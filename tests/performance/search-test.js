import http from 'k6/http';
import { check, sleep } from 'k6';

// This test simulates users constantly searching the product catalog.
// It ramps up to 50 concurrent searches to test Database Read performance.
export const options = {
  stages: [
    { duration: '30s', target: 50 },
    { duration: '1m', target: 50 },
    { duration: '30s', target: 0 },
  ],
  thresholds: {
    // Searches should ideally be fast, 95% under 1 second
    http_req_duration: ['p(95)<1000'],
  },
};

// Variety of terms to prevent Database query caching from skewing the results
const SEARCH_TERMS = ['tai nghe', 'phone', 'giày', 'áo', 'đồng hồ', 'sneakers', 'nam', 'sony'];

export default function () {
  const randomTerm = SEARCH_TERMS[Math.floor(Math.random() * SEARCH_TERMS.length)];
  const url = `http://localhost:8080/api/v1/products?search=${randomTerm}`;

  const res = http.get(url);

  check(res, {
    'is status 200': (r) => r.status === 200,
  });

  sleep(1); 
}
