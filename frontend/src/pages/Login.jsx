import { useState } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import { api } from '../api/auth'
import { getMe } from '../api/users'
import './Auth.css'

export default function Login() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const sessionExpired = searchParams.get('session') === 'expired'

  const [form, setForm] = useState({ username: '', password: '' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value })
    setError('')
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setLoading(true)
    setError('')
    try {
      const data = await api.login(form.username, form.password)
      localStorage.setItem('token', data.access_token)

      const user = await getMe()
      if (!user.organization_id) {
        navigate('/dashboard')           // no org → roaming
      } else if (user.role === 'admin') {
        navigate('/admin')               // admin dashboard
      } else {
        navigate('/user')                // regular user dashboard
      }
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="auth-page">
      {/* left decorative panel */}
      <div className="auth-panel dot-bg">
        <div className="auth-panel-orb" />
        <div className="auth-panel-content">
          <div className="auth-panel-logo">
            cite<span>berry</span>
          </div>
          <h2>Welcome back</h2>
          <p>Log in to manage your quotes, invoices, and team — all in one place.</p>
          <div className="auth-panel-badges">
            <span className="auth-badge">⚡ Instant quotes</span>
            <span className="auth-badge">🧾 One-click invoicing</span>
            <span className="auth-badge">🔐 Role-based access</span>
          </div>
        </div>
      </div>

      {/* right form panel */}
      <div className="auth-form-panel">
        <Link to="/" className="auth-back-btn">← Back to home</Link>
        <div className="auth-form-card fade-up">
          <div className="auth-form-header">
            <h1>Sign in</h1>
            <p>Enter your credentials to continue</p>
          </div>

          {sessionExpired && (
            <div className="auth-info">⏱ Your session expired. Please sign in again.</div>
          )}
          {error && <div className="auth-error">{error}</div>}

          <form onSubmit={handleSubmit} className="auth-form" noValidate>
            <div className="field">
              <label htmlFor="username">Username</label>
              <input
                id="username"
                name="username"
                type="text"
                placeholder="yourname"
                value={form.username}
                onChange={handleChange}
                required
                autoFocus
              />
            </div>

            <div className="field">
              <label htmlFor="password">
                Password
                <a href="#" className="field-link">Forgot password?</a>
              </label>
              <input
                id="password"
                name="password"
                type="password"
                placeholder="••••••••"
                value={form.password}
                onChange={handleChange}
                required
              />
            </div>

            <button type="submit" className="btn-submit" disabled={loading}>
              {loading ? <span className="spinner" /> : 'Sign in →'}
            </button>
          </form>

          <p className="auth-switch">
            Don't have an account?{' '}
            <Link to="/register">Create one</Link>
          </p>
        </div>
      </div>
    </div>
  )
}
