import { useEffect, useState } from 'react'
import { getProducts, getCategories, createProduct, updateProduct, deleteProduct } from '../../lib/api'

const Products = () => {
  const [products, setProducts] = useState([])
  const [categories, setCategories] = useState([])
  const [showForm, setShowForm] = useState(false)
  const [editProduct, setEditProduct] = useState(null)
  const [form, setForm] = useState({
    name: '', price: '', image_url: '', description: '', category_id: ''
  })

  useEffect(() => {
    fetchProducts()
    fetchCategories()
  }, [])

  //lấy danh sách sản phẩm
  const fetchProducts = async () => {
    const data = await getProducts()
    setProducts(data)
  }

  //lấy danh sách danh mục
  const fetchCategories = async () => {
    const data = await getCategories()
    setCategories(data)
  }

  const handleDelete = async (id) => {
    if (window.confirm('Xóa sản phẩm này?')) {
      await deleteProduct(id)
      fetchProducts()
    }
  }

  //chỉnh sửa sản phẩm
  const handleEdit = (product) => {
    setEditProduct(product)
    setForm({
      name: product.name,
      price: product.price,
      image_url: product.image_url,
      description: product.description,
      category_id: product.category_id
    })
    setShowForm(true)
  }

  //thêm hoặc cập nhật sản phẩm
  const handleSubmit = async (e) => {
    e.preventDefault()
    if (editProduct) {
      await updateProduct(editProduct.id, form)
    } else {
      await createProduct(form)
    }
    setShowForm(false)
    setEditProduct(null)
    setForm({ name: '', price: '', image_url: '', description: '', category_id: '' })
    fetchProducts()
  }

  return (
    <div>
      <div className="d-flex justify-content-between mb-3">
        <h2>Quản lý Sản phẩm</h2>
        <button className="btn btn-primary" onClick={() => { setShowForm(true); setEditProduct(null); setForm({ name: '', price: '', image_url: '', description: '', category_id: '' }) }}>
          + Thêm sản phẩm
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="border p-3 mb-4 rounded">
          <h5>{editProduct ? 'Sửa sản phẩm' : 'Thêm sản phẩm'}</h5>
          <div className="mb-2">
            <input className="form-control" placeholder="Tên sản phẩm" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
          </div>
          <div className="mb-2">
            <input className="form-control" placeholder="Giá" type="number" value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} required />
          </div>
          <div className="mb-2">
            <input className="form-control" placeholder="URL ảnh" value={form.image_url} onChange={(e) => setForm({ ...form, image_url: e.target.value })} />
          </div>
          <div className="mb-2">
            <input className="form-control" placeholder="Mô tả" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
          </div>
          <div className="mb-2">
            <select className="form-control" value={form.category_id} onChange={(e) => setForm({ ...form, category_id: e.target.value })} required>
              <option value="">Chọn danh mục</option>
                {categories.map((c) => (
              <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </select>
          </div>
          <button type="submit" className="btn btn-success me-2">{editProduct ? 'Cập nhật' : 'Thêm'}</button>
          <button type="button" className="btn btn-secondary" onClick={() => setShowForm(false)}>Hủy</button>
        </form>
      )}

      <table className="table table-bordered">
        <thead>
          <tr>
            <th>ID</th>
            <th>Tên</th>
            <th>Giá</th>
            <th>Danh mục</th>
            <th>Thao tác</th>
          </tr>
        </thead>
        <tbody>
          {products.map((p) => (
            <tr key={p.id}>
              <td>{p.id}</td>
              <td>{p.name}</td>
              <td>{Number(p.price).toLocaleString()}đ</td>
              <td>{p.Category?.name}</td>
              <td>
                <button className="btn btn-warning btn-sm me-2" onClick={() => handleEdit(p)}>Sửa</button>
                <button className="btn btn-danger btn-sm" onClick={() => handleDelete(p.id)}>Xóa</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default Products