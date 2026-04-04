/** Polar positions on the radar disc (degrees, 0 = 3 o'clock, clockwise). */
export const RADAR_BLIPS = [
  { id: 'react', label: 'React', angleDeg: 18 },
  { id: 'scss', label: 'SCSS', angleDeg: 90 },
  { id: 'django', label: 'Django', angleDeg: 162 },
  { id: 'vercel', label: 'Vercel', angleDeg: 234 },
  { id: 'render', label: 'Render', angleDeg: 306 },
]

const TAU = Math.PI * 2

export function polarToSvg(cx, cy, r, angleDeg) {
  const rad = (angleDeg * TAU) / 360
  return {
    x: cx + r * Math.cos(rad),
    y: cy + r * Math.sin(rad),
  }
}

/** Beam leading edge angle (deg), synchronized with CSS 6s rotation. */
export function beamLeadingAngleDeg(nowMs, periodMs = 6000) {
  return ((nowMs / periodMs) % 1) * 360
}

export function angularDistanceDeg(a, b) {
  const d = Math.abs(a - b) % 360
  return Math.min(d, 360 - d)
}

export function isBlipLit(beamDeg, blipDeg, windowDeg = 26) {
  return angularDistanceDeg(beamDeg, blipDeg) < windowDeg
}
