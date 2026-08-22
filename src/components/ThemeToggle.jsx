import { useEffect, useState } from 'react'

export const THEMES = [
  { id: 'dark', name: 'Dark', icon: '🌙' },
  { id: 'light', name: 'Light', icon: '☀️' },
]

export default function ThemeToggle() {
  const [activeTheme, setActiveTheme] = useState('dark')

  useEffect(() => {
    const saved = localStorage.getItem('km_portfolio_theme')
    const prefersLight = window.matchMedia?.('(prefers-color-scheme: light)').matches
    const initial = saved === 'light' || saved === 'dark' ? saved : prefersLight ? 'light' : 'dark'
    setActiveTheme(initial)
    document.documentElement.setAttribute('data-theme', initial)
  }, [])

  const toggle = () => {
    const next = activeTheme === 'dark' ? 'light' : 'dark'
    setActiveTheme(next)
    localStorage.setItem('km_portfolio_theme', next)
    document.documentElement.setAttribute('data-theme', next)
  }

  const current = THEMES.find((t) => t.id === activeTheme) || THEMES[0]
  const next = THEMES.find((t) => t.id !== activeTheme) || THEMES[1]

  return (
    <button
      className="theme-toggle-btn"
      onClick={toggle}
      aria-label={`Switch to ${next.name.toLowerCase()} theme`}
      title={`Switch to ${next.name.toLowerCase()} theme`}
    >
      <span className="theme-icon">{current.icon}</span>
      <span className="theme-label">{current.name}</span>
    </button>
  )
}
