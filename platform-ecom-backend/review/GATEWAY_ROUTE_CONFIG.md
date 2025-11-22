# Review Microservice - Gateway Route Configuration

Add the following route configuration to your gateway service's routing configuration:

```yaml
- id: review-service
  uri: lb://review-service
  predicates:
    - Path=/api/reviews/**
  filters:
    - AuthFilter
```

**Note**: Since your actual gateway configuration is in a separate git branch, please add this route when updating the centralized configuration. The Review service is registered with Eureka and will be discoverable at `lb://review-service`.
