import http from 'k6/http';
import { check, sleep } from 'k6';

export const options = {
  stages: [
    { duration: '15s', target: 20 },  // Ramp to 20 users
    { duration: '30s', target: 50 },  // Ramp to 50 users (causes blocking pileup)
    { duration: '15s', target: 0 },   // Ramp-down
  ],
  thresholds: {
    http_req_duration: ['p(95)<400'], // Expectation: 95% under 400ms
    http_req_failed: ['rate<0.01'],
  },
};

export default function () {
  // Test endpoint (Change from /api/flights to /api/flights-async after fix)
  const res = http.get(__ENV.TARGET_URL || 'http://localhost:8000/api/flights');
  
  check(res, {
    'status is 200': (r) => r.status === 200,
  });
  sleep(0.1);
}