const links = {
  Product: ['Features', 'Pricing', 'Changelog', 'Roadmap'],
  Developers: ['API Docs', 'SDKs', 'Status', 'Open Source'],
  Company: ['About', 'Blog', 'Careers', 'Contact'],
}

export default function Footer() {
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-inner">
          <div className="footer-brand">
            <div className="nav-logo" style={{ fontSize: '1.1rem' }}>
              cite<span style={{ color: 'var(--purple-lt)' }}>berry</span>
            </div>
            <p>
              The modern quoting and invoicing platform built for teams that
              move fast and bill smart.
            </p>
          </div>

          {Object.entries(links).map(([heading, items]) => (
            <div key={heading} className="footer-col">
              <h4>{heading}</h4>
              <ul>
                {items.map((item) => (
                  <li key={item}>
                    <a href="#">{item}</a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="footer-bottom">
          <p>© {new Date().getFullYear()} Citeberry. All rights reserved.</p>
          <p>
            <a href="#" style={{ marginRight: 16 }}>Privacy</a>
            <a href="#">Terms</a>
          </p>
        </div>
      </div>
    </footer>
  )
}
