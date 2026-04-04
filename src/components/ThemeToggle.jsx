import { useCallback, useEffect, useState } from 'react'

const STORAGE_KEY = 'sinxode-theme'

export default function ThemeToggle({ onRetroEnter }) {
  const [mode, setMode] = useState(() => {
    if (typeof document === 'undefined') return 'neon'
    const saved = localStorage.getItem(STORAGE_KEY)
    return saved === 'retro' ? 'retro' : 'neon'
  })

  const apply = useCallback(
    (next, showBoot) => {
      setMode(next)
      document.documentElement.dataset.theme = next
      localStorage.setItem(STORAGE_KEY, next)
      if (next === 'retro' && showBoot) onRetroEnter?.()
    },
    [onRetroEnter],
  )

  useEffect(() => {
    document.documentElement.dataset.theme = mode
  }, [mode])

  return (
    <div className="theme-toggle">
      <span className="theme-toggle__label">Time-Travel</span>
      <div className="theme-toggle__track" data-mode={mode}>
        <span className="theme-toggle__slider" aria-hidden />
        <div className="theme-toggle__options">
          <button
            type="button"
            className={`theme-toggle__opt${mode === 'neon' ? ' theme-toggle__opt--active' : ''}`}
            onClick={() => apply('neon', false)}
          >
            NEON_ACTIVE
          </button>
          <button
            type="button"
            className={`theme-toggle__opt${mode === 'retro' ? ' theme-toggle__opt--active' : ''}`}
            onClick={() => {
              if (mode !== 'retro') apply('retro', true)
            }}
          >
            RETRO_LINK
          </button>
        </div>
      </div>
    </div>
  )
}
