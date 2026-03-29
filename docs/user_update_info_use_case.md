# Use Case: Cập nhật thông tin cá nhân (Update User Information)

## 1. Tên Use Case
Cập nhật thông tin cá nhân (Update User Info)

## 2. Tác nhân (Actor)
Người dùng đã xác thực (Authenticated User)

## 3. Mô tả (Description)
Use case này cho phép người dùng đang đăng nhập có thể thực hiện thay đổi thông tin hồ sơ cá nhân của họ. Các thông tin có thể thao tác bao gồm tên hiển thị (username), địa chỉ email (email), thay đổi mật khẩu (password) và tải lên/thay đổi ảnh đại diện (avatar).

## 4. Điều kiện tiên quyết (Precondition)
- Người dùng đã có tài khoản và đang trong trạng thái đăng nhập hợp lệ (có chứa JWT Cookie/Token).
- Người dùng đang truy cập vào trang Quản lý tài khoản / Hồ sơ (Profile).

## 5. Điều kiện hậu quyết (Postcondition)
- Thông tin của người dùng được cập nhật thành công vào cơ sở dữ liệu hệ thống.
- Giao diện người dùng sẽ ngay lập tức được đồng bộ và phản ánh các thông tin mới (như tên mới, avatar mới).
- Trong trường hợp đổi mật khẩu, người dùng vẫn tiếp tục phiên đăng nhập (hoặc bị yêu cầu đăng nhập lại tuỳ logic hệ thống bảo mật quy định).

## 6. Luồng sự kiện chính (Main Event Flow)

### Kịch bản 1: Cập nhật thông tin hồ sơ (Tên, Email, Mật khẩu)
1. Người dùng truy cập vào phần chỉnh sửa Hồ sơ cá nhân trên giao diện (Frontend).
2. Hệ thống hiển thị form chứa thông tin hiện tại của người dùng (Username, Email).
3. Người dùng nhập các thay đổi muốn cập nhật (ví dụ: đổi `username`, `email` hoặc nhập `password` mới).
4. Người dùng **bắt buộc** phải nhập `currentPassword` (mật khẩu hiện tại) để tiếp tục thao tác như một cơ chế bảo mật (theo payload `UpdateUserRequest`).
5. Người dùng nhấn nút "Lưu thay đổi" (Save / Update).
6. Frontend gửi dữ liệu lên Backend thông qua API `PUT /api/v1/users/me`.
7. Hệ thống (Backend) xác thực token người dùng và tiến hành kiểm tra (Validation):
   - `username`: Từ 3 - 50 ký tự, không được để trống.
   - `email`: Đúng định dạng email, tối đa 50 ký tự, không được để trống.
   - `password` (nếu có thay đổi): Độ dài tối thiểu 8 ký tự.
   - `currentPassword`: Khớp với mật khẩu hiện tại trong cơ sở dữ liệu.
8. Sau khi kiểm tra hợp lệ, hệ thống cập nhật bản ghi User trong CSDL.
9. Hệ thống trả về mã `200 OK` với thông điệp "User info updated successfully" cùng với dữ liệu người dùng mới nhất.
10. Frontend thông báo thành công cho người dùng và cập nhật giao diện hiển thị.

### Kịch bản 2: Cập nhật ảnh đại diện (Upload Avatar)
1. Trong phần Hồ sơ thay vì form, người dùng nhấp vào ảnh đại diện hoặc nút đổi ảnh.
2. Thiết bị mở cửa sổ cho phép người dùng chọn tệp ảnh mới.
3. Người dùng chọn ảnh và xác nhận tải lên.
4. Frontend gửi form-data MultiPartFile qua API `PUT /api/v1/users/me/image`.
5. Hệ thống xác thực người dùng và nhận file (kiểm tra định dạng, kích cỡ của file ảnh).
6. Hệ thống thực hiện việc lưu trữ hình ảnh qua dịch vụ lưu trữ (ví dụ AWS S3, local uploads) và cập nhật đường dẫn ảnh mới cho User vào CSDL.
7. Hệ thống trả về mã `200 OK` với thông báo "User image uploaded successfully" cùng URL của ảnh vừa tạo.
8. Frontend nhận URL ảnh mới, thông báo thành công và làm mới hình đại diện hiển thị trên trang.

## 7. Luồng thay thế / Ngoại lệ (Alternative Flows)

- **A1. Sai mật khẩu hiện tại:** Tại bước 7 (Kịch bản 1), nếu thông tin `currentPassword` được cung cấp không chính xác, hệ thống từ chối cập nhật và trả về lỗi. Frontend hiển thị thông báo "Mật khẩu hiện tại không chính xác".
- **A2. Email đã tồn tại / Xung đột dữ liệu:** Tại bước 7 (Kịch bản 1), nếu email mới điều chỉnh trùng với một email của tài khoản khác đã có sẵn trong hệ thống, API sẽ trả về lỗi xung đột (Conflict) và Frontend thông báo "Email này đã được sử dụng".
- **A3. Dữ liệu nhập vào không hợp lệ (Validation Error):** Nếu người dùng bỏ trống Tên/Email hoặc nhập tên quá ngắn, mật khẩu mới dưới 8 ký tự, hoặc email sai định dạng, Server sẽ từ chối lưu và trả về lỗi phân giải `400 Bad Request`. Form trên UI sẽ highlight các trường đang lỗi.
- **A4. Lỗi định dạng tệp ảnh:** Tại bước 5 (Kịch bản 2), nếu tệp chọn không phải là định dạng ảnh được cho phép (ví dụ tải nhầm file PDF/DOC) hoặc quá kích cỡ tối đa, hệ thống trả về lỗi 400 và Frontend thông báo cho người dùng yêu cầu chọn lại ảnh khác.
- **A5. Phiên đăng nhập hết hạn (Unauthorized):** Bất cứ lúc nào trên 2 kịch bản nếu JWT Token của người dùng không còn hạn hoặc không hợp lệ, API sẽ trả về lỗi `401 Unauthorized`. Frontend lập tức điều hướng người dùng quay lại trang Đăng nhập.
