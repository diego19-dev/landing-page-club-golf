'use client'

import React, { createContext, useContext, useEffect, useState, useTransition } from 'react'

type Theme = 'dark' | 'light'

interface ThemeContextType {
  theme: Theme
  toggleTheme: () => void
  setTheme: (theme: Theme) => void
  isHydrated: boolean
}

const ThemeContext = createContext<ThemeContextType>({
  theme: 'dark',
  toggleTheme: () => {},
  setTheme: () => {},
  isHydrated: false,
})

const THEME_STORAGE_KEY = 'monteverde-theme'

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setThemeState] = useState<Theme>('dark')
  const [isHydrated, setIsHydrated] = useState(false)
  const [, startTransition] = useTransition()

  // Initialize theme from localStorage or default to dark (Monteverde luxury default)
  useEffect(() => {
    try {
      const stored = localStorage.getItem(THEME_STORAGE_KEY) as Theme | null
      const initialTheme: Theme = stored === 'light' ? 'light' : 'dark'
      setThemeState(initialTheme)
      applyThemeToDom(initialTheme)
    } catch {
      applyThemeToDom('dark')
    } finally {
      setIsHydrated(true)
    }
  }, [])

  const applyThemeToDom = (newTheme: Theme) => {
    const root = document.documentElement
    if (newTheme === 'dark') {
      root.classList.add('dark')
      root.classList.remove('light')
      root.style.colorScheme = 'dark'
    } else {
      root.classList.remove('dark')
      root.classList.add('light')
      root.style.colorScheme = 'light'
    }
  }

  const setTheme = (newTheme: Theme) => {
    setThemeState(newTheme)
    applyThemeToDom(newTheme)
    try {
      localStorage.setItem(THEME_STORAGE_KEY, newTheme)
    } catch (e) {
      console.error('Failed to save theme in localStorage', e)
    }
  }

  const toggleTheme = () => {
    const nextTheme: Theme = theme === 'dark' ? 'light' : 'dark'
    startTransition(() => {
      setTheme(nextTheme)
    })
  }

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme, setTheme, isHydrated }}>
      {children}
    </ThemeContext.Provider>
  )
}

export function useTheme() {
  const context = useContext(ThemeContext)
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider')
  }
  return context
}
