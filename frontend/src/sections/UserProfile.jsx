import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { updateMe, deleteMe } from '../api/users'
import { deactivateOrg } from '../api/organizations'

export default function UserProfile({ user, onUpdated }) {
  const navigate = useNavigate()
  const isAdmin = user?.role === 'admin'

  const [username, setUsername] = useState(user?.username || '')
  const [email, setEmail]       = useState(user?.email || '')
  const [password, setPassword] = useState('')
  const [confirm, setConfirm]   = useState('')

  const [saving, setSaving]     = useState(false)
  const [msg, setMsg]           = useState(null)
  const [err, setErr]           = useState(null)

  const [showDeleteAccount, setShowDeleteAccount] = useState(false)
  const [showDeactivateOrg, setShowDeactivateOrg] = useState(false)

  async function handleSave(e) {
    e.preventDefault()
    setErr(null); setMsg(null)
    if (password && password !== confirm) {
      setErr('Passwords do not match'); return
    }
    setSaving(true)
    try {
      const payload = {}
      if (username !== user.username) payload.username = username
      if (email !== user.email)       payload.email = email
      if (password)                   payload.password = password
      if (!Object.keys(payload).length) { setMsg('No changes to save.'); setSaving(false); return }
      await updateMe(payload)
      setMsg('Profile updated successfully.')
      setPassword(''); setConfirm('')
      if (onUpdated) onUpdated()
    } catch (e) {
      setErr(e.message)
    } finally {
      setSaving(false)
    }
  }

  async function handleDeleteAccount() {
    try {
      await deleteMe()
      localStorage.removeItem('token')
      navigate('/login')
    } catch (e) {
      setErr(e.message)
    }
  }

  async function handleDeactivateOrg() {
    try {
      await deactivateOrg(user.organization_id)
      setMsg('Organization has been deactivated.')
      setShowDeactivateOrg(false)
      if (onUpdated) onUpdated()
    } catch (e) {
      setErr(e.message)
    }
  }

  return (
    <div className="ds-section">
      <div className="ds-section-header">
        <h2 className="ds-section-title">My Profile</h2>
      </div>

      {msg && <div className="ds-banner ds-banner-success">{msg}</div>}
      {err && <div className="ds-banner ds-banner-error">{err}</div>}

      <div className="ds-profile-grid">
        {/* Account details */}
        <div className="ds-profile-card">
          <h3 className="ds-profile-card-title">Account Details</h3>
          <form onSubmit={handleSave} className="ds-form-vertical">
            <div className="ds-field">
              <label className="ds-label">Username</label>
              <input className="ds-input" value={username} onChange={e => setUsername(e.target.value)} />
            </div>
            <div className="ds-field">
              <label className="ds-label">Email</label>
              <input className="ds-input" type="email" value={email} onChange={e => setEmail(e.target.value)} />
            </div>
            <div className="ds-field">
              <label className="ds-label">New Password</label>
              <input className="ds-input" type="password" placeholder="Leave blank to keep current" value={password} onChange={e => setPassword(e.target.value)} />
            </div>
            <div className="ds-field">
              <label className="ds-label">Confirm Password</label>
              <input className="ds-input" type="password" placeholder="Repeat new password" value={confirm} onChange={e => setConfirm(e.target.value)} />
            </div>
            <div className="ds-profile-actions">
              <button type="submit" className="ds-btn-primary" disabled={saving}>
                {saving ? 'Saving…' : 'Save Changes'}
              </button>
            </div>
          </form>
        </div>

        {/* Account info */}
        <div className="ds-profile-card">
          <h3 className="ds-profile-card-title">Account Info</h3>
          <div className="ds-meta-grid">
            <span className="ds-meta-label">Role</span>
            <span className="ds-meta-value ds-badge">{user?.role}</span>
            <span className="ds-meta-label">Organization</span>
            <span className="ds-meta-value">{user?.organization?.name || '—'}</span>
            <span className="ds-meta-label">Org ID</span>
            <span className="ds-meta-value ds-muted">{user?.organization?.id || '—'}</span>
          </div>

          <div className="ds-profile-danger-zone">
            <h4 className="ds-danger-title">Danger Zone</h4>

            {!showDeleteAccount ? (
              <button className="ds-btn-danger" onClick={() => setShowDeleteAccount(true)}>
                🗑 Delete My Account
              </button>
            ) : (
              <div className="ds-confirm-box">
                <p>This will permanently delete your account. Are you sure?</p>
                <div className="ds-confirm-actions">
                  <button className="ds-btn-danger" onClick={handleDeleteAccount}>Yes, Delete</button>
                  <button className="ds-btn-secondary" onClick={() => setShowDeleteAccount(false)}>Cancel</button>
                </div>
              </div>
            )}

            {isAdmin && user?.organization_id && (
              <>
                {!showDeactivateOrg ? (
                  <button className="ds-btn-danger" onClick={() => setShowDeactivateOrg(true)}>
                    🏢 Deactivate Organization
                  </button>
                ) : (
                  <div className="ds-confirm-box">
                    <p>This will mark <strong>{user.organization?.name}</strong> as inactive. Are you sure?</p>
                    <div className="ds-confirm-actions">
                      <button className="ds-btn-danger" onClick={handleDeactivateOrg}>Yes, Deactivate</button>
                      <button className="ds-btn-secondary" onClick={() => setShowDeactivateOrg(false)}>Cancel</button>
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
