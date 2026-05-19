import json
import logging
from typing import Any, Dict, List, Tuple, Union

import redis.asyncio as redis

from app.clients.base_client import ServiceUnavailableError
from app.clients.product_client import ProductClient
from app.config import settings
from app.schemas.recommendation import ProductRecommendation

logger = logging.getLogger(__name__)

ProductCandidate = Union[int, Tuple[int, float]]


class FeatureStore:
    """Service for enriching product data with caching via Redis."""

    def __init__(self):
        self.redis = redis.Redis(
            host=settings.redis_host,
            port=settings.redis_port,
            decode_responses=True,
        )
        self.product_client = ProductClient()

    async def get_products(
        self,
        product_candidates: List[ProductCandidate],
        reason: str = "Recommended for you",
        reason_type: str = "COLLABORATIVE",
    ) -> List[ProductRecommendation]:
        """Fetch product details from cache or product-service with per-request scores."""
        ordered_ids, score_map = self._extract_candidates(product_candidates)
        if not ordered_ids:
            return []

        try:
            cached_products, missing_ids = await self._get_cached_products(ordered_ids)

            if missing_ids:
                try:
                    fetched = await self.product_client.fetch_batch(missing_ids)
                    fetched_map = self._map_fetched_products(fetched)
                    await self._cache_products(fetched_map)
                    cached_products.update(fetched_map)
                except ServiceUnavailableError as e:
                    logger.error(f"Product service unavailable: {e}")
                except Exception as e:
                    logger.error(f"Failed to fetch products from service: {e}")

            return self._build_recommendations(
                product_map=cached_products,
                ordered_ids=ordered_ids,
                score_map=score_map,
                reason=reason,
                reason_type=reason_type,
            )
        except Exception as e:
            logger.error(f"Error fetching products: {e}")
            return []

    def _extract_candidates(
        self, product_candidates: List[ProductCandidate]
    ) -> Tuple[List[int], Dict[int, float]]:
        ordered_ids: List[int] = []
        score_map: Dict[int, float] = {}

        for candidate in product_candidates:
            if isinstance(candidate, tuple):
                product_id_raw, score_raw = candidate
            else:
                product_id_raw, score_raw = candidate, 0.5

            try:
                product_id = int(product_id_raw)
                score = max(float(score_raw), 0.0)
            except (TypeError, ValueError):
                continue

            if product_id <= 0:
                continue

            if product_id not in score_map:
                ordered_ids.append(product_id)
            score_map[product_id] = score

        return ordered_ids, score_map

    async def _get_cached_products(
        self, product_ids: List[int]
    ) -> Tuple[Dict[int, Dict[str, Any]], List[int]]:
        """Check Redis cache for products.

        Returns:
            Tuple of (cached_product_map, missing_product_ids)
        """
        cached: Dict[int, Dict[str, Any]] = {}
        missing: List[int] = []

        for product_id in product_ids:
            try:
                cache_key = f"product:{product_id}"
                cached_data = await self.redis.get(cache_key)
                if not cached_data:
                    missing.append(product_id)
                    continue

                product_dict = json.loads(cached_data)
                cached[product_id] = product_dict
            except Exception as e:
                logger.warning(f"Redis cache error for product {product_id}: {e}")
                missing.append(product_id)

        return cached, missing

    async def _cache_products(self, products: Dict[int, Dict[str, Any]]):
        """Cache normalized product data in Redis with TTL."""
        for product_id, product_data in products.items():
            try:
                cache_key = f"product:{product_id}"
                await self.redis.setex(
                    cache_key,
                    settings.product_cache_ttl,
                    json.dumps(product_data),
                )
            except Exception as e:
                logger.warning(f"Failed to cache product {product_id}: {e}")

    def _map_fetched_products(
        self, products: List[Dict[str, Any]]
    ) -> Dict[int, Dict[str, Any]]:
        product_map: Dict[int, Dict[str, Any]] = {}

        for product in products:
            cached_product = self._transform_to_cached_product(product)
            if cached_product["product_id"] > 0:
                product_map[cached_product["product_id"]] = cached_product

        return product_map

    def _transform_to_cached_product(self, product: Dict[str, Any]) -> Dict[str, Any]:
        """Normalize product payload to cache-friendly shape (without recommendation metadata)."""
        first_variant = product.get("firstVariant", {}) or {}
        category = product.get("category", {}) or {}

        price = float(first_variant.get("price", 0)) if first_variant else 0.0
        sale_price = first_variant.get("salePrice")
        sale_price_float = float(sale_price) if sale_price is not None else None
        discount_percent = first_variant.get("discountPercent")
        stock = first_variant.get("stock", 0) or 0

        return {
            "product_id": int(product.get("id", 0) or 0),
            "product_name": product.get("name", ""),
            "slug": product.get("slug", ""),
            "image_url": product.get("imageUrl", ""),
            "category_id": int(category.get("id", 0) or 0) if category else 0,
            "category_name": category.get("name", "Unknown") if category else "Unknown",
            "original_price": price,
            "sale_price": sale_price_float,
            "discount_percent": discount_percent,
            "is_on_sale": sale_price is not None,
            "in_stock": stock > 0,
            "stock_quantity": int(stock),
        }

    def _build_recommendations(
        self,
        product_map: Dict[int, Dict[str, Any]],
        ordered_ids: List[int],
        score_map: Dict[int, float],
        reason: str,
        reason_type: str,
    ) -> List[ProductRecommendation]:
        recommendations: List[ProductRecommendation] = []

        for product_id in ordered_ids:
            product_data = product_map.get(product_id)
            if not product_data:
                continue

            recommendations.append(
                ProductRecommendation(
                    **product_data,
                    score=score_map.get(product_id, 0.5),
                    reason=reason,
                    reason_type=reason_type,
                )
            )

        return recommendations
