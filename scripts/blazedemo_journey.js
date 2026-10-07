import http from 'k6/http';
import { check, group, sleep } from 'k6';
import { Trend, Rate } from 'k6/metrics';

// Custom trends for transaction-specific visibility
const bookingDuration = new Trend('booking_duration');
const errorRate = new Rate('error_rate');

export const options = {
  // Polite load profile against public shared demo infrastructure
  stages: [
    { duration: '30s', target: 5 },   // Warm-up
    { duration: '1m',  target: 10 },  // Steady state (max 10 VUs)
    { duration: '30s', target: 0 },   // Ramp-down
  ],
  thresholds: {
    // SLO 1: 95% of all requests must complete within 1200ms
    http_req_duration: ['p(95)<1200'],
    // SLO 2: Overall HTTP error rate below 1%
    error_rate: ['rate<0.01'],
    // SLO 3: Full booking transaction p95 under 3.5s
    booking_duration: ['p(95)<3500'],
  },
};

const BASE_URL = 'https://blazedemo.com';

export default function () {
  const transactionStart = Date.now();

  group('01_Home_Page', function () {
    const res = http.get(BASE_URL);
    const pass = check(res, {
      'status is 200': (r) => r.status === 200,
      'has welcome text': (r) => r.body.includes('Welcome to the Simple Travel Agency!'),
    });
    errorRate.add(!pass);
  });

  sleep(1); // Realistic user think-time

  group('02_Find_Flights', function () {
    const payload = {
      fromPort: 'Paris',
      toPort: 'Buenos Aires',
    };

    const res = http.post(`${BASE_URL}/reserve.php`, payload);
    const pass = check(res, {
      'status is 200': (r) => r.status === 200,
      'flights found': (r) => r.body.includes('Flights from Paris to Buenos Aires'),
    });
    errorRate.add(!pass);
  });

  sleep(1);

  group('03_Choose_Flight', function () {
    const payload = {
      flight: '43',
      price: '472.56',
      airline: 'Virgin America',
      fromPort: 'Paris',
      toPort: 'Buenos Aires',
    };

    const res = http.post(`${BASE_URL}/purchase.php`, payload);
    const pass = check(res, {
      'status is 200': (r) => r.status === 200,
      'checkout loaded': (r) => r.body.includes('Total Cost:'),
    });
    errorRate.add(!pass);
  });

  sleep(1.5);

  group('04_Confirm_Booking', function () {
    const payload = {
      inputName: 'Performance Tester',
      address: '100 Main St',
      city: 'Austin',
      state: 'TX',
      zipCode: '78701',
      cardType: 'visa',
      creditCardNumber: '1111222233334444',
      creditCardMonth: '11',
      creditCardYear: '2028',
      nameOnCard: 'Tester Name',
    };

    const res = http.post(`${BASE_URL}/confirmation.php`, payload);
    const pass = check(res, {
      'status is 200': (r) => r.status === 200,
      'booking confirmed': (r) => r.body.includes('Thank you for your purchase today!'),
      'has confirmation id': (r) => r.body.includes('Id'),
    });
    errorRate.add(!pass);

    bookingDuration.add(Date.now() - transactionStart);
  });

  sleep(2);
}