# Đặc tả Use Case: Người Bán Tạo Mục Hàng Tồn Kho (Seller Create Inventory Item)

**1. Tên Use Case:** Người Bán Tạo Mục Hàng Tồn Kho (Seller Create Inventory Item)

**2. Tác nhân (Actor):** 
- Người bán (Seller): Người dùng đã đăng nhập hệ thống và được cấp quyền hạn của người bán (`ROLE_SELLER`).

**3. Mô tả (Description):**
Use case này mô tả quy trình cho phép người bán khởi tạo hồ sơ tồn kho (inventory record) lần đầu tiên cho một phân loại sản phẩm (Product Variant) cụ thể do họ quản lý. Đi kèm theo đó, người bán có thể ấn định mã lưu kho (SKU) và cung cấp số lượng hàng tồn kho ban đầu. 

**4. Điều kiện tiên quyết (Precondition):**
- Người bán đang ở trạng thái đã đăng nhập (authenticated) và tài khoản chứa phân quyền `ROLE_SELLER`.
- Sản phẩm gốc (Product) và phân loại sản phẩm (Product Variant) tương ứng phải tồn tại trong cơ sở dữ liệu.
- Phân loại sản phẩm này được xác nhận thuộc phân phối của tài khoản người bán.
- **Chưa tồn tại** bản ghi tồn kho (inventory) nào trước đây cho mã `variantId` này trong hệ thống.

**5. Điều kiện hậu quyết (Post condition):**
- Một bản ghi Inventory mới được khởi tạo và lưu trữ thành công bên trong cơ sở dữ liệu, liên kết với `productId` và `variantId` được chỉ định.
- Trạng thái kho hàng được cập nhật, bao gồm tổng số lượng (totalStock) và số lượng có khả dụng để bán (availableStock) bằng với lượng nhập ban đầu.
- Nếu người bán khởi tạo số lượng tồn kho lớn hơn không (`initialStock > 0`), hệ thống sẽ tự động sinh ra một bản ghi lịch sử giao dịch (Inventory Transaction) với phân loại `INITIAL`. 

**6. Luồng sự kiện chính (Main Event Flow):**
1. Người bán tiến hành truy cập vào mục "Quản lý tồn kho" (Inventory) bên trong ứng dụng/trang Bảng điều khiển dành cho người bán (Seller Dashboard).
2. Người bán chọn thiết lập kho hàng cho một phân loại sản phẩm (variant) hiện chưa có thông tin tồn kho.
3. Hệ thống trả về một biểu mẫu để điền số lượng kho đầu vào cho sản phẩm.
4. Người bán chọn định dạng ID sản phẩm (`productId`) và ID biến thể (`variantId`) cần cấu hình.
5. Người bán điền mã SKU (không bắt buộc) và tổng số lượng tồn kho ban đầu (`initialStock` - mặc định bằng 0 nếu được bảo trống).
6. Người bán nhấn nút xác nhận "Lưu" hoặc "Khởi tạo tồn kho".
7. Ứng dụng gửi yêu cầu `POST /api/v1/sellers/inventory` tới máy chủ. Hệ thống xác nhận và kiểm duyệt vai trò truy cập (`ROLE_SELLER`).
8. Hệ thống tra cứu cơ sở dữ liệu để bảo đảm `variantId` này không bị trùng lặp hồ sơ tồn kho hiện tại.
9. Hệ thống tiến hành lưu lại hồ sơ tồn kho mới định hình dữ liệu khởi điểm.
10. Nếu tham số `initialStock > 0`, hệ thống lập tức lưu lại một bản ghi giao dịch với mức loại `TransactionType.INITIAL`.
11. Máy chủ phản hồi lại với đối tượng DTO chứa dữ liệu hàng tồn kho (`id`, `availableStock`, `reservedStock`, `totalStock`, `isLowStock`, v.v.) và thông điệp khởi tạo thành công (mã 201 Created).
12. Giao diện màn hình hiển thị sản phẩm đã được lên cấu hình cập nhật số lượng tồn kho và kết thúc luồng.

**7. Các luồng thay thế (Alternative Flow):**

- **7.1 Ngoại lệ: Sản phẩm đã được thiết lập tồn kho (Inventory Already Exists)**
  - Tại Bước 8 của luồng chính, nếu hệ thống phát hiện đã có dữ liệu Inventory của `variantId` này, hệ thống sẽ thực hiện từ chối thêm mới và đưa ra báo lỗi ngoại lệ kiểu `IllegalStateException` với nội dung `"Inventory already exists for variant: {variantId}"`.
  - Hệ thống trả về thông điệp lỗi cho trình duyệt người dùng. Giao diện hiển thị cảnh báo (toast/alert) giải thích rằng khoản mục kho đã tồn tại và điều hướng người dùng sang sử dụng chức năng **Cập nhật số lượng/Điều chỉnh stock** thay vì tiến hành tạo bản ghi bổ sung.
  
- **7.2 Ngoại lệ: Thông tin không hợp lệ do thiếu các tham số bắt buộc**
  - Trong quá trình gửi thông tin, nếu `productId` hoặc `variantId` bị xóa/bỏ sót trong thông tin yêu cầu của hệ thống, máy chủ sẽ ngắt hành động và thông báo `Bad Request`.
  - Giao diện yêu cầu người dùng phải xác định rành mạch các trường đang để trống trước khi ấn nút.
  
- **7.3 Ngoại lệ: Phân quyền truy cập bị chặn (Unauthorized Access)**
  - Ở Bước 7, nếu Request Context không tìm ra Token hợp lệ hay thiếu Role của người bán, API bị gián đoạn (trả về mã trạng thái 401 Unauthorized hoặc 403 Forbidden). Hệ thống khóa truy cập và đẩy người dùng ra cửa sổ yêu cầu đăng nhập tài khoản.
