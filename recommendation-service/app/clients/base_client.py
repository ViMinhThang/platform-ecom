from typing import Optional
from py_eureka_client import eureka_client


class ServiceUnavailableError(Exception):
    """Raised when a service is not available in Eureka."""
    pass


class BaseServiceClient:
    """Base class for service clients with Eureka discovery."""
    
    def __init__(self, service_name: str):
        self.service_name = service_name
        self._http_client = None
    
    async def get_service_url(self) -> str:
        """Discover service instance from Eureka."""
        try:
            instance = eureka_client.get_instance(self.service_name)
            if not instance:
                raise ServiceUnavailableError(
                    f"Service '{self.service_name}' not found in Eureka"
                )
            return f"http://{instance.hostName}:{instance.port.port}"
        except Exception as e:
            raise ServiceUnavailableError(
                f"Failed to discover service '{self.service_name}': {str(e)}"
            )
    
    def _get_http_client(self):
        """Lazy initialization of HTTP client."""
        import httpx
        if self._http_client is None:
            self._http_client = httpx.AsyncClient(timeout=10.0)
        return self._http_client
