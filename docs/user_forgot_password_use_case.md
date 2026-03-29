# Use Case: Người Dùng Quên Mật Khẩu (User Forgot Password)

## 1. Tên Use Case
**Quên Mật Khẩu** (Forgot Password / Reset Password)

## 2. Tác nhân (Actor)
- **Người dùng (User):** Người dùng chưa đăng nhập hệ thống nhưng đã có tài khoản và muốn khôi phục lại mật khẩu.
- **Hệ thống (System):** Hệ thống E-commerce thực hiện việc xác thực, gửi mã OTP và xử lý cập nhật mật khẩu.

## 3. Mô tả (Description)
Use case này cho phép người dùng thay đổi (khôi phục) mật khẩu tài khoản của mình trong trường hợp họ quên mật khẩu đăng nhập. Quá trình này được thực hiện thông qua việc xác thực bảo mật bằng mã OTP (One-Time Password) gửi đến địa chỉ email đã đăng ký của người dùng, sau đó cho phép người dùng thiết lập lại mật khẩu mới.

## 4. Điều kiện tiên quyết (Precondition)
- Người dùng đã đăng ký tài khoản thành công trong hệ thống và tài khoản đang ở trạng thái hoạt động.
- Người dùng nhớ địa chỉ email đã sử dụng để đăng ký tài khoản.
- Người dùng có khả năng truy cập vào hộp thư của địa chỉ email đó để nhận mã bảo mật (OTP).

## 5. Điều kiện hậu quyết (Post condition)
- Mật khẩu truy cập của người dùng được cập nhật thành công (bằng mật khẩu mới) trong cơ sở dữ liệu của hệ thống.
- Các phiên đăng nhập hiện tại bằng mật khẩu cũ (nếu có) có thể bị vô hiệu hóa (tùy thuộc vào thiết lập bảo mật).
- Người dùng có thể sử dụng mật khẩu mới để đăng nhập thành công vào hệ thống.

## 6. Luồng sự kiện chính (Main Event Flow)
1. Người dùng truy cập vào trang Đăng nhập và nhấp vào liên kết **"Quên mật khẩu?"** (Forgot password?).
2. Hệ thống chuyển hướng người dùng đến biểu mẫu "Quên mật khẩu" (`/auth/forgot-password`).
3. Người dùng nhập địa chỉ email đã đăng ký và nhấn nút **"Gửi mã xác thực"**.
4. Hệ thống kiểm tra định dạng email và gọi API `POST /v1/auth/forgot-password` để yêu cầu hệ thống phía server xử lý đoạn mã OTP.
5. Back-end tạo ngẫu nhiên một mã OTP gồm 6 chữ số, lưu trữ mã này (cùng thời gian hết hạn) và gửi OTP đó tới email của người dùng.
6. Hệ thống hiển thị thông báo xác nhận: *"Mã OTP đã được gửi đến email của bạn!"*.
7. Hệ thống tự động chuyển hướng người dùng đến biểu mẫu **"Đặt lại mật khẩu"** (`/auth/reset-password`), trong đó địa chỉ email đã được tự động điền sẵn.
8. Người dùng kiểm tra hộp thư email của mình, lấy mã OTP gồm 6 chữ số.
9. Tại màn hình "Đặt lại mật khẩu", người dùng nhập **Mã xác thực (OTP)**, **Mật khẩu mới** và **Xác nhận mật khẩu** mới.
10. Người dùng nhấn nút **"Đặt lại mật khẩu"**.
11. Hệ thống ở Front-end kiểm tra độ dài OTP (đúng 6 số), độ dài mật khẩu (ít nhất 6 ký tự) và tính khớp nhau của hai trường mật khẩu.
12. Hệ thống gọi API `POST /v1/auth/verify-otp` mang theo email, mã OTP và mật khẩu mới để gửi yêu cầu đến Back-end.
13. Back-end kiểm tra và đối chiếu mã OTP hợp lệ của email đó, đồng thời bắt đầu xử lý mã hóa mật khẩu mới và lưu vào cơ sở dữ liệu.
14. Hệ thống hiển thị thông báo thành công: *"Mật khẩu đã được đặt lại thành công!"*.
15. Hệ thống chuyển hướng người dùng trở lại trang Đăng nhập (`/auth/sign-in`) để sử dụng mật khẩu mới.

