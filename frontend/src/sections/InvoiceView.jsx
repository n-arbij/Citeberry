import { useState } from 'react'
import { deleteInvoice } from '../api/invoices'
import SectionShell from '../components/SectionShell'

export default function InvoiceView({ invoice, onBack, onDeleted }) {
  const [deleting, setDeleting] = useState(false)

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
