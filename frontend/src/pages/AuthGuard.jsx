import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { cloneElement } from 'react'
import { getMe } from '../api/users'

/**
 * Wraps a dashboard component, ensures the user is authenticated and
 * has the correct role. Passes the resolved `user` object as a prop.
 */
export default function AuthGuard({ role, children }) {
  const navigate = useNavigate()
  const [user, setUser] = useState(null)

  useEffect(() => {
    const token = localStorage.getItem('token')
    if (!token) { navigate('/login'); return }

    getMe()
      .then((u) => {
        if (!u.organization_id) { navigate('/dashboard'); return }
        if (role && u.role !== role) {
          navigate(u.role === 'admin' ? '/admin' : '/user')
          return
        }
        setUser(u)
      })
      .catch(() => { localStorage.removeItem('token'); navigate('/login') })
  }, [navigate, role])

  if (!user) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f8fafc' }}>
        <div className="dash-spinner" />
      </div>
    )
  }

  return cloneElement(children, { user })
}
