# Online Store — Customer

Trang mua sắm dành cho khách hàng, xây dựng bằng Next.js 16 App Router.

---

## Mục lục

1. [Tính năng](#tính-năng)
2. [Công nghệ](#công-nghệ)
3. [Cài đặt](#cài-đặt)
4. [Các trang](#các-trang)
5. [Cấu trúc thư mục](#cấu-trúc-thư-mục)
6. [Xác thực và làm mới token](#xác-thực-và-làm-mới-token)
7. [Đa ngôn ngữ (i18n)](#đa-ngôn-ngữ-i18n)
8. [Lỗi thường gặp](#lỗi-thường-gặp)

---

## Tính năng

- Đăng ký, đăng nhập, đăng xuất (đăng xuất xóa session phía server, không chỉ xóa token phía trình duyệt)
- Tự làm mới access token khi hết hạn, không cần đăng nhập lại
- Xem sản phẩm, lọc theo danh mục (sản phẩm mới thêm/sửa luôn hiện ở đầu trang chủ)
- Xem chi tiết sản phẩm
- Giỏ hàng lưu trong localStorage
- Thanh toán và tạo đơn hàng
- Xem lịch sử đơn hàng
- Chuyển đổi ngôn ngữ Tiếng Việt / English
- Chế độ sáng / tối (Dark mode)
- Kiểm tra dữ liệu form
- Menu dạng hamburger khi xem trên điện thoại

---

## Công nghệ

| Thư viện              | Mục đích                     |
|-----------------------|------------------------------|
| Next.js 16            | Framework chính (App Router) |
| TypeScript            | Kiểu dữ liệu                 |
| Tailwind CSS          | Giao diện                    |
| next-intl             | Đa ngôn ngữ                  |
| next-themes           | Dark mode                    |
| react-hook-form + zod | Kiểm tra dữ liệu form        |
| react-hot-toast       | Hiện thông báo               |
| react-icons           | Icon                         |

---

## Cài đặt

> Cần chạy Backend trước (xem [Backend README](../backend/README.md)).

**1. Cài thư viện**

```bash
npm install
```

**2. Chạy dự án**

```bash
npm run dev
```

Mở trình duyệt tại `http://localhost:3000` (tự chuyển sang `/vi`).

---

## Các trang

| Đường dẫn               | Trang               | Cần đăng nhập |
|-------------------------|---------------------|---------------|
| /[locale]               | Trang chủ           | Không         |
| /[locale]/product/[id]  | Chi tiết sản phẩm   | Không         |
| /[locale]/register      | Đăng ký             | Không         |
| /[locale]/login         | Đăng nhập           | Không         |
| /[locale]/cart          | Giỏ hàng            | Không         |
| /[locale]/checkout      | Thanh toán          | Có            |
| /[locale]/order         | Đơn hàng của tôi    | Có            |

`[locale]` là `vi` hoặc `en`. Ví dụ: `/vi/cart`, `/en/login`.

---

## Cấu trúc thư mục

```
customer/
├── app/
│   └── [locale]/
│       ├── layout.tsx          # Layout chung, bọc Provider
│       ├── page.tsx            # Trang chủ
│       └── (pages)/
│           ├── register/
│           ├── login/
│           ├── cart/
│           ├── checkout/
│           ├── order/
│           └── product/[id]/
├── components/
│   └── Header.tsx              # Thanh menu, nút đổi ngôn ngữ, dark mode
├── lib/
│   └── api.ts                  # Các hàm gọi API backend
├── messages/
│   ├── vi.json                 # Bản dịch tiếng Việt
│   └── en.json                 # Bản dịch tiếng Anh
├── i18n.ts                     # Cấu hình next-intl
├── middleware.ts               # Điều hướng theo ngôn ngữ
└── next.config.ts
```

---

## Xác thực và làm mới token

`lib/api.ts` có hàm `fetchWithAuth` dùng để gọi các API cần đăng nhập (`createOrder`, `getMyOrders`, `logout`...). Hàm này tự gắn header `Authorization: Bearer <accessToken>` lấy từ `localStorage`.

Nếu request bị lỗi 401 (access token hết hạn), `fetchWithAuth` tự gọi `POST /api/auth/refresh` (bằng `fetch` thường, không qua `fetchWithAuth`) để lấy access token mới, lưu lại vào `localStorage`, rồi gửi lại request vừa thất bại. Nếu làm mới cũng thất bại (refresh token hết hạn), toàn bộ token trong `localStorage` bị xóa và trang tự chuyển về `/[locale]/login`.

Khi người dùng bấm Đăng xuất (`components/Header.tsx`): gọi `POST /api/auth/logout` để server xóa session trong database, sau đó xóa `accessToken`, `refreshToken`, `user` khỏi `localStorage` (dùng `try/finally` để đảm bảo luôn xóa dù API lỗi).

---

## Đa ngôn ngữ (i18n)

### Cách hoạt động

```
1. Người dùng vào /en/login
2. middleware.ts đọc "en" từ URL
3. i18n.ts nạp file messages/en.json
4. Trong component, gọi t('title') -> hiện "Login"
```

### Thêm một câu dịch mới

**Bước 1**: thêm key vào cả 2 file

```json
// messages/vi.json
{ "cart": { "title": "Giỏ hàng" } }

// messages/en.json
{ "cart": { "title": "Cart" } }
```

**Bước 2**: dùng trong component

```tsx
const t = useTranslations('cart');
return <h1>{t('title')}</h1>;
```

---

## Lỗi thường gặp

| Lỗi                                  | Nguyên nhân                | Cách sửa                              |
|--------------------------------------|----------------------------|---------------------------------------|
| `Failed to fetch`                    | Backend chưa chạy          | Chạy `npm run dev` trong `backend/`   |
| `ECONNREFUSED 3306` (ở backend)      | MySQL chưa bật             | Mở XAMPP, Start MySQL                 |
| `Couldn't find next-intl config`     | Thiếu plugin               | Kiểm tra `createNextIntlPlugin` trong `next.config.ts` |
| `Unable to make a module from invalid JSON` | File JSON sai cú pháp | Kiểm tra dấu phẩy, ngoặc trong `messages/*.json` |