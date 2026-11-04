const API_URL = 'http://localhost:5000/api'

// Lấy token từ localStorage ở fe
const getToken = () => localStorage.getItem('adminToken')

const refreshAccessToken = async () => {
  const refreshToken = localStorage.getItem('adminRefreshToken')

  const res = await fetch(`${API_URL}/auth/refresh`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ refreshToken }),
  })

  if (res.ok) {
    const data = await res.json()
    localStorage.setItem('adminToken', data.accessToken)
    return data.accessToken
  }

  localStorage.removeItem('adminToken')
  localStorage.removeItem('adminRefreshToken')
  return null
}



const fetchWithAuth = async (url, options = {}) => {
  let res = await fetch(url, {
    ...options,
    headers: { ...options.headers, Authorization: `Bearer ${getToken()}` },
  })

  if (res.status === 401) {
    const newToken = await refreshAccessToken()

    if (newToken) {
      res = await fetch(url, {
        ...options,
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
  const res = await fetchWithAuth(`${API_URL}/auth/logout`, {
    method: 'POST',
  })
  return res.json()
}

// Lấy tất cả sản phẩm
export const getProducts = async () => {
  const res = await fetchWithAuth(`${API_URL}/products`)   
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

// Xóa sản phẩm
export const deleteProduct = async (id) => {
  const res = await fetchWithAuth(`${API_URL}/products/${id}`, {   
    method: 'DELETE',
  })
  return res.json()
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