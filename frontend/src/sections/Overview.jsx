import { useCallback } from 'react'
import { useFetch } from '../hooks/useFetch'
import { listInvoices } from '../api/invoices'
import { listQuotes } from '../api/quotes'
import { listClients } from '../api/clients'
import { listJoinRequests } from '../api/organizations'

const statusColor = { pending: '#f59e0b', accepted: '#10b981', rejected: '#ef4444' }

export default function Overview({ user, onNavigate }) {
  const orgShortId = user?.organization?.id
  const inv   = useFetch(useCallback(listInvoices, []))
  const qt    = useFetch(useCallback(listQuotes, []))
  const cl    = useFetch(useCallback(listClients, []))
  const jr    = useFetch(useCallback(
    () => orgShortId ? listJoinRequests(orgShortId) : Promise.resolve([]),
    [orgShortId]
  ))

  const pendingJR = jr.data?.filter(r => r.status === 'pending') || []

  const stats = [
    {
      label: 'Invoices', value: inv.data?.length ?? '…',
      sub: inv.data ? `$${inv.data.reduce((s, i) => s + i.amount, 0).toFixed(2)} total` : '',
      color: '#6d28d9', section: 'invoices',
    },
    {
      label: 'Quotes', value: qt.data?.length ?? '…',
      sub: qt.data ? `${qt.data.filter(q => q.status === 'pending').length} pending` : '',
      color: '#0ea5e9', section: 'quotes',
    },
    {
      label: 'Clients', value: cl.data?.length ?? '…',
      sub: '', color: '#10b981', section: 'clients',
    },
    ...(user?.role === 'admin' ? [{
      label: 'Pending Join Requests', value: pendingJR.length,
      sub: 'awaiting approval', color: '#f59e0b', section: 'join-requests',
    }] : []),
  ]

  return (
    <div className="ds-section">
      <div className="ds-section-header"><h2>Overview</h2></div>

      <div className="ds-stats-grid">
        {stats.map(s => (
          <button
            key={s.label}
            className="ds-stat-card ds-stat-btn"
            style={{ '--accent': s.color }}
            onClick={() => onNavigate(s.section)}
          >
            <span className="ds-stat-value">{s.value}</span>
            <span className="ds-stat-label">{s.label}</span>
            {s.sub && <span className="ds-stat-sub">{s.sub}</span>}
          </button>
        ))}
      </div>

      {pendingJR.length > 0 && user?.role === 'admin' && (
        <div className="ds-alert">
          <strong>🔑 {pendingJR.length} pending join request{pendingJR.length > 1 ? 's' : ''}</strong> waiting for your approval.
          <button className="ds-alert-link" onClick={() => onNavigate('join-requests')}>Review →</button>
        </div>
      )}

      {/* Recent quotes */}
      {qt.data?.length > 0 && (
        <div className="ds-overview-recent">
          <h3>Recent Quotes</h3>
          <table className="ds-table">
            <thead><tr><th>Title</th><th>Amount</th><th>Status</th><th>Created</th></tr></thead>
            <tbody>
              {qt.data.slice(0, 5).map(q => (
                <tr key={q.id}>
                  <td>{q.title}</td>
                  <td><span className="ds-amount">${q.amount.toFixed(2)}</span></td>
                  <td><span className="ds-badge" style={{ '--bc': statusColor[q.status] || '#6b7280' }}>{q.status}</span></td>
                  <td className="ds-muted">{new Date(q.created_at).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <button className="ds-view-all" onClick={() => onNavigate('quotes')}>View all quotes →</button>
        </div>
      )}
    </div>
  )
}
