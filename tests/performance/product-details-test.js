import http from 'k6/http';
import { check, sleep } from 'k6';

// This test simulates peak traffic where users are just browsing Product Detail pages (PDP).
export const options = {
  stages: [
    { duration: '30s', target: 50 },
    { duration: '1m', target: 50 },
    { duration: '30s', target: 0 },
  ],
  thresholds: {
    // 95% of product details requests must be fulfilled within 1 second
    http_req_duration: ['p(95)<1000'],
  },
};

// Hardcoded generic product IDs to test the endpoint. 
// If your database uses UUIDs, replace these with valid UUID strings.
const PRODUCT_SLUGS = ['tai-nghe-gaming-khong-day-asus-rog-cetra-true-wireless-chong-nuoc-ipx4-cong-nghe-chong-on-anc',
   'tai-nghe-co-day-det-hoco-giac-cam-35mm-co-mic-jack-vuong-tien-loi-dung-cho-samsung-xiaomi', 
   'bo-dung-cu-ve-sinh-laptop-may-tinh-smtech-bo-ve-sinh-ban-phim-man-hinh-tai-nghe-dien-thoai-nho-gon',
    'dien-thoai-iphone-17-pro-256gb-chinh-hang-zp-a',
     '2-chan-de-laptop-mini-co-the-gap-lai-ban-phim-may-tinh-di-dong-nang-voi-2-goc-co-the-dieu-chinh-chan-de-notebook-vo-hi', 
     'dien-thoai-apple-iphone-air-512gb', 'mieng-lot-chuot-logitech-gia-sieu-re-23-x-18cm',
      'ao-so-mi-dai-tay-nam-giovanni-chat-lieu-100-cotton-chong-nhan-dang-regular-gls03811',
       'usb-bluetooth-dongle-50-giup-may-tinh-ban-may-tinh-cay-laptop-thu-phat-song-bluetooth-hd88-a001',
        'ao-polo-nam-regular-fit-beverly-hills-polo-club-pmrss25tl019'];

export default function () {
  const randomSlug = PRODUCT_SLUGS[Math.floor(Math.random() * PRODUCT_SLUGS.length)];
  
  // Endpoint to retrieve a specific product by slug
  const url = `http://localhost:8080/api/v1/products/slug/${randomSlug}`;

  const res = http.get(url);

  check(res, {
    // 404 is checked too just in case the ID does not exist in the database yet
    // but the application itself is still responding correctly.
    'is status 200 or 404': (r) => r.status === 200 || r.status === 404, 
  });

  sleep(1);
}
