import { AnimatePresence, motion } from 'framer-motion'
import { useState } from 'react'
import { Route, Routes, useLocation } from 'react-router-dom'
import Dock from './components/Dock'
import CommandCenter from './components/CommandCenter'
import GithubTicker from './components/GithubTicker'
import ThemeToggle from './components/ThemeToggle'
import ContactPing from './components/ContactPing'
import OsStatusStrip from './components/OsStatusStrip'
import Home from './pages/Home'
import ProjectsPage from './pages/ProjectsPage'

const pageTransition = {
  initial: { opacity: 0, scale: 0.985, filter: 'blur(6px)' },
  animate: { opacity: 1, scale: 1, filter: 'blur(0px)' },
  exit: { opacity: 0, scale: 1.01, filter: 'blur(8px)' },
}

const ASCII_BOOT = `> SINXODE_OS v2.1 — CRT KERNEL
> LOADING PHOSPHOR LUT… OK
> MOUNTING NEON_BUS… OK
> RETRO_LINK CHANNEL OPEN\n`

export default function App() {
  const location = useLocation()
  const [asciiBoot, setAsciiBoot] = useState(false)

  return (
    <div className="sinxode-app sinxode-app--retro-crt">
      <GithubTicker />
      <ThemeToggle
        onRetroEnter={() => {
          setAsciiBoot(true)
          window.setTimeout(() => setAsciiBoot(false), 2300)
        }}
      />
      {asciiBoot ? (
        <div className="sinxode-app__ascii-boot sinxode-app__ascii-boot--visible">{ASCII_BOOT}</div>
      ) : null}
      <div className="sinxode-scanline-beam" aria-hidden />
      <AnimatePresence mode="wait">
        <motion.div
          key={location.pathname}
          className="sinxode-main"
          initial="initial"
          animate="animate"
          exit="exit"
          variants={pageTransition}
          transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
          style={{ paddingTop: '104px' }}
        >
          <Routes location={location}>
            <Route path="/" element={<Home />} />
            <Route path="/projects" element={<ProjectsPage />} />
          </Routes>
        </motion.div>
      </AnimatePresence>
      <ContactPing />
      <OsStatusStrip />
      <Dock />
      <CommandCenter />
    </div>
  )
}
