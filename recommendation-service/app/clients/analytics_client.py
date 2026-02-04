from typing import List, Dict, Any
import httpx
from app.clients.base_client import BaseServiceClient


class AnalyticsClient(BaseServiceClient):
    """Client for communicating with the analytics-service."""
    
    def __init__(self):
        super().__init__("analytics-service")
    
    async def get_user_interactions(
        self, 
        days: int = 90
    ) -> List[Dict[str, Any]]:
        """Fetch aggregated user-product interactions for ML training.
        
        Args:
            days: Number of days of data to fetch (default: 90)
            
        Returns:
            List of interaction dictionaries with keys:
            - userId: int
            - productId: int  
            - weight: int (interaction score)
            
        Raises:
            ServiceUnavailableError: If analytics-service is unavailable
        """
        url = await self.get_service_url()
        async with httpx.AsyncClient(timeout=30.0) as client:
            response = await client.get(
                f"{url}/api/v1/analytics/ml/interactions",
                params={"days": days}
            )
            response.raise_for_status()
            result = response.json()
            return result.get("data", {}).get("data", [])
