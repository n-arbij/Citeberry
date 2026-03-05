import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Overview from '../sections/Overview'
import Invoices from '../sections/Invoices'
import Quotes from '../sections/Quotes'
import Clients from '../sections/Clients'
import NotificationList from '../sections/NotificationList'
import UserProfile from '../sections/UserProfile'
import NotifBadge from '../components/NotifBadge'
import './Dashboard.css'

const NAV = [
  { id: 'overview',      label: 'Overview',      icon: '📊' },
  { id: 'invoices',      label: 'Invoices',       icon: '🧾' },
  { id: 'quotes',        label: 'Quotes',         icon: '📝' },
  { id: 'clients',       label: 'Clients',        icon: '👥' },
  { id: 'notifications', label: 'Notifications',  icon: '🔔' },
]

export default function UserDashboard({ user }) {
  const navigate = useNavigate()
  const [section, setSection] = useState('overview')

  function signOut() { localStorage.removeItem('token'); navigate('/login') }

  function renderSection() {
    switch (section) {
      case 'invoices':      return <Invoices />
      case 'quotes':        return <Quotes />
      case 'clients':       return <Clients />
      case 'notifications': return <NotificationList />
      case 'profile':       return <UserProfile user={user} onUpdated={() => window.location.reload()} />
      default:              return <Overview user={user} onNavigate={setSection} />
    }
  }

  return (
    <div className="ds-app">
      <aside className="ds-sidebar">
        <div className="ds-sidebar-logo">cite<span>berry</span></div>
        <div className="ds-org-name">{user?.organization?.name || 'Organization'}</div>
        <nav className="ds-nav">
          {NAV.map(item => (
            <button
              key={item.id}
              className={`ds-nav-item${section === item.id ? ' active' : ''}`}
              onClick={() => setSection(item.id)}
            >
              <span className="ds-nav-icon">{item.icon}</span>
              {item.label}
              {item.id === 'notifications' && <NotifBadge />}
            </button>
          ))}
        </nav>
        <div className="ds-sidebar-footer">
          <div className="ds-user-pill ds-user-pill-link" onClick={() => setSection('profile')} title="View profile">
            <span className="ds-user-avatar">{user?.username?.[0]?.toUpperCase()}</span>
            <div>
              <div className="ds-user-name">{user?.username}</div>
              <div className="ds-user-role">Member</div>
            </div>
          </div>
          <button className="ds-signout" onClick={signOut}>Sign out</button>
        </div>
      </aside>
      <main className="ds-main">
        {renderSection()}
      </main>
    </div>
  )
}
