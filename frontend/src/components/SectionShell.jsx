/**
 * Shared shell for every dashboard section.
 * Renders a consistent header + handles loading / error / empty states.
 */
export default function SectionShell({ title, actions, loading, error, empty, children }) {
  return (
    <div className="ds-section">
      <div className="ds-section-header">
        <h2>{title}</h2>
        {actions && <div className="ds-section-actions">{actions}</div>}
      </div>

      {loading && <div className="ds-loading">Loading…</div>}
      {!loading && error && <div className="ds-error-msg">{error}</div>}
      {!loading && !error && empty && <div className="ds-empty">{empty}</div>}
      {!loading && !error && !empty && children}
    </div>
  )
}
