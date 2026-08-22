import Reveal from './Reveal'
import { usePortfolioData } from '../context/DataContext'

export default function Experience() {
  const { experience } = usePortfolioData()
  return (
    <section className="section" id="experience">
      <div className="wrap">
        <Reveal>
          <span className="eyebrow">Industry Experience</span>
          <h2 className="section-title">Developer Internships &amp; Track Record</h2>
          <p className="section-sub">
            Hands-on professional software engineering experience working in collaborative developer teams.
          </p>
        </Reveal>

        <Reveal delay={100}>
          <div className="exp-list">
            {experience.map((e) => (
              <div className="exp-item bracket-panel" key={e.id || `${e.role}-${e.date}`}>
                <div className="exp-head">
                  <h3>{e.role}</h3>
                  <div className="org">{e.org}</div>
                  <div className="date">{e.date} · {e.location}</div>
                  <span className="exp-type-tag">{e.type}</span>
                </div>

                <div className="exp-body">
                  <ul className="exp-points">
                    {e.points.map((pt, idx) => (
                      <li key={idx}>{pt}</li>
                    ))}
                  </ul>

                  {e.skills && (
                    <div className="exp-skills-row">
                      {e.skills.map((skill) => (
                        <span className="chip" key={skill}>{skill}</span>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </Reveal>
      </div>
    </section>
  )
}

