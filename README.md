# Online Store — Capstone Project

Dự án full-stack thương mại điện tử, gồm 3 phần:

- **Backend**: REST API (Node.js + Express + Sequelize + MariaDB)
- **Customer**: trang mua sắm cho khách hàng (Next.js 16)
- **Admin**: trang quản trị cho người bán (CoreUI React)

---

## Mục lục

1. [Bản đã triển khai](#bản-đã-triển-khai)
2. [Cấu trúc dự án](#cấu-trúc-dự-án)
3. [Yêu cầu hệ thống](#yêu-cầu-hệ-thống)
4. [Hướng dẫn cài đặt](#hướng-dẫn-cài-đặt)
5. [Luồng hoạt động](#luồng-hoạt-động)
6. [Công nghệ sử dụng](#công-nghệ-sử-dụng)
7. [Tác giả](#tác-giả)

---

## Bản đã triển khai

| Thành phần | Địa chỉ | Nền tảng |
| --- | --- | --- |
| Customer | https://project-online-store-ten.vercel.app | Vercel |
| Admin | https://project-online-store-7voj.vercel.app | Vercel |
| API | https://online-store-api-612c.onrender.com/api | Render |
| Database | online_store | TiDB Cloud (Singapore) |

Gói miễn phí của Render cho service ngủ sau 15 phút không có truy cập. Lần gọi đầu tiên sau đó mất khoảng 50 giây để khởi động lại.

### Biến môi trường trên Render

| Biến | Giá trị |
| --- | --- |
| DB_HOST | gateway01.ap-southeast-1.prod.aws.tidbcloud.com |
| DB_PORT | 4000 |
| DB_NAME | online_store |
| DB_USER | tiền tố cluster + .root |
| DB_PASSWORD | mật khẩu TiDB |
| DB_DIALECT | mariadb |
| DB_SSL | true |
| CORS_ORIGINS | các tên miền Vercel, ngăn cách bằng dấu phẩy |
| JWT_SECRET | chuỗi ngẫu nhiên |
| JWT_REFRESH_SECRET | chuỗi ngẫu nhiên |
| CLOUDINARY_CLOUD_NAME | tên cloud |
| CLOUDINARY_API_KEY | khoá Cloudinary |
| CLOUDINARY_API_SECRET | khoá bí mật Cloudinary |

Không khai báo biến PORT, Render tự cấp.

### Biến môi trường trên Vercel

| Project | Biến | Giá trị |
| --- | --- | --- |
| Customer | NEXT_PUBLIC_API_URL | https://online-store-api-612c.onrender.com/api |
| Admin | VITE_API_URL | https://online-store-api-612c.onrender.com/api |

### Ghi chú kỹ thuật

- Thư viện mysql2 không bắt tay được với gateway của TiDB Cloud, báo lỗi HANDSHAKE_UNKNOWN_ERROR. Môi trường triển khai dùng DB_DIALECT=mariadb, driver này kết nối bình thường.
- TiDB Cloud bắt buộc kết nối mã hoá, nên DB_SSL=true. Ở máy cá nhân dùng MariaDB không cần mã hoá, để DB_SSL=false.
- Admin dùng Vite với outDir đặt là dist trong vite.config.mjs để khớp thư mục mặc định Vercel tìm.
- Cả Customer và Admin đều đọc địa chỉ API từ biến môi trường, có giá trị dự phòng là http://localhost:5000/api nên chạy ở máy không cần tạo file .env.

---

## Cấu trúc dự án

```
Project-Online-Store/
├── backend/      # REST API - port 5000
├── customer/     # Trang khách hàng - port 3000
└── admin/        # Trang quản trị - port 3001
```

Mỗi thư mục có file README riêng, hướng dẫn chi tiết:

- [Backend README](./backend/README.md)
- [Customer README](./customer/README.md)
- [Admin README](./admin/README.md)

---

## Yêu cầu hệ thống

| Phần mềm | Phiên bản       |
|----------|-----------------|
| Node.js  | 18 trở lên      |
| npm      | 9 trở lên       |
| MariaDB  | (đi kèm XAMPP)  |

---

## Hướng dẫn cài đặt

### Bước 1: Clone dự án

```bash
git clone <link-repo>
cd Project-Online-Store
```

### Bước 2: Bật MariaDB

Mở XAMPP, bấm **Start** ở dòng MySQL (chạy MariaDB). Tạo database tên `online_store`.

### Bước 3: Chạy Backend

```bash
cd backend
npm install
cp .env.example .env
npm run dev
```

Mở file `backend/.env` và điền đủ các biến, bao gồm 3 biến Cloudinary (`CLOUDINARY_CLOUD_NAME`, `CLOUDINARY_API_KEY`, `CLOUDINARY_API_SECRET`) dùng cho tính năng upload ảnh sản phẩm — xem chi tiết tại [Backend README](./backend/README.md#biến-môi-trường).

Backend chạy tại `http://localhost:5000`

### Bước 4: Chạy Customer

Mở terminal mới:

```bash
cd customer
npm install
npm run dev
```

Customer chạy tại `http://localhost:3000`

### Bước 5: Chạy Admin

Mở terminal mới:

```bash
cd admin
npm install
npm start
```

Admin chạy tại `http://localhost:3001`

> **Lưu ý**: Phải chạy Backend và MariaDB trước, nếu không Customer và Admin sẽ báo lỗi `Failed to fetch`.

---

## Luồng hoạt động

```
Khách hàng (Customer :3000) ──┐
                              ├──> Backend API (:5000) ──┬──> MariaDB (:3306)
Quản trị viên (Admin :3001) ──┘                          └──> Cloudinary (lưu ảnh sản phẩm)
```

**Phía khách hàng:**

1. Đăng ký / đăng nhập tài khoản (access token tự làm mới khi hết hạn)
2. Xem danh sách sản phẩm (sản phẩm mới thêm/sửa hiện ở đầu trang chủ), lọc theo danh mục
3. Xem chi tiết sản phẩm, thêm vào giỏ hàng
4. Thanh toán, tạo đơn hàng
5. Xem lại lịch sử đơn hàng (đơn mới nhất lên đầu)
6. Đăng xuất (xóa session phía server và token phía trình duyệt)

**Phía quản trị viên:**

1. Đăng nhập bằng tài khoản admin
2. Quản lý sản phẩm: thêm, sửa, xóa, tải ảnh lên Cloudinary ngay trong form (sản phẩm mới thêm/sửa hiện ở đầu danh sách)
3. Xem đơn hàng (mới nhất lên đầu), cập nhật trạng thái "Chờ xử lý" sang "Hoàn thành"
4. Xem danh sách khách hàng
5. Đăng xuất

---

## Công nghệ sử dụng

| Phần     | Công nghệ                                                 |
|----------|-----------------------------------------------------------|
| Backend  | Node.js, Express, Sequelize, MariaDB, JWT, bcryptjs, multer, Cloudinary |
| Customer | Next.js 16, TypeScript, Tailwind CSS, next-intl, next-themes |
| Admin    | React, Vite, CoreUI, Redux, React Router                 |

---

## Tác giả

- **Họ tên**: Võ Trọng Cảnh
- **Email**: canhtrong26@gmail.com
- **GitHub**: [canhtrong26-dev](https://github.com/canhtrong26-dev)

