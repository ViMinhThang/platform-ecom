# Hướng dẫn Tạo và Quản lý Kho hàng (Dành cho Người bán)

Chào mừng bạn đến với hệ thống quản lý Kho hàng. Tính năng này giúp bạn theo dõi sát sao số lượng sản phẩm, nắm bắt kịp thời các mặt hàng sắp hết và quản lý việc nhập/xuất kho một cách chính xác.

Việc thiết lập kho hàng là bắt buộc để sản phẩm của bạn có thể hiển thị trạng thái "Còn hàng" và cho phép khách hàng đặt mua.

---

## 1. Truy cập vào quản lý Kho hàng

1. Đăng nhập vào trang quản trị (Bảng điều khiển/Dashboard) của Người bán.
2. Trên thanh menu, tìm và chọn mục **Kho hàng (Inventory)**.
3. Tại đây, bạn sẽ thấy giao diện tổng quan bao gồm:
   - **Tổng số lượng kho (Total Items):** Các mặt hàng bạn đang quản lý.
   - **Tổng tồn kho (Total Stock):** Số lượng vật lý thực tế của hàng hóa.
   - **Đang được đặt (Reserved):** Số lượng hàng khách đã đặt nhưng chưa hoàn tất đơn.
   - **Cảnh báo sắp hết hàng (Low Stock):** Những mặt hàng sắp cạn kiệt, cần nhập thêm.

---

## 2. Hướng dẫn Tạo kho hàng mới

Để quản lý số lượng cho một sản phẩm mới, bạn cần "Tạo kho hàng" và gán nó cho từng **biến thể** cụ thể (ví dụ: cùng một mẫu áo nhưng size M và size L sẽ có kho hàng riêng).

**Các bước thực hiện:**

1. Nhấp vào nút **"+ Tạo kho hàng"** ở góc phải màn hình danh sách.
2. Một biểu mẫu sẽ xuất hiện, bạn cần điền các thông tin sau:
   - **Sản phẩm:** Nhấp vào danh sách sổ xuống và tìm hoặc chọn sản phẩm bạn muốn thiết lập.
   - **Biến thể:** Danh sách các biến thể của sản phẩm trên sẽ hiện ra. Hãy chọn chính xác biến thể cần tạo kho.
   - **SKU (Mã lưu kho):** Mã nội bộ để bạn tự quản lý hàng hóa. Nếu lúc tạo biến thể bạn đã nhập sẵn, hệ thống sẽ tự động điền. Bạn hoàn toàn có thể thay đổi mã này cho dễ nhớ.
   - **Tồn kho ban đầu:** Nhập số lượng hàng bạn đang cầm trên tay và sẵn sàng bán. (Có thể để là `0` nếu hàng chưa nhập kho).
3. Sau khi xác nhận thông tin đã phản ánh đúng thực tế, nhấn nút **"Tạo kho hàng"**.
4. Sẽ có thông báo màu xanh báo hiệu thành công. Biến thể đó sẽ xuất hiện ngay trong bảng danh sách phía dưới.

> **Lưu ý quan trọng:** Bạn **không thể** tạo 2 kho hàng cho cùng 1 biến thể. Nếu biến thể đã có kho, hãy sử dụng tính năng "Điều chỉnh tồn kho" bên dưới.

---

## 3. Quản lý và Điều chỉnh lượng hàng tồn

Trong quá trình bán hàng, sẽ có lúc bạn nhập thêm hàng mới về, hoặc hàng bị hỏng hóc/thất lạc cần loại bỏ ra khỏi hệ thống.

**Cách điều chỉnh trực tiếp số lượng:**

1. Tại bảng danh sách biến thể, tìm mặt hàng bạn muốn thay đổi. Nếu danh sách quá dài, hãy dùng thanh **Tìm kiếm** (theo ID hoặc mã SKU).
2. Ở cột thao tác (ngoài cùng bên phải), nhấp vào biểu tượng **Sửa (Cây bút)**.
3. Hộp thoại Điều chỉnh tồn kho sẽ mở ra với 3 thông số so sánh: *Hiện tại -> Thay đổi -> Mới*.
4. Chọn hình thức:
   - **Thêm tồn kho (+):** Khi bạn nhập lô hàng mới về.
   - **Giảm tồn kho (-):** Khi hàng bị lỗi, thất lạc, hoặc bạn muốn trích ra cho mục đích cá nhân.
5. **Nhập số lượng:** Điền con số lượng bạn muốn tăng/giảm.
6. **Lý do (Tùy chọn):** Bạn nên ghi chú lại lý do (ví dụ: "Nhập đợt 2 ngày 20/4" hoặc "Áo bị rách 1 chiếc"). Mục này giúp bạn dễ dàng đối soát sau này.
7. Nhấn **"Xác nhận điều chỉnh"** để lưu hệ thống.

> **Chú ý:** Hệ thống không cho phép kho hàng điều chỉnh về mức âm (nhỏ hơn 0).

---

## 4. Xóa kho hàng

Nếu bạn ngừng kinh doanh hoàn toàn một biến thể sản phẩm, bạn có thể xóa kho hàng của nó để danh sách được gọn gàng.

- Nhấp vào biểu tượng **Thùng rác** bên cạnh biến thể đó.
- Hệ thống sẽ yêu cầu bạn xác nhận.
- **Cảnh báo:** Việc xóa kho hàng **KHÔNG THỂ HOÀN TÁC**. Toàn bộ lịch sử thêm/bớt hàng hóa và dữ liệu của biến thể này trong kho sẽ bị xóa vĩnh viễn. Hãy cân nhắc kỹ trước khi thực hiện.
