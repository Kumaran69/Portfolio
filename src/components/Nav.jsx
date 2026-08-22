import { useState } from 'react'
import ThemeToggle from './ThemeToggle'
import { profile } from '../data/portfolioData'

const LINKS = [
  { href: '#about', label: 'About' },
  { href: '#stack', label: 'Stack' },
  { href: '#projects', label: 'Projects' },
  { href: '#experience', label: 'Experience' },
  { href: '#contact', label: 'Contact' },
]

export default function Nav() {
  const [open, setOpen] = useState(false)

  return (
    <header className="nav">
      <div className="wrap nav-inner">
        <a href="#top" className="nav-mark" onClick={() => setOpen(false)}>
          <span className="box">KM</span>
          <span>Kumaran M</span>
        </a>

        <ul className="nav-links nav-links-mobile-hide">
          {LINKS.map((l) => (
            <li key={l.href}>
              <a href={l.href}>{l.label}</a>
            </li>
          ))}
        </ul>

        <div className="nav-right-actions">
          <ThemeToggle />

          <a
            href={profile.resumeUrl}
            target="_blank"
            rel="noopener noreferrer"
            download="Kumaran_M_Resume.pdf"
            className="btn btn-ghost nav-resume-btn"
          >
            <span>📄</span> Resume
          </a>

          <a href="#contact" className="btn nav-cta">
            Hire me →
          </a>

          <button
            className={`nav-burger ${open ? 'is-open' : ''}`}
            aria-label={open ? 'Close menu' : 'Open menu'}
            aria-expanded={open}
            onClick={() => setOpen((v) => !v)}
          >
            <span />
            <span />
          </button>
        </div>
      </div>

      <div className={`nav-mobile ${open ? 'is-open' : ''}`}>
        <ul>
          {LINKS.map((l) => (
            <li key={l.href}>
              <a href={l.href} onClick={() => setOpen(false)}>{l.label}</a>
            </li>
          ))}
          <li>
            <a
              href={profile.resumeUrl}
              target="_blank"
              rel="noopener noreferrer"
              download="Kumaran_M_Resume.pdf"
              className="btn btn-ghost"
              style={{ width: '100%', justifyContent: 'center' }}
            >
              📄 Download Resume / CV
            </a>
          </li>
          <li>
            <a href="#contact" onClick={() => setOpen(false)} className="btn" style={{ width: '100%', justifyContent: 'center' }}>
              Hire me →
            </a>
          </li>
        </ul>
      </div>
    </header>
  )
}

