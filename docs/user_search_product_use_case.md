# Use Case: Người Dùng Tìm Kiếm Sản Phẩm

## 1. Tên Use Case
Tìm kiếm sản phẩm (Search Product)

## 2. Actor (Người Thay Thế)
Người dùng (User) - bao gồm cả khách vãng lai (Guest) chưa đăng nhập và thành viên đã đăng nhập hệ thống.

## 3. Mô Tả (Description)
Use case này cho phép người dùng tìm kiếm các sản phẩm trên nền tảng thương mại điện tử bằng cách nhập từ khóa (tên sản phẩm, mã sản phẩm) vào thanh tìm kiếm. Hệ thống hỗ trợ lưu lại và hiển thị lịch sử tìm kiếm, đồng thời cung cấp các gợi ý tìm kiếm xu hướng. Kết quả trả về sẽ là danh sách các sản phẩm khớp với từ khóa tìm kiếm.

## 4. Tiền Điều Kiện (Precondition)
*   Người dùng đã truy cập vào website hoặc ứng dụng, thanh tìm kiếm (Search Bar) đang hiển thị sẵn ở phần Header (trên cùng).
*   Hệ thống Backend (API Product) đang hoạt động bình thường.

## 5. Hậu Điều Kiện (Postcondition)
*   Hệ thống điều hướng người dùng sang trang hiển thị kết quả tìm kiếm (`/products`).
*   Danh sách các sản phẩm trùng khớp hoặc gần đúng với từ khóa được hiển thị (được hỗ trợ phân trang).
*   Từ khóa tìm kiếm hợp lệ được hệ thống lưu lại vào lịch sử tìm kiếm của người dùng (Local Storage/State).

## 6. Luồng Sự Kiện Chính (Main Event Flow)
1.  Người dùng click/chạm vào ô nhập liệu của thanh tìm kiếm ở Header.
2.  Hệ thống hiển thị khung dropdown chứa lịch sử các từ khóa đã tìm kiếm trước đó (nếu có) và danh sách các "Từ khóa xu hướng" (Quick Search Tags).
3.  Người dùng nhập từ khóa tìm kiếm (VD: tên sản phẩm, mã sản phẩm).
4.  Người dùng nhấn phím `Enter` hoặc click vào nút biểu tượng "Kính lúp" (Tìm kiếm).
5.  Frontend xử lý bằng cách cập nhật URL chuyển hướng đến trang `/products?search=[từ_khóa]` và thêm từ khóa mới vào Local History.
6.  Trang kết quả gọi API Backend `GET /api/v1/products?search=[từ_khóa]`.
7.  Hệ thống Backend nhận request, tiến hành truy vấn cơ sở dữ liệu để tìm các sản phẩm thỏa mãn điều kiện tìm kiếm.
8.  Hệ thống Backend trả về dữ liệu bao gồm danh sách sản phẩm và thông tin phân trang (ProductResponse).
9.  Hệ thống Frontend hiển thị danh sách giao diện kết quả các sản phẩm được trả về cho người dùng.

## 7. Các Luồng Thay Thế (Alternative Flow)
*   **A1. Tìm kiếm bằng lịch sử:** 
    *   Tại Bước 2 của luồng chính, người dùng không nhập từ khóa mới mà click chọn trực tiếp một từ khóa trong "Lịch sử tìm kiếm".
    *   Hệ thống cập nhật ô tìm kiếm thành từ khóa đó và trực tiếp chuyển đến Bước 5 của luồng chính.
*   **A2. Tìm kiếm bằng gợi ý xu hướng:** 
    *   Thanh tìm kiếm có cung cấp các tag xu hướng (Ví dụ: "Điện tử", "Phụ kiện", "Thời trang"). 
    *   Người dùng click vào một tag xu hướng bất kỳ. Hệ thống sẽ ngay lập tức lấy từ khóa đó và chuyển đến Bước 5 của luồng chính.
*   **A3. Tìm kiếm với từ khóa rỗng:** 
    *   Tại Bước 4 của luồng chính, nếu ô tìm kiếm đang rỗng hoặc chỉ có khoảng trắng, khi người dùng nhấn tìm kiếm, hệ thống sẽ bỏ qua thao tác (không thực hiện chuyển trang hoặc gọi API).
*   **A4. Xóa một mục hoặc toàn bộ lịch sử tìm kiếm:** 
    *   Trong khi hiển thị dropdown Lịch sử tìm kiếm, người dùng có thể click vào nút `X` (biểu tượng xóa) kế bên mỗi từ khóa để xóa từ khóa đó khỏi lịch sử.
    *   Người dùng cũng có thể click vào nút "Xóa lịch sử tìm kiếm" (Clear All) ở cuối danh sách. Hệ thống sẽ làm sạch mọi từ khóa đã lưu trước đó và đóng cửa sổ popup dropdown.
*   **A5. Không tìm thấy sản phẩm hợp lệ:** 
    *   Tại Bước 8 của luồng chính, nếu cơ sở dữ liệu không có sản phẩm nào khớp với từ khóa, Backend sẽ trả về mảng danh sách rỗng (`[]`).
    *   Tại Bước 9, Frontend sẽ hiển thị thông báo "Không tìm thấy sản phẩm nào" hoặc giao diện trạng thái trống (Empty State) gợi ý người dùng tìm một từ khóa khác.
