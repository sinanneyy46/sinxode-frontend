import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import App from './App.jsx'
import './styles/main.scss'

;(function syncThemeFromStorage() {
  try {
    const t = localStorage.getItem('sinxode-theme')
    if (t === 'retro') document.documentElement.dataset.theme = 'retro'
    else document.documentElement.dataset.theme = 'neon'
  } catch {
    document.documentElement.dataset.theme = 'neon'
  }
})()

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </StrictMode>,
)
