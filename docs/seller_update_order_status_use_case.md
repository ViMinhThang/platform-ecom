# Use Case: Cập nhật Trạng thái Đơn hàng bởi Người bán (Seller Update Order Status)

## 1. Tên Use Case (Name)
Cập nhật trạng thái đơn hàng (Seller Update Order Status)

## 2. Tác nhân (Actor)
Người bán (Seller - có quyền `ROLE_SELLER`)

## 3. Mô tả (Description)
Use case này cho phép Người bán quản lý quy trình giao hàng và cập nhật các trạng thái (status) cho các đơn hàng con (sub-orders) thuộc về cửa hàng của họ. Người bán có thể thực hiện những hành động như: 
- Cập nhật thông tin vận chuyển (mã vận tải, đơn vị giao hàng, đường dẫn theo dõi).
- Đánh dấu đơn hàng là đã gửi cho đơn vị vận chuyển (Shipped).
- Đánh dấu đơn hàng là đã giao thành công cho người mua (Delivered).

## 4. Điều kiện tiên quyết (Precondition)
- Người bán đã đăng nhập vào hệ thống tài khoản hợp lệ với vai trò là `ROLE_SELLER`.
- Tồn tại đơn hàng con (Sub-order) trong hệ thống thuộc quyền sở hữu cung cấp bởi cửa hàng của người bán.
- Đơn hàng phải ở một trạng thái hợp lệ cho phép cập nhật (ví dụ: Đã xác nhận, Đang xử lý, Chưa bị hủy).

## 5. Điều kiện sau (Post condition)
- Trạng thái của đơn hàng con (Sub-order) được cập nhật và lưu trữ thành công vào hệ thống cơ sở dữ liệu.
- Các thông tin về theo dõi vận chuyển (shipping tracking) được lưu lại và hiển thị cho người mua.
- Đối với mỗi lần chuyển đổi trạng thái quan trọng (như *Shipped* hay *Delivered*), khách hàng (người mua) có thể nhận được thông báo cập nhật về tình trạng đơn hàng của họ (nếu được hỗ trợ bởi Notification service).

## 6. Luồng sự kiện chính (Event Flow)
1. Người bán truy cập vào giao diện quản lý đơn hàng/bảng điều khiển dành cho người bán trên hệ thống (Seller Dashboard).
2. Hệ thống gọi API `GET /api/v1/sub-orders/seller` để lấy và hiển thị danh sách các đơn hàng thuộc về người bán này.
3. Người bán tìm kiếm và chọn một đơn hàng cần cập nhật trạng thái giao hàng.
4. Tùy thuộc vào tình hình xử lý thực tế, người bán lựa chọn một trong các hành động tương ứng trên hệ thống:
    - **Cập nhật mã vận đơn (Tracking):** Người bán nhập mã vận đơn (tracking number), chọn đơn vị vận chuyển (carrier) và bấm "Cập nhật". Hệ thống gọi API `PUT /api/v1/sub-orders/{subOrderId}/tracking`.
    - **Đánh dấu Đã gửi hàng (Shipped):** Người bán nhấn nút "Xác nhận gửi hàng" khi hàng đã được đưa cho đối tác vận chuyển. Hệ thống gọi API `POST /api/v1/sub-orders/{subOrderId}/ship`.
    - **Đánh dấu Đã giao hàng (Delivered):** Người bán nhấn nút "Xác nhận đã giao" khi hàng đã đến tay người mua. Hệ thống gọi API `POST /api/v1/sub-orders/{subOrderId}/deliver`.
5. Hệ thống tiếp nhận yêu cầu, trích xuất mã định danh (ID) của người bán từ token bảo mật và kiểm tra quyền sở hữu đối với mã đơn hàng con (`subOrderId`).
6. Hệ thống thực hiện thay đổi trạng thái và/hoặc cập nhật thông tin vận chuyển trên cơ sở dữ liệu.
7. Hệ thống trả về thông báo cập nhật thành công (Ví dụ: "Tracking updated" hoặc "Sub-order marked as shipped/delivered") và hiển thị trạng thái mới nhất lên giao diện của người bán.

## 7. Luồng thay thế (Alternative Flow)
- **A1. Đơn hàng không tồn tại hoặc không thuộc về người bán:** Tại bước 5, nếu Server xác định `subOrderId` không tồn tại hoặc không thuộc quyền quản lý của `sellerId` hiện tại, hệ thống từ chối truy cập, giữ nguyên trạng thái cũ và báo lỗi.
- **A2. Lỗi xác thực tài khoản (Token Valid errors):** Nếu token của người bán bị hết hạn hoặc không hợp lệ, hệ thống báo lỗi 401 Unauthorized / 403 Forbidden và yêu cầu người bán đăng nhập lại.
- **A3. Chuyển đổi trạng thái không hợp lý (Invalid State Transition):** Nếu đơn hàng hiện tại đang ở trạng thái không cho phép thay đổi (ví dụ chuyển ngược lại từ `Delivered` sang `Shipped`), hệ thống chặn giao dịch tại layer logic và hiển thị thông báo trạng thái không hợp lệ.
- **A4. Đơn hàng đã bị hủy bởi Khách hàng hoặc Hệ thống:** Nếu người mua đã thực hiện hành động hủy đơn thành công (`POST /api/v1/sub-orders/{subOrderId}/cancel`) trước thời điểm người bán gửi cập nhật gửi hàng, thì trạng thái đã là "Đã hủy" (Cancelled). Hệ thống thông báo lỗi cho người bán biết rằng đơn hàng không còn tồn tại hiệu lực.
