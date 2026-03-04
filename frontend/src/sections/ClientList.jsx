import { useCallback } from 'react'
import { useFetch } from '../hooks/useFetch'
import { listClients } from '../api/clients'
import SectionShell from '../components/SectionShell'

export default function ClientList() {
  const { data, loading, error, load } = useFetch(useCallback(listClients, []))
  const rows = data || []

  return (
    <SectionShell
      title="Clients"
      loading={loading}
      error={error}
      empty={!rows.length && 'No clients yet.'}
      actions={<button className="ds-btn-primary" onClick={load}>↻ Refresh</button>}
    >
      <table className="ds-table">
        <thead>
          <tr><th>#</th><th>Name</th><th>Company</th><th>Email</th><th>Phone</th></tr>
        </thead>
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
