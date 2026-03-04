import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { api } from '../api/auth'
import './Auth.css'

export default function Register() {
  const navigate = useNavigate()
  const [form, setForm] = useState({ username: '', email: '', password: '' })
  const [errors, setErrors] = useState({})
  const [serverError, setServerError] = useState('')
  const [loading, setLoading] = useState(false)

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value })
    setErrors({ ...errors, [e.target.name]: '' })
    setServerError('')
  }

  function validate() {
    const errs = {}
    if (!form.username.trim()) errs.username = 'Username is required'
    if (!form.email.trim()) errs.email = 'Email is required'
    else if (!/\S+@\S+\.\S+/.test(form.email)) errs.email = 'Enter a valid email'
    if (!form.password) errs.password = 'Password is required'
    else if (form.password.length < 6) errs.password = 'Minimum 6 characters'
    return errs
  }

  async function handleSubmit(e) {
    e.preventDefault()
    const errs = validate()
    if (Object.keys(errs).length) { setErrors(errs); return }

    setLoading(true)
    setServerError('')
    try {
      await api.register(form)
      navigate('/login?registered=1')
    } catch (err) {
      setServerError(err.message)
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
          <h2>Get started free</h2>
          <p>Create your account and start sending professional quotes in minutes.</p>
          <div className="auth-panel-badges">
            <span className="auth-badge">✅ No credit card needed</span>
            <span className="auth-badge">🏢 Create or join an org</span>
            <span className="auth-badge">📊 Activity logs included</span>
          </div>
        </div>
      </div>

      {/* right form panel */}
      <div className="auth-form-panel">
        <div className="auth-form-card fade-up">
          <div className="auth-form-header">
            <h1>Create account</h1>
            <p>Fill in the details below to get started</p>
          </div>

          {serverError && <div className="auth-error">{serverError}</div>}

          <form onSubmit={handleSubmit} className="auth-form" noValidate>
            <div className={`field ${errors.username ? 'field-error' : ''}`}>
              <label htmlFor="username">Username</label>
              <input
                id="username"
                name="username"
                type="text"
                placeholder="yourname"
                value={form.username}
                onChange={handleChange}
                autoFocus
              />
              {errors.username && <span className="field-msg">{errors.username}</span>}
            </div>

            <div className={`field ${errors.email ? 'field-error' : ''}`}>
              <label htmlFor="email">Email address</label>
              <input
                id="email"
                name="email"
                type="email"
                placeholder="you@company.com"
                value={form.email}
                onChange={handleChange}
              />
              {errors.email && <span className="field-msg">{errors.email}</span>}
            </div>

            <div className={`field ${errors.password ? 'field-error' : ''}`}>
              <label htmlFor="password">Password</label>
              <input
                id="password"
                name="password"
                type="password"
                placeholder="Min. 6 characters"
                value={form.password}
                onChange={handleChange}
              />
              {errors.password && <span className="field-msg">{errors.password}</span>}
              {!errors.password && form.password && (
                <PasswordStrength password={form.password} />
              )}
            </div>

            <button type="submit" className="btn-submit" disabled={loading}>
              {loading ? <span className="spinner" /> : 'Create account →'}
            </button>
          </form>

          <p className="auth-switch">
            Already have an account?{' '}
            <Link to="/login">Sign in</Link>
          </p>
        </div>
      </div>
    </div>
  )
}

function PasswordStrength({ password }) {
  const score = Math.min(
    (password.length >= 8 ? 1 : 0) +
    (/[A-Z]/.test(password) ? 1 : 0) +
    (/[0-9]/.test(password) ? 1 : 0) +
    (/[^A-Za-z0-9]/.test(password) ? 1 : 0),
    3
  )
  const labels = ['Weak', 'Fair', 'Strong']
  const colors = ['#ef4444', '#f59e0b', '#10b981']
  return (
    <div className="password-strength">
      <div className="strength-bars">
        {[0, 1, 2].map((i) => (
          <div
            key={i}
            className="strength-bar"
            style={{ background: i < score ? colors[score - 1] : '#e2e8f0' }}
          />
        ))}
      </div>
      <span style={{ color: colors[score - 1] || '#94a3b8', fontSize: '0.75rem', fontWeight: 500 }}>
        {score > 0 ? labels[score - 1] : ''}
      </span>
    </div>
  )
}
