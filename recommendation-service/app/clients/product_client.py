from typing import List, Dict, Any
import httpx
from app.clients.base_client import BaseServiceClient


class ProductClient(BaseServiceClient):
    """Client for communicating with the product-service."""
    
    def __init__(self):
        super().__init__("product-service")
    
    async def fetch_batch(self, product_ids: List[int]) -> List[Dict[str, Any]]:
        """Fetch multiple products by IDs.
        
        Args:
            product_ids: List of product IDs to fetch
            
        Returns:
            List of product dictionaries
            
        Raises:
            ServiceUnavailableError: If product-service is unavailable
        """
        url = await self.get_service_url()
        async with httpx.AsyncClient(timeout=10.0) as client:
            response = await client.post(
                f"{url}/api/v1/products/batch",
                json={"productIds": product_ids}
            )
            response.raise_for_status()
            result = response.json()
            return result.get("data", [])
    
    async def fetch_all_products(
        self, 
        page: int = 0, 
        per_page: int = 100
    ) -> List[Dict[str, Any]]:
        """Fetch all products with pagination.
        
        Args:
            page: Page number (0-indexed)
            per_page: Items per page
            
        Returns:
            List of product dictionaries
        """
        url = await self.get_service_url()
        async with httpx.AsyncClient(timeout=10.0) as client:
            response = await client.get(
                f"{url}/api/v1/products",
                params={"page": page, "perPage": per_page}
            )
            response.raise_for_status()
            result = response.json()
            return result.get("data", {}).get("content", [])
    
    async def fetch_all_paginated(
        self,
        max_pages: int = 100
    ) -> List[Dict[str, Any]]:
        """Fetch all products across all pages.
        
        Args:
            max_pages: Maximum number of pages to fetch
            
        Returns:
            List of all product dictionaries
        """
        all_products = []
        page = 0
        
        while page < max_pages:
            products = await self.fetch_all_products(page=page, per_page=100)
            if not products:
                break
            all_products.extend(products)
            page += 1
        
        return all_products
