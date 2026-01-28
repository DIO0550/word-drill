import { describe, it, expect, beforeEach } from 'vitest'
import { renderHook, act } from '@testing-library/react'
import { ThemeProvider } from './ThemeContext'
import { useTheme } from '../../hooks/useTheme'
import { themes } from './themes'

// Mock storage
const localStorageMock = (() => {
  let store: Record<string, string> = {}
  return {
    getItem: (key: string) => store[key] || null,
    setItem: (key: string, value: string) => {
      store[key] = value.toString()
    },
    clear: () => {
      store = {}
    },
  }
})()

Object.defineProperty(window, 'localStorage', {
  value: localStorageMock,
})

describe('ThemeContext', () => {
  beforeEach(() => {
    window.localStorage.clear()
    document.documentElement.style.cssText = ''
    document.documentElement.removeAttribute('data-theme')
  })

  it('provides default theme', () => {
    const wrapper = ({ children }: { children: React.ReactNode }) => (
      <ThemeProvider>{children}</ThemeProvider>
    )
    const { result } = renderHook(() => useTheme(), { wrapper })

    expect(result.current.theme.id).toBe(themes[0].id)
  })

  it('updates theme', () => {
    const wrapper = ({ children }: { children: React.ReactNode }) => (
      <ThemeProvider>{children}</ThemeProvider>
    )
    const { result } = renderHook(() => useTheme(), { wrapper })

    const newThemeId = themes[1].id
    act(() => {
      result.current.setTheme(newThemeId)
    })

    expect(result.current.currentThemeId).toBe(newThemeId)
    expect(result.current.theme.id).toBe(newThemeId)
    expect(window.localStorage.getItem('word-drill-theme-id')).toBe(newThemeId)
  })

  it('loads theme from local storage', () => {
    const savedThemeId = themes[2].id
    window.localStorage.setItem('word-drill-theme-id', savedThemeId)

    const wrapper = ({ children }: { children: React.ReactNode }) => (
      <ThemeProvider>{children}</ThemeProvider>
    )
    const { result } = renderHook(() => useTheme(), { wrapper })

    expect(result.current.theme.id).toBe(savedThemeId)
  })
})
