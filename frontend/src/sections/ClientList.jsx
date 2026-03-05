import { useCallback } from 'react'
import { useFetch } from '../hooks/useFetch'
import { listClients, deleteClient } from '../api/clients'
import SectionShell from '../components/SectionShell'

export default function ClientList({ onEdit, onCreate }) {
  const { data, loading, error, load } = useFetch(useCallback(listClients, []))
  const rows = data || []

  async function handleDelete(c) {
    if (!confirm(`Delete client "${c.client_name}"?`)) return
    await deleteClient(c.id)
    load()
  }

  const emptyState = (
    <div className="ds-empty-cta">
      <div className="ds-empty-icon">👥</div>
      <p>No clients yet. Add your first one to get started.</p>
      <button className="ds-btn-primary" onClick={onCreate}>+ New Client</button>
    </div>
  )

  return (
    <SectionShell
      title="Clients"
      loading={loading}
      error={error}
      empty={!rows.length && emptyState}
      actions={
        <>
          <button className="ds-btn-primary" onClick={load}>↻ Refresh</button>
          <button className="ds-btn-primary" onClick={onCreate}>+ New Client</button>
        </>
      }
    >
      <table className="ds-table">
        <thead>
          <tr><th>#</th><th>Name</th><th>Company</th><th>Email</th><th>Phone</th><th></th></tr>
        </thead>
        <tbody>
          {rows.map(c => (
            <tr key={c.id}>
              <td className="ds-id">{c.id}</td>
              <td>{c.client_name}</td>
              <td className="ds-muted">{c.enterprise_name || '—'}</td>
              <td>{c.email}</td>
              <td className="ds-muted">{c.phone || '—'}</td>
              <td>
                <div className="ds-action-row">
                  <button className="ds-btn-accept ds-btn-sm" onClick={() => onEdit(c)}>Edit</button>
                  <button className="ds-btn-reject ds-btn-sm" onClick={() => handleDelete(c)}>Delete</button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </SectionShell>
  )
}
