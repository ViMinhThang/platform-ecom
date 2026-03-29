# Tài liệu Use Case: Admin/Seller Tạo Sản Phẩm (Kèm Tùy chọn, Hình ảnh và Biến thể)

## Tiêu đề Use Case (Use Case Name)
**Tạo mới sản phẩm phức tạp có chứa các Tùy chọn (Options), Hình ảnh (Images) và Biến thể (Variants)**

## Tác nhân (Actor)
- **Admin / Seller** (Người bán hoặc Quản trị viên quản lý danh mục sản phẩm).

## Mô tả (Description)
Use case này mô tả chi tiết toàn bộ quy trình từ lúc Admin/Seller bắt đầu khởi tạo một sản phẩm mới, cập nhật các thông tin mô tả cơ bản thiết lập các tùy chọn phân loại (Ví dụ: Màu sắc, Kích thước...), tải hình ảnh sản phẩm, và cuối cùng tạo ra các biến thể sản phẩm (Variants) chứa thông số về giá cả, SKU, số lượng tồn kho theo từng sự kết hợp tùy chọn phân loại.

## Điều kiện tiên quyết (Precondition)
1. Tác nhân phải đăng nhập thành công vào trang quản trị (Dashboard) với quyền hợp lệ (Vd: `ROLE_SELLER` hoặc `ROLE_ADMIN`).
2. Tác nhân đã được xác thực (Authenticated) bằng Token và được cấp phiên làm việc.
3. Hệ thống danh mục sản phẩm (Categories) đã được khởi tạo dữ liệu trong hệ thống.
4. Có sẵn dịch vụ (Service) để lưu trữ và tải lên tệp tin (File/Image Upload) hoạt động bình thường.

## Điều kiện sau (Post condition)
1. Một **Sản phẩm (Product)** mới được lưu trữ trong cơ sở dữ liệu.
2. Các **Tùy chọn (Product Options)** (như Size, Color) và **Giá trị Tùy chọn (Product Option Values)** (như XL, L, Đỏ, Đen) được tạo mới và liên kết chính xác với Product ID đó.
3. Các **Hình ảnh (Product Images)** được tải lên lưu trữ, trả về URL có thể truy cập và liên kết với Product ID đó.
4. Các **Biến thể (Product Variants)** tương ứng cho sự kết hợp của Option Values được tạo thành công, gắn liền với SKU, giá bán riêng, ảnh riêng (nếu có) và tồn kho (stock) hiện tại.
5. Người dùng (Buyer) có thể tìm kiếm và xem được thiết kế sản phẩm hoàn chỉnh cùng với đa dạng biến thể khi mua hàng ngoài giao diện Client.

---

## Luồng sự kiện chính (Main Event Flow)

1. **Bắt đầu tạo mới**: Tác nhân truy cập vào phân hệ sản phẩm và nhấn nút "Thêm sản phẩm mới".
2. **Nhập thông tin cơ bản**: Tác nhân điền các thông tin của sản phẩm bào gồm: Tên sản phẩm, Danh mục (Category), Mô tả (Description), Trạng thái ban đầu, và Giá cơ bản vào biểu mẫu.
3. **Lưu sản phẩm gốc**: Tác nhân nhấn "Tiếp tục" (hoặc "Lưu"). Hệ thống sẽ gửi yêu cầu API (`POST /api/v1/sellers/products`) lên hệ thống để khởi tạo Product Record và trả về `productId` nội bộ làm gốc liên kết.
4. **Tải lên hình ảnh**: Hệ thống chuyển sang khu vực quản lý hình ảnh. Tác nhân kéo thả các hình ảnh mô tả / hình ảnh biến thể lên form. Hệ thống gọi API Upload và gán danh sách hình ảnh trỏ tới bản ghi `productId`.
5. **Định nghĩa Tùy chọn (Options)**: Tác nhân kích hoạt thuộc tính sản phẩm có biến thể, sau đó nhập tên Option (Ví dụ: "Màu sắc"). Tiếp theo, Tác nhân nhập các giá trị của tùy chọn cho Option đó (Ví dụ: "Xanh", "Đỏ"). Hệ thống sẽ gọi lệnh (`POST /api/v1/sellers/products/{productId}/options`) để lưu *ProductOption* & *OptionValues*.
6. **Khởi tạo và Quản lý Biến thể (Variants)**:
   - Dựa trên các Tùy chọn được nhập, hệ thống Frontend tự động kết hợp các thuộc tính thành một bảng Biến thể để tác nhân dễ dàng quản lý (Ví dụ: Áo Xanh, Áo Đỏ).
   - Với mỗi biến thể, Tác nhân cập nhật mã SKU, Giá bán riêng lẻ, Giảm giá, số lượng mở bán (Stock), và một URL hình ảnh cụ thể đại diện cho biến thể đó.
7. **Lưu Biến thể**: Tác nhân nhấn xác nhận thêm biến thể. Hệ thống gọi giao tiếp Server (`POST /api/v1/sellers/products/{productId}/variants`) để lưu từng ProductVariant vào cơ sở dữ liệu.
8. **Hoàn tất Use Case**: Hệ thống hiển thị thông báo **"Tạo sản phẩm với biến thể thành công"** và chuyển hướng Tác nhân quay trở lại giao diện danh sách Sản phẩm.

---

## Luồng thay thế / rẽ nhánh (Alternative Flows)

### 1: Validation Lỗi thông tin cơ bản
- **Tại Event 2 hoặc 3**: Thay vì nhập những trường bắt buộc (như Tên sản phẩm, Danh mục, Giá cơ bản), tác nhân lại bỏ trống form.
- **Xử lý**: API sẽ ngay lập tức từ chối yêu cầu và trả về lỗi Validation (Error 400 Bad Request). Frontend bôi đỏ Form và yêu cầu Tác nhân điền các trường bắt buộc để gửi lại form.

### 2: Tải định dạng hình ảnh không hợp lệ / quá dung lượng
- **Tại Event 4**: Tác nhân tải file không phải hình ảnh (vd: PDF, ZIP) hoặc hình ảnh dung lượng quá 5MB.
- **Xử lý**: Hệ thống từ chối File và hiển thị Popup lỗi: "Chỉ được phép định dạng JPG, PNG hoặc dung lượng quá lớn". File bị loại khỏi danh sách upload, Tác nhân cần chọn lại.

### 3: Trùng lặp mã SKU biến thể
- **Tại Event 6 và 7**: Tác nhân vô tình điền mã SKU của *Biến thể A* trùng lặp với Mã SKU đã từng tồn tại trong hệ thống.
- **Xử lý**: Server từ chối lệnh tạo `ProductVariant` đó (Return lỗi `SKU đã tồn tại`). Tác nhân được hệ thống thông báo cần chỉnh sửa lại mã SKU cho duy nhất rồi mới được tiếp tục lưu.

### 4: Tác nhân hủy thao tác giữa chừng (Cancel operation)
- **Tại bất kỳ bước nào (sau Event 3)**: Tác nhân nhấn nút "Hủy" hoặc đóng trình duyệt.
- **Xử lý**: Hệ thống bắt sự kiện và hiển thị thông báo "Dữ liệu chưa lưu sẽ bị mất. Bạn chắc chắn muốn thoát?". Nếu Tác nhân chọn OK, dữ liệu về Sản phẩm gốc (tại bước 3) có thể được đánh dấu là `Draft` (Nháp) hoặc có thể cần cronjob xóa rác nếu thiết kế hệ thống là tạo Product cứng trước tiên. Tác nhân sau đó được trả về trang danh sách ban đầu.
