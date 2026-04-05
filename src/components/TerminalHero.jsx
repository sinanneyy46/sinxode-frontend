import { useEffect, useMemo, useState } from 'react'

function buildSinePath(width, height, amplitude, frequency, phase) {
  const mid = height * 0.5
  const steps = Math.ceil(width / 4)
  let d = ''
  for (let i = 0; i <= steps; i += 1) {
    const t = i / steps
    const x = t * width
    const y = mid + amplitude * Math.sin(frequency * x + phase)
    d += i === 0 ? `M ${x.toFixed(2)} ${y.toFixed(2)}` : ` L ${x.toFixed(2)} ${y.toFixed(2)}`
  }
  return d
}

export default function TerminalHero() {
  const [scrollDepth, setScrollDepth] = useState(0)

  useEffect(() => {
    const onScroll = () => {
      const max = Math.max(document.documentElement.scrollHeight - window.innerHeight, 1)
      const y = window.scrollY / max
      setScrollDepth(Math.min(1, Math.max(0, y)))
    }
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const wave = useMemo(() => {
    const width = 1200
    const height = 200
    const amp = 28 + scrollDepth * 52
    const freq = 0.012 + scrollDepth * 0.022
    const phase = scrollDepth * Math.PI * 3.2
    const path = buildSinePath(width, height, amp, freq, phase)
    return { width, height, path }
  }, [scrollDepth])

  return (
    <header className="terminal-hero">
      <div className="terminal-hero__grid" aria-hidden />
      <svg
        className="terminal-hero__wave"
        viewBox={`0 0 ${wave.width} ${wave.height}`}
        preserveAspectRatio="none"
        aria-hidden
      >
        <defs>
          <linearGradient id="sinxode-wave-grad" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="var(--sx-wave-1)" stopOpacity="0.2" />
            <stop offset="40%" stopColor="var(--sx-wave-2)" stopOpacity="0.85" />
            <stop offset="100%" stopColor="var(--sx-wave-3)" stopOpacity="0.35" />
          </linearGradient>
        </defs>
        <path
          d={wave.path}
          fill="none"
          stroke="url(#sinxode-wave-grad)"
          strokeWidth="3.5"
          strokeLinecap="square"
          style={{
            filter: `drop-shadow(0 0 ${8 + scrollDepth * 18}px var(--sx-wave-glow))`,
          }}
        />
        <path
          d={wave.path}
          fill="none"
          stroke="var(--sx-wave-underlay)"
          strokeWidth="10"
          strokeLinecap="square"
        />
      </svg>

      <h1 className="terminal-hero__title">
        <span className="terminal-hero__sin">SIN</span>
        <span className="terminal-hero__x">X</span>
        <span className="terminal-hero__ode">ODE</span>
      </h1>
      <p className="terminal-hero__tagline">
        Full-stack systems with a cyber-professional edge. Django APIs, React surfaces, and interfaces
        that feel like software—not brochures.
      </p>
      <div className="terminal-hero__meta">
        <span className="terminal-hero__chip">Portfolio v0.1</span>
        <span className="terminal-hero__chip">Scroll ∿ Waveform</span>
        <span className="terminal-hero__chip">Ctrl+K / CMD</span>
      </div>
    </header>
  )
}
