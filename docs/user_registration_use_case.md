# Tài Liệu Yêu Cầu Use Case: Đăng Ký Tài Khoản Người Dùng

Dựa trên quá trình phân tích mã nguồn (API backend: `UserController.java`, `AuthServiceImpl.java` và `SignupRequest.java`), dưới đây là tài liệu đặc tả Use Case cho chức năng đăng ký người dùng.

## 1. Thông Tin Chung
- **Tên Use Case (Name):** Đăng ký tài khoản (User Registration)
- **Tác nhân (Actor):** Khách truy cập (Guest/Visitor) - Người dùng chưa có tài khoản trên hệ thống.
- **Mô tả (Description):** Use case này cho phép một khách truy cập tạo 1 tài khoản mới trên hệ thống thương mại điện tử bằng cách cung cấp các thông tin cần thiết như tên đăng nhập, email và mật khẩu an toàn.

## 2. Điều Kiện
- **Tiền điều kiện (Precondition):**
  - Tác nhân (khách) có quyền truy cập vào ứng dụng (ứng dụng web hoặc mobile).
  - Tác nhân chưa đăng nhập vào hệ thống.
  - Hệ thống backend (User Service) và Database đang hoạt động bình thường.
- **Hậu điều kiện (Post-condition):**
  - Nếu thành công: Một bản ghi tài khoản người dùng mới được tạo trong cơ sở dữ liệu. Mật khẩu của người dùng được mã hóa (hashed) an toàn trước khi lưu. Người dùng được cấp các quyền (Roles) hệ thống tương ứng do API quy định.
  - Nếu thất bại: Không có thay đổi nào trong cơ sở dữ liệu, hiển thị thông báo lỗi cụ thể cho người dùng.

## 3. Luồng Sự Kiện Chính (Main Flow)
1. Khách truy cập điều hướng đến trang "Đăng ký" và điền vào biểu mẫu đăng ký.
2. Khách truy cập cung cấp các thông tin: 
   - `username`: Tên đăng nhập (yêu cầu từ 3-20 ký tự).
   - `email`: Địa chỉ email hợp lệ (tối đa 50 ký tự).
   - `password`: Mật khẩu an toàn (yêu cầu từ 6-40 ký tự).
   - *(Optional)* `role`: Chỉ định phân quyền nếu có (thường hệ thống sẽ tự động gán phân quyền mặc định là User).
3. Khách truy cập bấm xác nhận. Hệ thống gửi yêu cầu (POST request đến API `/api/v1/auth/signup`).
4. Hệ thống (Backend) xác nhận tính hợp lệ (Validation) của payload theo cấu trúc `SignupRequest`.
5. Hệ thống kiểm tra xem `username` đã tồn tại trong cơ sở dữ liệu hay chưa.
6. Hệ thống tiếp tục kiểm tra xem `email` đã tồn tại trong cơ sở dữ liệu hay chưa.
7. Hệ thống mã hóa mật khẩu đã nhận bằng thuật toán bảo mật (thông qua `PasswordEncoder`).
8. Hệ thống thiết lập các vai trò (Roles) cho người dùng thông qua `RoleService`.
9. Hệ thống lưu đối tượng người dùng mới vào cơ sở dữ liệu (`UserRepository.save()`).
10. Hệ thống trả về mã trạng thái hợp lệ (HTTP 200 OK) với thông báo `"Register successfully"`.
11. Giao diện frontend hiển thị thông báo đăng ký thành công và chuyển hướng người dùng đến trang Đăng nhập.

## 4. Luồng Sự Kiện Thay Thế / Ngoại Lệ (Alternative Flow / Exceptions)

- **A1. Dữ liệu ngõ vào không hợp lệ (Validation Error):**
  - Tại bước 4 của luồng chính, nếu `username` bị trống, quá ngắn/dài, hoặc `email` sai định dạng, mật khẩu bé hơn 6 ký tự:
  - Hệ thống từ chối yêu cầu trước khi xử lý logic (nhờ `@Valid`).
  - Hệ thống trả về mã lỗi Bad Request kèm theo chi tiết các trường không hợp lệ.
  - Use case kết thúc sớm, người dùng được yêu cầu sửa lại dữ liệu đầu vào.

- **A2. Tên đăng nhập (Username) đã tồn tại:**
  - Tại bước 5 của luồng chính, nếu API phát hiện cấu trúc `username` đã được ai đó đăng ký, hệ thống ném ra ngoại lệ `UserAlreadyExistsException`.
  - Hệ thống trả về thông báo lỗi: `"Error: Username is already taken!"`.
  - Quy trình bị hủy, người dùng phải nhập `username` khác.

- **A3. Địa chỉ Email đã được sử dụng:**
  - Tại bước 6 của luồng chính, nếu hệ thống phát hiện `email` đã tồn tại cho một tài khoản khả dụng.
  - API ném ngoại lệ `UserAlreadyExistsException` và trả dữ liệu lỗi: `"Error: Email is already in use"`.
  - Quy trình bị hủy, người dùng phải đăng nhập tài khoản cũ hoặc sử dụng `email` mới.

- **A4. Lỗi máy chủ / Lội hệ thống cơ sở dữ liệu:**
  - Trong quá trình lưu thông tin ở bước 9, nếu cơ sở dữ liệu không phản hồi.
  - Hệ thống ghi chép log và trả về HTTP 500 Internal Server Error.
  - Thông báo cho người dùng hệ thống đang bận và thử lại sau.
