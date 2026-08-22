import { useEffect } from 'react'

export default function ProjectModal({ project, onClose }) {
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', handleKeyDown)
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', handleKeyDown)
      document.body.style.overflow = 'unset'
    }
  }, [onClose])

  if (!project) return null

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div
        className="modal-content bracket-panel"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
      >
        <button className="modal-close" onClick={onClose} aria-label="Close modal">
          ✕
        </button>

        <div className="modal-header">
          <div className="modal-meta-top">
            <span className="project-code">{project.code}</span>
            <span className="modal-category-badge">{project.category}</span>
            <span className="project-date">REV — {project.date}</span>
          </div>
          <h2 id="modal-title" className="modal-title">{project.name}</h2>
          <p className="project-tagline">{project.tagline}</p>
        </div>

        <div className="modal-body">
          <div className="modal-section">
            <h4>Overview & Objective</h4>
            <p className="modal-desc">{project.description}</p>
          </div>

          {project.architecture && (
            <div className="modal-section">
              <h4>System Architecture & Tech Breakdown</h4>
              <div className="modal-arch-grid">
                {project.architecture.map((item, i) => (
                  <div key={i} className="modal-arch-item">
                    <span className="modal-arch-bullet">⚡</span>
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="modal-section">
            <h4>Key Deliverables & Impact</h4>
            <ul className="project-highlights">
              {project.highlights.map((h, i) => (
                <li key={i}>{h}</li>
              ))}
            </ul>
          </div>

          <div className="modal-section">
            <h4>Technologies Used</h4>
            <div className="project-stack">
              {project.stack.map((s) => (
                <span className="chip" key={s}>{s}</span>
              ))}
            </div>
          </div>
        </div>

        <div className="modal-footer">
          <a
            href={project.link}
            target="_blank"
            rel="noreferrer"
            className="btn btn-glow"
          >
            {project.linkLabel} →
          </a>
          {project.githubLink && (
            <a
              href={project.githubLink}
              target="_blank"
              rel="noreferrer"
              className="btn btn-ghost"
            >
              GitHub Repo ↗
            </a>
          )}
        </div>
      </div>
    </div>
  )
}
