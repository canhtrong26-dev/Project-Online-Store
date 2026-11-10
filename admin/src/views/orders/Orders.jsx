import { useEffect, useState } from 'react'
import { getOrders, updateOrder } from '../../lib/api'

const Orders = () => {
  const [orders, setOrders] = useState([])
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)

  useEffect(() => {
    fetchOrders()
  }, [page])   // đổi trang thì gọi lại

  const fetchOrders = async () => {
    const res = await getOrders({ page, limit: 10 })
    if (res && Array.isArray(res.data)) {
      setOrders(res.data)
      setTotalPages(res.totalPages)
    }
  }

  const handleComplete = async (id) => {
    if (window.confirm('Xác nhận hoàn thành đơn hàng này?')) {
      await updateOrder(id, 'completed')
      fetchOrders()
    }
  }

  return (
    <div>
      <h2 className="mb-3">Quản lý Đơn hàng</h2>
      <div className="table-responsive">
        <table className="table table-bordered">
          <thead>
            <tr>
              <th>ID</th>
              <th>Khách hàng</th>
              <th>Người nhận</th>
              <th>SĐT</th>
              <th>Địa chỉ giao hàng</th>
              <th>Tổng tiền</th>
              <th>Trạng thái</th>
              <th>Thao tác</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((o) => (
              <tr key={o.id}>
                <td>{o.id}</td>
                <td>{o.User?.name}</td>
                <td>{o.shipping_name || '—'}</td>
                <td>{o.shipping_phone || '—'}</td>
                <td>{o.shipping_address || '—'}</td>
                <td>{Number(o.total).toLocaleString()}đ</td>
                <td>
                  <span
                    className={`badge ${o.status === 'completed' ? 'bg-success' : 'bg-warning'}`}
                  >
                    {o.status === 'completed' ? 'Hoàn thành' : 'Chờ xử lý'}
                  </span>
                </td>
                <td>
                  {o.status === 'pending' && (
                    <button aria-label={`Hoàn thành đơn hàng #${o.id}`} className="btn btn-success btn-sm" onClick={() => handleComplete(o.id)}>
                      Hoàn thành
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* thanh phân trang */}
      {totalPages > 1 && (
        <nav className="d-flex justify-content-center mt-3">
          <ul className="pagination">
            <li className={`page-item ${page === 1 ? 'disabled' : ''}`}>
              <button className="page-link" onClick={() => setPage(page - 1)}>«</button>
            </li>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((soTrang) => (
              <li key={soTrang} className={`page-item ${page === soTrang ? 'active' : ''}`}>
                <button className="page-link" onClick={() => setPage(soTrang)}>{soTrang}</button>
              </li>
            ))}
            <li className={`page-item ${page === totalPages ? 'disabled' : ''}`}>
              <button className="page-link" onClick={() => setPage(page + 1)}>»</button>
            </li>
          </ul>
        </nav>
      )}
    </div>
  )
}

export default Orders
