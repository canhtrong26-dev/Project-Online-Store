import React from 'react'
import CIcon from '@coreui/icons-react'
import {
  cilSpeedometer,
  cilCart,
  cilPeople,
  cilList,
} from '@coreui/icons'
import { CNavItem, CNavTitle } from '@coreui/react'

const _nav = [
  {
    component: CNavItem,
    name: 'Dashboard',
    to: '/dashboard',
    icon: <CIcon icon={cilSpeedometer} customClassName="nav-icon" />,
  },
  {
    component: CNavTitle,
    name: 'Quản lý',
  },
  {
    component: CNavItem,
    name: 'Sản phẩm',
    to: '/products',
    icon: <CIcon icon={cilCart} customClassName="nav-icon" />,
  },
  {
    component: CNavItem,
    name: 'Đơn hàng',
    to: '/orders',
    icon: <CIcon icon={cilList} customClassName="nav-icon" />,
  },
  {
    component: CNavItem,
    name: 'Khách hàng',
    to: '/users',
    icon: <CIcon icon={cilPeople} customClassName="nav-icon" />,
  },
]

export default _nav