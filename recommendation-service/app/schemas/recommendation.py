from pydantic import BaseModel
from typing import Optional
from decimal import Decimal


class ProductRecommendation(BaseModel):
    product_id: int
    product_name: str
    slug: str
    image_url: str
    category_id: int
    category_name: str

    # Pricing
    original_price: float
    sale_price: Optional[float] = None
    discount_percent: Optional[int] = None
    is_on_sale: bool = False

    # Recommendation metadata
    score: float
    reason: str
    reason_type: str  # SIMILAR, COLLABORATIVE, TRENDING, SALE

    # Stock info
    in_stock: bool = True
    stock_quantity: int = 0
