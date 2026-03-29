# Use Case: Nhận Đề Xuất Sản Phẩm (Product Recommendation)

## 1. Tên Use Case (Use Case Name)
Nhận Đề Xuất Sản Phẩm (Hệ thống gợi ý sản phẩm). Bao gồm Đề xuất sản phẩm tương tự (Similar Products) và Nguồn cấp dữ liệu cá nhân hóa (Personalized Feed).

## 2. Tác Nhân (Actor)
- **Người dùng (User/Guest):** Người tương tác với nền tảng, xem chi tiết sản phẩm hoặc duyệt trang chủ/giỏ hàng.
- **Hệ thống (System - Recommendation Service):** Dịch vụ Machine Learning phân tích dữ liệu và dự đoán các sản phẩm phù hợp.

## 3. Mô Tả (Description)
Use case này mô tả quá trình người dùng nhận được các danh sách sản phẩm gợi ý khi duyệt nền tảng thương mại điện tử. Các gợi ý có thể là:
- **Sản phẩm tương tự (Similar Products):** Xuất hiện khi xem một sản phẩm cụ thể, hệ thống đề xuất các sản phẩm có cùng danh mục, thuộc tính hoặc thường được mua cùng.
- **Dành riêng cho bạn (Personalized Feed):** Xuất hiện ở trang chủ hoặc trang hiển thị chung, dựa vào lịch sử duyệt web, mua sắm và sở thích riêng của từng người dùng để đưa ra đề xuất.

## 4. Điều Kiện Tiên Quyết (Precondition)
- Recommendation Service (viết bằng Python/FastAPI) đang hoạt động bình thường.
- Các mô hình Machine Learning (như Collaborative Filtering) đã được huấn luyện với đủ dữ liệu thông qua Data Pipeline.
- **Đối với "Nguồn cấp cá nhân hóa":** Người dùng cần có `user_id` hợp lệ (đã đăng nhập) hoặc có lịch sử hành vi lưu trong phiên làm việc.
- **Đối với "Sản phẩm tương tự":** Sản phẩm hiện tại (`product_id`) phải tồn tại trong cơ sở dữ liệu.

## 5. Điều Kiện Sau Cùng (Postcondition)
- Hệ thống trả về danh sách các sản phẩm (bao gồm ID, tên, giá, hình ảnh thu nhỏ, điểm phù hợp) để hiển thị lên giao diện (Trang chủ, Trang chi tiết sản phẩm, hoặc Giỏ hàng) dưới dạng các mục như *Related Products* hoặc *Cart Recommendations*.
- Hành vi tương tác (click, xem, bỏ qua) của người dùng đối với các mục đề xuất được theo dõi (tracking) nhằm tái huấn luyện mô hình.

## 6. Luồng Sự Kiện Chính (Main Event Flow)

### Luồng 6.1: Nhận Đề xuất Sản phẩm Tương tự
1. Người dùng bấm xem chi tiết một sản phẩm bất kỳ.
2. Frontend (Next.js) gửi request `GET /v1/recommendations/products/{product_id}/similar?limit={limit}` tới API Gateway.
3. API Gateway định tuyến request đến Recommendation Service.
4. Recommendation Service trích xuất các nét đặc trưng (features) của sản phẩm hiện tại và tìm kiếm K-láng giềng gần nhất (sản phẩm tương đồng).
5. Service trả về danh sách dữ liệu `ProductRecommendation` (JSON).
6. Frontend tiếp nhận kết quả và render component (ví dụ: `RelatedProducts.tsx`), hiển thị danh sách các sản phẩm tương tự cho người dùng.

### Luồng 6.2: Nhận Nguồn cấp Cá nhân hóa
1. Người dùng (đã đăng nhập) truy cập vào Trang chủ (Home Page).
2. Frontend nhận diện `user_id` và gọi API `GET /v1/recommendations/users/{user_id}/personalized?limit={limit}&page={page}`.
3. Recommendation Service Query thông tin của người dùng để phân tích hành vi lịch sử.
4. Model dự đoán và xếp hạng một danh sách các sản phẩm có độ liên quan cao nhất đối với `user_id` hiện tại.
5. Service trả về dữ liệu danh sách `ProductRecommendation`.
6. Frontend render khu vực component (ví dụ: `ProductFeed.tsx`), hiển thị gợi ý cá nhân hóa.

## 7. Luồng Thay Thế (Alternative Flow)

* **Luồng thay thế 1 - Người dùng không có dữ liệu lịch sử (Cold Start Problem):** 
  Nếu hệ thống không có đủ dữ liệu duyệt / đánh giá về người dùng, hệ thống Recommendation Service sẽ trả về danh sách các sản phẩm đang phổ biến (Trending/Popular Products) hoặc các sản phẩm bán chạy nhất hiện tại thay vì danh sách cá nhân hóa.
* **Luồng thay thế 2 - Sản phẩm không tồn tại / Lỗi Service ML:** 
  Nếu `product_id` không tồn tại để lấy sản phẩm tương đương, API trả về mảng rỗng `[]` (Error handling/Status 404). Frontend bắt lỗi và sẽ **giấu (ẩn) Component Đề xuất**, không làm vỡ giao diện chung của trang.
* **Luồng thay thế 3 - Timeout từ Recommendation Service:** 
  Khi Recommendation Service phản hồi lâu hơn quy định (timeout), Frontend Client (thường xử lý trong `catch` block) ghi log lại lỗi `Failed to fetch similar products` và trả về danh sách rỗng, do đó khu vực Đề xuất chỉ đơn giản là không hiển thị hoặc fallback về một cache tĩnh, bảo vệ trải nghiệm của người dùng.
