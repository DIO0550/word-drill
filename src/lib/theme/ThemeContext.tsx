import React, { createContext, useEffect, useState, type ReactNode } from 'react'
import type { Theme } from './types'
import { themes, defaultTheme } from './themes'

type ThemeContextType = {
  theme: Theme
  currentThemeId: string
  setTheme: (themeId: string) => void
  availableThemes: Theme[]
}

// eslint-disable-next-line react-refresh/only-export-components
export const ThemeContext = createContext<ThemeContextType>({
  theme: defaultTheme,
  currentThemeId: defaultTheme.id,
  setTheme: () => {},
  availableThemes: themes,
})

const STORAGE_KEY = 'word-drill-theme-id'

type ThemeProviderProps = {
  children: ReactNode
}

export const ThemeProvider: React.FC<ThemeProviderProps> = ({ children }) => {
  const [currentThemeId, setCurrentThemeId] = useState<string>(() => {
    const savedThemeId = localStorage.getItem(STORAGE_KEY)
    if (savedThemeId && themes.find((t) => t.id === savedThemeId)) {
      return savedThemeId
    }
    return defaultTheme.id
  })

  const theme = themes.find((t) => t.id === currentThemeId) || defaultTheme

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, currentThemeId)
    applyTheme(theme)
  }, [currentThemeId, theme])

  const setTheme = (id: string) => {
    if (themes.find((t) => t.id === id)) {
      setCurrentThemeId(id)
    }
  }

  return (
    <ThemeContext.Provider
      value={{
        theme,
        currentThemeId,
        setTheme,
        availableThemes: themes,
      }}
    >
      {children}
    </ThemeContext.Provider>
  )
}

const applyTheme = (theme: Theme) => {
  const root = document.documentElement
  
  // Set Color Scheme
  root.style.colorScheme = theme.colorScheme

  // Set Colors
  Object.entries(theme.colors).forEach(([key, value]) => {
    // Convert camelCase to kebab-case for CSS variables
    const cssVarName = `--color-${key.replace(/([A-Z])/g, '-$1').toLowerCase()}`
    root.style.setProperty(cssVarName, value)
  })

  // Set Typography
  root.style.setProperty('--font-display', theme.typography.fontDisplay)
  root.style.setProperty('--font-body', theme.typography.fontBody)
  root.style.setProperty('--font-emoji', theme.typography.fontEmoji)
  
  // Set data-theme attribute for specific styling needs
  root.setAttribute('data-theme', theme.id)
}
