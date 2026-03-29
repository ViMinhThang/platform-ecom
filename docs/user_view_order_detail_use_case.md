# Tài liệu Use Case: Xem chi tiết đơn hàng với phiên bản và hình ảnh tùy chọn (View Order Detail with Option Images and Variant)

## 1. Tên Use Case
Xem chi tiết đơn hàng (View Order Detail with Option Images and Variant)

## 2. Tác nhân (Actor)
- **Người dùng (User)**: Khách hàng đã có tài khoản và đã đăng nhập vào hệ thống e-commerce, đồng thời đã có ít nhất một đơn hàng trong lịch sử mua hàng.

## 3. Mô tả (Description)
Use case này cho phép người dùng xem chi tiết về một đơn hàng cụ thể mà họ đã đặt trước đó. Ở trang chi tiết này, người dùng không chỉ xem được trạng thái, tổng giá trị, và thời gian đặt hàng mà còn thấy được thông tin chi tiết từng sản phẩm trong đơn, bao gồm **tên sản phẩm**, **tên phiên bản (Variant Name)**, **mã SKU**, **hình ảnh của phiên bản (Option Image)**, và các **thuộc tính tùy chọn** (ví dụ: Màu sắc, Kích cỡ). Điều này giúp người dùng dễ dàng nhận diện chính xác biến thể của sản phẩm mà mình đã mua.

## 4. Điều kiện tiên quyết (Precondition)
- Người dùng đã được xác thực (đăng nhập thành công) vào hệ thống.
- Người dùng có ít nhất một đơn hàng trong lịch sử mua hàng của mình.
- Người dùng đang ở màn hình hiển thị danh sách "Lịch sử đơn hàng" (Order History) thuộc phần Quản lý Hồ sơ (Profile) của mình.

## 5. Điều kiện hậu quyết (Post condition)
- Giao diện màn hình hiển thị thành công toàn bộ chi tiết của đơn hàng được chọn.
- Các thông tin chi tiết của mỗi sản phẩm (OrderItem) được tải và hiển thị chính xác bao gồm: hình ảnh biến thể (variant image), tên sản phẩm, tùy chọn của biến thể (kích cỡ, màu sắc), số lượng, đơn giá và tổng phụ của item.
- Người dùng có thể thực hiện tiếp các thao tác liên quan như theo dõi đơn hàng, để lại đánh giá (nếu đủ điều kiện trạng thái) hoặc mua lại (Buy Again).

## 6. Luồng sự kiện chính (Main Event Flow)
1. Từ màn hình "Lịch sử đơn hàng", người dùng bấm vào một đơn hàng cụ thể để xem chi tiết hoặc bấm vào nút "Xem chi tiết" (View Details) trên thẻ tóm tắt đơn hàng.
2. Giao diện người dùng gửi yêu cầu HTTP `GET` kèm theo ID của đơn hàng (ví dụ: `/api/v1/users/orders/{orderId}`) và Access Token lên hệ thống Backend.
3. Backend tiếp nhận yêu cầu, kiểm tra quyền hạn (Access Token) và xác thực người dùng có phải là chủ sở hữu của đơn hàng này hay không.
4. Backend truy vấn cơ sở dữ liệu để lấy toàn bộ thông tin chi tiết của đơn hàng, trong đó bao gồm danh sách các sản phẩm (OrderItems). 
5. Đối với mỗi sản phẩm trong đơn (OrderItem), Backend tải đầy đủ dữ liệu về **Biến thể sản phẩm (Product Variant)** bao gồm:
   - Tên biến thể (Variant Name)
   - Hình ảnh đặc trưng của biến thể đó (imageUrl)
   - Các giá trị thuộc tính tùy chọn (Option Values, ví dụ: Xanh, Size M).
   - Mã SKU của biến thể.
6. Backend trả về payload dữ liệu chi tiết của đơn hàng định dạng JSON cho giao diện Frontend.
7. Frontend nhận dữ liệu và hiển thị chi tiết (Component `OrderItemCard`). Đối với mỗi sản phẩm:
   - **Hình ảnh biến thể**: Hiển thị hình thu nhỏ (thumbnail) dựa trên URL hình ảnh thuộc biến thể sản phẩm đó.
   - **Tên và SKU**: Hiển thị tên sản phẩm, tên biến thể và mã SKU.
   - **Thuộc tính tuỳ chọn**: Hiển thị dạng thẻ (tags) cho kích thước, màu sắc tương ứng.
   - **Giá và số lượng**: Hiển thị đơn giá lúc đặt hàng kèm số lượng mua và tính ra tổng phí cho mục đó.
8. Người dùng xem chi tiết các mặt hàng mua và phiên bản chính xác, có thể thấy nút "Viết đánh giá" (Write Review) nếu đơn hàng đã được giao thành công.

## 7. Các luồng thay thế (Alternative Flows)

### 7.1. Luồng A1: Sản phẩm hoặc biến thể không có hình ảnh tĩnh
- **Tại bước 7 của Luồng chính**, Frontend kiểm tra thấy biến thể của sản phẩm không có trường dữ liệu hình ảnh (`imageUrl` bị rỗng hoặc null).
- Frontend tự động bắt lỗi hiển thị và thế chỗ bằng hình ảnh mặc định (Placeholder / icon Package) của hệ thống để duy trì giao diện người dùng.

### 7.2. Luồng A2: Phiên đăng nhập hết hạn hoặc chưa đăng nhập
- **Tại bước 2 của Luồng chính**, hệ thống không tìm thấy Access Token hợp lệ của thiết bị.
- Backend phân loại bảo mật ở mức 401 Unauthorized, không cho phép truy xuất dữ liệu đơn hàng.
- Frontend nhận lỗi và thông báo người dùng phiên đăng nhập đã quá hạn, điều hướng người dùng tới trang Đăng nhập và yêu cầu đăng nhập lại để tiếp tục.

### 7.3. Luồng A3: Đơn hàng không tồn tại hoặc không thuộc về người dùng
- **Tại bước 3 của Luồng chính**, Backend tìm kiếm ID đơn hàng trong cơ sở dữ liệu nhưng không có kết quả, hoặc ID thuộc về một khách hàng khác.
- Backend trả về lỗi 403 Forbidden hoặc 404 Not Found nhằm bảo mật thông tin.
- Frontend nhận lỗi, điều hướng người dùng quay trở về trang Lịch sử đơn hàng, đồng thời bật đoạn toast cảnh báo: "Đơn hàng này không tồn tại hoặc bạn không có quyền truy cập".

### 7.4. Luồng A4: Thông tin biến thể sản phẩm đã bị xóa khỏi hệ thống
- **Tại bước 5 của Luồng chính**, nếu cửa hàng đã xóa biến thể đó sau khi người dùng đặt hàng.
- Backend vẫn trích xuất bảo lưu những dữ liệu đã được chép (snapshot) lại tại thời điểm mua (trong OrderItem) giúp đơn hàng không bị mất thông tin.
- Frontend sẽ hiển thị thông tin như cũ được sao lưu ở dữ liệu đơn hàng (ví dụ Tên cũ, Hình ảnh cũ) thay vì truy vấn trực tiếp vào Catalogue của sản phẩm đang active.
