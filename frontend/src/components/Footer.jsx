import { Link } from 'react-router-dom'
import './Footer.css'

export default function Footer() {
  return (
    <footer className="footer">
      <div className="container footer-inner">
        <div className="footer-brand">
          <span className="logo-icon">⬡</span>
          <span>Interview<span className="logo-accent">Coach</span></span>
        </div>
        <nav className="footer-links">
          <Link to="/">Home</Link>
          <Link to="/about">About</Link>
          <Link to="/interview">Practice</Link>
        </nav>
        <p className="footer-copy">Powered by Azure OpenAI &amp; Azure Speech · Built with React + FastAPI</p>
      </div>
    </footer>
  )
}
