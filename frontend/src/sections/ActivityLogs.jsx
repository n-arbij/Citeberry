import { useCallback } from 'react'
import { useFetch } from '../hooks/useFetch'
import { listActivityLogs } from '../api/activityLogs'
import SectionShell from '../components/SectionShell'

export default function ActivityLogs() {
  const { data, loading, error, load } = useFetch(useCallback(listActivityLogs, []))
  const rows = data || []

  return (
    <SectionShell
      title="Activity Logs"
      loading={loading}
      error={error}
      empty={!rows.length && 'No activity recorded yet.'}
      actions={<button className="ds-btn-primary" onClick={load}>↻ Refresh</button>}
    >
      <table className="ds-table">
        <thead>
          <tr><th>#</th><th>User</th><th>Action</th><th>Resource</th><th>Details</th><th>Time</th></tr>
        </thead>
        <tbody>
          {rows.map(l => (
            <tr key={l.id}>
              <td className="ds-id">{l.id}</td>
              <td>{l.username || `#${l.user_id}`}</td>
              <td><span className="ds-tag">{l.action}</span></td>
              <td className="ds-muted">{l.resource_type}{l.resource_id ? ` #${l.resource_id}` : ''}</td>
              <td className="ds-muted">{l.details || '—'}</td>
              <td className="ds-muted">{new Date(l.created_at).toLocaleString()}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </SectionShell>
  )
}
