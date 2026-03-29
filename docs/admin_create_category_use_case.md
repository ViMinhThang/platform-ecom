# Usecase: Tạo mới danh mục sản phẩm (Admin Create a Category)

## 1. Tên Use Case
Tạo mới danh mục sản phẩm

## 2. Actor (Người thực hiện)
Admin (Quản trị viên)

## 3. Description (Mô tả)
Use case này cho phép Quản trị viên (Admin) tạo thêm một danh mục sản phẩm mới vào hệ thống e-commerce để phân loại sản phẩm.

## 4. Precondition (Điều kiện tiên quyết)
- Admin đã đăng nhập vào hệ thống thành công.
- Tài khoản đăng nhập phải có quyền hệ thống là `ROLE_ADMIN`.

## 5. Postcondition (Điều kiện hậu quyết)
- Một danh mục sản phẩm mới được tạo thành công và lưu vào cơ sở dữ liệu (CSDL).
- Danh mục mới hiển thị lập tức trên bảng danh sách danh mục của Admin.

## 6. Event Flow (Luồng sự kiện chính)
1. **Admin** truy cập vào trang Quản lý danh mục (Dashboard > Danh mục).
2. **Hệ thống** kiểm tra quyền truy cập và hiển thị giao diện danh sách các danh mục hiện có cùng với nút "Thêm mới".
3. **Admin** nhấn vào nút "Thêm mới" (biểu tượng thẻ cộng).
4. **Hệ thống** hiển thị Dialog/Popup form với tiêu đề "Tạo danh mục mới", bao gồm các trường thông tin: 
   - Tên danh mục (Name)
   - Hình ảnh danh mục (ImageUrl)
5. **Admin** tiến hành nhập dữ liệu vào các trường thông tin yêu cầu.
6. **Admin** nhấn nút "Tạo danh mục mới" để xác nhận.
7. **Hệ thống** phía Client (Frontend) tiến hành:
   - Validate dữ liệu (Tên danh mục không được để trống).
   - Tự động tạo định dạng `slug` theo tên danh mục (chuyển chữ thường, bỏ dấu và thay khoảng trắng bằng dấu gạch ngang `-`).
8. **Hệ thống** gọi API `POST /api/v1/admin/categories` với thông tin DTO (`name`, `slug`, `imageUrl`) gửi xuống Backend.
9. **Hệ thống (Backend)** tiếp nhận, validate và lưu thông tin danh mục mới vào CSDL với thời gian `createdAt`, `updatedAt` hiện tại.
10. **Hệ thống** phản hồi thành công, Frontend hiển thị thông báo (toast) "Tạo danh mục thành công".
11. **Hệ thống** đóng Dialog và tự động tải lại danh sách danh mục để phản ánh dữ liệu vừa được thêm mới.

## 7. Alternative Flow (Luồng sự kiện thay thế)

### 7.1. Dữ liệu nhập không hợp lệ (Validation Error)
1. Ở **bước 6** của luồng chính, nếu Admin bỏ trống tên danh mục:
2. **Hệ thống** (Frontend qua Zod Form Validation) phát hiện lỗi.
3. **Hệ thống** không gọi API, đồng thời chặn hành động submit và hiển thị cảnh báo yêu cầu Admin phải điền đầy đủ thiết lập bắt buộc (Tên danh mục).
4. **Admin** nhập lại thông tin cho đúng và tiếp tục luồng chính ở **bước 6**.

### 7.2. Lỗi máy chủ hoặc lỗi mạng khi gọi API
1. Ở **bước 8** của luồng chính, nếu có lỗi xảy ra trong quá trình gọi API (mất kết nối mạng, backend bị lỗi 500,...):
2. **Hệ thống** nhận được phản hồi lỗi hoặc time-out.
3. **Hệ thống** hiển thị thông báo lỗi (toast) "Tạo mới danh mục thất bại".
4. Dialog vẫn giữ nguyên thông tin đang nhập để Admin có thể thử lại.

### 7.3. Hủy bỏ quá trình tạo danh mục
1. Ở **bước 4** hoặc **bước 5** của luồng chính, Admin quyết định không tạo danh mục mặt hàng nữa.
2. **Admin** chọn nút "Hủy" (Cancel) trên form hoặc tắt Dialog.
3. **Hệ thống** đóng form, xóa bỏ dữ liệu trên form và quay lại giao diện danh sách danh mục. Use case kết thúc.
