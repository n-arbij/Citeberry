import { useCallback } from 'react'
import { useFetch } from '../hooks/useFetch'
import { listNotifications } from '../api/notifications'
import SectionShell from '../components/SectionShell'

export default function NotificationList() {
  const { data, loading, error, load } = useFetch(useCallback(listNotifications, []))
  const rows = data || []

  return (
    <SectionShell
      title="Notifications"
      loading={loading}
      error={error}
      empty={!rows.length && 'No notifications.'}
      actions={<button className="ds-btn-primary" onClick={load}>↻ Refresh</button>}
    >
      <ul className="ds-notif-list">
        {rows.map(n => (
          <li key={n.id} className="ds-notif-item">
            <div className="ds-notif-body">
              {n.title && <strong>{n.title}</strong>}
              <p>{n.message}</p>
            </div>
            <span className="ds-muted ds-notif-date">{new Date(n.created_at).toLocaleDateString()}</span>
          </li>
        ))}
      </ul>
    </SectionShell>
  )
}
