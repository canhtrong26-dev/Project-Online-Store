const API_URL = 'http://localhost:5000/api';

//xem tất cả sản phẩm
export const getProducts = async () => {
  const res = await fetch(`${API_URL}/products`);
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
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  return res.json();
};


//gọi API đăng ký
export const register = async (data: object) => {
  const res = await fetch(`${API_URL}/auth/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  return res.json();
};


//gọi API tạo đơn hàng
export const createOrder = async (data: object, token: string) => {
  const res = await fetch(`${API_URL}/orders`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
    body: JSON.stringify(data),
  });
  return res.json();
};