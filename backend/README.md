# Online Store — Backend API

## Công nghệ
- Node.js + Express
- Sequelize + MySQL
- JWT Authentication (Access Token + Refresh Token)
- bcryptjs

## Cài đặt và chạy

**1. Clone repo về máy:**
```bash
git clone https://gitlab.com/canh-dev/project-online-store.git
cd project-online-store/backend
```

**2. Cài dependencies:**
```bash
npm install
```

**3. Tạo file `.env` theo mẫu `.env.example`:**
```
DB_HOST=
DB_PORT=
DB_NAME=
DB_USER=
DB_PASSWORD=
JWT_SECRET=
JWT_REFRESH_SECRET=
```

**4. Tạo database trong MySQL:**
```sql
CREATE DATABASE online_store;
```

**5. Chạy server:**
```bash
npm run dev
```

Server chạy tại `http://localhost:5000`

## Cấu trúc thư mục
```
backend/
├── config/          # Kết nối database
├── controllers/     # Xử lý logic
├── middlewares/     # Kiểm tra JWT token
├── models/          # Định nghĩa bảng + quan hệ
├── routes/          # Định nghĩa API endpoints
├── .env.example     # Mẫu file .env
└── index.js         # Khởi động server
```

## API Endpoints

### Auth
| Method | URL | Mô tả |
|---|---|---|
| POST | /api/auth/register | Đăng ký |
| POST | /api/auth/login | Đăng nhập |
| POST | /api/auth/refresh-token | Làm mới token |
| POST | /api/auth/logout | Đăng xuất |

### Products
| Method | URL | Mô tả |
|---|---|---|
| GET | /api/products | Lấy tất cả |
| POST | /api/products | Thêm mới (admin) |
| PUT | /api/products/:id | Sửa (admin) |
| DELETE | /api/products/:id | Xoá (admin) |

### Categories
| Method | URL | Mô tả |
|---|---|---|
| GET | /api/categories | Lấy tất cả |
| POST | /api/categories | Thêm mới (admin) |
| PUT | /api/categories/:id | Sửa (admin) |
| DELETE | /api/categories/:id | Xoá (admin) |

### Users
| Method | URL | Mô tả |
|---|---|---|
| GET | /api/users | Lấy tất cả (admin) |
| PUT | /api/users/:id | Sửa (admin) |
| DELETE | /api/users/:id | Xoá (admin) |

### Orders
| Method | URL | Mô tả |
|---|---|---|
| GET | /api/orders | Lấy tất cả (admin) |
| POST | /api/orders | Tạo đơn hàng |
| PUT | /api/orders/:id | Cập nhật (admin) |
| DELETE | /api/orders/:id | Xoá (admin) |