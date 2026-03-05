import { useCallback } from 'react'
import { useFetch } from '../hooks/useFetch'
import { listNotifications, markNotificationRead } from '../api/notifications'
import SectionShell from '../components/SectionShell'

export default function NotificationList() {
  const { data, loading, error, load } = useFetch(useCallback(listNotifications, []))
  const rows = data || []
  const unread = rows.filter(n => !n.is_read).length

  async function handleMarkRead(id) {
    await markNotificationRead(id)
    load()
  }

  return (
    <SectionShell
      title={`Notifications${unread ? ` (${unread} unread)` : ''}`}
      loading={loading}
      error={error}
      empty={!rows.length && 'No notifications.'}
      actions={<button className="ds-btn-primary" onClick={load}>↻ Refresh</button>}
    >
      <ul className="ds-notif-list">
        {rows.map(n => (
          <li key={n.id} className={`ds-notif-item${n.is_read ? '' : ' ds-notif-unread'}`}>
            <div className="ds-notif-body">
              {n.title && <strong>{n.title}</strong>}
              <p>{n.message}</p>
            </div>
            <div className="ds-notif-meta">
              <span className="ds-muted ds-notif-date">{new Date(n.created_at).toLocaleDateString()}</span>
              {!n.is_read && (
                <button className="ds-notif-read-btn" onClick={() => handleMarkRead(n.id)}>
                  Mark read
                </button>
              )}
            </div>
          </li>
        ))}
      </ul>
    </SectionShell>
  )
}
