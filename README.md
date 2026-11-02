# Online Store — Capstone Project

Dự án full-stack thương mại điện tử, gồm 3 phần:

- **Backend**: REST API (Node.js + Express + Sequelize + MariaDB)
- **Customer**: trang mua sắm cho khách hàng (Next.js 16)
- **Admin**: trang quản trị cho người bán (CoreUI React)

---

## Mục lục

1. [Cấu trúc dự án](#cấu-trúc-dự-án)
2. [Yêu cầu hệ thống](#yêu-cầu-hệ-thống)
3. [Hướng dẫn cài đặt](#hướng-dẫn-cài-đặt)
4. [Luồng hoạt động](#luồng-hoạt-động)
5. [Công nghệ sử dụng](#công-nghệ-sử-dụng)
6. [Tác giả](#tác-giả)

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
                              ├──> Backend API (:5000) ──> MariaDB (:3306)
Quản trị viên (Admin :3001) ──┘
```

**Phía khách hàng:**

1. Đăng ký / đăng nhập tài khoản
2. Xem danh sách sản phẩm, lọc theo danh mục
3. Xem chi tiết sản phẩm, thêm vào giỏ hàng
4. Thanh toán, tạo đơn hàng
5. Xem lại lịch sử đơn hàng

**Phía quản trị viên:**

1. Đăng nhập bằng tài khoản admin
2. Quản lý sản phẩm (thêm, sửa, xóa)
3. Xem đơn hàng, cập nhật trạng thái "Chờ xử lý" sang "Hoàn thành"
4. Xem danh sách khách hàng

---

## Công nghệ sử dụng

| Phần     | Công nghệ                                                 |
|----------|-----------------------------------------------------------|
| Backend  | Node.js, Express, Sequelize, MariaDB, JWT, bcryptjs       |
| Customer | Next.js 16, TypeScript, Tailwind CSS, next-intl, next-themes |
| Admin    | React, Vite, CoreUI, Redux, React Router                 |

---

## Tác giả

- **Họ tên**: Võ Trọng Cảnh
- **Email**: canhtrong26@gmail.com
- **GitHub**: [canhtrong26-dev](https://github.com/canhtrong26-dev)

