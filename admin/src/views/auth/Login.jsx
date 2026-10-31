import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

const API_URL = 'http://localhost:5000/api'

const Login = () => {
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')

  const handleLogin = async (e) => {
    e.preventDefault()
    const res = await fetch(`${API_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    })
      const data = await res.json()  

    if (data.accessToken) {
      if (data.user.role !== 'admin') {
        setError('Bạn không có quyền admin!')
        return
      }
      localStorage.setItem('adminToken', data.accessToken)
      navigate('/dashboard')
    } else {
      setError(data.message || 'Đăng nhập thất bại!')
    }
  }

  return (
    <div className="min-vh-100 d-flex align-items-center justify-content-center">
      <div className="card p-4" style={{ width: 400 }}>
        <h4 className="mb-4 text-center">Admin Login</h4>
        {error && <div className="alert alert-danger">{error}</div>} 
        <form onSubmit={handleLogin}>
          <div className="mb-3">
            <label>Email</label>
            <input
              type="email"
              className="form-control"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div className="mb-3">
            <label>Password</label>
            <input
              type="password"
              className="form-control"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <button type="submit" className="btn btn-primary w-100">
            Đăng nhập
          </button>
        </form>
      </div>
    </div>
  )
}

export default Login