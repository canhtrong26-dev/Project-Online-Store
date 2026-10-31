const API_URL = 'http://localhost:5000/api'

// Lấy token từ localStorage ở fe
const getToken = () => localStorage.getItem('adminToken')

// Lấy tất cả sản phẩm
export const getProducts = async () => {
  const res = await fetch(`${API_URL}/products`)
  return res.json()
}



  // Lấy danh mục
export const getCategories = async () => {
  const res = await fetch(`${API_URL}/categories`)
  return res.json()
}

// Thêm sản phẩm
export const createProduct = async (data) => {
  const res = await fetch(`${API_URL}/products`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${getToken()}`
    },
    body: JSON.stringify(data)
  })
  return res.json()
}

// Sửa sản phẩm
export const updateProduct = async (id, data) => {
  const res = await fetch(`${API_URL}/products/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${getToken()}`
    },
    body: JSON.stringify(data)
  })
  return res.json()
}

// Xóa sản phẩm
export const deleteProduct = async (id) => {
  const res = await fetch(`${API_URL}/products/${id}`, {
    method: 'DELETE',
    headers: { 'Authorization': `Bearer ${getToken()}` }
  })
  return res.json()
}