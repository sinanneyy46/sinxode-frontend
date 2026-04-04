import { useEffect, useState } from 'react'
import { RADAR_BLIPS, beamLeadingAngleDeg, isBlipLit, polarToSvg } from '../lib/radar'

const CX = 100
const CY = 100
const R = 76

export default function TechRadar() {
  const [hit, setHit] = useState(() => ({}))

  useEffect(() => {
    let id
    const tick = () => {
      const beam = beamLeadingAngleDeg(performance.now(), 6000)
      const next = {}
      RADAR_BLIPS.forEach((b) => {
        next[b.id] = isBlipLit(beam, b.angleDeg, 28)
      })
      setHit(next)
      id = requestAnimationFrame(tick)
    }
    id = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(id)
  }, [])

  return (
    <section className="tech-radar" aria-label="Tech radar">
      <div className="tech-radar__chrome">
        <div className="tech-radar__title">Tech radar · live sweep</div>
        <div className="tech-radar__svg-wrap">
          <svg className="tech-radar__svg" viewBox="0 0 200 200" aria-hidden>
            <defs>
              <linearGradient id="sinxode-radar-beam-grad" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="var(--sx-neon-a)" stopOpacity="0" />
                <stop offset="100%" stopColor="var(--sx-neon-a)" stopOpacity="0.65" />
              </linearGradient>
            </defs>
            {[28, 52, 76].map((r, i) => (
              <circle
                key={r}
                className={`tech-radar__ring${i === 2 ? ' tech-radar__ring--major' : ''}`}
                cx={CX}
                cy={CY}
                r={r}
              />
            ))}
            <line className="tech-radar__axis tech-radar__axis--major" x1={CX} y1={CY} x2={200} y2={CY} />
            <line className="tech-radar__axis" x1={CX} y1={CY} x2={CX} y2={0} />
            <g className="tech-radar__beam">
              <path
                className="tech-radar__beam-shape"
                d={`M ${CX} ${CY} L 200 ${CY} A 100 100 0 0 0 ${CX + 28} ${CY - 18} Z`}
              />
            </g>
            {RADAR_BLIPS.map((b) => {
              const p = polarToSvg(CX, CY, R, b.angleDeg)
              return (
                <g key={b.id}>
                  <circle
                    className={`tech-radar__blip${hit[b.id] ? ' tech-radar__blip--hit' : ''}`}
                    cx={p.x}
                    cy={p.y}
                    r={hit[b.id] ? 7 : 4.5}
                    fill="var(--sx-neon-a)"
                  />
                  <text className="tech-radar__blip-label" x={p.x} y={p.y + 14}>
                    {b.label}
                  </text>
                </g>
              )
            })}
          </svg>
        </div>
      </div>
    </section>
  )
}
