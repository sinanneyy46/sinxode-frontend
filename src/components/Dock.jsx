import { NavLink } from 'react-router-dom'

const links = [
  { to: '/', label: 'Shell' },
  { to: '/projects', label: 'Projects' },
]

export default function Dock() {
  return (
    <nav className="dock" aria-label="Primary">
      {links.map(({ to, label }) => (
        <NavLink
          key={to}
          to={to}
          className={({ isActive }) => `dock__link${isActive ? ' dock__link--active' : ''}`}
          end={to === '/'}
        >
          {label}
        </NavLink>
      ))}
    </nav>
  )
}
