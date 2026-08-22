import { useMemo, useState } from 'react'
import Reveal from './Reveal'
import ProjectModal from './ProjectModal'
import { projectCategories } from '../data/portfolioData'
import { usePortfolioData } from '../context/DataContext'

export default function Projects() {
  const { projects } = usePortfolioData()
  const [activeCategory, setActiveCategory] = useState('All')
  const [selectedProject, setSelectedProject] = useState(null)

  const categories = useMemo(() => {
    const fromData = Array.from(new Set(projects.map((p) => p.category))).filter(Boolean)
    const base = projectCategories.filter((c) => c === 'All' || fromData.includes(c))
    fromData.forEach((c) => { if (!base.includes(c)) base.push(c) })
    return base.length ? base : projectCategories
  }, [projects])

  const filteredProjects = activeCategory === 'All'
    ? projects
    : projects.filter((p) => p.category === activeCategory)

  return (
    <section className="section" id="projects">
      <div className="wrap">
        <Reveal>
          <div className="projects-header-row">
            <div>
              <span className="eyebrow">Production Portfolio</span>
              <h2 className="section-title">End-to-End System Builds</h2>
              <p className="section-sub">
                Real-world full-stack platforms, local RAG AI tools, and predictive ML systems with complete architecture specs.
              </p>
            </div>

            {/* Category Filter Tabs */}
            <div className="project-filter-tabs" role="tablist">
              {categories.map((cat) => (
                <button
                  key={cat}
                  role="tab"
                  aria-selected={activeCategory === cat}
                  className={`filter-tab ${activeCategory === cat ? 'is-active' : ''}`}
                  onClick={() => setActiveCategory(cat)}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>
        </Reveal>

        <div className="projects-grid">
          {filteredProjects.map((p, i) => (
            <Reveal delay={i * 90} key={p.id}>
              <article className="bracket-panel project-card">
                <div className="project-meta-col">
                  <div>
                    <div className="project-top-tags">
                      <span className="project-code">{p.code}</span>
                      <span className="project-category-badge">{p.category}</span>
                    </div>
                    <h3>{p.name}</h3>
                    <p className="project-tagline">{p.tagline}</p>
                  </div>
                  
                  <div className="project-metric-pill">
                    ⚡ {p.metrics}
                  </div>
                </div>

                <div className="project-content-col">
                  <p className="project-desc">{p.description}</p>
                  <ul className="project-highlights">
                    {p.highlights.map((h, idx) => (
                      <li key={idx}>{h}</li>
                    ))}
                  </ul>

                  <div className="project-stack">
                    {p.stack.map((s) => (
                      <span className="chip" key={s}>{s}</span>
                    ))}
                  </div>

                  <div className="project-action-row">
                    <button
                      className="btn btn-ghost project-arch-btn"
                      onClick={() => setSelectedProject(p)}
                    >
                      🔍 Architecture Specs
                    </button>
                    <a href={p.link} target="_blank" rel="noreferrer" className="project-link">
                      {p.linkLabel} →
                    </a>
                    {p.githubLink && (
                      <a href={p.githubLink} target="_blank" rel="noreferrer" className="project-github-link" title="GitHub Repository">
                        GitHub ↗
                      </a>
                    )}
                  </div>
                </div>
              </article>
            </Reveal>
          ))}
        </div>

        {/* Project Modal */}
        {selectedProject && (
          <ProjectModal
            project={selectedProject}
            onClose={() => setSelectedProject(null)}
          />
        )}
      </div>
    </section>
  )
}

