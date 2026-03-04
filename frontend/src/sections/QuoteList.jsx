import { useCallback } from 'react'
import { useFetch } from '../hooks/useFetch'
import { listQuotes, deleteQuote } from '../api/quotes'
import SectionShell from '../components/SectionShell'

const STATUS_COLOR = { pending: '#f59e0b', accepted: '#10b981', rejected: '#ef4444' }

export default function QuoteList({ onEdit, onCreate }) {
  const { data, loading, error, load } = useFetch(useCallback(listQuotes, []))
  const rows = data || []

  async function handleDelete(id) {
    if (!confirm('Delete this quote?')) return
    await deleteQuote(id)
    load()
  }

  const emptyState = (
    <div className="ds-empty-cta">
      <div className="ds-empty-icon">📝</div>
      <p>No quotes yet. Create your first one to get started.</p>
      <button className="ds-btn-primary" onClick={onCreate}>+ New Quote</button>
    </div>
  )

  return (
    <SectionShell
      title="Quotes"
      loading={loading}
      error={error}
      empty={!rows.length && emptyState}
      actions={
        <>
          <button className="ds-btn-primary" onClick={load}>↻ Refresh</button>
          <button className="ds-btn-primary" onClick={onCreate}>+ New Quote</button>
        </>
      }
    >
      <table className="ds-table">
        <thead>
          <tr>
            <th>#</th>
            <th>Title</th>
            <th>Client</th>
            <th>Amount</th>
            <th>Status</th>
            <th>Created</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {rows.map(q => (
            <tr key={q.id}>
              <td className="ds-id">{q.id}</td>
              <td>{q.title}</td>
              <td className="ds-muted">#{q.client_id}</td>
              <td><span className="ds-amount">${q.amount.toFixed(2)}</span></td>
              <td>
                <span className="ds-badge" style={{ '--bc': STATUS_COLOR[q.status] || '#6b7280' }}>
                  {q.status}
                </span>
              </td>
              <td className="ds-muted">{new Date(q.created_at).toLocaleDateString()}</td>
              <td>
                <div className="ds-action-row">
                  <button className="ds-btn-accept ds-btn-sm" onClick={() => onEdit(q)}>Edit</button>
                  <button className="ds-btn-reject ds-btn-sm" onClick={() => handleDelete(q.id)}>Delete</button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </SectionShell>
  )
}
