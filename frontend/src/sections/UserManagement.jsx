import { useCallback, useState } from 'react'
import { useFetch } from '../hooks/useFetch'
import { listUsers, setUserRole, setUserLock } from '../api/users'
import SectionShell from '../components/SectionShell'

const ROLE_COLOR = { admin: '#6d28d9', user: '#6b7280' }

export default function UserManagement({ currentUser }) {
  const { data, loading, error, load } = useFetch(useCallback(listUsers, []))
  const [busy, setBusy] = useState({}) // { [userId]: true }
  const rows = data || []

  async function handleRoleToggle(u) {
    const newRole = u.role === 'admin' ? 'user' : 'admin'
    if (!confirm(`Change ${u.username}'s role to "${newRole}"?`)) return
    setBusy(b => ({ ...b, [u.id]: true }))
    try {
      await setUserRole(u.id, newRole)
      load()
    } catch (err) {
      alert(err.message)
    } finally {
      setBusy(b => ({ ...b, [u.id]: false }))
    }
  }

  async function handleLockToggle(u) {
    const locking = !u.is_locked
    const msg = locking
      ? `Lock ${u.username}'s account? They will not be able to log in.`
      : `Unlock ${u.username}'s account?`
    if (!confirm(msg)) return
    setBusy(b => ({ ...b, [u.id]: true }))
    try {
      await setUserLock(u.id, locking)
      load()
    } catch (err) {
      alert(err.message)
    } finally {
      setBusy(b => ({ ...b, [u.id]: false }))
    }
  }

  return (
    <SectionShell
      title="User Management"
      loading={loading}
      error={error}
      empty={!rows.length && 'No users found.'}
      actions={<button className="ds-btn-primary" onClick={load}>↻ Refresh</button>}
    >
      <table className="ds-table">
        <thead>
          <tr>
            <th>#</th>
            <th>Username</th>
            <th>Email</th>
            <th>Role</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {rows.map(u => {
            const isSelf = u.id === currentUser?.id
            const isBusy = busy[u.id]
            return (
              <tr key={u.id}>
                <td className="ds-id">{u.id}</td>
                <td>
                  {u.username}
                  {isSelf && <span className="ds-self-tag"> (you)</span>}
                </td>
                <td className="ds-muted">{u.email}</td>
                <td>
                  <span className="ds-badge" style={{ '--bc': ROLE_COLOR[u.role] || '#6b7280' }}>
                    {u.role}
                  </span>
                </td>
                <td>
                  {u.is_locked
                    ? <span className="ds-badge" style={{ '--bc': '#ef4444' }}>locked</span>
                    : <span className="ds-badge" style={{ '--bc': '#10b981' }}>active</span>
                  }
                </td>
                <td>
                  {isSelf ? (
                    <span className="ds-muted" style={{ fontSize: '0.8rem' }}>—</span>
                  ) : (
                    <div className="ds-action-row">
                      <button
                        className={u.role === 'admin' ? 'ds-btn-demote ds-btn-sm' : 'ds-btn-elevate ds-btn-sm'}
                        onClick={() => handleRoleToggle(u)}
                        disabled={isBusy}
                      >
                        {u.role === 'admin' ? '↓ Demote' : '↑ Elevate'}
                      </button>
                      <button
                        className={u.is_locked ? 'ds-btn-accept ds-btn-sm' : 'ds-btn-reject ds-btn-sm'}
                        onClick={() => handleLockToggle(u)}
                        disabled={isBusy}
                      >
                        {u.is_locked ? '🔓 Unlock' : '🔒 Lock'}
                      </button>
                    </div>
                  )}
                </td>
              </tr>
            )
          })}
        </tbody>
      </table>
    </SectionShell>
  )
}
