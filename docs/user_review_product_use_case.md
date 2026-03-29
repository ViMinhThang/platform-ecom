# Tài liệu Use Case: Người dùng đánh giá sản phẩm

**1. Tên Use Case (Name):**
Người dùng đánh giá sản phẩm (User Review a Product)

**2. Tác nhân (Actor):**
Khách hàng (Customer/User đã đăng nhập)

**3. Mô tả (Description):**
Use case này cho phép một khách hàng tạo một đánh giá (review) cho một sản phẩm mà họ đã mua thành công trên nền tảng thương mại điện tử. Người dùng có thể đánh giá số sao (rating), viết bình luận và tải lên hình ảnh đính kèm. Hệ thống sẽ có cơ chế tự động phân tích cảm xúc (Sentiment Analysis) của nội dung chữ kết hợp với sao để đảm bảo tính hợp lệ, ngăn chặn việc đánh giá rác hoặc sai lệch.

**4. Điều kiện tiên quyết (Precondition):**
* Người dùng đã được xác thực và đăng nhập vào hệ thống.
* Sản phẩm cần đánh giá phải tồn tại trong hệ thống.
* Người dùng phải có lịch sử mua sản phẩm này và trạng thái đơn hàng (Order) liên quan hiện tại phải là `DELIVERED` (Đã giao hàng) hoặc `COMPLETED` (Hoàn thành).
* Người dùng chưa từng đánh giá sản phẩm này trước đó trong hệ thống.

**5. Điều kiện hậu quyết (Post condition):**
* Một bản ghi đánh giá mới được tạo ra và lưu thành công trong Database cùng với thông tin về Rating (1-5), Bình luận và Danh sách hình ảnh minh chứng.
* Đánh giá được hệ thống đo lường tự động và gán thêm độ đo cảm xúc (Sentiment: `POSITIVE`, `NEUTRAL`, `NEGATIVE`) kèm theo điểm tin cậy cảm xúc (Sentiment Score).
* Đánh giá của người dùng được hiển thị công khai khi người dùng khác xem chi tiết sản phẩm.

**6. Luồng sự kiện chính (Main Event Flow):**
1. Người dùng chọn sản phẩm từ danh sách các đơn hàng đã được giao thành công hoặc từ trang chi tiết sản phẩm và bấm "Viết đánh giá".
2. Hệ thống tiến hành xác thực và kiểm tra các điều kiện tiên quyết: sản phẩm có tồn tại, người dùng đã thực sự mua hàng, đơn đã giao thành công và người dùng chưa từng đánh giá sản phẩm này.
3. Người dùng nhập nội dung đánh giá: chọn số sao đánh giá (từ 1 tới 5), nhập nội dung bình luận bằng chữ (comment), đính kèm tệp hình ảnh minh chứng (nếu có), và bấm "Gửi".
4. Hệ thống tải lên các file hình ảnh qua dịch vụ lưu trữ (FileStorageService) và nhận về danh sách đường dẫn hợp lệ.
5. Hệ thống gửi nội dung nhận xét sang dịch vụ `Sentiment Service` để AI chạy phân tích cảm xúc lời văn và trả về nhãn cảm xúc (Tích cực/Trung tính/Tiêu cực) kèm theo điểm độ tin cậy (`nlpScore`).
6. Hệ thống xác nhận tính hợp lệ của bài đánh giá dựa trên sự tương quan giữa điểm số sao (Rating) và điểm cảm xúc (`nlpScore`).
7. Hệ thống xây dựng đối tượng Review, gán các thông số cảm xúc và tiến hành lưu dữ liệu vào cơ sở dữ liệu.
8. Hệ thống thông báo tác vụ thêm đánh giá thành công và tải lại giao diện hiển thị đánh giá mới.

**7. Luồng luân phiên / Xử lý ngoại lệ (Alternative Flow):**
* **A1. Đơn hàng chưa giao / Chưa mua:** Tại bước 2, nếu đơn hàng chưa ở trạng thái `DELIVERED`/`COMPLETED` hoặc người dùng chưa từng mua sản phẩm, hệ thống từ chối và hiển thị lỗi: *"You can only review products from delivered orders"* hoặc *"You must purchase this product before reviewing it"*. Tiến trình kết thúc.
* **A2. Đánh giá trùng lặp:** Tại bước 2, nếu phát hiện người dùng đã đánh giá sản phẩm này trước đó, hệ thống thông báo báo lỗi: *"You have already reviewed this product"*. Tiến trình kết thúc.
* **A3. Đánh giá không hợp lệ (Mâu thuẫn Rating và Sentiment):** Tại bước 6, nếu hệ thống phát hiện sự bất thường giữa điểm số sao và nội dung bình luận, hệ thống sẽ báo lỗi *"Đánh giá không hợp lệ"* và yêu cầu người dùng thay đổi. Các trường hợp bất thường:
  * Rating cao (4-5 sao) nhưng lời văn chỉ ra cảm xúc cực kỳ tiêu cực (`nlpScore` < 0.3).
  * Rating thấp (1-2 sao) nhưng lời văn lại cực kỳ khen ngợi/tích cực (`nlpScore` > 0.7).
  * Rating trung bình (3 sao) nhưng biểu hiện cảm xúc trên văn bản lại quá đoan (quá thấp `< 0.3` hoặc quá cao `> 0.7`).
* **A4. Lỗi Microservice rớt kết nối:**
  * Nếu `Product Service` hoặc `Order Service` bị lỗi kết nối: Hệ thống thông báo lỗi chung chung *"Unable to verify order. Please try again later."* và yêu cầu người dùng thử lại sau.
  * Nếu `Sentiment Service` rớt kết nối: Kích hoạt cơ chế Fallback (dự phòng), tính năng vẫn tiếp tục hoạt động trơn tru bằng cách tự động đánh nhãn cảm xúc vào đánh giá là `NEUTRAL` (Trung tính) với điểm số mặc định là `0.5`, thay vì từ chối người dùng.