## 7. Các luồng thay thế (Alternative Flows)

### 7.1. Định dạng email không hợp lệ
* **Bắt nguồn từ:** Bước 3 của Luồng chính.
* **Chi tiết:** Khi người dùng nhập định dạng sai quy định về email (Ví dụ: `nguyenvana`, `abc@.xyz`), tính năng kiểm tra tại Front-end (Zod validation) sẽ bắt lỗi.
* **Xử lý:** Hệ thống hiển thị thông báo lỗi dưới ô nhập liệu: *"Email không hợp lệ"* và khóa nút gửi yêu cầu để ngăn chặn. Luồng kết thúc tại bước này cho đến khi người dùng nhập đúng định dạng.

### 7.2. Email chưa được đăng ký trong hệ thống
* **Bắt nguồn từ:** Bước 4 của Luồng chính.
* **Chi tiết:** Backend kiểm tra email và thấy email không tồn tại trong cơ sở dữ liệu.
* **Xử lý:** Backend sẽ trả lại thông báo lỗi. Front-end hiển thị *"Gửi yêu cầu thất bại. Vui lòng thử lại."* hoặc các hướng dẫn bảo mật hệ thống.

### 7.3. Chưa nhận được hoặc muốn gửi lại mã OTP
* **Bắt nguồn từ:** Bước 8 của Luồng chính (Khi người dùng đang ở trang Nhập mã).
* **Chi tiết:** Người dùng chờ nhưng không nhận được email hoặc mã OTP đã hết hạn, và họ nhấn vào nút **"Gửi lại mã xác thực"**.
* **Xử lý:** Hệ thống chuyển hướng người dùng quay trở lại bước yêu cầu OTP (`/auth/forgot-password`).

### 7.4. Mã OTP nhập không đủ 6 số
* **Bắt nguồn từ:** Bước 9 của Luồng chính.
* **Chi tiết:** Người dùng nhập thiếu chữ số vào ô nhập OTP.
* **Xử lý:** Hệ thống ở phía React Hook Form sẽ báo lỗi ngay lập tức đoạn này *"Vui lòng nhập đủ 6 số"* và không gọi API. Trạng thái dừng ở đây cho đến khi người dùng bổ sung đủ mã.

### 7.5. Mã OTP sai lệch hoặc hết hạn
* **Bắt nguồn từ:** Bước 13 của Luồng chính.
* **Chi tiết:** Ở phía Back-end kiểm tra và phát hiện mã OTP mà người dùng nhập không khớp với OTP đã tạo cho email đó, hoặc OTP đã quá hạn sử dụng.
* **Xử lý:** Hệ thống trả về lỗi cho Front-end và hiển thị thông báo (ví dụ: *"Xác thực thất bại. Vui lòng thử lại."*). Người dùng có thể quay lại bước 7.3 để yêu cầu lại mã.

### 7.6. Mật khẩu không đáp ứng điều kiện bảo mật
* **Bắt nguồn từ:** Bước 9 của Luồng chính.
* **Chi tiết:** Khi nhập mật khẩu mới, người dùng nhập dưới 6 ký tự.
* **Xử lý:** Hệ thống phía máy khách (Zod schema validation) sẽ hiện thông báo *"Mật khẩu phải có ít nhất 6 ký tự"* và chặn nút gửi.

### 7.7. Nhập xác nhận mật khẩu không khớp
* **Bắt nguồn từ:** Bước 9 của Luồng chính.
* **Chi tiết:** Người dùng nhập các giá trị ở ô "Mật khẩu mới" và ô "Xác nhận mật khẩu" khác nhau.
* **Xử lý:** Form kiểm tra hiển thị thông báo lỗi: *"Mật khẩu xác nhận không khớp"* và ngăn quá trình tạo yêu cầu API. Nhờ vậy người dùng có thể nhập lại để đồng nhất mật khẩu mong muốn.
