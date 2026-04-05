import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import TerminalHero from '../components/TerminalHero'
import TechStackTerminal from '../components/TechStackTerminal'
import TechRadar from '../components/TechRadar'
import ProjectGrid from '../components/ProjectGrid'

export default function Home() {
  return (
    <>
      <TerminalHero />
      <motion.div
        initial={{ opacity: 0, y: 18, filter: 'blur(6px)' }}
        whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
        viewport={{ once: true, amount: 0.35 }}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      >
        <TechRadar />
      </motion.div>
      <motion.section
        className="home-section"
        initial={{ opacity: 0, y: 20, filter: 'blur(6px)' }}
        whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
        viewport={{ once: true, amount: 0.2 }}
        transition={{ duration: 0.52, ease: [0.22, 1, 0.36, 1] }}
      >
        <div className="home-section__head">
          <h2 className="home-section__title">Signal</h2>
          <span className="home-section__hint">Live stack preview</span>
        </div>
        <TechStackTerminal />
      </motion.section>
      <motion.section
        className="home-section"
        initial={{ opacity: 0, y: 20, filter: 'blur(6px)' }}
        whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
        viewport={{ once: true, amount: 0.18 }}
        transition={{ duration: 0.52, delay: 0.06, ease: [0.22, 1, 0.36, 1] }}
      >
        <div className="home-section__head">
          <h2 className="home-section__title">Project matrix</h2>
          <Link to="/projects" className="home-section__hint home-section__hint--link">
            View all →
          </Link>
        </div>
        <ProjectGrid previewCount={2} />
      </motion.section>
    </>
  )
}
