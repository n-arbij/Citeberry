export default function Navbar() {
  return (
    <nav className="navbar">
      <div className="container navbar-inner">
        <a href="#" className="nav-logo">
          cite<span>berry</span>
        </a>

        <ul className="nav-links">
          <li><a href="#features">Features</a></li>
          <li><a href="#how">How it works</a></li>
          <li><a href="#pricing">Pricing</a></li>
          <li><a href="#">Docs</a></li>
        </ul>

        <div className="nav-cta">
          <button className="btn-ghost">Sign in</button>
          <button className="btn-primary">Get started free</button>
        </div>
      </div>
    </nav>
  )
}
