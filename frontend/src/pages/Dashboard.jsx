import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { getMe } from '../api/users'
import { listOrganizations, createOrganization, requestToJoin } from '../api/organizations'
import './Dashboard.css'

export default function Dashboard() {
  const navigate = useNavigate()

  const [user, setUser] = useState(null)
  const [orgs, setOrgs] = useState([])
  const [view, setView] = useState('loading') // loading | roaming | pending | home
  const [activePanel, setActivePanel] = useState(null) // null | 'create' | 'join'

  // create form
  const [createForm, setCreateForm] = useState({ name: '', email: '', address: '' })
  const [createError, setCreateError] = useState('')
  const [createLoading, setCreateLoading] = useState(false)

  // join search
  const [search, setSearch] = useState('')
  const [joinError, setJoinError] = useState('')
  const [joinLoadingId, setJoinLoadingId] = useState(null)
  const [sentRequest, setSentRequest] = useState(null)

  useEffect(() => {
    const token = localStorage.getItem('token')
    if (!token) { navigate('/login'); return }

    getMe()
      .then((u) => {
        setUser(u)
        if (u.organization_id) {
          setView('home')
        } else {
          listOrganizations().then(setOrgs)
          setView('roaming')
        }
      })
      .catch(() => { localStorage.removeItem('token'); navigate('/login') })
  }, [navigate])

  /* ── Create org ── */
  async function handleCreate(e) {
    e.preventDefault()
    setCreateError('')
    if (!createForm.name.trim()) { setCreateError('Organization name is required'); return }
    setCreateLoading(true)
    try {
      await createOrganization(createForm)
      const updated = await getMe()
      setUser(updated)
      setView('home')
    } catch (err) {
      setCreateError(err.message)
    } finally {
      setCreateLoading(false)
    }
  }

  /* ── Send join request ── */
  async function handleJoin(org) {
    setJoinError('')
    setJoinLoadingId(org.id)
    try {
      await requestToJoin(org.short_id)
      setSentRequest(org)
      setView('pending')
    } catch (err) {
      setJoinError(err.message)
    } finally {
      setJoinLoadingId(null)
    }
  }

  const filteredOrgs = orgs.filter((o) =>
    o.name.toLowerCase().includes(search.toLowerCase())
  )

  /* ── Render states ── */
  if (view === 'loading') {
    return (
      <div className="dash-center">
        <div className="dash-spinner" />
      </div>
    )
  }

  if (view === 'pending') {
    return (
      <div className="dash-center">
        <div className="dash-pending-card">
          <div className="dash-pending-icon">⏳</div>
          <h2>Request sent!</h2>
          <p>
            Your request to join <strong>{sentRequest?.name}</strong> is pending approval
            by an admin. You'll have access once it's accepted.
          </p>
          <button className="dash-btn-ghost" onClick={() => { setView('roaming'); setSentRequest(null) }}>
            ← Choose a different organization
          </button>
        </div>
      </div>
    )
  }

  if (view === 'home') {
    return (
      <div className="dash-center">
        <div className="dash-pending-card">
          <div className="dash-pending-icon">🎉</div>
          <h2>Welcome, {user?.username}!</h2>
          <p>You're a member of <strong>{user?.organization?.name}</strong>.</p>
          <p className="dash-sub">Full dashboard coming soon.</p>
        </div>
      </div>
    )
  }

  /* ── Roaming view ── */
  return (
    <div className="dash-roaming">
      <header className="dash-roaming-header">
        <a href="/" className="dash-logo">cite<span>berry</span></a>
        <button
          className="dash-btn-ghost"
          onClick={() => { localStorage.removeItem('token'); navigate('/login') }}
        >
          Sign out
        </button>
      </header>

      <div className="dash-roaming-body">
        <div className="dash-roaming-welcome">
          <h1>Welcome, <span>{user?.username}</span> 👋</h1>
          <p>You're not part of any organization yet. Create a new one or join an existing one to get started.</p>
        </div>

        {!activePanel && (
          <div className="dash-choice-grid">
            <button className="dash-choice-card" onClick={() => setActivePanel('create')}>
              <div className="dash-choice-icon">🏢</div>
              <h3>Create an organization</h3>
              <p>Set up a new workspace for your team. You'll be the admin.</p>
              <span className="dash-choice-arrow">→</span>
            </button>
            <button className="dash-choice-card" onClick={() => setActivePanel('join')}>
              <div className="dash-choice-icon">🔍</div>
              <h3>Join an organization</h3>
              <p>Find an existing workspace and request access from its admin.</p>
              <span className="dash-choice-arrow">→</span>
            </button>
          </div>
        )}

        {activePanel === 'create' && (
          <div className="dash-panel">
            <button className="dash-back" onClick={() => { setActivePanel(null); setCreateError('') }}>← Back</button>
            <h2>Create an organization</h2>
            <form className="dash-form" onSubmit={handleCreate}>
              <div className="dash-field">
                <label>Organization name *</label>
                <input
                  value={createForm.name}
                  onChange={(e) => setCreateForm({ ...createForm, name: e.target.value })}
                  placeholder="e.g. Acme Inc."
                />
              </div>
              <div className="dash-field">
                <label>Email</label>
                <input
                  type="email"
                  value={createForm.email}
                  onChange={(e) => setCreateForm({ ...createForm, email: e.target.value })}
                  placeholder="contact@company.com"
                />
              </div>
              <div className="dash-field">
                <label>Address</label>
                <input
                  value={createForm.address}
                  onChange={(e) => setCreateForm({ ...createForm, address: e.target.value })}
                  placeholder="123 Main St, City"
                />
              </div>
              {createError && <p className="dash-error">{createError}</p>}
              <button type="submit" className="dash-btn-primary" disabled={createLoading}>
                {createLoading ? 'Creating…' : 'Create organization'}
              </button>
            </form>
          </div>
        )}

        {activePanel === 'join' && (
          <div className="dash-panel">
            <button className="dash-back" onClick={() => { setActivePanel(null); setJoinError('') }}>← Back</button>
            <h2>Join an organization</h2>
            <input
              className="dash-search"
              placeholder="Search organizations…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            {joinError && <p className="dash-error">{joinError}</p>}
            <ul className="dash-org-list">
              {filteredOrgs.length === 0 && (
                <li className="dash-org-empty">No organizations found.</li>
              )}
              {filteredOrgs.map((org) => (
                <li key={org.id} className="dash-org-item">
                  <div className="dash-org-info">
                    <strong>{org.name}</strong>
                    {org.email && <span>{org.email}</span>}
                  </div>
                  <button
                    className="dash-btn-primary dash-btn-sm"
                    onClick={() => handleJoin(org)}
                    disabled={joinLoadingId === org.id}
                  >
                    {joinLoadingId === org.id ? '…' : 'Request to join'}
                  </button>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  )
}
