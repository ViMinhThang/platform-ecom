from typing import List, Dict, Any
import httpx
from app.clients.base_client import BaseServiceClient, ServiceUnavailableError


class AnalyticsClient(BaseServiceClient):
    """Client for communicating with the analytics-service."""
    
    # Direct fallback URLs when Eureka discovery fails
    FALLBACK_URLS = [
        "http://192.168.1.2:8089",
        "http://localhost:8089"
    ]
    
    def __init__(self):
        super().__init__("analytics-service")
    
    async def _resolve_urls(self) -> List[str]:
        urls_to_try: List[str] = []
        try:
            url = await self.get_service_url()
            urls_to_try.append(url)
        except ServiceUnavailableError:
            pass

        urls_to_try.extend(self.FALLBACK_URLS)
        return urls_to_try

    async def get_user_interactions(
        self, 
        days: int = 90
    ) -> List[Dict[str, Any]]:
        """Fetch aggregated user-product interactions for ML training."""
        urls_to_try = await self._resolve_urls()
        last_error = None
        for url in urls_to_try:
            try:
                async with httpx.AsyncClient(timeout=5.0) as client:
                    response = await client.get(
                        f"{url}/api/v1/analytics/ml/interactions",
                        params={"days": days}
                    )
                    response.raise_for_status()
                    result = response.json()
                    return result.get("data", {}).get("data", [])
            except Exception as e:
                last_error = e
                continue
        
        raise ServiceUnavailableError(
            f"Could not connect to analytics-service. Last error: {last_error}"
        )

    async def get_trending_products(
        self,
        days: int = 30,
        limit: int = 200
    ) -> List[Dict[str, Any]]:
        """Fetch trending products for cold-start fallback."""
        urls_to_try = await self._resolve_urls()
        last_error = None

        for url in urls_to_try:
            try:
                async with httpx.AsyncClient(timeout=5.0) as client:
                    response = await client.get(
                        f"{url}/api/v1/analytics/ml/trending",
                        params={"days": days, "limit": limit}
                    )
                    response.raise_for_status()
                    result = response.json()
                    return result.get("data", {}).get("data", [])
            except Exception as e:
                last_error = e
                continue

        raise ServiceUnavailableError(
            f"Could not fetch trending products from analytics-service. Last error: {last_error}"
        )
