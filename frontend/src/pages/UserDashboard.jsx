import { useState, useEffect, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { listInvoices } from '../api/invoices'
import { listQuotes } from '../api/quotes'
import { listClients } from '../api/clients'
import { listNotifications } from '../api/notifications'
import './Dashboard.css'

const NAV = [
  { id: 'overview',      label: 'Overview',      icon: '📊' },
  { id: 'invoices',      label: 'Invoices',       icon: '🧾' },
  { id: 'quotes',        label: 'Quotes',         icon: '📝' },
  { id: 'clients',       label: 'Clients',        icon: '👥' },
  { id: 'notifications', label: 'Notifications',  icon: '🔔' },
]

function useFetch(fetchFn) {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const load = useCallback(() => {
    setLoading(true); setError(null)
    fetchFn().then(setData).catch(e => setError(e.message)).finally(() => setLoading(false))
  }, [fetchFn])
  return { data, loading, error, load }
}

function SectionShell({ title, actions, loading, error, empty, children }) {
  return (
    <div className="ds-section">
      <div className="ds-section-header">
        <h2>{title}</h2>
        {actions}
      </div>
      {loading && <div className="ds-loading">Loading…</div>}
      {error && <div className="ds-error-msg">{error}</div>}
      {!loading && !error && empty && <div className="ds-empty">{empty}</div>}
      {!loading && !error && !empty && children}
    </div>
  )
}

export default function UserDashboard({ user }) {
  const navigate = useNavigate()

  const [section, setSection] = useState('overview')

  const inv   = useFetch(useCallback(listInvoices, []))
  const qt    = useFetch(useCallback(listQuotes, []))
  const cl    = useFetch(useCallback(listClients, []))
  const notif = useFetch(useCallback(listNotifications, []))

  useEffect(() => { inv.load(); qt.load(); cl.load(); notif.load() }, [])

  function signOut() { localStorage.removeItem('token'); navigate('/login') }

  /* ── Section renderers ── */
  function renderOverview() {
    const stats = [
      { label: 'Invoices', value: inv.data?.length ?? '…', sub: inv.data ? `$${inv.data.reduce((s,i) => s+i.amount,0).toFixed(2)} total` : '', color: '#6d28d9' },
      { label: 'Quotes',   value: qt.data?.length ?? '…',  sub: qt.data ? `${qt.data.filter(q=>q.status==='pending').length} pending` : '', color: '#0ea5e9' },
      { label: 'Clients',  value: cl.data?.length ?? '…',  sub: '', color: '#10b981' },
      { label: 'Notifications', value: notif.data?.length ?? '…', sub: '', color: '#f59e0b' },
    ]
    return (
      <div className="ds-section">
        <div className="ds-section-header"><h2>Overview</h2></div>
        <div className="ds-stats-grid">
          {stats.map(s => (
            <div key={s.label} className="ds-stat-card" style={{ '--accent': s.color }}>
              <span className="ds-stat-value">{s.value}</span>
              <span className="ds-stat-label">{s.label}</span>
              {s.sub && <span className="ds-stat-sub">{s.sub}</span>}
            </div>
          ))}
        </div>
      </div>
    )
  }

  function renderInvoices() {
    const rows = inv.data || []
    return (
      <SectionShell title="Invoices" loading={inv.loading} error={inv.error}
        empty={!rows.length && 'No invoices yet'}
        actions={<button className="ds-btn-primary" onClick={() => inv.load()}>↻ Refresh</button>}
      >
        <table className="ds-table">
          <thead><tr><th>#</th><th>Title</th><th>Description</th><th>Amount</th><th>Created</th></tr></thead>
          <tbody>
            {rows.map(i => (
              <tr key={i.id}>
                <td className="ds-id">{i.id}</td>
                <td>{i.title}</td>
                <td className="ds-muted">{i.description}</td>
                <td><span className="ds-amount">${i.amount.toFixed(2)}</span></td>
                <td className="ds-muted">{new Date(i.created_at).toLocaleDateString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </SectionShell>
    )
  }

  function renderQuotes() {
    const rows = qt.data || []
    const statusColor = { pending: '#f59e0b', accepted: '#10b981', rejected: '#ef4444' }
    return (
      <SectionShell title="Quotes" loading={qt.loading} error={qt.error}
        empty={!rows.length && 'No quotes yet'}
        actions={<button className="ds-btn-primary" onClick={() => qt.load()}>↻ Refresh</button>}
      >
        <table className="ds-table">
          <thead><tr><th>#</th><th>Title</th><th>Client</th><th>Amount</th><th>Status</th><th>Created</th></tr></thead>
          <tbody>
            {rows.map(q => (
              <tr key={q.id}>
                <td className="ds-id">{q.id}</td>
                <td>{q.title}</td>
                <td className="ds-muted">#{q.client_id}</td>
                <td><span className="ds-amount">${q.amount.toFixed(2)}</span></td>
                <td><span className="ds-badge" style={{ '--bc': statusColor[q.status] || '#6b7280' }}>{q.status}</span></td>
                <td className="ds-muted">{new Date(q.created_at).toLocaleDateString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </SectionShell>
    )
  }

  function renderClients() {
    const rows = cl.data || []
    return (
      <SectionShell title="Clients" loading={cl.loading} error={cl.error}
        empty={!rows.length && 'No clients yet'}
        actions={<button className="ds-btn-primary" onClick={() => cl.load()}>↻ Refresh</button>}
      >
        <table className="ds-table">
          <thead><tr><th>#</th><th>Name</th><th>Company</th><th>Email</th><th>Phone</th></tr></thead>
          <tbody>
            {rows.map(c => (
              <tr key={c.id}>
                <td className="ds-id">{c.id}</td>
                <td>{c.client_name}</td>
                <td className="ds-muted">{c.enterprise_name || '—'}</td>
                <td>{c.email}</td>
                <td className="ds-muted">{c.phone || '—'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </SectionShell>
    )
  }

  function renderNotifications() {
    const rows = notif.data || []
    return (
      <SectionShell title="Notifications" loading={notif.loading} error={notif.error}
        empty={!rows.length && 'No notifications'}
        actions={<button className="ds-btn-primary" onClick={() => notif.load()}>↻ Refresh</button>}
      >
        <ul className="ds-notif-list">
          {rows.map(n => (
            <li key={n.id} className="ds-notif-item">
              <div className="ds-notif-body">
                <strong>{n.title}</strong>
                <p>{n.message}</p>
              </div>
              <span className="ds-muted ds-notif-date">{new Date(n.created_at).toLocaleDateString()}</span>
            </li>
          ))}
        </ul>
      </SectionShell>
    )
  }

  const sections = {
    overview:      renderOverview,
    invoices:      renderInvoices,
    quotes:        renderQuotes,
    clients:       renderClients,
    notifications: renderNotifications,
  }

  return (
    <div className="ds-app">
      {/* Sidebar */}
      <aside className="ds-sidebar">
        <div className="ds-sidebar-logo">cite<span>berry</span></div>
        <div className="ds-org-name">{user?.organization?.name || 'Organization'}</div>
        <nav className="ds-nav">
          {NAV.map(item => (
            <button
              key={item.id}
              className={`ds-nav-item${section === item.id ? ' active' : ''}`}
              onClick={() => setSection(item.id)}
            >
              <span className="ds-nav-icon">{item.icon}</span>
              {item.label}
            </button>
          ))}
        </nav>
        <div className="ds-sidebar-footer">
          <div className="ds-user-pill">
            <span className="ds-user-avatar">{user?.username?.[0]?.toUpperCase()}</span>
            <div>
              <div className="ds-user-name">{user?.username}</div>
              <div className="ds-user-role">Member</div>
            </div>
          </div>
          <button className="ds-signout" onClick={signOut}>Sign out</button>
        </div>
      </aside>

      {/* Main */}
      <main className="ds-main">
        {(sections[section] || renderOverview)()}
      </main>
    </div>
  )
}
