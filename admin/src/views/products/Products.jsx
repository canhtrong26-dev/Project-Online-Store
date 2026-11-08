import { useEffect, useState } from 'react'
import {
  getProducts,
  getCategories,
  createProduct,
  updateProduct,
  deleteProduct,
  uploadImage,
} from '../../lib/api'

const Products = () => {
  const [products, setProducts] = useState([])
  const [categories, setCategories] = useState([])
  const [showForm, setShowForm] = useState(false)
  const [editProduct, setEditProduct] = useState(null)
  const [form, setForm] = useState({
    name: '',
    price: '',
    image_url: '',
    description: '',
    category_id: '',
  })
  const [search, setSearch] = useState('')
  const [uploading, setUploading] = useState(false)
  const [uploadError, setUploadError] = useState('')
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)

  //gọi lại API khi đổi trang hoặc gõ ô tìm kiếm, chờ 400ms cho người dùng gõ xong
  useEffect(() => {
    const timer = setTimeout(() => {
      fetchProducts()
    }, 400)
    return () => clearTimeout(timer)
  }, [page, search])

  //danh mục chỉ lấy 1 lần
  useEffect(() => {
    fetchCategories()
  }, [])

  //lấy danh sách sản phẩm theo trang, lọc theo tên
  const fetchProducts = async () => {
    const res = await getProducts({ page, limit: 10, search })
    if (res && Array.isArray(res.data)) {
      setProducts(res.data)
      setTotalPages(res.totalPages)
    }
  }

  //lấy danh sách danh mục
  const fetchCategories = async () => {
    const data = await getCategories()
    if (Array.isArray(data)) setCategories(data)
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
      category_id: product.category_id,
    })
    setShowForm(true)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  //chọn ảnh rồi tải lên Cloudinary sau đó tự điền link vào form
  const handleImageChange = async (e) => {
    const file = e.target.files[0]
    if (!file) return

    setUploading(true)
    setUploadError('')
    try {
      const data = await uploadImage(file)
      if (data.url) {
        setForm((prev) => ({ ...prev, image_url: data.url }))
      } else {
        setUploadError(data.message || 'Tải ảnh thất bại!')
      }
    } catch {
      setUploadError('Tải ảnh thất bại!')
    } finally {
      setUploading(false)
    }
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
      <div className="d-flex flex-wrap justify-content-between align-items-center gap-2 mb-3">
        <h2 className="mb-0">Quản lý Sản phẩm</h2>
        <button
          aria-label="Thêm sản phẩm mới"
          className="btn btn-primary"
          onClick={() => {
            setShowForm(true)
            setEditProduct(null)
            setUploadError('')
            setForm({ name: '', price: '', image_url: '', description: '', category_id: '' })
          }}
        >
          + Thêm sản phẩm
        </button>
      </div>

      <input
        aria-label="Tìm kiếm sản phẩm"
        className="form-control mb-3"
        placeholder="Tìm kiếm sản phẩm..."
        value={search}
        onChange={(e) => {
          setSearch(e.target.value)
          setPage(1)
        }}
      />

      {showForm && (
        <form onSubmit={handleSubmit} className="border p-3 mb-4 rounded">
          <h5>{editProduct ? 'Sửa sản phẩm' : 'Thêm sản phẩm'}</h5>
          <div className="mb-2">
            <input
              aria-label="Tên sản phẩm"
              className="form-control"
              placeholder="Tên sản phẩm"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              required
            />
          </div>
          <div className="mb-2">
            <input
              aria-label="Giá sản phẩm"
              className="form-control"
              placeholder="Giá"
              type="number"
              value={form.price}
              onChange={(e) => setForm({ ...form, price: e.target.value })}
              required
            />
          </div>

          <div className="mb-2">
            <label className="form-label">Ảnh sản phẩm</label>
            <input
              aria-label="Chọn ảnh sản phẩm"
              type="file"
              accept="image/*"
              className="form-control"
              onChange={handleImageChange}
              disabled={uploading}
            />
            {uploading && <div className="text-muted small mt-1">Đang tải ảnh lên...</div>}
            {uploadError && <div className="text-danger small mt-1">{uploadError}</div>}
            {form.image_url && !uploading && (
              <img
                src={form.image_url}
                alt="Xem trước ảnh sản phẩm"
                className="mt-2 rounded border"
                style={{ width: 120, height: 120, objectFit: 'cover' }}
              />
            )}
          </div>

          <div className="mb-2">
            <input
              aria-label="URL ảnh sản phẩm"
              className="form-control"
              placeholder="URL ảnh"
              value={form.image_url}
              onChange={(e) => setForm({ ...form, image_url: e.target.value })}
            />
          </div>
          <div className="mb-2">
            <input
              aria-label="Mô tả sản phẩm"
              className="form-control"
              placeholder="Mô tả"
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
            />
          </div>
          <div className="mb-2">
            <select
              aria-label="Chọn danh mục sản phẩm"
              className="form-control"
              value={form.category_id}
              onChange={(e) => setForm({ ...form, category_id: e.target.value })}
              required
            >
              <option value="">Chọn danh mục</option>
              {categories.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>
          <button
            aria-label={editProduct ? 'Cập nhật sản phẩm' : 'Thêm sản phẩm'}
            type="submit"
            className="btn btn-success me-2"
            disabled={uploading}
          >
            {uploading ? 'Đang tải ảnh...' : editProduct ? 'Cập nhật' : 'Thêm'}
          </button>
          <button
            aria-label="Hủy thêm/sửa sản phẩm"
            type="button"
            className="btn btn-secondary"
            onClick={() => setShowForm(false)}
          >
            Hủy
          </button>
        </form>
      )}

      <div className="table-responsive">
        <table className="table table-bordered">
          <thead>
            <tr>
              <th>ID</th>
              <th>Ảnh</th>
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
                <td>
                  {p.image_url && (
                    <img
                      src={p.image_url}
                      alt={p.name}
                      style={{ width: 60, height: 50, objectFit: 'cover' }}
                    />
                  )}
                </td>
                <td>{p.name}</td>
                <td>{Number(p.price).toLocaleString()}đ</td>
                <td>{p.Category?.name}</td>
                <td>
                  <button
                    aria-label={`Sửa sản phẩm ${p.name}`}
                    className="btn btn-warning btn-sm me-2"
                    onClick={() => handleEdit(p)}
                  >
                    Sửa
                  </button>
                  <button
                    aria-label={`Xóa sản phẩm ${p.name}`}
                    className="btn btn-danger btn-sm"
                    onClick={() => handleDelete(p.id)}
                  >
                    Xóa
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {totalPages > 1 && (
        <nav className="d-flex justify-content-center mt-3">
          <ul className="pagination mb-0">
            <li className={`page-item ${page === 1 ? 'disabled' : ''}`}>
              <button className="page-link" onClick={() => setPage(page - 1)}>
                &laquo;
              </button>
            </li>

            {Array.from({ length: totalPages }, (_, i) => i + 1).map((soTrang) => (
              <li key={soTrang} className={`page-item ${page === soTrang ? 'active' : ''}`}>
                <button className="page-link" onClick={() => setPage(soTrang)}>
                  {soTrang}
                </button>
              </li>
            ))}

            <li className={`page-item ${page === totalPages ? 'disabled' : ''}`}>
              <button className="page-link" onClick={() => setPage(page + 1)}>
                &raquo;
              </button>
            </li>
          </ul>
        </nav>
      )}
    </div>
  )
}

export default Products