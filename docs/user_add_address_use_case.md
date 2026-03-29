# Tài liệu Use Case: Thêm địa chỉ mới (Add New Address)

## 1. Tên Use Case
Thêm địa chỉ mới (Add New Address)

## 2. Tác nhân (Actor)
- **Người dùng (User)**: Khách hàng đã có tài khoản và đã đăng nhập vào hệ thống e-commerce.

## 3. Mô tả (Description)
Use case này cho phép người dùng (đã xác thực) thêm một địa chỉ giao hàng hoặc địa chỉ liên hệ mới vào hồ sơ cá nhân của mình. Địa chỉ này sau đó có thể được chọn và sử dụng nhanh lẹ trong quá trình thanh toán (checkout) đơn hàng. Người dùng có thể thiết lập địa chỉ mới này làm địa chỉ mặc định.

## 4. Điều kiện tiên quyết (Precondition)
- Người dùng đã được xác thực (đăng nhập thành công) vào hệ thống.
- Người dùng đang ở giao diện Quản lý hồ sơ (Profile) hoặc đang ở bước Thanh toán (Checkout) chứa module Quản lý địa chỉ.
- Số lượng địa chỉ đã lưu hiện tại của người dùng **nhỏ hơn 5** (Hệ thống mỗi người dùng chỉ cho phép lưu tối đa 5 địa chỉ).

## 5. Điều kiện hậu quyết (Post condition)
- Địa chỉ mới với đầy đủ các trường thông tin được tạo thành công và gắn (liên kết) với tài khoản người dùng tương ứng trong cơ sở dữ liệu.
- Nếu người dùng đánh dấu chọn địa chỉ này làm **địa chỉ mặc định** (`isDefault = true`), hệ thống sẽ tự động hủy cờ mặc định của các địa chỉ đã tồn tại trước đó của người dùng này.
- Danh sách địa chỉ lưu trên hệ thống và hiển thị trên giao diện của người dùng được cập nhật tự động.

## 6. Luồng sự kiện chính (Main Event Flow)
1. Người dùng truy cập phần "Địa chỉ" (Addresses) trong Hồ sơ, hoặc tại danh sách địa chỉ ở giao diện Thanh toán, và nhấn vào nút "Thêm địa chỉ mới" (Add new address).
2. Hệ thống (Frontend) hiển thị biểu mẫu (form) nhập thông tin địa chỉ bao gồm các trường:
   - Số nhà, Tên đường (Street)
   - Tòa nhà (Building Name)
   - Tỉnh/Thành phố (GHN Province)
   - Quận/Huyện (GHN District)
   - Phường/Xã (GHN WardCode)
   - Mã bưu điện (Pincode)
   - Checkbox "Đặt làm địa chỉ mặc định" (Set as default)
3. Người dùng nhập đầy đủ và chính xác các thông tin cần thiết vào form, sau đó bấm nút "Lưu" (Save / Submit).
4. Giao diện người dùng gửi yêu cầu HTTP `POST /api/v1/users/addresses` chứa payload AddressDTO và Access Token của người dùng lên hệ thống Backend.
5. Hệ thống nhận yêu cầu, trích xuất ID người dùng dựa vào Context xác thực của token.
6. Hệ thống thực hiện truy vấn đếm số lượng địa chỉ hiện có của người dùng trong cơ sở dữ liệu (đảm bảo `count < 5`).
7. Hệ thống ánh xạ thông tin gửi lên vào Entity `Address`, xử lý logic thiết lập địa chỉ mặc định (nếu được chọn) và tiến hành lưu bản ghi nhận này vào Database.
8. Hệ thống phản hồi lại thành công cho Frontend (kèm theo dữ liệu của địa chỉ vừa tạo ra).
9. Màn hình Frontend thông báo cho người dùng "Address added successfully" (Thêm địa chỉ thành công), tự động đóng biểu mẫu đi và làm mới lại danh sách các địa chỉ hiện diện trên màn hình.

## 7. Các luồng thay thế (Alternative Flows)

### 7.1. Luồng A1: Vượt giới hạn số lượng địa chỉ được phép lưu
- **Tại bước 6 của Luồng chính**, nếu Backend kiểm tra và phát hiện (`count >= 5`), người dùng đã sở hữu tối đa 5 địa chỉ trong tài khoản.
- Backend từ chối thiết lập vào cơ sở dữ liệu và ngay lập tức ném ra lỗi `IllegalStateException` ("Maximum of 5 addresses allowed per user").
- Frontend nhận lỗi, hiển thị thông báo "Maximum of 5 addresses allowed per user" lên màn hình dưới dạng thông báo pop-up/toast, và yêu cầu người dùng xóa bớt địa chỉ cũ trước khi thêm mới.

### 7.2. Luồng A2: Lỗi xác thực thiếu dữ liệu (Validation Error)
- **Tại bước 3 của Luồng chính**, nếu người dùng bỏ trống các vùng thông tin bắt buộc hoặc điền sai định dạng (ví dụ định dạng ward, mã bưu chính,...).
- Front-end hoặc Back-end nhận diện lỗi Validation, chặn quá trình tạo địa chỉ.
- Hệ thống trả về danh sách các trường bị lỗi, giao diện hiện thông báo chữ đỏ hướng dẫn người dùng chỉnh sửa và bắt buộc thử lại bước 3.

### 7.3. Luồng A3: Người dùng mất kết nối hoặc phiên đăng nhập hết hạn (Unauthorized)
- **Tại bước 4 của Luồng chính**, nếu Access Token của người dùng đã bị hết hạn hoặc không tồn tại (chưa đăng nhập), hay người này sử dụng sai vai trò.
- Frontend sẽ kiểm tra trạng thái session, nếu không có sẽ bật thông báo: *"You must be logged in to add addresses"*.
- Hoặc, Backend sẽ nhận về lỗi 401 Unauthorized do Spring Security quy định từ chối xử lý request. Giao diện sau đó điều hướng người dùng quay lại trang Đăng nhập (Login) trước khi tiếp tục.
