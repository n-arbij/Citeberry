const stats = [
  { number: '10k+', label: 'Quotes created' },
  { number: '99.9%', label: 'Uptime SLA' },
  { number: '< 200ms', label: 'API response time' },
  { number: 'Free', label: 'To get started' },
]

export default function Stats() {
  return (
    <section className="stats">
      <div className="container">
        <div className="stats-grid">
          {stats.map((s) => (
            <div key={s.label} className="stat-card">
              <div className="stat-number gradient-text">{s.number}</div>
              <div className="stat-label">{s.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
