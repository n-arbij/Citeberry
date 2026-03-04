import { useCallback } from 'react'
import { useFetch } from '../hooks/useFetch'
import { listJoinRequests, acceptJoinRequest, rejectJoinRequest } from '../api/organizations'
import SectionShell from '../components/SectionShell'

export default function JoinRequests({ user }) {
  const orgShortId = user?.organization?.id
  const { data, loading, error, load } = useFetch(
    useCallback(() => orgShortId ? listJoinRequests(orgShortId) : Promise.resolve([]), [orgShortId])
  )
  const rows = data || []

  async function handleAccept(id) {
    await acceptJoinRequest(orgShortId, id)
    load()
  }
  async function handleReject(id) {
    await rejectJoinRequest(orgShortId, id)
    load()
  }

  return (
    <SectionShell
      title="Join Requests"
      loading={loading}
      error={error}
      empty={!rows.length && 'No join requests.'}
      actions={<button className="ds-btn-primary" onClick={load}>↻ Refresh</button>}
    >
      <table className="ds-table">
        <thead>
          <tr><th>#</th><th>User</th><th>Status</th><th>Requested</th><th>Actions</th></tr>
        </thead>
        <tbody>
          {rows.map(r => (
            <tr key={r.id}>
              <td className="ds-id">{r.id}</td>
              <td>User #{r.user_id}</td>
              <td>
                <span className="ds-badge" style={{
                  '--bc': r.status === 'pending' ? '#f59e0b' : r.status === 'accepted' ? '#10b981' : '#ef4444'
                }}>{r.status}</span>
              </td>
              <td className="ds-muted">{new Date(r.created_at).toLocaleDateString()}</td>
              <td>
                {r.status === 'pending' && (
                  <div className="ds-action-row">
                    <button className="ds-btn-accept" onClick={() => handleAccept(r.id)}>✓ Accept</button>
                    <button className="ds-btn-reject" onClick={() => handleReject(r.id)}>✗ Reject</button>
                  </div>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </SectionShell>
  )
}
