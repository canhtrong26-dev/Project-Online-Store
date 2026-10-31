import React from 'react'

const Dashboard = React.lazy(() => import('./views/dashboard/Dashboard'))
const Products = React.lazy(() => import('./views/products/Products'))
const Orders = React.lazy(() => import('./views/orders/Orders'))
const Users = React.lazy(() => import('./views/users/Users'))

export const routes = [
  { path: '/', exact: true, name: 'Home' },
  { path: '/dashboard', name: 'Dashboard', element: Dashboard },
  { path: '/products', name: 'Sản phẩm', element: Products },
  { path: '/orders', name: 'Đơn hàng', element: Orders },
  { path: '/users', name: 'Khách hàng', element: Users },
]

export default routes