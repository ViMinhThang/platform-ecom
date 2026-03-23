import http from 'k6/http';
import { check, sleep } from 'k6';

// This test simulates users browsing products by clicking on a specific Category.
export const options = {
  stages: [
    { duration: '30s', target: 60 },
    { duration: '1m', target: 60 },
    { duration: '30s', target: 0 },
  ],
  thresholds: {
    // 95% of category browse queries should return under 1 second
    http_req_duration: ['p(95)<1000'],
  },
};

// Common categories to query
const CATEGORIES = ['in-thoi', 'git-gi-chm-sc-nh-ca', 'latop', 'giày', 'áo', 'đồng hồ'];

export default function () {
  const randomCategory = CATEGORIES[Math.floor(Math.random() * CATEGORIES.length)];

  // As discovered in PublicProductController.java: GET /api/v1/products?category={category}
  const url = `http://localhost:8080/api/v1/products?category=${randomCategory}`;

  const res = http.get(url);

  check(res, {
    'is status 200': (r) => r.status === 200,
  });

  sleep(1);
}
