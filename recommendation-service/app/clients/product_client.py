from typing import List, Dict, Any
import httpx


class ServiceUnavailableError(Exception):
    pass


class ProductClient:
    """Client for product-service via direct Windows host IP."""
    
    BASE_URL = "http://localhost:8084"
    
    async def fetch_all_paginated(self, max_pages: int = 100) -> List[Dict[str, Any]]:
        all_products = []
        
        for page in range(max_pages):
            products = await self._fetch_page(page)
            if not products:
                break
            all_products.extend(products)
        
        return all_products
    
    async def _fetch_page(self, page: int, per_page: int = 100) -> List[Dict[str, Any]]:
        url = f"{self.BASE_URL}/api/v1/products"
        
        async with httpx.AsyncClient(timeout=10.0) as client:
            response = await client.get(url, params={"page": page, "perPage": per_page})
            response.raise_for_status()
            result = response.json()
            return result.get("data", {}).get("content", [])
    
    async def fetch_batch(self, product_ids: List[int]) -> List[Dict[str, Any]]:
        """Fetch specific products by their IDs."""
        if not product_ids:
            return []
        
        # Fetch all products and filter by ID
        all_products = await self.fetch_all_paginated(max_pages=10)
        id_set = set(product_ids)
        return [p for p in all_products if p.get("id") in id_set]
