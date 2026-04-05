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
              <radialGradient id="sinxode-radar-beam-grad" cx="100" cy="100" r="92" gradientUnits="userSpaceOnUse">
                <stop offset="0%" stopColor="var(--sx-neon-a)" stopOpacity="0.35" />
                <stop offset="50%" stopColor="var(--sx-neon-a)" stopOpacity="0.18" />
                <stop offset="100%" stopColor="var(--sx-neon-a)" stopOpacity="0.02" />
              </radialGradient>
              <linearGradient id="sinxode-radar-core-grad" x1="100" y1="100" x2="186" y2="100" gradientUnits="userSpaceOnUse">
                <stop offset="0%" stopColor="var(--sx-neon-a)" stopOpacity="0.2" />
                <stop offset="100%" stopColor="var(--sx-neon-a)" stopOpacity="0.95" />
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
                d={`M ${CX} ${CY} L 178 88 A 84 84 0 0 1 178 112 Z`}
              />
              <path className="tech-radar__beam-core" d={`M ${CX} ${CY} L 184 ${CY}`} />
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
