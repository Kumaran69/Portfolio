import { useRef, useState } from 'react'
import { stack } from '../data/portfolioData'
import { usePortfolioData } from '../context/DataContext'
import { asset } from '../src/asset' // ← update this path to wherever your asset() helper actually lives

export default function Hero() {
  const { profile } = usePortfolioData()
  const featured = stack.slice(0, 4)
  const heroRef = useRef(null)
  const [copied, setCopied] = useState(false)

  const handleMouseMove = (e) => {
    const node = heroRef.current
    if (!node) return
    const rect = node.getBoundingClientRect()
    node.style.setProperty('--mx', `${e.clientX - rect.left}px`)
    node.style.setProperty('--my', `${e.clientY - rect.top}px`)
  }

  const handleCopyEmail = async () => {
    try {
      await navigator.clipboard.writeText(profile.email)
      setCopied(true)
      setTimeout(() => setCopied(false), 2500)
    } catch {
      // Fallback
    }
  }

  return (
    <section className="hero" id="top" ref={heroRef} onMouseMove={handleMouseMove}>
      <div className="hero-glow" aria-hidden="true" />
      <div className="wrap hero-grid">
        <div className="hero-copy-in">
          <div className="hero-top-bar">
            <span className="status-chip">
              <span className="status-dot" />
              {profile.availability}
            </span>
          </div>

          <h1>
            Engineering full-stack products <span>&amp; production AI systems</span>.
          </h1>

          <p className="hero-role">{profile.summary}</p>

          {/* Recruiter Quick Glance Pills */}
          <div className="recruiter-badge-grid">
            {profile.recruiterBadges.map((badge, idx) => (
              <div className="recruiter-pill" key={idx}>
                <span className="recruiter-pill-icon">{badge.icon}</span>
                <div>
                  <strong>{badge.label}</strong>
                  <small>{badge.detail}</small>
                </div>
              </div>
            ))}
          </div>

          <div className="hero-actions">
            <a
              href={profile.resumeUrl}
              target="_blank"
              rel="noopener noreferrer"
              download="Kumaran_M_Resume.pdf"
              className="btn btn-glow"
            >
              📄 Download Resume / CV
            </a>
            <a href="#projects" className="btn btn-ghost">
              View Work ↓
            </a>
            <a href="#contact" className="btn btn-ghost">
              Get in Touch →
            </a>
          </div>

          <div className="hero-meta">
            <span>📍 {profile.location}</span>
            <button onClick={handleCopyEmail} className="email-copy-btn">
              {copied ? '✓ Email Copied!' : `✉️ ${profile.email}`}
            </button>
            <a href={profile.github} target="_blank" rel="noreferrer">GitHub</a>
            <a href={profile.linkedin} target="_blank" rel="noreferrer">LinkedIn</a>
          </div>
        </div>

        <div className="schematic schematic-in" aria-hidden="false">
          {/* Profile Photo */}
          {profile.photo && (
            <div className="profile-photo-wrap">
              <div className="profile-photo-frame">
                <img
                  src={asset(profile.photo)}
                  alt={`${profile.name} — profile photo`}
                  className="profile-photo"
                  loading="lazy"
                />
              </div>
              <span className="profile-photo-ring" aria-hidden="true" />
            </div>
          )}

          <span className="schematic-label">Architecture Capability Matrix</span>
          <div className="schematic-nodes">
            {featured.map((s, i) => (
              <div className="snode snode-in" key={s.layer} style={{ animationDelay: `${400 + i * 130}ms` }}>
                <span className="snode-idx">{s.layer}</span>
                <span className="snode-line" />
                <span className="snode-bar">
                  <strong>{s.name}</strong>
                  <small>{s.items.slice(0, 3).join(' · ')}</small>
                </span>
              </div>
            ))}
          </div>

          <div className="title-block">
            <div>
              <span>Candidate</span>
              <strong>{profile.name}</strong>
            </div>
            <div>
              <span>Specialization</span>
              <strong>Full-Stack / AI RAG / Cloud</strong>
            </div>
            <div>
              <span>Degree &amp; Status</span>
              <strong>B.E. CSE Final Year</strong>
            </div>
            <div>
              <span>Cloud Cert</span>
              <strong>AWS Cloud Practitioner</strong>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}