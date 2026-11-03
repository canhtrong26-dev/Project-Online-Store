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

//tạo đơn hàng
export const createOrder = async (data: object, token: string) => {
  const res = await fetchWithAuth(`${API_URL}/orders`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      
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
//lấy refreshToken từ trình duyệt đã lưu lúc login
  const refreshToken = localStorage.getItem('refreshToken'); 

  const res = await fetch(`${API_URL}/auth/refresh`, {       
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ refreshToken }),                
  });

    if (res.ok) {                                               
    const data = await res.json();                           
    localStorage.setItem('accessToken', data.accessToken);   
    return data.accessToken; //nếu ok hết thì lưu accessToken vào localStorage (ghi đè accessToken cũ đã hết hạn)
  }

    localStorage.removeItem('accessToken');                   
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('user');
    return null;
  };


//fetch có tự gắn token + tự refresh khi hết hạn
const fetchWithAuth = async (url: string, options: RequestInit = {}) => {
  //Lấy accessToken hiện tại sau khi đã xử lí ở bước trên
  const token = localStorage.getItem('accessToken');

  //gọi API lần 1, tự gắn header Authorization
  let res = await fetch(url, {
    ...options,
    headers: {
      ...(options.headers as Record<string, string>),
      Authorization: `Bearer ${token}`,
    },
  });

  // bị 401 và token hết hạn thì xin token mới
  if (res.status === 401) {
    const newToken = await refreshAccessToken();   //gọi lại hàm đã được xử lí ở bước trên để lấy accessToken mới từ refreshToken 

    if (newToken) {

      //Có token mới thì gọi lại API lần 2
      res = await fetch(url, {
        ...options,
        headers: {
          ...(options.headers as Record<string, string>),
          Authorization: `Bearer ${newToken}`,
        },
      });
    } else {
      //refreshToken cũng hết hạn thì chuyển sang trang đăng nhập
      const locale = window.location.pathname.split('/')[1] || 'vi';
      window.location.href = `/${locale}/login`;
    }
  }

  //trả kết quả cho hàm gọi (createOrder, getMyOrders)
  return res;
};
