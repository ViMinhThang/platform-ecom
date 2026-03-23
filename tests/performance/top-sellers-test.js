import http from 'k6/http';
import { check, sleep } from 'k6';

// This test evaluates the database performance when querying the top-selling products for a category.
// Aggregation queries like "top sellers" or "trending" are often the most CPU-intensive 
// operations for an e-commerce database because they require grouping and sorting large datasets.
export const options = {
  stages: [
    { duration: '30s', target: 40 },
    { duration: '1m', target: 40 },
    { duration: '30s', target: 0 },
  ],
  thresholds: {
    // We give this a slightly higher threshold (1.5s) since it's a heavier backend calculation
    http_req_duration: ['p(95)<1500'], 
  },
};

const CATEGORIES = ['latop', 'giày', 'áo', 'đồng-hồ', 'tai-nghe'];

export default function () {
  const randomCategory = CATEGORIES[Math.floor(Math.random() * CATEGORIES.length)];
  
  // As discovered in PublicProductController.java: GET /api/v1/products/categories/{categorySlug}/top-sellers
  const url = `http://localhost:8080/api/v1/products/categories/${randomCategory}/top-sellers?limit=10`;

  const res = http.get(url);

  check(res, {
    'is status 200': (r) => r.status === 200,
  });

  sleep(1);
}
