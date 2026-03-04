const features = [
  {
    icon: '⚡',
    bg: 'rgba(124,58,237,0.15)',
    title: 'Instant Quote Builder',
    desc: 'Create itemized quotes in seconds with real-time totals, line items, and automatic tax calculations.',
  },
  {
    icon: '🧾',
    bg: 'rgba(6,182,212,0.15)',
    title: 'One-click Invoicing',
    desc: 'Convert any accepted quote directly into a professional invoice — no re-entering data.',
  },
  {
    icon: '🏢',
    bg: 'rgba(16,185,129,0.15)',
    title: 'Organization Workspaces',
    desc: 'Invite your team, manage roles, and keep all quotes and invoices scoped to your organization.',
  },
  {
    icon: '🔐',
    bg: 'rgba(245,158,11,0.15)',
    title: 'Role-based Access',
    desc: 'Admins control who joins and what they can see. Every action is logged for full audit trails.',
  },
  {
    icon: '📊',
    bg: 'rgba(239,68,68,0.15)',
    title: 'Activity Logs',
    desc: 'Complete visibility into every create, update, and delete across your organization — for security and compliance.',
  },
  {
    icon: '🔔',
    bg: 'rgba(168,85,247,0.15)',
    title: 'Smart Notifications',
    desc: 'Stay in the loop with real-time notifications scoped to your organization and team activity.',
  },
]

export default function Features() {
  return (
    <section className="features" id="features">
      <div className="container" style={{ textAlign: 'center' }}>
        <span className="section-label">Features</span>
        <h2 className="section-title">
          Everything your team needs to{' '}
          <span className="gradient-text">get paid faster</span>
        </h2>
        <p className="section-sub">
          A complete quoting and invoicing toolkit designed for speed, clarity, and collaboration.
        </p>

        <div className="features-grid">
          {features.map((f) => (
            <div key={f.title} className="feature-card">
              <div className="feature-icon" style={{ background: f.bg }}>
                {f.icon}
              </div>
              <h3>{f.title}</h3>
              <p>{f.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
