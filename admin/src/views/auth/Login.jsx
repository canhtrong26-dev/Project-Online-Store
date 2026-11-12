import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api'

const Login = () => {
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')

   const handleLogin = async (e) => {
    e.preventDefault()
    const res = await fetch(`${API_URL}/auth/login?client=admin`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include', //để trình duyệt NHẬN và lưu cookie adminRefreshToken
      body: JSON.stringify({ email, password }),
    })
    const data = await res.json()

    if (data.accessToken) {
      if (data.user.role !== 'admin') {
        setError('Bạn không có quyền admin')
        return
      }
      localStorage.setItem('adminToken', data.accessToken)
      navigate('/dashboard')
    } else {
      setError(data.message || 'Đăng nhập thất bại')
    }
  }

  return (
    <div className="min-vh-100 d-flex align-items-center justify-content-center px-3">
      <div className="card p-4 w-100" style={{ maxWidth: 400 }}>
        <h4 className="mb-4 text-center">Admin Login</h4>
        {error && <div className="alert alert-danger">{error}</div>}
        <form onSubmit={handleLogin}>
          <div className="mb-3">
            <label>Email</label>
            <input
              aria-label="Email"
              type="email"
              className="form-control"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div className="mb-3">
            <label>Password</label>
            <input
              aria-label="Password"
              type="password"
              className="form-control"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <button
            aria-label="Đăng nhập vào trang quản trị"
            type="submit"
            className="btn btn-primary w-100"
          >
            Đăng nhập
          </button>
        </form>
      </div>
    </div>
  )
}

export default Login
