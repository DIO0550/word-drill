import { useTheme } from '../../hooks/useTheme'
import { Select } from '../../components/Select/Select'
import './ThemeSwitcher.scss'

export const ThemeSwitcher = () => {
  const { currentThemeId, setTheme, availableThemes } = useTheme()

  const themeOptions = availableThemes.map((theme) => ({
    label: theme.name,
    value: theme.id,
  }))

  return (
    <div className="theme-switcher">
      <Select
        options={themeOptions}
        value={currentThemeId}
        onChange={(value) => setTheme(String(value))}
      />
    </div>
  )
}
