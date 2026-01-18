import { Link } from '@tanstack/react-router'
import './Header.css'

export function Header() {
  return (
    <header className="header">
      <Link to="/" className="header__logo">
        <span className="header__logo-icon">📖</span>
        <span className="header__logo-text">Word Drill</span>
      </Link>
      <nav className="header__nav">
        <Link to="/stats" className="header__nav-link">
          <span className="header__nav-link-icon">📊</span>
          <span>統計</span>
        </Link>
      </nav>
    </header>
  )
}
