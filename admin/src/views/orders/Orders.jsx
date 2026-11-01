import { useEffect, useState } from 'react'
import { getOrders, updateOrder } from '../../lib/api'

const Orders = () => {
  const [orders, setOrders] = useState([])

  useEffect(() => {
    fetchOrders()
  }, [])

  const fetchOrders = async () => { //lấy tất cả đơn hàng rồi set cho orders
    const data = await getOrders()
    setOrders(data)
  }

  const handleComplete = async (id) => {
    if (window.confirm('Xác nhận hoàn thành đơn hàng này?')) {
      await updateOrder(id, 'completed') //xác nhận và cập nhật lại đơn hàng
      fetchOrders()
    }
  }

  return (
    <div>
      <h2>Quản lý Đơn hàng</h2>
      <table className="table table-bordered">
        <thead>
          <tr>
            <th>ID</th>
            <th>Khách hàng</th>
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
              <td>{Number(o.total).toLocaleString()}đ</td>
              <td>
                <span className={`badge ${o.status === 'completed' ? 'bg-success' : 'bg-warning'}`}>
                  {o.status === 'completed' ? 'Hoàn thành' : 'Chờ xử lý'}
                </span>
              </td>
              <td>
                {o.status === 'pending' && (
                  <button className="btn btn-success btn-sm" onClick={() => handleComplete(o.id)}>
                    Hoàn thành
                  </button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default Orders