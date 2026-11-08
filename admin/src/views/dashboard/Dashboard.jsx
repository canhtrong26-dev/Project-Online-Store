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
      getOrders(),
      getUsers()
    ])

    const revenue = orders.reduce((sum, o) => sum + Number(o.total), 0)

    setStats({
      products: products.total,
      orders: orders.length,
      users: users.length,
      revenue
    })

    setRecentOrders(orders.slice(0, 10)) //set 10 đơn gần nhất
  } 

  return (
    <div>
      <h2 className="mb-4">Dashboard</h2>

      <div className="row mb-4">
        <div className="col-12 col-sm-6 col-md-3 mb-3 mb-md-0">
          <div className="card text-center p-3">
            <h5>Sản phẩm</h5>
            <h2>{stats.products}</h2>
          </div>
        </div>
        <div className="col-12 col-sm-6 col-md-3 mb-3 mb-md-0">
          <div className="card text-center p-3">
            <h5>Đơn hàng</h5>
            <h2>{stats.orders}</h2>
          </div>
        </div>
        <div className="col-12 col-sm-6 col-md-3 mb-3 mb-md-0">
          <div className="card text-center p-3">
            <h5>Khách hàng</h5>
            <h2>{stats.users}</h2>
          </div>
        </div>
        <div className="col-12 col-sm-6 col-md-3 mb-3 mb-md-0">
          <div className="card text-center p-3">
            <h5>Doanh thu</h5>
            <h2>{Number(stats.revenue).toLocaleString()}đ</h2>
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