import { Link } from 'react-router-dom'

export default function Navbar() {
  return (
    <nav className="navbar">
      <div className="container navbar-inner">
        <Link to="/" className="nav-logo">
          cite<span>berry</span>
        </Link>

        <ul className="nav-links">
          <li><a href="#features">Features</a></li>
          <li><a href="#how">How it works</a></li>
          <li><a href="#pricing">Pricing</a></li>
          <li><a href="#">Docs</a></li>
        </ul>

        <div className="nav-cta">
          <Link to="/login" className="btn-ghost">Sign in</Link>
          <Link to="/register" className="btn-primary">Get started free</Link>
        </div>
      </div>
    </nav>
  )
}
