import { useEffect, useState } from 'react'
import ProjectGrid from '../components/ProjectGrid'

export default function ProjectsPage() {
  const [projects, setProjects] = useState([])

  useEffect(() => {
    const ac = new AbortController()
    fetch('/api/projects/', { signal: ac.signal })
      .then((r) => (r.ok ? r.json() : []))
      .then((raw) => {
        const arr = Array.isArray(raw) ? raw : raw.results ?? []
        setProjects(arr)
      })
      .catch(() => setProjects([]))
    return () => ac.abort()
  }, [])

  return (
    <div className="projects-page">
      <header className="projects-page__head">
        <h1 className="projects-page__title">Project matrix</h1>
        <p className="projects-page__sub">
          Canonical build queue · status-coded neon · glass system windows. Tap a module for the full brief.
        </p>
      </header>
      <ProjectGrid projects={projects} />
    </div>
  )
}
