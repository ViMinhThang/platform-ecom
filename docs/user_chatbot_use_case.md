# Use Case: Sử dụng Chatbot AI hỗ trợ mua sắm

## 1. Tên Use Case
Trò chuyện với Chatbot AI hỗ trợ mua sắm (Chatbot AI Assistant)

## 2. Tác nhân (Actor)
- **Người dùng (Khách hàng/Khách truy cập):** Bất kỳ người dùng nào đang truy cập trang web (có thể đã đăng nhập hoặc chưa đăng nhập) muốn tìm kiếm sản phẩm, nhận tư vấn mua sắm, hoặc hỏi thông tin chi tiết về sản phẩm.
- **Hệ thống Chatbot Backend (LLM/Gemini):** Tác nhân phụ xử lý ngôn ngữ tự nhiên, phân tích yêu cầu và tự động gọi các công cụ dữ liệu (Tools) để trả lời.

## 3. Mô tả (Description)
Use case này cho phép người dùng tương tác trực tiếp bằng ngôn ngữ tự nhiên tiếng Việt với một "Trợ lý mua sắm AI". Chatbot giúp tư vấn thông tin, tìm kiếm sản phẩm theo nhiều tiêu chí đa dạng (tên, danh mục, giá cả, thương hiệu, bán chạy nhất, rẻ nhất,...), và hiển thị trực tiếp danh sách các sản phẩm gợi ý ngay trong khung chat của người dùng.

## 4. Điều kiện tiên quyết (Precondition)
- Người dùng đang mở giao diện frontend của hệ thống platform-ecom.
- Các dịch vụ backend bao gồm Gateway, Chatbot Service, và nền tảng cung cấp AI LLM (như Gemini) đang hoạt động ổn định.
- (Tùy chọn) Dữ liệu Vector Embeddings của các sản phẩm đã được đồng bộ hóa thành công qua tính năng Sync Embeddings để Chatbot có thể tìm kiếm dữ liệu.

## 5. Điều kiện hậu quyết (Post condition)
- Người dùng nhận được phản hồi phù hợp với ngữ cảnh câu hỏi bằng tiếng Việt, kèm theo danh sách sản phẩm tương ứng (nếu yêu cầu là tìm kiếm hoặc gợi ý sản phẩm).
- Thông tin hội thoại được lưu lại tạm thời vào bộ nhớ (`ChatMemory`) trong phiên làm việc hiện tại, gắn liền với `conversationId` của cuộc trò chuyện để giữ liên kết ngữ cảnh ở các câu tiếp theo.

## 6. Luồng sự kiện chính (Event Flow)
1. **Người dùng** click vào biểu tượng Chatbot ở góc giao diện màn hình frontend.
2. **Hệ thống** hiển thị cửa sổ Chat Window và tự động gửi một tin nhắn chào mừng mặc định: *"Xin chào! Tôi là trợ lý AI của cửa hàng..."*.
3. **Người dùng** nhập câu hỏi hoặc yêu cầu tư vấn (ví dụ: "Tìm cho tôi điện thoại Samsung rẻ nhất", "Giới thiệu sản phẩm...") và nhấn nút Gửi (hoặc phím Enter).
4. **Hệ thống (Frontend)** gắn ID cuộc hội thoại (`conversationId`) vào tin nhắn và gửi API request (`POST /api/v1/chatbot/chat`) đến hệ thống Backend.
5. **Hệ thống (Backend - ChatbotService)** tiếp nhận nội dung, đẩy Prompt (kèm theo Conversation ID để giữ ngữ cảnh) sang AI Client.
6. **Hệ thống AI (LLM)** phân tích câu hỏi người dùng, tự động xác định được ý định mua sắm và gọi các công cụ tìm kiếm dữ liệu nội bộ (ví dụ: `searchAndSortProducts`, `ProductTools`).
7. **Hệ thống (Backend)** ghi nhận câu trả lời dạng văn bản từ AI, đồng thời đóng gói kèm danh sách các sản phẩm tìm được (`ProductSummaryDTO`).
8. **Hệ thống (Frontend)** nhận phản hồi từ API, cập nhật lên giao diện cửa sổ Chat Window. Người dùng sẽ thấy câu trả lời tư vấn bằng văn bản và danh sách rút gọn các sản phẩm hiển thị trên màn hình.

## 7. Luồng sự kiện thay thế (Alternative Flow)
- **Ngoại lệ 1: Không tìm thấy sản phẩm phù hợp**
   - *Tại bước 6 của luồng chính:* Nếu hệ thống AI truy vấn nhưng cơ sở dữ liệu không trả về kết quả sản phẩm nào khớp với yêu cầu tìm kiếm của người dùng.
   - *Bước 7:* Backend sẽ ghi nhận trạng thái danh sách sản phẩm rỗng (`showSupportInfo = true`).
   - *Bước 8:* Hệ thống hiển thị câu trả lời tư vấn thân thiện thông báo không tìm thấy sản phẩm, đồng thời gợi ý thay đổi từ khóa, hiển thị thông tin Liên hệ/Hỗ trợ (Support Info) để người dùng lấy thêm thông tin trực tiếp từ chăm sóc khách hàng.
 
- **Ngoại lệ 2: Lỗi kết nối hoặc AI Service bị gián đoạn**
   - *Tại bước 4 hoặc bước 5 của luồng chính:* Nếu hệ thống mất kết nối mạng, backend bị lỗi nội bộ (`Exception`), hoặc nhà cung cấp AI Client không phản hồi.
   - *Bước 6 (Thay thế):* Phương thức bắt lỗi (catch block) tại backend chạy, tự động sinh ra một câu trả lời dự phòng.
   - *Bước 8:* Hệ thống hiển thị thông báo lỗi thân thiện cho người dùng: *"Xin lỗi, tôi gặp chút trục trặc kỹ thuật. Cảm phiền bạn thử lại sau giây lát nhé!"*. Tiến trình bị gián đoạn nhưng không làm treo toàn bộ ứng dụng người dùng.

- **Luồng phụ 3: Chức năng xem tóm tắt một sản phẩm cụ thể bằng AI**
   - Người dùng đang xem thông tin một sản phẩm và bấm vào tùy chọn tóm tắt hoặc chi tiết nhanh sản phẩm qua AI.
   - Hệ thống (Frontend) gọi riêng Endpoint `GET /api/v1/chatbot/product/{slug}/summary`.
   - Backend đẩy một Prompt đặc thù yêu cầu AI tóm tắt ngắn gọn tính năng, đặc tả của sản phẩm đó.
   - Hệ thống hiển thị kết quả tóm tắt cho người dùng trên giao diện.
