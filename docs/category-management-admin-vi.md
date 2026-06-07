# Hướng dẫn Quản lý Danh mục (Admin)

Tài liệu này cung cấp cái nhìn chi tiết về chức năng quản lý danh mục sản phẩm dành cho quản trị viên (Admin) trên hệ thống Platform E-commerce.

## 1. Giới thiệu chung
Danh mục sản phẩm đóng vai trò quan trọng trong việc tổ chức và phân loại sản phẩm, giúp người dùng dễ dàng tìm kiếm và duyệt sản phẩm. Quản trị viên có toàn quyền kiểm soát vòng đời của một danh mục, từ lúc tạo mới cho đến khi ngừng hoạt động.

## 2. Cách truy cập
Quản trị viên có thể truy cập trang quản lý danh mục thông qua Dashboard Admin:
- **Đường dẫn:** `/admin/dashboard/category`
- **Yêu cầu:** Phải đăng nhập với tài khoản có quyền `ROLE_ADMIN`.

## 3. Các tính năng chính

### 3.1. Xem danh sách danh mục
Hệ thống cung cấp giao diện bảng để liệt kê tất cả các danh mục hiện có.
- **Phân trang:** Hỗ trợ xem danh sách theo từng trang để tối ưu hiệu suất.
- **Sắp xếp:** Có thể sắp xếp danh mục theo tên, ngày tạo hoặc ngày cập nhật.
- **Tìm kiếm:** (Nếu được tích hợp trên UI) Tìm kiếm nhanh danh mục theo tên.

### 3.2. Thêm mới danh mục
Quản trị viên có thể tạo danh mục mới bằng cách nhấn nút "Tạo danh mục". Các thông tin cần cung cấp bao gồm:
- **Tên danh mục (Name):** Tên hiển thị của danh mục (Ví dụ: Điện thoại, Thời trang nam).
- **Slug (Đường dẫn):** Chuỗi định danh duy nhất dùng cho URL. Nếu để trống, hệ thống sẽ tự động tạo từ tên danh mục.
- **Hình ảnh (Image):** Ảnh đại diện cho danh mục để hiển thị trên giao diện người dùng.

### 3.3. Cập nhật danh mục
Cho phép thay đổi thông tin của danh mục đã tồn tại.
- **Chỉnh sửa thông tin:** Cập nhật tên, slug.
- **Thay đổi hình ảnh:** Tải lên ảnh mới để thay thế ảnh cũ.

### 3.4. Xóa danh mục
Hệ thống sử dụng cơ chế **Xóa mềm (Soft Delete)**.
- Khi một danh mục bị xóa, nó sẽ không bị xóa vĩnh viễn khỏi cơ sở dữ liệu.
- Thay vào đó, trường `deleted` sẽ được chuyển thành `true`.
- Danh mục bị xóa sẽ ẩn khỏi giao diện khách hàng nhưng vẫn được lưu giữ trong hệ thống để đảm bảo tính toàn vẹn dữ liệu (ví dụ: các sản phẩm cũ vẫn có thể tham chiếu đến danh mục này).

## 4. Chi tiết kỹ thuật (Dành cho Developer)

### Backend (Spring Boot)
- **Controller:** `AdminCategoryController` xử lý các yêu cầu từ `/api/v1/admin/categories`.
- **Entity:** `Category` sử dụng annotation `@SQLDelete` của Hibernate để thực hiện xóa mềm.
- **Logic tự động:** `slug` được tạo tự động thông qua phương thức `generateSlug` trong class `Category` trước khi lưu vào DB (`@PrePersist`).

### Frontend (Next.js)
- **Trang:** `app/admin/dashboard/category/page.tsx`.
- **Quản lý trạng thái:** Sử dụng Redux Toolkit Query (`admin` store) để giao tiếp với API.
- **Thư viện UI:** Sử dụng các thành phần từ Shadcn/UI và Tabler Icons.

## 5. Lưu ý quan trọng
- **Slug duy nhất:** Mỗi danh mục phải có một slug duy nhất trong hệ thống. Nếu trùng, backend sẽ trả về lỗi 400.
- **Ảnh danh mục:** Nên sử dụng ảnh có kích thước chuẩn và dung lượng nhẹ để đảm bảo tốc độ tải trang frontend.
- **Ràng buộc sản phẩm:** Khi xóa danh mục, cần lưu ý các sản phẩm thuộc danh mục đó vẫn sẽ tồn tại nhưng có thể không hiển thị đúng nếu logic frontend yêu cầu danh mục phải ở trạng thái "active".
