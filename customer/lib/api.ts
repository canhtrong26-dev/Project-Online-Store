const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

//lấy sản phẩm theo trang, có thể lọc theo danh mục và tìm theo tên
export const getProducts = async (
  params: {
    page?: number;
    limit?: number;
    category_id?: number | null;
    search?: string;
  } = {},
) => {
  const query = new URLSearchParams();
  query.set("page", String(params.page ?? 1));
  query.set("limit", String(params.limit ?? 8));
  if (params.category_id) query.set("category_id", String(params.category_id));
  if (params.search) query.set("search", params.search);

  const res = await fetch(`${API_URL}/products?${query.toString()}`);
  return res.json();
};

//xem tất cả danh mục
export const getCategories = async () => {
  const res = await fetch(`${API_URL}/categories`);
  return res.json();
};

//gọi API đăng nhập
export const login = async (data: object) => {
  const res = await fetch(`${API_URL}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include", //để trình duyệt nhận và lưu cookie từ be
    body: JSON.stringify(data),
  });
  return res.json();
};

//gọi API đăng ký
export const register = async (data: object) => {
  const res = await fetch(`${API_URL}/auth/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  return res.json();
};

//tạo đơn hàng
export const createOrder = async (data: object, token: string) => {
  const res = await fetchWithAuth(`${API_URL}/orders`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });
  return res.json();
};

// xem đơn hàng của user đang login
export const getMyOrders = async (token: string) => {
  const res = await fetchWithAuth(`${API_URL}/orders/my-orders`);
  return res.json();
};

//xin accessToken hết hạn bằng refreshToken
const refreshAccessToken = async () => {
  //không còn đọc refreshToken từ localStorage nữa, trình duyệt tự gửi cookie
  const res = await fetch(`${API_URL}/auth/refresh`, {
    method: "POST",
    credentials: "include", //để trình duyệt gửi cookie refreshToken lên, backend đọc từ req.cookies
  });

  if (res.ok) {
    const data = await res.json();
    localStorage.setItem("accessToken", data.accessToken);
    return data.accessToken;
  }

  //nếu refresh hết hạn hoặc không hợp lệ thì nhảy xuống đây
  localStorage.removeItem("accessToken");
  localStorage.removeItem("user");
  return null;
};

//fetch có tự gắn token + tự refresh khi hết hạn
const fetchWithAuth = async (url: string, options: RequestInit = {}) => {
  //Lấy accessToken hiện tại sau khi đã xử lí ở bước trên
  const token = localStorage.getItem("accessToken");

  //gọi API lần 1, tự gắn header Authorization
  let res = await fetch(url, {
    ...options,
    credentials: "include",//cần cho logout: trình duyệt chỉ chịu xoá cookie nếu yêu cầu có gửi kèm cookie
    headers: {
      ...(options.headers as Record<string, string>),
      Authorization: `Bearer ${token}`,
    },
  });

  // bị 401 và token hết hạn thì xin token mới
  if (res.status === 401) {
    const newToken = await refreshAccessToken(); //gọi lại hàm đã được xử lí ở bước trên để lấy accessToken mới từ refreshToken

    if (newToken) {
      //Có token mới thì gọi lại API lần 2
      res = await fetch(url, {
        ...options,
        credentials: "include", //cần cho logout: trình duyệt chỉ chịu xoá cookie nếu yêu cầu có gửi kèm cookie
        headers: {
          ...(options.headers as Record<string, string>),
          Authorization: `Bearer ${newToken}`,
        },
      });
    } else {
      //refreshToken cũng hết hạn thì chuyển sang trang đăng nhập
      const locale = window.location.pathname.split("/")[1] || "vi";
      window.location.href = `/${locale}/login`;
    }
  }

  //trả kết quả cho hàm gọi (createOrder, getMyOrders)
  return res;
};

//xóa session (refreshToken) trong database
export const logout = async () => {
  const res = await fetchWithAuth(`${API_URL}/auth/logout`, {
    method: "POST",
  });
  return res.json();
};
