# Hướng dẫn Quản lý Người dùng (Admin)

Tài liệu này hướng dẫn chi tiết các chức năng quản lý người dùng dành cho quản trị viên (Admin) trên hệ thống Platform E-commerce.

## 1. Giới thiệu chung
Chức năng Quản lý người dùng cho phép Admin kiểm soát toàn bộ tài khoản trong hệ thống, bao gồm khách hàng (User), người bán (Seller) và các quản trị viên khác. Admin có quyền tạo mới, chỉnh sửa, khóa hoặc xóa tài khoản để đảm bảo an ninh và vận hành hệ thống.

## 2. Cách truy cập
- **Đường dẫn:** `/admin/dashboard/user`
- **Yêu cầu:** Phải đăng nhập với tài khoản có quyền `ROLE_ADMIN`.

## 3. Các chức năng chính

### 3.1. Xem danh sách người dùng
Giao diện quản lý cung cấp danh sách người dùng dưới dạng bảng với các thông tin:
- **Tên người dùng (Username)**
- **Email**
- **Trạng thái (Active/Inactive):** Cho biết tài khoản có đang được phép hoạt động hay không.
- **Vai trò (Roles):** Các quyền hạn mà người dùng sở hữu (ROLE_USER, ROLE_SELLER, ROLE_ADMIN).

### 3.2. Thêm mới người dùng
Admin có thể chủ động tạo tài khoản cho người dùng khác:
- **Thông tin cơ bản:** Username, Email, Mật khẩu (Mặc định thường là `12345678` và yêu cầu đổi sau).
- **Gán vai trò:** Chọn một hoặc nhiều vai trò cho người dùng mới.

### 3.3. Cập nhật thông tin
Admin có quyền thay đổi thông tin của bất kỳ người dùng nào:
- **Thông tin cá nhân:** Email, Tên hiển thị.
- **Ảnh đại diện:** Tải lên ảnh mới cho người dùng.
- **Vai trò:** Thêm hoặc bớt các quyền hạn (Roles).

### 3.4. Quản lý trạng thái (Kích hoạt/Khóa)
Đây là tính năng quan trọng để xử lý các tài khoản vi phạm hoặc cần tạm dừng:
- **Kích hoạt (Active):** Cho phép người dùng đăng nhập và sử dụng hệ thống bình thường.
- **Khóa (Inactive):** Người dùng sẽ không thể đăng nhập hoặc thực hiện bất kỳ thao tác nào trên hệ thống.

### 3.5. Xóa người dùng
- Cho phép loại bỏ hoàn toàn tài khoản người dùng khỏi hệ thống.
- **Lưu ý:** Việc xóa tài khoản là hành động vĩnh viễn và có thể ảnh hưởng đến các dữ liệu liên quan như đơn hàng, đánh giá nếu không được xử lý cẩn thận ở mức DB.

## 4. Chi tiết kỹ thuật (Dành cho Developer)

### Backend (User Service)
- **Controller:** `AdminUserController` cung cấp các API tại `/api/v1/admin/users`.
- **Dịch vụ:** `AdminUserServiceImpl` xử lý logic nghiệp vụ như mã hóa mật khẩu, kiểm tra trùng lặp Email/Username và lưu trữ hình ảnh.
- **Cơ sở dữ liệu:** Bảng `users` lưu giữ thông tin chính, bảng `roles` lưu danh sách quyền và bảng trung gian `user_role` quản lý mối quan hệ n-n.

### Frontend (Next.js)
- **Trang:** `app/admin/dashboard/user/page.tsx`.
- **Quản lý trạng thái:** Sử dụng Redux Toolkit Query để đồng bộ dữ liệu người dùng từ Backend.

## 5. Lưu ý bảo mật
- **Mật khẩu:** Mật khẩu luôn được mã hóa bằng `BCrypt` trước khi lưu vào cơ sở dữ liệu.
- **Phân quyền:** Chỉ những tài khoản có `ROLE_ADMIN` mới có thể truy cập các API trong `AdminUserController` nhờ vào Aspect `@RequireRole`.
- **Kiểm tra dữ liệu:** Hệ thống tự động kiểm tra tính duy nhất của Email và Username để tránh xung đột dữ liệu.
