import redis.asyncio as redis
from typing import List
from app.schemas.recommendation import ProductRecommendation


class FeatureStore:
    def __init__(self):
        self.redis = None

    async def get_products(self, product_ids: List[int]) -> List[ProductRecommendation]:
        # In a real app, this would fetch from product-service or a local mirror DB
        # For this prototype, we'll mock the data enrichment
        return [
            ProductRecommendation(
                product_id=pid,
                product_name=f"Product {pid}",
                slug=f"product-{pid}",
                image_url=f"https://placeholder.com/{pid}",
                category_id=1,
                category_name="General",
                original_price=100.0,
                sale_price=80.0 if pid % 3 == 0 else None,
                discount_percent=20 if pid % 3 == 0 else None,
                is_on_sale=pid % 3 == 0,
                score=0.5,
                reason="Recommended for you",
                reason_type="COLLABORATIVE",
                stock_quantity=10,
            )
            for pid in product_ids
        ]
