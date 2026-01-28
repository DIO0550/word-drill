import { useTheme } from '../../hooks/useTheme'
import './ThemeSwitcher.scss'

export const ThemeSwitcher = () => {
  const { currentThemeId, setTheme, availableThemes } = useTheme()

  return (
    <div className="theme-switcher">
      <select
        value={currentThemeId}
        onChange={(e) => setTheme(e.target.value)}
        className="theme-select"
        aria-label="Select theme"
      >
        {availableThemes.map((theme) => (
          <option key={theme.id} value={theme.id}>
            {theme.name}
          </option>
        ))}
      </select>
    </div>
  )
}
