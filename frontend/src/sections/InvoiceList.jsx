import { useCallback, useState } from 'react'
import { useFetch } from '../hooks/useFetch'
import { listInvoices, deleteInvoice, updateInvoice } from '../api/invoices'
import SectionShell from '../components/SectionShell'

const STATUS_COLOR = { unpaid: '#f59e0b', paid: '#10b981', overdue: '#ef4444' }

export default function InvoiceList({ onView }) {
  const { data, loading, error, load } = useFetch(useCallback(listInvoices, []))
  const [marking, setMarking] = useState(null)
  const rows = data || []

  async function handleDelete(id) {
    if (!confirm('Delete this invoice?')) return
    await deleteInvoice(id)
    load()
  }

  async function handleMarkPaid(inv) {
    setMarking(inv.id)
    try {
      await updateInvoice(inv.id, { status: 'paid' })
      load()
    } catch (err) {
      alert(err.message)
    } finally {
      setMarking(null)
    }
  }

  return (
    <SectionShell
      title="Invoices"
      loading={loading}
      error={error}
      empty={!rows.length && 'No invoices yet.'}
      actions={<button className="ds-btn-primary" onClick={load}>↻ Refresh</button>}
    >
      <table className="ds-table">
        <thead>
          <tr>
            <th>#</th><th>Title</th><th>Description</th><th>Amount</th><th>Status</th><th>Created</th><th></th>
          </tr>
        </thead>
        <tbody>
          {rows.map(i => (
            <tr key={i.id}>
              <td className="ds-id">{i.id}</td>
              <td className="ds-link" onClick={() => onView && onView(i)}>{i.title}</td>
              <td className="ds-muted">{i.description}</td>
              <td><span className="ds-amount">${i.amount.toFixed(2)}</span></td>
              <td>
                <span className="ds-badge" style={{ '--bc': STATUS_COLOR[i.status] || '#6b7280' }}>
                  {i.status || 'unpaid'}
                </span>
              </td>
              <td className="ds-muted">{new Date(i.created_at).toLocaleDateString()}</td>
              <td>
                <div className="ds-action-row">
                  <button className="ds-btn-view ds-btn-sm" onClick={() => onView && onView(i)}>View</button>
                  {i.status !== 'paid' && (
                    <button
                      className="ds-btn-accept ds-btn-sm"
                      onClick={() => handleMarkPaid(i)}
                      disabled={marking === i.id}
                    >
                      {marking === i.id ? '…' : '✓ Paid'}
                    </button>
                  )}
                  <button className="ds-btn-reject ds-btn-sm" onClick={() => handleDelete(i.id)}>Delete</button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </SectionShell>
  )
}
