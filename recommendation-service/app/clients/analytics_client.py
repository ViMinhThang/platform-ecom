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
    
    async def get_user_interactions(
        self, 
        days: int = 90
    ) -> List[Dict[str, Any]]:
        """Fetch aggregated user-product interactions for ML training."""
        # Try Eureka discovery first
        urls_to_try = []
        try:
            url = await self.get_service_url()
            urls_to_try.append(url)
        except ServiceUnavailableError:
            pass
        
        # Add fallback URLs
        urls_to_try.extend(self.FALLBACK_URLS)
        
        # Try each URL
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
