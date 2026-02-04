import json
import logging
from typing import List, Dict, Any, Tuple
import redis.asyncio as redis

from app.schemas.recommendation import ProductRecommendation
from app.clients.product_client import ProductClient
from app.clients.base_client import ServiceUnavailableError
from app.config import settings

logger = logging.getLogger(__name__)


class FeatureStore:
    """Service for enriching product data with caching via Redis."""
    
    def __init__(self):
        self.redis = redis.Redis(
            host=settings.redis_host,
            port=settings.redis_port,
            decode_responses=True
        )
        self.product_client = ProductClient()
    
    async def get_products(
        self, 
        product_ids: List[int],
        score: float = 0.5,
        reason: str = "Recommended for you",
        reason_type: str = "COLLABORATIVE"
    ) -> List[ProductRecommendation]:
        """Fetch product details from cache or product-service.
        
        Args:
            product_ids: List of product IDs to fetch
            score: Recommendation score
            reason: Recommendation reason text
            reason_type: Type of recommendation
            
        Returns:
            List of ProductRecommendation objects
        """
        if not product_ids:
            return []
        
        try:
            cached, missing_ids = await self._get_cached_products(product_ids)
            
            if missing_ids:
                try:
                    fetched = await self.product_client.fetch_batch(missing_ids)
                    await self._cache_products(fetched)
                    cached.extend(
                        self._map_products_to_recommendations(
                            fetched, score, reason, reason_type
                        )
                    )
                except ServiceUnavailableError as e:
                    logger.error(f"Product service unavailable: {e}")
                except Exception as e:
                    logger.error(f"Failed to fetch products from service: {e}")
            
            return self._sort_by_original_order(cached, product_ids)
        except Exception as e:
            logger.error(f"Error fetching products: {e}")
            return []
    
    async def _get_cached_products(
        self, 
        product_ids: List[int]
    ) -> Tuple[List[ProductRecommendation], List[int]]:
        """Check Redis cache for products.
        
        Returns:
            Tuple of (cached_products, missing_product_ids)
        """
        cached = []
        missing = []
        
        for pid in product_ids:
            try:
                cache_key = f"product:{pid}"
                cached_data = await self.redis.get(cache_key)
                
                if cached_data:
                    product_dict = json.loads(cached_data)
                    cached.append(ProductRecommendation(**product_dict))
                else:
                    missing.append(pid)
            except Exception as e:
                logger.warning(f"Redis cache error for product {pid}: {e}")
                missing.append(pid)
        
        return cached, missing
    
    async def _cache_products(self, products: List[Dict[str, Any]]):
        """Cache products in Redis with TTL."""
        for product in products:
            try:
                pid = product.get("id")
                if not pid:
                    continue
                
                cache_key = f"product:{pid}"
                cache_data = self._transform_to_recommendation(product)
                
                await self.redis.setex(
                    cache_key,
                    settings.product_cache_ttl,
                    json.dumps(cache_data.dict())
                )
            except Exception as e:
                logger.warning(f"Failed to cache product: {e}")
    
    def _map_products_to_recommendations(
        self,
        products: List[Dict[str, Any]],
        score: float,
        reason: str,
        reason_type: str
    ) -> List[ProductRecommendation]:
        """Map product dictionaries to ProductRecommendation objects."""
        return [
            self._transform_to_recommendation(p, score, reason, reason_type)
            for p in products
        ]
    
    def _transform_to_recommendation(
        self,
        product: Dict[str, Any],
        score: float = 0.5,
        reason: str = "Recommended for you",
        reason_type: str = "COLLABORATIVE"
    ) -> ProductRecommendation:
        """Transform product dictionary to ProductRecommendation."""
        first_variant = product.get("firstVariant", {}) or {}
        category = product.get("category", {}) or {}
        
        price = float(first_variant.get("price", 0)) if first_variant else 0
        sale_price = first_variant.get("salePrice")
        sale_price_float = float(sale_price) if sale_price else None
        discount_percent = first_variant.get("discountPercent")
        stock = first_variant.get("stock", 0) or 0
        
        return ProductRecommendation(
            product_id=product.get("id", 0),
            product_name=product.get("name", ""),
            slug=product.get("slug", ""),
            image_url=product.get("imageUrl", ""),
            category_id=category.get("id", 0) if category else 0,
            category_name=category.get("name", "Unknown") if category else "Unknown",
            original_price=price,
            sale_price=sale_price_float,
            discount_percent=discount_percent,
            is_on_sale=sale_price is not None,
            score=score,
            reason=reason,
            reason_type=reason_type,
            in_stock=stock > 0,
            stock_quantity=stock
        )
    
    def _sort_by_original_order(
        self,
        products: List[ProductRecommendation],
        original_ids: List[int]
    ) -> List[ProductRecommendation]:
        """Sort products by their original order."""
        product_map = {p.product_id: p for p in products}
        return [
            product_map[pid] for pid in original_ids 
            if pid in product_map
        ]
