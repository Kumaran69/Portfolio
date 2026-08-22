import { useState } from 'react'
import Reveal from './Reveal'
import { stack } from '../data/portfolioData'

export default function Skills() {
  const [searchTerm, setSearchTerm] = useState('')

  const handleClear = () => setSearchTerm('')

  return (
    <section className="section" id="stack">
      <div className="wrap">
        <Reveal>
          <div className="skills-header-row">
            <div>
              <span className="eyebrow">Technical Competencies</span>
              <h2 className="section-title">Six-Layer Architecture Stack</h2>
              <p className="section-sub">
                Every skill listed below has been implemented and shipped in production repositories or client intern projects.
              </p>
            </div>

            {/* Skill Search Input */}
            <div className="skill-search-box">
              <span className="search-icon">🔍</span>
              <input
                type="text"
                placeholder="Search skills (e.g. Docker, Python, AWS)..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                aria-label="Search skills"
              />
              {searchTerm && (
                <button className="search-clear-btn" onClick={handleClear} aria-label="Clear search">
                  ✕
                </button>
              )}
            </div>
          </div>
        </Reveal>

        <Reveal delay={100}>
          <div className="stack-grid">
            {stack.map((s) => {
              const matchedItems = s.items.filter((item) =>
                item.toLowerCase().includes(searchTerm.toLowerCase().trim())
              )
              const isCategoryMatch = s.name.toLowerCase().includes(searchTerm.toLowerCase().trim())
              const isMatch = matchedItems.length > 0 || isCategoryMatch

              return (
                <div
                  className={`stack-cell ${searchTerm && !isMatch ? 'is-dimmed' : ''} ${searchTerm && isMatch ? 'is-highlighted' : ''}`}
                  key={s.layer}
                >
                  <div className="stack-cell-head">
                    <span className="layer-id">{s.layer}</span>
                    <h3>{s.name}</h3>
                    <span className="layer-count">{s.items.length} tools</span>
                  </div>
                  <div className="chip-row">
                    {s.items.map((item) => {
                      const isHighlighted =
                        searchTerm.trim() !== '' &&
                        item.toLowerCase().includes(searchTerm.toLowerCase().trim())

                      return (
                        <span
                          className={`chip ${isHighlighted ? 'chip-active' : ''}`}
                          key={item}
                        >
                          {item}
                        </span>
                      )
                    })}
                  </div>
                </div>
              )
            })}
          </div>
        </Reveal>
      </div>
    </section>
  )
}

