const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api'

// Lấy token từ localStorage ở fe
const getToken = () => localStorage.getItem('adminToken')

const refreshAccessToken = async () => {
  const res = await fetch(`${API_URL}/auth/refresh?client=admin`, {
    method: 'POST',
    credentials: 'include', //để trình duyệt GỬI cookie lên, backend đọc từ req.cookies
  })

  if (res.ok) {
    const data = await res.json()
    localStorage.setItem('adminToken', data.accessToken)
    return data.accessToken
  }

  localStorage.removeItem('adminToken')
  return null
}

// Gọi API kèm access token; nếu bị 401 (token hết hạn) thì tự xin token mới rồi gọi lại, xin không được thì về trang login
const fetchWithAuth = async (url, options = {}) => {
  let res = await fetch(url, {
    ...options,
    credentials: 'include', //cần cho logout: xoá cookie cũng phải gửi cookie kèm
    headers: { ...options.headers, Authorization: `Bearer ${getToken()}` },
  })

  if (res.status === 401) {
    const newToken = await refreshAccessToken()

    if (newToken) {
      res = await fetch(url, {
        ...options,
        credentials: 'include', //cần cho logout: xoá cookie cũng phải gửi cookie kèm
        headers: { ...options.headers, Authorization: `Bearer ${newToken}` },
      })
    } else {
      window.location.href = '/#/login'
    }
  }

  return res
}

// Đăng xuất
export const logout = async () => {
  const res = await fetchWithAuth(`${API_URL}/auth/logout?client=admin`, {
    method: 'POST',
  })
  return res.json()
}

// Lấy sản phẩm theo trang, có thể tìm theo tên
export const getProducts = async ({ page = 1, limit = 10, search = '' } = {}) => {
  const query = new URLSearchParams({ page: String(page), limit: String(limit) })
  if (search) query.set('search', search)

  const res = await fetchWithAuth(`${API_URL}/products?${query.toString()}`)
  return res.json()
}

// Lấy danh mục (KHÔNG SỬA, vẫn dùng fetch thường)
export const getCategories = async () => {
  const res = await fetch(`${API_URL}/categories`)
  return res.json()
}

// Thêm sản phẩm
export const createProduct = async (data) => {
  const res = await fetchWithAuth(`${API_URL}/products`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  })
  return res.json()
}

// Sửa sản phẩm
export const updateProduct = async (id, data) => {
  const res = await fetchWithAuth(`${API_URL}/products/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  })
  return res.json()
}

// Xóa sản phẩm, trả thêm ok để biết thành công hay bị chặn
export const deleteProduct = async (id) => {
  const res = await fetchWithAuth(`${API_URL}/products/${id}`, {
    method: 'DELETE',
  })
  const data = await res.json()
  return { ok: res.ok, ...data }
}

// Lấy tất cả đơn hàng
export const getOrders = async () => {
  const res = await fetchWithAuth(`${API_URL}/orders`)
  return res.json()
}

// Cập nhật trạng thái đơn hàng
export const updateOrder = async (id, status) => {
  const res = await fetchWithAuth(`${API_URL}/orders/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ status }),
  })
  return res.json()
}

// Lấy tất cả khách hàng
export const getUsers = async () => {
  const res = await fetchWithAuth(`${API_URL}/users`)
  return res.json()
}

// Tải ảnh lên Cloudinary qua backend, nhận về link ảnh
export const uploadImage = async (file) => {
  const formData = new FormData()
  formData.append('image', file)

  const res = await fetchWithAuth(`${API_URL}/upload`, {
    method: 'POST',
    body: formData,
  })
  return res.json()
}
