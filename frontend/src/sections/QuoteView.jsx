import { useState, useCallback } from 'react'
import { useFetch } from '../hooks/useFetch'
import { deleteQuote } from '../api/quotes'
import { listQuoteItemsByQuote } from '../api/quoteItems'
import { createInvoice } from '../api/invoices'
import SectionShell from '../components/SectionShell'

const STATUS_COLOR = { pending: '#f59e0b', accepted: '#10b981', rejected: '#ef4444', draft: '#6b7280' }

export default function QuoteView({ quote, onBack, onEdit, onDeleted }) {
  const { data: items, loading: itemsLoading } = useFetch(
    useCallback(() => listQuoteItemsByQuote(quote.id), [quote.id])
  )
  const [generating, setGenerating] = useState(false)
  const [invoiceMsg, setInvoiceMsg] = useState('')

  async function handleDelete() {
    if (!confirm(`Delete quote "${quote.title}"?`)) return
    await deleteQuote(quote.id)
    onDeleted()
  }

  async function handleGenerateInvoice() {
    if (!confirm(`Generate an invoice from "${quote.title}"?`)) return
    setGenerating(true)
    setInvoiceMsg('')
    try {
      const inv = await createInvoice({
        title: quote.title,
        description: quote.description || quote.title,
        amount: quote.amount,
      })
      setInvoiceMsg(`✅ Invoice #${inv.id} created successfully.`)
    } catch (err) {
      setInvoiceMsg(`❌ ${err.message}`)
    } finally {
      setGenerating(false)
    }
  }

  const rows = items || []
  const total = rows.reduce((s, i) => s + i.sub_total, 0)

  return (
    <SectionShell title="Quote Details">
      <div className="ds-view-card">
        {/* Header: back + action buttons */}
        <div className="ds-view-header">
          <button className="dash-back" onClick={onBack}>← Back to quotes</button>
          <div className="ds-action-row">
            {quote.status === 'accepted' && (
              <button className="ds-btn-invoice" onClick={handleGenerateInvoice} disabled={generating}>
                {generating ? 'Generating…' : '🧾 Generate Invoice'}
              </button>
            )}
            <button className="ds-btn-accept" onClick={onEdit}>Edit</button>
            <button className="ds-btn-reject" onClick={handleDelete}>Delete</button>
          </div>
        </div>

        {invoiceMsg && (
          <div className={`ds-invoice-msg ${invoiceMsg.startsWith('✅') ? 'ds-invoice-msg--ok' : 'ds-invoice-msg--err'}`}>
            {invoiceMsg}
            <button className="ds-invoice-msg-close" onClick={() => setInvoiceMsg('')}>×</button>
          </div>
        )}

        {/* Two-column body */}
        <div className="ds-view-body">
          {/* Left: meta */}
          <div className="ds-view-meta">
            <div className="ds-view-title">{quote.title}</div>
            <span className="ds-badge" style={{ '--bc': STATUS_COLOR[quote.status] || '#6b7280' }}>
              {quote.status}
            </span>

            <div className="ds-meta-grid">
              <span className="ds-meta-label">Client</span>
              <span>{quote.client_name || `#${quote.client_id}`}</span>

              <span className="ds-meta-label">Amount</span>
              <span className="ds-amount">${quote.amount.toFixed(2)}</span>

              <span className="ds-meta-label">Created</span>
              <span>{new Date(quote.created_at).toLocaleDateString()}</span>

              <span className="ds-meta-label">Updated</span>
              <span>{new Date(quote.updated_at).toLocaleDateString()}</span>

              {quote.description && (
                <>
                  <span className="ds-meta-label">Description</span>
                  <span>{quote.description}</span>
                </>
              )}
            </div>
          </div>

          {/* Right: line items */}
          <div className="ds-view-items">
            <h3 className="ds-view-section-title">Line Items</h3>
            {itemsLoading ? (
              <p className="ds-muted">Loading items…</p>
            ) : rows.length === 0 ? (
              <p className="ds-muted">No items added.</p>
            ) : (
              <>
                <table className="ds-table ds-items-table">
                  <thead>
                    <tr>
                      <th>Description</th>
                      <th>Qty</th>
                      <th>Unit Price</th>
                      <th>Subtotal</th>
                    </tr>
                  </thead>
                  <tbody>
                    {rows.map(item => (
                      <tr key={item.id}>
                        <td>{item.description}</td>
                        <td>{item.quantity}</td>
                        <td>${item.unit_price.toFixed(2)}</td>
                        <td className="ds-amount">${item.sub_total.toFixed(2)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                <div className="ds-total-row" style={{ marginTop: '0.75rem' }}>
                  <label>Total</label>
                  <span className="ds-amount ds-total-amount">${total.toFixed(2)}</span>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </SectionShell>
  )
}
