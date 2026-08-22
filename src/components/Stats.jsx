import Reveal from './Reveal'
import CountUp from './CountUp'
import { stats } from '../data/portfolioData'

export default function Stats() {
  return (
    <div className="wrap">
      <Reveal>
        <div className="stats-strip">
          {stats.map((s, i) => (
            <div className="stat-cell" key={s.label} style={{ transitionDelay: `${i * 90}ms` }}>
              <div className="stat-value">
                <CountUp value={s.value} suffix={s.suffix} />
              </div>
              <div className="stat-label">{s.label}</div>
            </div>
          ))}
        </div>
      </Reveal>
    </div>
  )
}
