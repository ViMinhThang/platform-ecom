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
        """Discover service instance from Eureka, preferring IP over hostname."""
        try:
            # Use the eureka_client to discover the service
            client = eureka_client.get_client()
            
            if client and hasattr(client, 'applications') and client.applications:
                try:
                    apps = client.applications
                    # Look for the application by name
                    for app_name in dir(apps):
                        if app_name.upper() == self.service_name.replace('-', '_').upper():
                            app = getattr(apps, app_name)
                            if app and hasattr(app, 'up_instances') and app.up_instances:
                                instance = app.up_instances[0]
                                
                                # Prefer IP address over hostname to avoid host.docker.internal issues
                                host = instance.ipAddr if instance.ipAddr else instance.hostName
                                port = instance.port.port if instance.port else 8080
                                url = f"http://{host}:{port}"
                                
                                # Test the URL to make sure it's accessible
                                import httpx
                                try:
                                    async with httpx.AsyncClient(timeout=2.0) as test_client:
                                        response = await test_client.get(f"{url}/actuator/health")
                                        if response.status_code < 500:
                                            return url
                                except Exception:
                                    # IP didn't work, try hostname as fallback
                                    if instance.hostName and instance.hostName != instance.ipAddr:
                                        url = f"http://{instance.hostName}:{port}"
                                        try:
                                            async with httpx.AsyncClient(timeout=2.0) as test_client:
                                                response = await test_client.get(f"{url}/actuator/health")
                                                if response.status_code < 500:
                                                    return url
                                        except Exception:
                                            pass
                                
                                # Return IP-based URL even if test failed, let caller handle errors
                                return f"http://{instance.ipAddr if instance.ipAddr else instance.hostName}:{port}"
                except Exception:
                    pass
            
            # Fallback: use eureka_client.do_service_async to get a URL
            try:
                from typing import Any
                test_response: Any = await eureka_client.do_service_async(
                    self.service_name,
                    "/actuator/health",
                    return_type="response"
                )
                if test_response and hasattr(test_response, 'url') and test_response.url:
                    from urllib.parse import urlparse
                    parsed = urlparse(str(test_response.url))
                    return f"{parsed.scheme}://{parsed.netloc}"
            except Exception:
                pass
            
            # Final fallback: try direct hostname resolution
            import socket
            try:
                host = self.service_name.replace('-', '')
                ip = socket.gethostbyname(host)
                return f"http://{host}:8080"
            except:
                pass
            
            raise ServiceUnavailableError(
                f"Service '{self.service_name}' not found in Eureka and no fallback worked"
            )
            
        except ServiceUnavailableError:
            raise
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
