# Online Store — Backend API

REST API cho hệ thống Online Store, phục vụ cả trang Customer và trang Admin.

---

## Mục lục

1. [Công nghệ](#công-nghệ)
2. [Cài đặt](#cài-đặt)
3. [Biến môi trường](#biến-môi-trường)
4. [Cấu trúc thư mục](#cấu-trúc-thư-mục)
5. [Database](#database)
6. [API Endpoints](#api-endpoints)
7. [Xác thực JWT](#xác-thực-jwt)
8. [Upload ảnh](#upload-ảnh)

---

## Công nghệ

| Thư viện       | Mục đích                         |
|----------------|-----------------------------------|
| Express        | Tạo server và định tuyến API      |
| Sequelize      | ORM kết nối MariaDB               |
| mariadb        | Driver kết nối MariaDB            |
| jsonwebtoken   | Tạo và kiểm tra token             |
| bcryptjs       | Mã hóa mật khẩu                   |
| uuid           | Sinh id ngẫu nhiên cho user       |
| dotenv         | Đọc biến môi trường               |
| cors           | Cho phép frontend gọi API         |
| multer         | Nhận file ảnh từ form tải lên (lưu tạm trong RAM) |
| cloudinary     | Lưu trữ ảnh sản phẩm trên cloud    |
| nodemon        | Tự khởi động lại khi sửa code (dev)|

---

## Cài đặt

**1. Cài thư viện**

```bash
npm install
```

**2. Tạo file môi trường**

```bash
cp .env.example .env
```

Mở file `.env` và điền thông tin (xem mục bên dưới).

**3. Bật MariaDB/MySQL** (XAMPP → Start MySQL)

**4. Chạy server**

```bash
npm run dev
```

Khi thành công, server chạy tại `http://localhost:5000`

---

## Biến môi trường

| Biến                | Ý nghĩa                     | Ví dụ          |
|---------------------|-----------------------------|----------------|
| DB_HOST             | Địa chỉ MariaDB              | localhost      |
| DB_PORT             | Cổng MariaDB                 | 3306           |
| DB_NAME             | Tên database                | online_store   |
| DB_USER             | Tài khoản MariaDB            | root           |
| DB_PASSWORD         | Mật khẩu MariaDB             | (để trống)     |
| JWT_SECRET          | Khóa bí mật access token    | chuoi_bi_mat_1 |
| JWT_REFRESH_SECRET  | Khóa bí mật refresh token   | chuoi_bi_mat_2 |
| PORT                | Cổng chạy server            | 5000           |
| CLOUDINARY_CLOUD_NAME | Tên cloud trên Cloudinary  | (xem hướng dẫn dưới) |
| CLOUDINARY_API_KEY    | API Key của Cloudinary     | (xem hướng dẫn dưới) |
| CLOUDINARY_API_SECRET | API Secret của Cloudinary  | (xem hướng dẫn dưới) |

Nếu bỏ trống `PORT`, server tự dùng cổng `5000` (xem `index.js`).

Lấy 3 biến Cloudinary: đăng nhập [Cloudinary Console](https://console.cloudinary.com) → vào **Settings** → **API Keys**, copy `Cloud name`, `API Key`, `API Secret` vào `.env`.

---

## Cấu trúc thư mục

```
backend/
├── config/
│   ├── database.js       # Cấu hình kết nối database
│   └── cloudinary.js     # Cấu hình kết nối Cloudinary
├── controllers/
│   └── uploadController.js  # Nhận ảnh từ multer, tải lên Cloudinary
├── middlewares/     # verifyToken, verifyAdmin
├── models/          # Định nghĩa các bảng
├── routes/
│   └── uploadRoutes.js   # Route POST /api/upload
├── .env.example     # File mẫu biến môi trường
└── index.js         # File khởi động server
```

---

## Database

Dialect thật đang dùng là **MariaDB** (cấu hình trong `config/database.js`).

### Các bảng

| Bảng        | Mô tả                                   |
|-------------|-----------------------------------------|
| users       | Tài khoản (khách hàng và admin)         |
| categories  | Danh mục sản phẩm                       |
| products    | Sản phẩm                                |
| orders      | Đơn hàng                                |
| order_items | Từng sản phẩm trong một đơn hàng        |
| sessions    | Refresh token của người dùng đã đăng nhập |

### Quan hệ giữa các bảng

```
categories  1 ──── n  products
users       1 ──── n  orders
orders      1 ──── n  order_items
products    1 ──── n  order_items
users       1 ──── n  sessions
```

### Dọn session hết hạn

Server có một job tự động chạy mỗi 24 giờ để xóa các session (refresh token) đã hết hạn trong bảng `sessions` (xem `setInterval` trong `index.js`).

### Timestamps

Bảng `products` và `orders` đều có cột `createdAt` và `updatedAt` (model đã bật `timestamps: true`). `updatedAt` của `products` dùng để sắp xếp "sản phẩm mới nhất lên đầu"; `createdAt` của `orders` dùng để sắp xếp "đơn hàng mới nhất lên đầu".

### Lưu ý khi dùng database có sẵn

Nếu bảng `products` đã được tạo từ trước khi bật `timestamps`, bảng sẽ chưa có cột `createdAt`/`updatedAt` và phải tự thêm bằng tay:

```sql
ALTER TABLE products
  ADD COLUMN createdAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  ADD COLUMN updatedAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP;
UPDATE products SET createdAt = '2026-01-01 00:00:00', updatedAt = '2026-01-01 00:00:00' WHERE updatedAt > UTC_TIMESTAMP();
```

Câu `UPDATE` dùng để sửa lệch múi giờ: giá trị `CURRENT_TIMESTAMP` mặc định của MariaDB lấy theo giờ địa phương của server database, trong khi Sequelize tính và so sánh thời gian theo UTC — nếu không chỉnh lại, các dòng cũ có thể bị hiểu nhầm là "mới hơn" so với thời điểm thực tại UTC.

---

## API Endpoints

Tất cả endpoint đều có tiền tố `/api` (xem cách mount route trong `index.js`).

Ký hiệu quyền truy cập:

- **Public**: ai cũng gọi được
- **User**: phải đăng nhập (có access token hợp lệ)
- **Admin**: phải đăng nhập và có role admin

### Auth (`/api/auth`)

| Method | Endpoint             | Quyền  | Mô tả                    |
|--------|-----------------------|--------|--------------------------|
| POST   | /api/auth/register    | Public | Đăng ký tài khoản        |
| POST   | /api/auth/login       | Public | Đăng nhập                |
| POST   | /api/auth/refresh     | Public | Lấy access token mới     |
| POST   | /api/auth/logout      | User   | Đăng xuất                |

### Categories (`/api/categories`)

| Method | Endpoint             | Quyền  | Mô tả             |
|--------|-----------------------|--------|-------------------|
| GET    | /api/categories       | Public | Lấy tất cả        |
| POST   | /api/categories       | Admin  | Thêm danh mục     |
| PUT    | /api/categories/:id   | Admin  | Sửa danh mục      |
| DELETE | /api/categories/:id   | Admin  | Xóa danh mục      |

### Products (`/api/products`)

| Method | Endpoint           | Quyền  | Mô tả             |
|--------|---------------------|--------|-------------------|
| GET    | /api/products       | Public | Lấy tất cả        |
| GET    | /api/products/:id    | Public | Lấy 1 sản phẩm    |
| POST   | /api/products       | Admin  | Thêm sản phẩm     |
| PUT    | /api/products/:id    | Admin  | Sửa sản phẩm      |
| DELETE | /api/products/:id    | Admin  | Xóa sản phẩm      |

### Orders (`/api/orders`)

| Method | Endpoint               | Quyền  | Mô tả                       |
|--------|-------------------------|--------|-----------------------------|
| GET    | /api/orders/my-orders   | User   | Xem đơn hàng của chính mình |
| GET    | /api/orders             | Admin  | Xem tất cả đơn hàng         |
| POST   | /api/orders             | User   | Tạo đơn hàng                |
| PUT    | /api/orders/:id         | Admin  | Cập nhật trạng thái đơn     |
| DELETE | /api/orders/:id         | Admin  | Xóa đơn hàng                |

### Users (`/api/users`)

| Method | Endpoint         | Quyền  | Mô tả                     |
|--------|-------------------|--------|---------------------------|
| GET    | /api/users         | Admin  | Xem danh sách khách hàng  |
| POST   | /api/users         | Admin  | Thêm người dùng mới       |
| PUT    | /api/users/:id      | Admin  | Sửa thông tin người dùng  |
| DELETE | /api/users/:id      | Admin  | Xóa người dùng            |

### Upload (`/api/upload`)

| Method | Endpoint      | Quyền  | Mô tả                          |
|--------|----------------|--------|--------------------------------|
| POST   | /api/upload    | Admin  | Tải ảnh sản phẩm lên Cloudinary |

Request gửi dạng `multipart/form-data`, trường file tên `image`. Middleware áp dụng theo thứ tự: `verifyToken` → `verifyAdmin` → `multer` (lưu file tạm trong RAM bằng `memoryStorage`, giới hạn dung lượng **5 MB**, chỉ nhận file có mimetype bắt đầu bằng `image/`) → controller tải lên Cloudinary.

Response thành công: `{ "url": "https://..." }` — là link ảnh (`secure_url`) trên Cloudinary, lưu trong thư mục (folder) `online-store`.

---

## Xác thực JWT

### Hai loại token

| Token         | Thời hạn | Payload           | Lưu ở đâu                     |
|---------------|----------|--------------------|-------------------------------|
| Access Token  | 15 phút  | `id`, `role`       | localStorage phía frontend    |
| Refresh Token | 7 ngày   | `id`, `role`       | localStorage + database (bảng `sessions`) |

Thời hạn và payload này áp dụng nhất quán cho access token được cấp lúc đăng nhập (`POST /api/auth/login`) và lúc làm mới (`POST /api/auth/refresh`). Response của `POST /api/auth/login` và `POST /api/auth/register` không trả về trường `password`.

### Luồng đăng nhập

```
1. Người dùng gửi email + mật khẩu  ->  POST /api/auth/login
2. Server kiểm tra, trả về accessToken + refreshToken + thông tin user (không có password)
3. Frontend lưu 2 token vào localStorage
4. Mỗi lần gọi API cần quyền, gửi kèm header:
   Authorization: Bearer <accessToken>
5. Access token hết hạn  ->  gọi POST /api/auth/refresh để lấy accessToken mới
6. Đăng xuất  ->  gọi POST /api/auth/logout (kèm access token) để server xóa refresh token (session) trong database, sau đó frontend xóa token khỏi localStorage
```

Cả `customer/lib/api.ts` và `admin/src/lib/api.js` đều có một hàm `fetchWithAuth` dùng chung cho các request cần đăng nhập: khi gặp lỗi 401, hàm này tự gọi `POST /api/auth/refresh` để lấy accessToken mới rồi gửi lại request cũ; nếu làm mới cũng thất bại thì chuyển về trang đăng nhập.

### Middleware

| Middleware  | Chức năng                                         |
|-------------|---------------------------------------------------|
| verifyToken | Kiểm tra token hợp lệ, gắn thông tin user vào req |
| verifyAdmin | Chạy sau verifyToken, kiểm tra role là admin      |

```
Request -> verifyToken -> verifyAdmin -> Controller
```

---

## Upload ảnh

Luồng tải ảnh sản phẩm:

```
Admin chọn ảnh trong form
  -> gửi multipart/form-data lên POST /api/upload (field "image")
  -> verifyToken + verifyAdmin kiểm tra quyền
  -> multer đọc file vào RAM (memoryStorage), giới hạn 5 MB, chỉ nhận ảnh
  -> controller gửi file lên Cloudinary (thư mục "online-store")
  -> Cloudinary trả về link ảnh (secure_url)
  -> server trả về { url: secure_url } cho frontend
  -> frontend lưu link này vào trường image_url khi tạo/sửa sản phẩm
```

Database **không lưu file ảnh**, chỉ lưu đường dẫn (link) ảnh trong cột `image_url` của bảng `products`. File ảnh thật được lưu trên Cloudinary.
