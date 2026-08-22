import Reveal from './Reveal'
import { credentials, process, profile } from '../data/portfolioData'

export default function About() {
  return (
    <section className="section" id="about">
      <div className="wrap">
        <Reveal>
          <span className="eyebrow">Professional Profile</span>
          <h2 className="section-title">Production Engineering &amp; AI Systems</h2>
        </Reveal>

        <div className="about-grid">
          <Reveal delay={80}>
            <div className="about-copy">
              <p>
                I'm a Computer Science undergraduate who splits time between two things that
                turn out to be the same core discipline: <strong>building reliable full-stack applications</strong> —
                from REST APIs and stateful React interfaces to cost-free local RAG retrieval pipelines serving LLMs.
              </p>
              <p>
                My developer internships equipped me with standard engineering practices: <strong>structured Git
                workflows, API design &amp; testing with Postman, Docker containerization, and automated CI/CD releases</strong> — delivering
                maintainable code built for production.
              </p>

              <div className="cred-card-grid">
                <div className="cred-row">
                  <span className="tag tag-edu">EDU</span>
                  <div>
                    <strong>{credentials.education.school}</strong>
                    <span>{credentials.education.degree} · <strong className="highlight-text">{credentials.education.score}</strong></span>
                    <small className="cred-dates">{credentials.education.date}</small>
                  </div>
                </div>

                <div className="cred-row">
                  <span className="tag tag-cert">CERT</span>
                  <div>
                    <strong>{credentials.certification.name}</strong>
                    <span>{credentials.certification.issuer}</span>
                    <small className="cred-dates">{credentials.certification.date}</small>
                  </div>
                </div>
              </div>

              <div style={{ marginTop: 24 }}>
                <a
                  href={profile.resumeUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  download="Kumaran_M_Resume.pdf"
                  className="btn btn-glow"
                >
                  📄 View Full Resume / Specs
                </a>
              </div>
            </div>
          </Reveal>

          <Reveal delay={160}>
            <div className="process-container">
              <h3 className="process-title">Engineering Process</h3>
              <ul className="process-list">
                {process.map((p, i) => (
                  <li key={p.step}>
                    <span className="process-num">{String(i + 1).padStart(2, '0')}</span>
                    <div>
                      <h4>{p.step}</h4>
                      <p>{p.detail}</p>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  )
}

