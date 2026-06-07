# Hướng dẫn Quản lý Chiến dịch Khuyến mãi (Sale Campaign)

Tài liệu này hướng dẫn chi tiết cách tạo và quản lý các chiến dịch khuyến mãi (Sale Campaign) dành cho quản trị viên (Admin) trên hệ thống Platform E-commerce.

## 1. Giới thiệu chung
Tính năng Chiến dịch Khuyến mãi cho phép Admin tạo ra các chương trình giảm giá quy mô lớn áp dụng cho nhiều danh mục sản phẩm khác nhau. Hệ thống hỗ trợ giảm giá theo khung (Discount Tiers) và tự động áp dụng khi chiến dịch được kích hoạt.

## 2. Cách truy cập
- **Đường dẫn danh sách:** `/admin/dashboard/sale-campaigns`
- **Đường dẫn tạo mới:** `/admin/dashboard/sale-campaigns/new`
- **Yêu cầu:** Phải đăng nhập với tài khoản `ROLE_ADMIN`.

## 3. Các bước tạo và cấu hình chiến dịch

### Bước 1: Nhập thông tin cơ bản
- **Tên chiến dịch:** Tên hiển thị (Ví dụ: "Siêu Sale 11/11").
- **Thời gian:** Thiết lập thời điểm Bắt đầu và Kết thúc của chiến dịch.
- **Mô tả:** Thông tin chi tiết về chương trình.

### Bước 2: Chọn danh mục áp dụng
Admin có thể chọn các danh mục sản phẩm sẽ được áp dụng khuyến mãi trong chiến dịch này. Tất cả sản phẩm thuộc các danh mục đã chọn sẽ được hệ thống xem xét giảm giá.

### Bước 3: Cấu hình khung giảm giá (Discount Tiers)
Đây là phần quan trọng nhất, cho phép thiết lập mức giảm giá dựa trên giá trị sản phẩm:
- **Giá tối thiểu:** Ngưỡng giá sản phẩm để áp dụng mức giảm.
- **Mức giảm (%):** Tỷ lệ phần trăm giảm giá.
- *Ví dụ:* Sản phẩm từ 100k giảm 10%, từ 500k giảm 20%.

### Bước 4: Tải lên Banner
Tải lên hình ảnh quảng bá cho chiến dịch. Hình ảnh này sẽ được hiển thị trên trang chủ hoặc trang khuyến mãi dành cho khách hàng.

## 4. Quản lý trạng thái chiến dịch
Một chiến dịch trải qua các trạng thái sau:
- **Bản nháp (DRAFT):** Chiến dịch đang được biên tập, chưa có hiệu lực.
- **Kích hoạt (ACTIVE):** Chiến dịch chính thức hoạt động. Hệ thống sẽ tự động tính toán giá giảm cho các sản phẩm liên quan.
- **Kết thúc (FINISHED):** Chiến dịch đã qua thời gian kết thúc.
- **Hủy (CANCELLED):** Chiến dịch bị dừng thủ công bởi Admin.

## 5. Tính năng Xem trước (Preview Items)
Trước khi kích hoạt, Admin có thể sử dụng tính năng "Xem trước sản phẩm" để kiểm tra danh sách các sản phẩm sẽ bị tác động bởi chiến dịch và mức giá sau khi giảm tương ứng. Điều này giúp đảm bảo cấu hình giảm giá là chính xác.

## 6. Chi tiết kỹ thuật (Dành cho Developer)

### Backend (Product Service)
- **Controller:** `AdminSaleCampaignController` quản lý toàn bộ logic CRUD và trạng thái.
- **Scheduler:** `SaleCampaignScheduler` tự động quét và cập nhật trạng thái chiến dịch dựa trên thời gian thực tế.
- **Logic giảm giá:** `SaleCampaignItemGenerator` chịu trách nhiệm tính toán mức giá giảm cho từng sản phẩm dựa trên các Tiers đã cấu hình.

### Frontend (Next.js)
- **Component chính:** `SaleCampaignForm` xử lý giao diện nhập liệu phức tạp (bao gồm danh sách động cho các Tier).
- **Service:** `saleCampaignService` thực hiện các cuộc gọi API đến Backend.

## 7. Lưu ý vận hành
- **Thời gian:** Không thể tạo chiến dịch có thời gian bắt đầu trong quá khứ.
- **Trùng lặp:** Cần lưu ý khi có nhiều chiến dịch diễn ra cùng lúc trên cùng một danh mục sản phẩm (Hệ thống thường ưu tiên mức giảm giá cao nhất hoặc chiến dịch mới nhất).
- **Kích hoạt:** Sau khi tạo, đừng quên nhấn "Kích hoạt" để chiến dịch có hiệu lực.
