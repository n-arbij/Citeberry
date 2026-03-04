export default function Hero() {
  return (
    <section className="hero dot-bg">
      <div className="container" style={{ width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <div className="hero-badge fade-up">
          <span className="hero-badge-dot" />
          Now in public beta — free to get started
        </div>

        <h1 className="fade-up-1">
          <span className="gradient-text">Quotes & Invoices</span>
          <br />built for modern teams
        </h1>

        <p className="hero-sub fade-up-2">
          Create professional quotes, convert them to invoices, and collaborate
          across your organization — all in one beautiful, fast platform.
        </p>

        <div className="hero-actions fade-up-3">
          <button className="btn-hero btn-hero-primary">Start for free →</button>
          <button className="btn-hero btn-hero-secondary">View demo</button>
        </div>

        {/* mock dashboard preview */}
        <div className="hero-preview fade-up-4">
          <div className="preview-topbar">
            <div className="preview-dot" style={{ background: '#ff5f56' }} />
            <div className="preview-dot" style={{ background: '#ffbd2e' }} />
            <div className="preview-dot" style={{ background: '#27c93f' }} />
          </div>
          <div className="preview-rows">
            <div className="preview-row w-1-4" />
            <div className="preview-row w-full" />
            <div className="preview-row w-3-4" />
            <div className="preview-row w-1-2" />
          </div>
          <div className="preview-grid">
            <div className="preview-card" style={{ borderColor: 'rgba(139,92,246,0.3)' }} />
            <div className="preview-card" />
            <div className="preview-card" style={{ borderColor: 'rgba(6,182,212,0.3)' }} />
          </div>
        </div>
      </div>
    </section>
  )
}
