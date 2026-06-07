# Hướng dẫn Cài đặt Dự án (Dành cho Developer)

Chào mừng bạn đến với dự án Platform E-commerce. Tài liệu này sẽ hướng dẫn bạn cách thiết lập môi trường phát triển cục bộ một cách chi tiết.

## 1. Yêu cầu hệ thống (Prerequisites)

Trước khi bắt đầu, hãy đảm bảo máy tính của bạn đã cài đặt các công cụ sau:
- **Docker & Docker Compose:** Để chạy các dịch vụ cơ sở hạ tầng (DB, Message Broker, v.v.)
- **Java Development Kit (JDK) 17+:** Cần thiết cho các dịch vụ Backend Spring Boot.
- **Node.js (LTS - v18+) & npm:** Cần thiết cho Frontend Next.js.
- **Maven 3.8+:** Để build các module Java.
- **Git:** Để quản lý mã nguồn.

## 2. Thiết lập Cơ sở hạ tầng (Infrastructure)

Dự án sử dụng Docker Compose để quản lý các dịch vụ hỗ trợ. Hãy chạy lệnh sau tại thư mục gốc của dự án:

```bash
docker-compose up -d
```

Các dịch vụ sẽ được khởi tạo bao gồm:
- **PostgreSQL (Port 5432):** Cơ sở dữ liệu chính (sử dụng pgvector cho AI/Search).
- **Redis (Port 6379):** Dùng để caching.
- **Kafka & Zookeeper (Port 9093):** Message Broker cho các tác vụ bất đồng bộ.
- **RabbitMQ (Port 5672, UI 15672):** Message Broker cho các thông báo.
- **Eureka Server (Port 8761):** Dùng cho Service Discovery.
- **Zipkin (Port 9411):** Theo dõi luồng xử lý (Distributed Tracing).
- **PgAdmin (Port 5050):** Giao diện quản lý PostgreSQL.

## 3. Thiết lập Backend (Java Microservices)

Các dịch vụ Backend nằm trong thư mục `platform-ecom-backend`.

### Bước 1: Build mã nguồn
Di chuyển vào thư mục backend và cài đặt các thư viện dùng chung:

```bash
cd platform-ecom-backend
mvn clean install -DskipTests
```
*Lưu ý: Phải chạy lệnh này để build module `shared-commons` trước, vì các dịch vụ khác phụ thuộc vào nó.*

### Bước 2: Thứ tự khởi chạy các dịch vụ
Để hệ thống hoạt động ổn định, bạn nên khởi chạy các dịch vụ theo thứ tự sau:
1. **Config Server** (nếu có)
2. **Eureka Server** (Đã chạy qua Docker, kiểm tra tại http://localhost:8761)
3. **Gateway Service:** Cửa ngõ chính cho toàn bộ API.
4. **Các Microservices:** `user`, `product`, `order`, `inventory`, `notification`, v.v.

Bạn có thể chạy từng dịch vụ bằng IDE (IntelliJ, Eclipse) hoặc lệnh:
```bash
mvn spring-boot:run -pl <module-name>
```

## 4. Thiết lập Frontend (Next.js)

Di chuyển vào thư mục `frontend-client`:

```bash
cd frontend-client
```

### Bước 1: Cài đặt dependencies
```bash
npm install
```

### Bước 2: Cấu hình biến môi trường
Kiểm tra file `.env.local` (nếu có) hoặc copy từ `.env.example`. Đảm bảo URL gọi đến Backend Gateway là chính xác (mặc định thường là `http://localhost:8080`).

### Bước 3: Chạy ứng dụng
```bash
npm run dev
```
Ứng dụng sẽ chạy tại: [http://localhost:3000](http://localhost:3000)

## 5. Các công cụ quản trị (UI Tools)

Sau khi khởi chạy thành công, bạn có thể truy cập các công cụ sau để kiểm tra:
- **Eureka Dashboard:** [http://localhost:8761](http://localhost:8761) (Xem trạng thái các microservices).
* **RabbitMQ Management:** [http://localhost:15672](http://localhost:15672) (Username/Password: `guest/guest`).
- **PgAdmin:** [http://localhost:5050](http://localhost:5050) (Dùng để xem dữ liệu DB).
- **Zipkin UI:** [http://localhost:9411](http://localhost:9411) (Xem trace log).

## 6. Lưu ý quan trọng
- **Cơ sở dữ liệu:** File `init-multi-db.sh` sẽ tự động tạo các database cần thiết khi Docker Postgres khởi chạy lần đầu. Nếu gặp lỗi kết nối DB, hãy kiểm tra logs của container postgres.
- **Bộ nhớ:** Các dịch vụ microservices tốn khá nhiều RAM, hãy đảm bảo máy tính có ít nhất 16GB RAM để trải nghiệm mượt mà.
- **Môi trường:** Luôn kiểm tra các file `.env` trong từng module microservices để cập nhật thông tin kết nối chính xác.
