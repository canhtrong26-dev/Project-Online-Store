import { useEffect, useState } from 'react'
import { getProducts, getOrders, getUsers } from '../../lib/api'

const Dashboard = () => {
  const [stats, setStats] = useState({
    products: 0,
    orders: 0,
    users: 0,
    revenue: 0
  })
  const [recentOrders, setRecentOrders] = useState([]) 

  useEffect(() => {
    fetchStats()
  }, [])

  const fetchStats = async () => {
    const [products, orders, users] = await Promise.all([
      getProducts(),
      getOrders({ page: 1, limit: 1000 }), //API đơn hàng đã phân trang, lấy 1 trang lớn để đủ đơn tính doanh thu
      getUsers()
    ])

    const danhSachDon = orders?.data || [] //getOrders trả object { data, total, ... }, lỗi hoặc chưa có data thì dùng mảng rỗng cho khỏi vỡ trang

    const revenue = danhSachDon.reduce((sum, o) => sum + Number(o.total), 0)

    setStats({
      products: products?.total || 0, //getProducts trả object { data, total, ... }
      orders: orders?.total || 0, //tổng số đơn lấy từ total của API phân trang
      users: Array.isArray(users) ? users.length : 0, //getUsers trả mảng, lỗi thì trả object nên phải kiểm tra
      revenue
    })

    setRecentOrders(danhSachDon.slice(0, 10)) //set 10 đơn gần nhất
  } 

  return (
    <div>
      <h2 className="mb-4 fw-normal">Dashboard</h2>

      <div className="row mb-4">
        <div className="col-12 col-sm-6 col-md-3 mb-3 mb-md-0">
          <div className="card p-3 h-100">
            <div className="small text-body-secondary mb-2">Sản phẩm</div>
            <div className="stat-figure fs-3 fw-medium">{stats.products}</div>
          </div>
        </div>
        <div className="col-12 col-sm-6 col-md-3 mb-3 mb-md-0">
          <div className="card p-3 h-100">
            <div className="small text-body-secondary mb-2">Đơn hàng</div>
            <div className="stat-figure fs-3 fw-medium">{stats.orders}</div>
          </div>
        </div>
        <div className="col-12 col-sm-6 col-md-3 mb-3 mb-md-0">
          <div className="card p-3 h-100">
            <div className="small text-body-secondary mb-2">Khách hàng</div>
            <div className="stat-figure fs-3 fw-medium">{stats.users}</div>
          </div>
        </div>
        <div className="col-12 col-sm-6 col-md-3 mb-3 mb-md-0">
          <div className="card p-3 h-100">
            <div className="small text-body-secondary mb-2">Doanh thu</div>
            <div className="stat-figure fs-3 fw-medium">{Number(stats.revenue).toLocaleString()}đ</div>
          </div>
        </div>
      </div>

      <div className="card">
        <div className="card-header">Đơn hàng gần đây</div>
        <div className="card-body">
          <div className="table-responsive">
            <table className="table table-bordered">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Khách hàng</th>
                  <th>Tổng tiền</th>
                  <th>Trạng thái</th>
                </tr>
              </thead>
              <tbody>
                {recentOrders.map((o) => (
                  <tr key={o.id}>
                    <td>{o.id}</td>
                    <td>{o.User?.name}</td>
                    <td>{Number(o.total).toLocaleString()}đ</td>
                    <td>
                      <span
                        className={`badge ${o.status === 'completed' ? 'bg-success' : 'bg-warning'}`}
                      >
                        {o.status === 'completed' ? 'Hoàn thành' : 'Chờ xử lý'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Dashboard