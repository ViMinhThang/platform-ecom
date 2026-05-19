# Hướng Dẫn Quản Lý Tài Khoản Khách Hàng - Platform E-com

Tài liệu này cung cấp hướng dẫn đầy đủ về các chức năng liên quan đến tài khoản khách hàng, bao gồm: Đăng ký, Quên mật khẩu (OTP), Quản lý hồ sơ và Địa chỉ.

---

## 1. Đăng Ký Tài Khoản Mới (SignUp)
Dành cho người dùng mới muốn tham gia vào hệ thống.

*   **Đường dẫn:** `/auth/register`
*   **Thông tin yêu cầu:**
    *   **Tên đăng nhập:** 3 - 20 ký tự (Duy nhất).
    *   **Email:** Định dạng chuẩn (Duy nhất).
    *   **Mật khẩu:** Ít nhất 6 ký tự.
*   **Quy trình:** Điền thông tin -> Nhấn "Tạo tài khoản" -> Hệ thống thông báo thành công -> Chuyển về trang Đăng nhập.

---

## 2. Quên Mật Khẩu và Xác Thực OTP
Dành cho người dùng đã có tài khoản nhưng không nhớ mật khẩu.

### Bước 2.1: Yêu cầu mã OTP
*   **Đường dẫn:** `/auth/forgot-password`
*   **Thao tác:** Nhập Email đã đăng ký -> Nhấn "Gửi mã xác thực".
*   **Kết quả:** Hệ thống gửi một mã số (6 chữ số) vào email của bạn. Mã có hiệu lực trong **10 phút**.

### Bước 2.2: Xác thực OTP và Đặt lại mật khẩu
*   **Đường dẫn:** Tự động chuyển hướng đến `/auth/reset-password` sau bước 2.1.
*   **Thông tin yêu cầu:**
    1.  **Email:** (Thường được điền sẵn).
    2.  **Mã xác thực (OTP):** Nhập 6 số nhận được từ email.
    3.  **Mật khẩu mới:** Nhập mật khẩu bạn muốn thay đổi.
*   **Quy trình:** Nhập OTP -> Nhập mật khẩu mới -> Nhấn "Đặt lại mật khẩu".

---

## 3. Quản Lý Hồ Sơ Cá Nhân (Profile)
Người dùng sau khi đăng nhập có thể thay đổi thông tin cá nhân.

*   **Chức năng bao gồm:**
    *   **Thay đổi ảnh đại diện:** Hỗ trợ định dạng JPG, PNG (Tối đa 5MB).
    *   **Cập nhật Tên định danh & Email.**
    *   **Đổi mật khẩu:** Yêu cầu nhập mật khẩu hiện tại để xác minh.

---

## 4. Quản Lý Địa Chỉ Giao Hàng (Address)
Lưu trữ các địa chỉ để sử dụng khi thanh toán nhanh chóng hơn.

*   **Thao tác:**
    *   **Thêm địa chỉ:** Tên người nhận, Số điện thoại, Tỉnh/Thành phố, Quận/Huyện, Địa chỉ chi tiết.
    *   **Sửa/Xóa:** Có thể cập nhật hoặc gỡ bỏ các địa chỉ cũ không còn sử dụng.

---

## 5. Các lưu ý quan trọng (Validation)
*   **OTP:** Tuyệt đối không chia sẻ mã OTP cho bất kỳ ai.
*   **Độ mạnh mật khẩu:** Hệ thống có thanh hiển thị trực quan để giúp bạn chọn mật khẩu an toàn hơn.
*   **Lỗi thường gặp:**
    *   *OTP hết hạn:* Bạn cần quay lại trang Quên mật khẩu để yêu cầu mã mới.
    *   *Sai định dạng email:* Vui lòng kiểm tra kỹ dấu chấm `.` và ký tự `@`.

---
*Tài liệu được cập nhật ngày 21 tháng 04 năm 2026.*
