import { useState, useEffect } from 'react'
import { listNotifications } from '../api/notifications'

export default function NotifBadge() {
  const [count, setCount] = useState(0)

  useEffect(() => {
    listNotifications()
      .then(data => setCount(data.filter(n => !n.is_read).length))
      .catch(() => {})
  }, [])

  if (!count) return null
  return <span className="ds-notif-badge">{count}</span>
}
