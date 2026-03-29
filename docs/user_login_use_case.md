# Tài liệu Đặc tả Use Case: Đăng nhập Người dùng (User Login)

## 1. Tên Use Case (Name)
Đăng nhập người dùng (User Login)

## 2. Chủ thể (Actor)
Người dùng (User), bao gồm Khách hàng (Customer) hoặc Quản trị viên (Admin).

## 3. Mô tả (Description)
Use case này mô tả quá trình một người dùng (đã có tài khoản) xác thực với hệ thống thông qua email và mật khẩu. Quá trình này giúp hệ thống cấp quyền truy cập vào các tính năng hợp lệ dưới dạng một JWT Token Cookie nếu thông tin đăng nhập chính xác.

## 4. Điều kiện tiên quyết (Preconditions)
* Người dùng đã đăng ký tài khoản thành công trong hệ thống.
* Hệ thống cơ sở dữ liệu và các microservices (đặc biệt là service `user`) đang hoạt động.
* Ứng dụng client có thể kết nối với REST API backend qua endpoint `/api/v1/auth/login`.

## 5. Điều kiện kết thúc (Postconditions)
* **Thành công:** Hệ thống tạo ra một Set-Cookie chứa JWT Token cho phiên đăng nhập hiện tại và trả về thông tin dữ liệu hồ sơ cá nhân của người dùng. Trạng thái của phiên đăng nhập được duy trì cho các luồng request tiếp theo.
* **Thất bại:** Kết nối xác thực bị từ chối, JWT Token không được sinh ra và hệ thống trả về thông báo lỗi báo lý do từ chối.

## 6. Luồng sự kiện chính (Main Event Flow)
1. Người dùng mở trang / hộp thoại Đăng nhập trên giao diện frontend.
2. Người dùng nhập `email` và `password`.
3. Người dùng kích hoạt hành động "Đăng nhập" (click nút).
4. Frontend gửi yêu cầu `POST` dạng JSON tới API endpoint `/api/v1/auth/login` với body chứa `email` và `password`.
5. Hệ thống backend kiểm tra tính hợp lệ của dữ liệu (các trường không được để trống).
6. Hệ thống thực hiện tìm kiếm người dùng trong cơ sở dữ liệu bằng cách sử dụng `email` đã cung cấp.
7. Hệ thống tiến hành so sánh và xác thực mã băm của `password` người dùng vừa nhập xem có khớp với mật khẩu đã mã hóa của tài khoản lưu trong database hay không.
8. Nếu mật khẩu khớp hoàn toàn, hệ thống khởi tạo một JWT token chứa phân định danh (User ID) của người dùng đó.
9. Hệ thống đóng gói đối tượng JWT Token này vào HTTP `ResponseCookie`.
10. Hệ thống phản hồi HTTP Status `200 OK` với Header có đính kèm `Set-Cookie` chứa token và Body chứa cấu trúc `APIResponse` gửi kèm báo hiệu "Login successful" cùng với thông tin người dùng (`UserInfoResponse`).
11. Giao diện frontend nhận được phản hồi, lưu trạng thái user hiện tại và chuyển hướng người dùng vào bên trong hệ thống (Trang chủ hoặc bảng điều khiển).

## 7. Các luồng thay thế / ngoại lệ (Alternative / Exception Flows)

* **AF1: Email không tồn tại trong hệ thống**
    1. Tại bước 6 của Luồng chính, hệ thống truy vấn CSDL và không tìm thấy bản ghi user nào khớp với `email`.
    2. Hệ thống xử lý ngoại lệ `ResourceNotFoundException`.
    3. Hệ thống trả về phản hồi lỗi cho frontend với thông báo mô tả "User email" không được tìm thấy.
    4. Giao diện hiển thị thông báo lỗi (Ví dụ: "Tài khoản không tồn tại") và yêu cầu người dùng kiểm tra lại thông tin. Use case kết thúc.

* **AF2: Mật khẩu không chính xác**
    1. Tại bước 7 của Luồng chính, mật khẩu (sau khi băm qua thuật toán nội bộ) không khớp với giá trị có sẵn.
    2. Hệ thống báo ngoại lệ `APIException` kèm nội dung "Invalid email or password!".
    3. Hệ thống trả báo lỗi HTTP Error Response về cho Client.
    4. Giao diện in ra thông báo "Sai email hoặc mật khẩu" và giữ người dùng ở nguyên trạng thái trang đăng nhập để tiếp tục thử lại. Use case kết thúc.

* **AF3: Gửi cấu trúc thông tin thiếu sót (Blank Email/Password)**
    1. Tại bước 5 của Luồng chính, hệ thống kiểm tra đối tượng `LoginRequest` xem có các trường bị rỗng không (`@NotBlank`).
    2. Nếu `email` hoặc `password` rỗng, hệ thống từ chối yêu cầu và không xử lý truy vấn CSDL.
    3. Hệ thống trả về lỗi lỗi HTTP (Bad Request) bao gồm tình trạng vi phạm của dữ liệu.
    4. Frontend hiển thị thông báo "Vui lòng nhập Email/Mật khẩu". Use case kết thúc.
