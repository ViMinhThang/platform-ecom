# Báo cáo Phân tích Use Case: Cập nhật địa chỉ người dùng (User Update Address)

**Tên Use Case:** Cập nhật địa chỉ (Update Address)  
**Tác nhân (Actor):** Người dùng (User / Customer) - Người dùng đã xác thực.  

## 1. Mô tả (Description)
Use case này cho phép người dùng đã đăng nhập thay đổi, chỉnh sửa thông tin của một địa chỉ giao/nhận hàng đã tồn tại trong danh bạ địa chỉ (Address Manager) của họ trên hệ thống. 

## 2. Điều kiện tiên quyết (Precondition)
- Người dùng đã đăng ký và đăng nhập thành công vào hệ thống.
- Người dùng đã có ít nhất một địa chỉ hiện có được lưu trong sổ địa chỉ.
- Người dùng đang truy cập vào trang quản lý hồ sơ / danh bạ địa chỉ cá nhân (`AddressManager`).

## 3. Điều kiện hậu quyết (Postcondition)
- **Thành công:** Thông tin địa chỉ mới được lưu trữ thành công vào cơ sở dữ liệu. Danh sách địa chỉ hiển thị trên giao diện người dùng được cập nhật tương ứng. Nếu người dùng chọn đặt địa chỉ này làm mặc định, trạng thái của các địa chỉ khác sẽ được tự động điều chỉnh phù hợp.
- **Thất bại:** Trạng thái hệ thống và cơ sở dữ liệu không thay đổi. Địa chỉ giữ nguyên thông tin ban đầu.

## 4. Luồng sự kiện chính (Main Event Flow - Basic Flow)
1. **[User]** Truy cập vào mục quản lý địa chỉ (Profile -> Address Manager).
2. **[System]** Hiển thị danh sách các địa chỉ hiện tại của người dùng (tải thông qua `GET /api/v1/users/addresses`).
3. **[User]** Tại một thẻ địa chỉ (AddressCard) cụ thể, người dùng nhấn vào nút "Chỉnh sửa" (Edit).
4. **[System]** Mở một Dialog chứa biểu mẫu (AddressForm) được điền sẵn đầy đủ các thông tin hiện hành của địa chỉ đó (Tên người nhận, Số điện thoại, Tỉnh/Thành phố, Quận/Huyện, Phường/Xã, Địa chỉ cụ thể, Cài đặt địa chỉ mặc định).
5. **[User]** Thay đổi các trường thông tin mong muốn và nhấn nút "Lưu thay đổi" (Save/Update).
6. **[System]** Frontend tiến hành xác thực dữ liệu tại client (Client-side validation) để đảm bảo không để trống các trường bắt buộc và định dạng (chẳng hạn số điện thoại) hợp lệ.
7. **[System]** Gửi yêu cầu cập nhật API (`PUT /api/v1/users/addresses/{addressId}`) với payload là thông tin mới tới Server Backend.
8. **[System]** Backend xác thực định danh (AuthContext), kiểm tra quyền sở hữu đối với `addressId` và tiến hành cập nhật Data Model.
9. **[System]** Backend trả về thông điệp báo thành công (`200 OK`) kèm dữ liệu AddressDTO đã cập nhật.
10. **[System]** Frontend đóng Dialog, hiển thị một Toast thông báo "Cập nhật địa chỉ thành công", và cập nhật lại danh sách hiển thị (thông qua hook hoặc state updater).

## 5. Luồng sự kiện thay thế (Alternative Flow)

### 5.1. Alternative Flow 1: Người dùng hủy thao tác
- Tại **bước 4 hoặc 5**, người dùng có thể quyết định không cập nhật nữa và nhấn nút "Hủy" (Cancel) ở trong Dialog hoặc click ra ngoài vùng làm việc.
- **[System]** Đóng Dialog thông tin.
- **[System]** Trạng thái địa chỉ được giữ nguyên, kết thúc use case.

### 5.2. Alternative Flow 2: Lỗi xác thực biểu mẫu (Validation Error)
- Tại **bước 6**, nếu thông tin người dùng nhập vào không đáp ứng yêu cầu (Ví dụ: để trống "Số điện thoại" hoặc "Tỉnh/Thành phố").
- **[System]** Hệ thống ngăn chặn việc gửi API request.
- **[System]** Hiển thị lỗi tương ứng bằng màu đỏ dưới/bên cạnh mỗi trường dữ liệu không hợp lệ.
- **[User]** Chỉnh sửa lại thông tin lỗi và thực hiện lưu lại. Trở lại **bước 5**.

### 5.3. Alternative Flow 3: Lỗi quyền sở hữu hoặc không tồn tại địa chỉ (Authorization / Not Found)
- Tại **bước 8**, nếu Server phát hiện `addressId` này đã bị xóa ở nơi khác hoặc không thực sự thuộc quyền sở hữu của người dùng hiện tại (lỗi 403 Forbidden hoặc 404 Not Found).
- **[System]** Backend trả về mã lỗi bảo mật.
- **[System]** Frontend bắt lỗi, giữ nguyên hoặc đóng Dialog và hiển thị thông báo lỗi "Bạn không có quyền chỉnh sửa địa chỉ này hoặc địa chỉ không tồn tại" (qua Toast error).
- **[System]** Tải lại (refresh) trang để đồng bộ với danh sách địa chỉ thực tế từ DB. Kết thúc use case.

### 5.4. Alternative Flow 4: Lỗi kết nối / Máy chủ (Server / Network Error)
- Tại **bước 7 hoặc 8**, trong quá trình truyền tải, kết nối mạng gặp vấn đề hoặc máy chủ Backend xảy ra sự cố (500 Internal Server Error).
- **[System]** Frontend chờ timeout hoặc nhận mã lỗi từ Backend.
- **[System]** Hiển thị thông báo Toast error: "Có lỗi xảy ra trong quá trình kết nối, vui lòng thử lại sau!".
- **[System]** Biểu mẫu vẫn được giữ nguyên và trạng thái địa chỉ không thay đổi để người dùng có thể thực hiện nhấn thử lại (retry) khi mạng ổn định. Kết thúc use case.
