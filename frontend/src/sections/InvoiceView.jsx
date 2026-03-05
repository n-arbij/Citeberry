import { useState } from 'react'
import { deleteInvoice, updateInvoice } from '../api/invoices'
import SectionShell from '../components/SectionShell'

const STATUS_COLOR = { unpaid: '#f59e0b', paid: '#10b981', overdue: '#ef4444' }
const STATUSES = ['unpaid', 'paid', 'overdue']

export default function InvoiceView({ invoice, onBack, onDeleted }) {
  const [deleting, setDeleting] = useState(false)
  const [status, setStatus] = useState(invoice.status || 'unpaid')
  const [saving, setSaving] = useState(false)

  async function handleDelete() {
    if (!confirm(`Delete invoice "${invoice.title}"?`)) return
    setDeleting(true)
    try {
      await deleteInvoice(invoice.id)
      onDeleted()
    } catch (err) {
      alert(err.message)
      setDeleting(false)
    }
  }

  async function handleStatusChange(newStatus) {
    setSaving(true)
    try {
      await updateInvoice(invoice.id, { status: newStatus })
      setStatus(newStatus)
    } catch (err) {
      alert(err.message)
    } finally {
      setSaving(false)
    }
  }

  return (
    <SectionShell title="Invoice Details">
      <div className="ds-view-card">
        {/* Header */}
        <div className="ds-view-header">
          <button className="dash-back" onClick={onBack}>← Back to invoices</button>
          <button className="ds-btn-reject" onClick={handleDelete} disabled={deleting}>
            {deleting ? 'Deleting…' : 'Delete'}
          </button>
        </div>

        <div className="ds-view-meta ds-view-meta--full">
          <div className="ds-view-title">{invoice.title}</div>
          <div className="ds-meta-grid">
            <span className="ds-meta-label">Invoice #</span>
            <span className="ds-id">{invoice.id}</span>

            <span className="ds-meta-label">Amount</span>
            <span className="ds-amount ds-total-amount">${invoice.amount.toFixed(2)}</span>

            <span className="ds-meta-label">Status</span>
            <span>
              <span className="ds-badge" style={{ '--bc': STATUS_COLOR[status] || '#6b7280', marginRight: '0.5rem' }}>{status}</span>
              {STATUSES.filter(s => s !== status).map(s => (
                <button key={s} className="ds-btn-secondary ds-btn-sm" style={{ marginRight: '0.3rem' }} onClick={() => handleStatusChange(s)} disabled={saving}>
                  → {s}
                </button>
              ))}
            </span>

            <span className="ds-meta-label">Description</span>
            <span>{invoice.description}</span>

            <span className="ds-meta-label">Created</span>
            <span>{new Date(invoice.created_at).toLocaleDateString()}</span>

            {invoice.organization_id && (
              <>
                <span className="ds-meta-label">Organization</span>
                <span>#{invoice.organization_id}</span>
              </>
            )}
          </div>
        </div>
      </div>
    </SectionShell>
  )
}
