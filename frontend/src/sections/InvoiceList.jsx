import { useCallback } from 'react'
import { useFetch } from '../hooks/useFetch'
import { listInvoices, deleteInvoice } from '../api/invoices'
import SectionShell from '../components/SectionShell'

export default function InvoiceList() {
  const { data, loading, error, load } = useFetch(useCallback(listInvoices, []))
  const rows = data || []

  async function handleDelete(id) {
    if (!confirm('Delete this invoice?')) return
    await deleteInvoice(id)
    load()
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
            <th>#</th><th>Title</th><th>Description</th><th>Amount</th><th>Created</th><th></th>
          </tr>
        </thead>
        <tbody>
          {rows.map(i => (
            <tr key={i.id}>
              <td className="ds-id">{i.id}</td>
              <td>{i.title}</td>
              <td className="ds-muted">{i.description}</td>
              <td><span className="ds-amount">${i.amount.toFixed(2)}</span></td>
              <td className="ds-muted">{new Date(i.created_at).toLocaleDateString()}</td>
              <td>
                <button className="ds-btn-reject ds-btn-sm" onClick={() => handleDelete(i.id)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </SectionShell>
  )
}
