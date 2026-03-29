# Usecase: Khách hàng Đặt Hàng (User Order Product)

## 1. Tên Use Case (Name)
Khách hàng Đặt Hàng (Order Product / Checkout)

## 2. Tác nhân (Actor)
- Khách hàng (User) - Người dùng đã xác thực (có role `ROLE_USER`).

## 3. Mô tả (Description)
Use case này cho phép khách hàng thực hiện quá trình thanh toán và đặt hàng đối với các sản phẩm đang có trong giỏ hàng. Quá trình bao gồm hai bước chính: khởi tạo luồng thanh toán (tạo Checkout Session với cổng thanh toán như Stripe, PayPal) và xác nhận thanh toán (Confirm Payment) để chính thức tạo đơn hàng vào hệ thống.

## 4. Điều kiện tiên quyết (Precondition)
- Người dùng đã đăng nhập thành công vào hệ thống và có JSON Web Token (JWT) hợp lệ.
- Người dùng đã có ít nhất một sản phẩm trong giỏ hàng (Cart).
- Người dùng đã thiết lập cấu hình địa chỉ giao hàng (`addressId`) hợp lệ trên hệ thống.

## 5. Điều kiện hậu quyết (Post condition)
- Đơn hàng (hoặc nhóm đơn hàng - `Order Group`) được tạo thành công trong cơ sở dữ liệu với trạng thái phù hợp (ví dụ: `PAID` nếu thanh toán ngay).
- Sản phẩm được đặt thành công sẽ bị xóa khỏi giỏ hàng hiện tại của người dùng.
- Lịch sử đặt hàng được cập nhật, cho phép người dùng xem chi tiết các đơn đặt hàng cũ thông qua API lấy danh sách đơn hàng.

## 6. Luồng sự kiện chính (Main Event Flow)
1. **Khách hàng bắt đầu thanh toán:** Khách hàng chuyển đến màn hình thanh toán từ giỏ hàng.
2. **Khởi tạo thanh toán (Initiate Checkout):** Frontend gửi yêu cầu `POST /api/v1/order-groups/initiate-checkout` kèm payload:
   - `addressId`: Mã định danh địa chỉ giao hàng.
   - `paymentProvider`: Nhà cung cấp dịch vụ thanh toán (VD: stripe, paypal, square).
   - `shippingFee`: Phí giao dịch/giao hàng.
   - `idempotencyKey`: Khóa chống trùng lặp yêu cầu.
   - `promoCode` (Tùy chọn): Mã khuyến mãi rút gọn.
3. **Hệ thống tạo phiên thanh toán:** API Backend (`OrderGroupController`) xác nhận giỏ hàng của người dùng, làm việc với nhà cung cấp dịch vụ thanh toán (chẳng hạn gọi API của Stripe) để tạo ra mã ý định thanh toán (`PaymentIntent`). Ở bước này đơn hàng **chưa** được tạo trong db. Hệ thống trả dữ liệu `CheckoutSession` lại cho Frontend.
4. **Khách hàng thanh toán:** Frontend cung cấp giao diện để người dùng hoàn tất thủ tục thanh toán bảo mật với nhà cung cấp (VD: biểu mẫu thẻ tín dụng Stripe).
5. **Xác nhận thanh toán (Confirm Payment):** Sau khi nhà cung cấp báo giao dịch gốc thành công, Frontend gửi yêu cầu `POST /api/v1/order-groups/confirm-payment` với payload:
   - `paymentIntentId`: ID thanh toán nhận từ cổng xác nhận.
   - `addressId`, `shippingFee`, và tùy chọn `voucherCode`.
6. **Hệ thống tạo Đơn hàng:** Backend kiểm chứng lại tính xác thực của `paymentIntentId`. Nếu mọi thứ đúng chuẩn, hệ thống tạo `OrderGroup` và các `SubOrder` tương ứng, cập nhật trạng thái đơn hàng và dọn dẹp giỏ hàng.
7. **Thông báo thành công:** API trả về thông tin đối tượng đơn hàng vừa tạo (`OrderGroupDTO`). Giao diện hiển thị màn hình chúc mừng đặt hàng thành công.

## 7. Các luồng thay thế (Alternative Flows)
- **A1. Dữ liệu đầu vào không hợp lệ:** Tại bước 2 hoặc 5, nếu Payload gửi lên bị thiếu thông tin bắt buộc (ví dụ `addressId` là `null`, `paymentProvider` không hợp lệ - nằm ngoài validator "stripe|paypal|square"), hệ thống ném ra ngoại lệ `MethodArgumentNotValidException` (400 Bad Request) và từ chối xử lý.
- **A2. Cổng thanh toán từ chối (Thẻ hết tiền, bị khóa):** Tại bước 4, nếu việc thanh toán bị hệ thống ngoại vi (Stripe/PayPal) từ chối, giao diện sẽ nhận được thông báo lỗi từ cổng thanh toán, khách hàng buộc phải sửa thông tin thẻ hoặc chọn đổi phương thức thanh toán. Quá trình quay lại bước 4. API xác nhận cũng sẽ không được gọi.
- **A3. Phát hiện Request lặp (Idempotency Key):** Tại bước 2, nhờ có `idempotencyKey`, nếu mạng chậm làm Front-end vô ý gửi hai yêu cầu "Initiate Checkout" giống nhau thì hệ thống API vẫn chỉ tạo duy nhất 1 phiên giao dịch thay vì cấp nhiều phiên thừa (tránh tính tiền nhiều lần).
- **A4. Sản phẩm hết hàng đột xuất:** Trong lúc Backend chuẩn bị tạo `PaymentIntent` ở bước 3, hệ thống Inventory báo là số lượng sản phẩm không còn đủ thì tiến trình sẽ bị hủy bỏ, API trả về lỗi 400 Bad Request kèm thông báo sản phẩm hết lượng tồn kho cho khách hàng.
