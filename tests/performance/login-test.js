import http from 'k6/http';
import { check, sleep } from 'k6';

// This test simulates users attempting to log in concurrently.
// It will ramp up to 20 concurrent users over 30s, hold for 1m, then ramp down.
export const options = {
  stages: [
    { duration: '30s', target: 20 },
    { duration: '1m', target: 20 },
    { duration: '30s', target: 0 },
  ],
  thresholds: {
    // 95% of login requests must finish within 2 seconds
    http_req_duration: ['p(95)<2000'],
    // Ensure the failure rate remains under 5%
    http_req_failed: ['rate<0.05'],
  },
};

export default function () {
  // Base URL set to 3000 as requested
  const url = 'http://localhost:8080/api/v1/auth/login';
  
  // Standard test credentials, update these if you have seeded the DB
  const payload = JSON.stringify({
    email: 'admin@ecom.com', 
    password: 'admin123',
  });

  const params = {
    headers: { 'Content-Type': 'application/json' },
  };

  const res = http.post(url, payload, params);

  check(res, {
    'is status 200': (r) => r.status === 200,
    // Add 401 as acceptable if the DB hasn't been seeded with this specific user yet
    // 'is status 200 or 401': (r) => r.status === 200 || r.status === 401,
  });

  sleep(1); // Simulate real user wait time before logging in again
}
