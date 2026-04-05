import { AnimatePresence, motion } from 'framer-motion'
import { useEffect } from 'react'
import { createPortal } from 'react-dom'
import { X } from 'lucide-react'
import { ProjectStackIcon } from '../lib/projectStackIcon'

export default function ProjectModal({ project, onClose }) {
  useEffect(() => {
    if (!project) return undefined
    const prev = document.body.style.overflow
    document.documentElement.classList.add('sinxode-project-modal-open')
    document.body.style.overflow = 'hidden'
    const onKey = (e) => {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', onKey)
    return () => {
      document.documentElement.classList.remove('sinxode-project-modal-open')
      document.body.style.overflow = prev
      window.removeEventListener('keydown', onKey)
    }
  }, [project, onClose])

  const modalTree = (
    <AnimatePresence>
      {project ? (
        <motion.div
          className="project-modal__overlay"
          role="presentation"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.22 }}
          onMouseDown={(e) => {
            if (e.target === e.currentTarget) onClose()
          }}
        >
          <motion.div
            className={`project-modal__window project-modal__window--status-${String(project.status || 'STABLE')
              .toLowerCase()
              .replace(/_/g, '-')}`}
            role="dialog"
            aria-modal="true"
            aria-labelledby="project-modal-title"
            initial={{ opacity: 0, scale: 0.96, y: 16 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.98, y: 10 }}
            transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
          >
            <header className="project-modal__head">
              <div className="project-modal__head-left">
                <span className="project-modal__order">
                  {String(project.matrix_order ?? 0).padStart(2, '0')}
                </span>
                <span className="project-modal__tag">{project.matrix_tag}</span>
                <span
                  className={`project-modal__status-badge project-modal__status-badge--${String(
                    project.status || 'STABLE',
                  )
                    .toLowerCase()
                    .replace(/_/g, '-')}`}
                >
                  {project.status}
                </span>
              </div>
              <button type="button" className="project-modal__close" onClick={onClose} aria-label="Close">
                <X size={20} strokeWidth={1.75} />
              </button>
            </header>

            <h2 id="project-modal-title" className="project-modal__title">
              {project.title}
            </h2>
            <p className="project-modal__desc">{project.description}</p>

            {project.live_url ? (
              <a
                className="project-modal__live"
                href={project.live_url.startsWith('http') ? project.live_url : `https://${project.live_url}`}
                target="_blank"
                rel="noreferrer"
              >
                [ EXECUTE_LIVE_URL ]
              </a>
            ) : null}

            <section className="project-modal__section">
              <h3 className="project-modal__section-title">Key highlights</h3>
              <ul className="project-modal__list">
                {(project.highlights?.length ? project.highlights : ['—']).map((line) => (
                  <li key={line}>{line}</li>
                ))}
              </ul>
            </section>

            <section className="project-modal__section">
              <h3 className="project-modal__section-title">Tech stack</h3>
              <div className="project-modal__stack">
                {project.tech_stack?.length
                  ? project.tech_stack.map((t, i) => {
                      const iconName = project.stack_icons?.[i]
                      return (
                        <span key={`${t}-${i}`} className="project-modal__stack-row">
                          {iconName ? <ProjectStackIcon name={iconName} size={20} className="project-modal__ico" /> : null}
                          <span>{t}</span>
                        </span>
                      )
                    })
                  : '—'}
              </div>
            </section>

            <section className="project-modal__section">
              <h3 className="project-modal__section-title">Outcome</h3>
              <p className="project-modal__outcome">{project.outcome || '—'}</p>
            </section>

            {project.github_url ? (
              <a className="project-modal__gh" href={project.github_url} target="_blank" rel="noreferrer">
                GitHub →
              </a>
            ) : null}
          </motion.div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  )

  if (typeof document === 'undefined') return modalTree
  return createPortal(modalTree, document.body)
}
