# Online Store — Admin

Trang quản trị dành cho người bán, xây dựng dựa trên template [CoreUI Free React Admin Template](https://github.com/coreui/coreui-free-react-admin-template) (MIT License).

---

## Mục lục

1. [Tính năng](#tính-năng)
2. [Công nghệ](#công-nghệ)
3. [Cài đặt](#cài-đặt)
4. [Các trang](#các-trang)
5. [Cấu trúc thư mục](#cấu-trúc-thư-mục)
6. [Thêm trang mới](#thêm-trang-mới)
7. [Nguồn tham khảo](#nguồn-tham-khảo)

---

## Tính năng

- Đăng nhập bằng tài khoản admin
- Dashboard tổng quan
- Quản lý sản phẩm: thêm, sửa, xóa
- Quản lý đơn hàng: xem và cập nhật trạng thái
- Xem danh sách khách hàng
- Sidebar thu gọn / mở rộng

---

## Công nghệ

| Thư viện     | Mục đích                          |
|--------------|-----------------------------------|
| React        | Thư viện giao diện                |
| Vite         | Công cụ build và chạy dev         |
| CoreUI       | Bộ component giao diện admin      |
| Redux        | Lưu trạng thái sidebar            |
| React Router | Điều hướng giữa các trang         |

---

## Cài đặt

> Cần chạy Backend trước (xem [Backend README](../backend/README.md)).

**1. Cài thư viện**

```bash
npm install
```

**2. Chạy dự án**

```bash
npm start
```

Mở trình duyệt tại `http://localhost:3001`

---

## Các trang

| Đường dẫn     | Trang       | Chức năng                                    |
|---------------|-------------|------------------------------------------------|
| /#/login      | Đăng nhập   | Đăng nhập bằng tài khoản có role admin       |
| /#/dashboard  | Dashboard   | Thống kê tổng quan                           |
| /#/products   | Sản phẩm    | Thêm, sửa, xóa sản phẩm                      |
| /#/orders     | Đơn hàng    | Chuyển trạng thái "Chờ xử lý" → "Hoàn thành" |
| /#/users      | Khách hàng  | Xem danh sách khách hàng                     |

Đường dẫn các trang quản lý được khai báo trong `src/routes.js`; đường dẫn `/login` được khai báo riêng trong `src/App.jsx` (nằm ngoài sidebar).

Admin lưu token đăng nhập trong localStorage với key `adminToken` (khác với Customer, dùng key `accessToken`).

---

## Cấu trúc thư mục

```
admin/
├── src/
│   ├── components/
│   │   ├── AppHeader.jsx      # Thanh trên cùng
│   │   ├── AppSidebar.jsx     # Thanh menu bên trái
│   │   └── AppFooter.jsx      # Chân trang
│   ├── views/
│   │   ├── auth/
│   │   │   └── Login.jsx      # Trang đăng nhập admin thật đang dùng
│   │   ├── dashboard/
│   │   ├── products/
│   │   ├── orders/
│   │   └── users/
│   ├── layout/                # Khung giao diện chung
│   ├── lib/
│   │   └── api.js             # Các hàm gọi API backend
│   ├── assets/                # Hình ảnh, icon, brand
│   ├── scss/                  # File style
│   ├── _nav.jsx                # Danh sách menu sidebar
│   ├── routes.js               # Khai báo đường dẫn các trang quản lý
│   ├── store.js                 # Redux store
│   ├── App.jsx
│   └── index.jsx
└── index.html
```

Ghi chú: các thư mục `src/views/components/`, `src/views/forms/`, `src/views/icons/`, `src/views/widgets/`, `src/views/authentication/` là các trang mẫu còn sót lại từ CoreUI Free React Admin Template, không được dùng trong dự án thật (bao gồm cả `src/views/authentication/login/Login.jsx`, là bản demo, khác với trang đăng nhập thật nằm ở `src/views/auth/Login.jsx`).

---

## Thêm trang mới

**Bước 1**: tạo component trong `src/views/`

```jsx
// src/views/categories/Categories.jsx
const Categories = () => {
  return <h1>Quản lý danh mục</h1>
}
export default Categories
```

**Bước 2**: khai báo đường dẫn trong `src/routes.js`

```js
const Categories = React.lazy(() => import('./views/categories/Categories'))

{ path: '/categories', name: 'Danh mục', element: Categories }
```

**Bước 3**: thêm vào menu trong `src/_nav.jsx`

```jsx
{
  component: CNavItem,
  name: 'Danh mục',
  to: '/categories',
}
```

---

## Nguồn tham khảo

Giao diện admin được xây dựng dựa trên template mã nguồn mở:

| Thông tin   | Chi tiết                                                                                              |
|-------------|-------------------------------------------------------------------------------------------------------|
| Tên         | CoreUI Free React Admin Template                                                                      |
| Tác giả     | creativeLabs (CoreUI)                                                                                 |
| GitHub      | [coreui/coreui-free-react-admin-template](https://github.com/coreui/coreui-free-react-admin-template) |
| Trang chủ   | [coreui.io](https://coreui.io)                                                                        |
| Giấy phép   | MIT License                                                                                           |

### Những phần đã tùy chỉnh so với template gốc

- Đổi logo CoreUI thành tên "Online Store" ở sidebar
- Xóa các icon thông báo, tin nhắn, avatar ở header
- Đổi nội dung footer
- Viết lại menu sidebar: Dashboard, Sản phẩm, Đơn hàng, Khách hàng
- Thêm các trang quản lý kết nối với Backend API
