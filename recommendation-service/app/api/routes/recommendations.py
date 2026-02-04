from fastapi import APIRouter, Query, Path
from typing import List
from app.schemas.recommendation import ProductRecommendation
from app.services.recommendation_service import recommendation_service

router = APIRouter()


@router.get(
    "/products/{product_id}/similar", response_model=List[ProductRecommendation]
)
async def get_similar_products(
        product_id: int = Path(...), limit: int = Query(10, ge=1, le=50)
):
    return await recommendation_service.get_similar_products(product_id, limit)


@router.get("/users/{user_id}/personalized", response_model=List[ProductRecommendation])
async def get_personalized_feed(
        user_id: int = Path(...),
        limit: int = Query(24, ge=1, le=100),
        page: int = Query(0, ge=0),
):
    return await recommendation_service.get_personalized_feed(user_id, limit, page)
