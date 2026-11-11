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
9. [Xử lý đơn hàng](#xử-lý-đơn-hàng)
10. [Kiểm thử](#kiểm-thử)

---

## Công nghệ

| Thư viện       | Mục đích                         |
|----------------|-----------------------------------|
| Express 5      | Tạo server và định tuyến API      |
| Sequelize 6    | ORM kết nối MariaDB               |
| mariadb        | Driver kết nối MariaDB            |
| jsonwebtoken   | Tạo và kiểm tra token             |
| bcryptjs       | Băm mật khẩu (salt rounds = 10)   |
| cookie-parser  | Đọc cookie refresh token (`req.cookies`) |
| uuid           | Sinh id ngẫu nhiên cho user       |
| dotenv         | Đọc biến môi trường               |
| cors           | Cho phép frontend gọi API         |
| multer         | Nhận file ảnh từ form tải lên (lưu tạm trong RAM) |
| cloudinary     | Lưu trữ ảnh sản phẩm trên cloud    |
| nodemon        | Tự khởi động lại khi sửa code (dev)|
| mocha + chai + supertest | Kiểm thử API (dev)      |

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
| DB_DIALECT          | `mariadb` hoặc `mysql` (mặc định `mariadb`) | mariadb |
| DB_SSL              | `true` khi dùng TiDB Cloud, `false` khi chạy máy | false |
| CORS_ORIGINS        | Tên miền được gọi API, cách nhau bằng dấu phẩy, không khoảng trắng, không có `/` ở cuối. Bỏ trống thì mặc định `http://localhost:3000,http://localhost:3001` | (để trống) |
| NODE_ENV            | `development` khi chạy máy, `production` trên Render (bắt buộc để cookie refresh token có `secure` + `sameSite=none`, gửi được từ Vercel sang Render) | development |
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
│   ├── authController.js      # Đăng ký, đăng nhập, làm mới token, đăng xuất
│   ├── categoryController.js  # CRUD danh mục
│   ├── productController.js   # CRUD sản phẩm, phân trang, tìm kiếm
│   ├── orderController.js     # Đặt hàng, trừ/hoàn kho, phân trang đơn
│   ├── userController.js      # Quản lý người dùng
│   └── uploadController.js    # Nhận ảnh từ multer, tải lên Cloudinary
├── middlewares/
│   └── auth.js           # verifyToken, verifyAdmin
├── models/               # Định nghĩa các bảng + quan hệ (index.js)
├── routes/
│   ├── authRoutes.js
│   ├── categoryRoutes.js
│   ├── productRoutes.js
│   ├── orderRoutes.js
│   ├── userRoutes.js
│   └── uploadRoutes.js   # Route POST /api/upload
├── test/
│   └── api.test.js       # Test API (Mocha + Chai + Supertest)
├── .env.example          # File mẫu biến môi trường
├── app.js                # Khởi tạo Express: CORS, cookie-parser, mount route
└── index.js              # File khởi động server, nối database, dọn session
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

### Các cột chính

| Bảng | Cột |
|------|-----|
| users | `id` VARCHAR(8) PK — 8 ký tự hex ngẫu nhiên (0-9, a-f) lấy từ uuid v4; `name`; `email` UNIQUE; `password` (đã băm bcrypt); `phone` UNIQUE; `address`; `role` ENUM('admin','customer'), mặc định `customer` |
| categories | `id` INT PK tự tăng; `name` |
| products | `id` INT PK tự tăng; `name`; `price` DECIMAL(10,2); `image_url`; `description` TEXT; `category_id` FK → categories; `stock` INT, mặc định 0 (số hàng tồn kho); `createdAt`; `updatedAt` |
| orders | `id` INT PK tự tăng; `user_id` VARCHAR(8) FK → users; `total` DECIMAL(10,2); `status` (`pending` \| `completed`, mặc định `pending`); `shipping_name`, `shipping_phone`, `shipping_address` (thông tin giao hàng lúc đặt); `createdAt`; `updatedAt` |
| order_items | `id` INT PK tự tăng; `order_id` FK → orders; `product_id` FK → products; `quantity`; `price` DECIMAL(10,2) — giá tại thời điểm đặt |
| sessions | `id` INT PK tự tăng; `user_id` VARCHAR(8) FK → users; `refresh_token` TEXT; `expires_at` (ngày hết hạn); `createdAt`; `updatedAt` |

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

Tương tự, server dùng `sequelize.sync({ force: false })` (xem `index.js`): lệnh này chỉ tạo bảng chưa có, **không thêm cột mới** vào bảng đã tồn tại. Nếu database được tạo trước khi có tồn kho và thông tin giao hàng, phải tự chạy:

```sql
ALTER TABLE products ADD COLUMN stock INT NOT NULL DEFAULT 0;
ALTER TABLE orders
  ADD COLUMN shipping_name VARCHAR(255),
  ADD COLUMN shipping_phone VARCHAR(255),
  ADD COLUMN shipping_address VARCHAR(255);
```

---

## API Endpoints

Tất cả endpoint đều có tiền tố `/api` (xem cách mount route trong `app.js`).

Ký hiệu quyền truy cập:

- **Public**: ai cũng gọi được
- **User**: phải đăng nhập (có access token hợp lệ)
- **Admin**: phải đăng nhập và có role admin

### Auth (`/api/auth`)

| Method | Endpoint             | Quyền  | Mô tả                    |
|--------|-----------------------|--------|--------------------------|
| POST   | /api/auth/register    | Public | Đăng ký tài khoản        |
| POST   | /api/auth/login       | Public | Đăng nhập (sai email hay sai mật khẩu đều trả 400 "Email hoặc mật khẩu không đúng!") |
| POST   | /api/auth/refresh     | Public | Lấy access token mới (đọc refresh token từ cookie) |
| POST   | /api/auth/logout      | User   | Đăng xuất                |

Admin gọi `login`, `refresh`, `logout` kèm `?client=admin` để backend dùng cookie `adminRefreshToken` thay cho `refreshToken` (xem mục [Xác thực JWT](#xác-thực-jwt)).

### Categories (`/api/categories`)

| Method | Endpoint             | Quyền  | Mô tả             |
|--------|-----------------------|--------|-------------------|
| GET    | /api/categories       | Public | Lấy tất cả        |
| POST   | /api/categories       | Admin  | Thêm danh mục     |
| PUT    | /api/categories/:id   | Admin  | Sửa danh mục      |
| DELETE | /api/categories/:id   | Admin  | Xóa danh mục (404 nếu không tìm thấy, 400 nếu còn sản phẩm) |

### Products (`/api/products`)

| Method | Endpoint           | Quyền  | Mô tả             |
|--------|---------------------|--------|-------------------|
| GET    | /api/products       | Public | Danh sách có phân trang (mới sửa lên đầu) |
| GET    | /api/products/:id    | Public | Lấy 1 sản phẩm (404 nếu không có) |
| POST   | /api/products       | Admin  | Thêm sản phẩm (gồm `stock`) |
| PUT    | /api/products/:id    | Admin  | Sửa sản phẩm (gồm `stock`) |
| DELETE | /api/products/:id    | Admin  | Xóa sản phẩm (404 nếu không tìm thấy, 400 nếu đã nằm trong đơn hàng) |

Query của `GET /api/products`: `page` (mặc định 1), `limit` (mặc định 8), `category_id` (lọc theo danh mục), `search` (tìm tên chứa từ khoá, dùng `LIKE`). Trả về `{ data, total, page, totalPages }`.

### Orders (`/api/orders`)

| Method | Endpoint               | Quyền  | Mô tả                       |
|--------|-------------------------|--------|-----------------------------|
| GET    | /api/orders/my-orders   | User   | Xem đơn hàng của chính mình |
| GET    | /api/orders             | Admin  | Danh sách đơn có phân trang (mới nhất lên đầu) |
| POST   | /api/orders             | User   | Tạo đơn hàng (xem [Xử lý đơn hàng](#xử-lý-đơn-hàng)) |
| PUT    | /api/orders/:id         | Admin  | Cập nhật trạng thái đơn (`status` chỉ nhận `pending` hoặc `completed`, giá trị khác trả 400 "Trạng thái không hợp lệ!") |
| DELETE | /api/orders/:id         | Admin  | Xóa đơn hàng và hoàn lại tồn kho |

Query của `GET /api/orders`: `page` (mặc định 1), `limit` (mặc định 10). Trả về `{ data, total, page, totalPages }`; mỗi đơn kèm thông tin user (không có password) và chi tiết sản phẩm.

### Users (`/api/users`)

| Method | Endpoint         | Quyền  | Mô tả                     |
|--------|-------------------|--------|---------------------------|
| GET    | /api/users         | Admin  | Xem danh sách tài khoản (gồm cả admin, không trả password) |
| POST   | /api/users         | Admin  | Thêm người dùng mới (mật khẩu được băm bcrypt, response không có password) |
| PUT    | /api/users/:id      | Admin  | Sửa thông tin người dùng (không đổi mật khẩu) |
| DELETE | /api/users/:id      | Admin  | Xóa người dùng (404 nếu không tìm thấy, 400 nếu còn đơn hàng) |

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
| Refresh Token | 7 ngày   | `id`, `role`       | Cookie httpOnly + database (bảng `sessions`) |

Cookie refresh token có các thuộc tính: `httpOnly` (JavaScript trên trình duyệt không đọc được), `path=/api/auth` (chỉ gửi kèm khi gọi route auth), `maxAge` 7 ngày; khi `NODE_ENV=production` thì thêm `secure` + `sameSite=none` để gửi được giữa 2 tên miền khác nhau (Vercel → Render), còn khi chạy máy là `sameSite=lax`. Tên cookie là `refreshToken` cho Customer và `adminRefreshToken` cho Admin (Admin gọi kèm `?client=admin`), vì 2 trang dùng chung backend nên phải tách tên để không ghi đè nhau.

Thời hạn và payload này áp dụng nhất quán cho access token được cấp lúc đăng nhập (`POST /api/auth/login`) và lúc làm mới (`POST /api/auth/refresh`).

### Bảo mật mật khẩu

- Mật khẩu được băm bằng bcrypt với 10 vòng (salt rounds = 10), cả khi khách tự đăng ký lẫn khi admin tạo user qua `POST /api/users`.
- Không API nào trả cột `password` ra ngoài: login chỉ trả các trường cần thiết, register chỉ trả thông báo, danh sách user và đơn hàng đều loại bỏ `password`.
- Đăng nhập sai email hay sai mật khẩu đều trả cùng mã 400 và cùng thông báo "Email hoặc mật khẩu không đúng!", để người ngoài không dò được email nào đã đăng ký.

### Luồng đăng nhập

```
1. Người dùng gửi email + mật khẩu  ->  POST /api/auth/login
2. Server kiểm tra, trả về accessToken + thông tin user trong JSON (không có password),
   còn refreshToken được đặt vào cookie httpOnly (không nằm trong JSON)
3. Frontend chỉ lưu accessToken và user vào localStorage
4. Mỗi lần gọi API cần quyền, gửi kèm header:
   Authorization: Bearer <accessToken>
5. Access token hết hạn  ->  gọi POST /api/auth/refresh (credentials: 'include'),
   trình duyệt tự gửi cookie refresh token, server trả accessToken mới
6. Đăng xuất  ->  gọi POST /api/auth/logout (kèm access token) để server xóa toàn bộ session
   của tài khoản trong database (đăng xuất trên mọi thiết bị) và xóa cookie,
   sau đó frontend xóa accessToken và user khỏi localStorage
```

Cả `customer/lib/api.ts` và `admin/src/lib/api.js` đều có một hàm `fetchWithAuth` dùng chung cho các request cần đăng nhập (gửi kèm `credentials: 'include'`): khi gặp lỗi 401, hàm này tự gọi `POST /api/auth/refresh` để lấy accessToken mới rồi gửi lại request cũ; nếu làm mới cũng thất bại thì chuyển về trang đăng nhập.

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

---

## Xử lý đơn hàng

Body của `POST /api/orders`:

```json
{
  "items": [{ "product_id": 1, "quantity": 2 }],
  "name": "Nguyễn Văn A",
  "phone": "0900000000",
  "address": "Số nhà, Xã, Huyện, Tỉnh"
}
```

Các bước backend thực hiện (`controllers/orderController.js`):

1. Kiểm tra dữ liệu, trả **400** khi: giỏ hàng trống, thiếu tên/SĐT/địa chỉ giao hàng, số lượng ≤ 0, sản phẩm không tồn tại, hoặc không đủ tồn kho.
2. **Tự tính tổng tiền** từ giá trong database, không tin giá hay tổng tiền gửi từ frontend.
3. Mở **transaction**: tạo đơn, tạo chi tiết đơn và trừ kho phải cùng thành công hoặc cùng huỷ.
4. Trừ kho bằng một câu `UPDATE` có điều kiện:
   ```sql
   UPDATE products SET stock = stock - :quantity WHERE id = :id AND stock >= :quantity
   ```
   Nếu không dòng nào bị ảnh hưởng (hàng vừa bị người khác mua hết) thì rollback và trả 400 "vừa hết hàng". Cách này chống bán vượt kho khi nhiều người đặt cùng lúc.
5. Lưu bản sao **giá tại thời điểm đặt** vào `order_items.price` và **thông tin giao hàng** vào `orders.shipping_name`, `shipping_phone`, `shipping_address`, nên sau này sửa giá sản phẩm hay sửa thông tin khách cũng không làm sai đơn cũ.
6. Lỗi giữa chừng thì rollback toàn bộ và trả 500.

Khi admin **xoá đơn** (`DELETE /api/orders/:id`): trong một transaction, cộng lại tồn kho cho từng sản phẩm của đơn, xoá chi tiết đơn rồi xoá đơn.

---

## Kiểm thử

Dùng **Mocha + Chai + Supertest**, gồm **9 test case** trong `test/api.test.js`:

- Sản phẩm (7): trả 200; có đủ `data`, `total`, `page`, `totalPages`; `limit` giới hạn số sản phẩm; `page` trả đúng trang; `search` chỉ trả sản phẩm khớp tên; id không tồn tại trả 404; thêm sản phẩm khi chưa đăng nhập trả 401
- Danh mục (1): `GET /api/categories` trả về mảng
- Đăng nhập (1): sai mật khẩu trả 400

Chạy:

```bash
npm test
```

Test gọi thẳng vào database thật, nên MariaDB phải đang chạy, file `.env` đã điền và database đã có dữ liệu (test tìm kiếm dùng từ khoá `snapback`).
