# Review Microservice

A dedicated microservice for managing product reviews in the e-commerce platform.

## Features

- ✅ Create, update, and delete product reviews
- ✅ Purchase verification (users can only review purchased products)
- ✅ Review statistics and summaries (average rating, distribution)
- ✅ Paginated review listings by product and user
- ✅ Kafka event publishing for review operations
- ✅ Unique constraint (one review per user per product)
- ✅ Support for review images
- ✅ Verified purchase badges
- ✅ Helpful/not helpful vote tracking

## Tech Stack

- Spring Boot 3.5.6
- Java 25
- PostgreSQL
- Apache Kafka
- Spring Cloud (Eureka Client, Config)
- Model Mapper
- Lombok

## API Endpoints

### Review Operations

- `POST /api/reviews` - Create a new review
- `PUT /api/reviews/{reviewId}` - Update review
- `DELETE /api/reviews/{reviewId}` - Delete review
- `GET /api/reviews/{reviewId}` - Get review by ID

### Query Endpoints

- `GET /api/reviews/product/{productId}` - Get all reviews for a product (paginated)
- `GET /api/reviews/user/{userId}` - Get all reviews by user (paginated)
- `GET /api/reviews/user/email/{email}` - Get reviews by user email (paginated)
- `GET /api/reviews/summary/product/{productId}` - Get product review summary (average, count, distribution)

## Configuration

### Database

- Database: `review_db`
- Port: 5432 (PostgreSQL)

### Service

- Port: 8084
- Eureka: http://localhost:8761/eureka/

### Kafka Topics

- `review-events` - Published events for review operations (CREATED, UPDATED, DELETED)

## Running the Service

### Prerequisites

- PostgreSQL running with `review_db` database created
- Kafka running on localhost:9092
- Eureka server running on localhost:8761
- Config server running on localhost:8888

### Build

```bash
mvn clean install
```

### Run

```bash
mvn spring-boot:run
```

## Inter-Service Communication

### Dependencies

- **Order Service**: Verifies purchase history
- **Product Service**: Validates product existence

### Kafka Events

Publishes `ReviewEvent` to `review-events` topic:

```json
{
  "eventType": "CREATED|UPDATED|DELETED",
  "reviewId": 1,
  "productId": 123,
  "userId": 456,
  "rating": 5,
  "timestamp": "2025-11-22T20:30:00"
}
```

## Business Rules

1. Users must have a DELIVERED order containing the product to review it
2. One review per user per product (enforced by database unique constraint)
3. Reviews include verified purchase badge
4. Users can only edit/delete their own reviews
5. All reviews are auto-approved (status: APPROVED)

## Database Schema

### reviews table

- `id` (PK)
- `product_id`, `user_id`, `order_id`
- `email`
- `rating` (1-5)
- `title`, `comment`
- `images` (JSONB)
- `verified_purchase`
- `helpful_count`, `not_helpful_count`
- `status` (PENDING/APPROVED/REJECTED)
- `created_at`, `updated_at`
- **UNIQUE**: (user_id, product_id)

## Gateway Integration

Add this route to your gateway configuration:

```yaml
- id: review-service
  uri: lb://review-service
  predicates:
    - Path=/api/reviews/**
  filters:
    - AuthFilter
```

## Environment Variables

Create `.env` file:

```
DB_USER=fragile
DB_PASSWORD=204863
RABBITMQ_USERNAME=guest
RABBITMQ_PASSWORD=guest
RABBITMQ_PORT=5672
```

## Monitoring

- Actuator endpoints: http://localhost:8084/actuator
- Zipkin tracing: http://localhost:9411
- Eureka dashboard: http://localhost:8761

## Author

Platform E-commerce Team
