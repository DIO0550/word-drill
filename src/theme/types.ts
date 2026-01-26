/**
 * Theme type definitions
 */

export type ColorPalette = {
  /** Primary brand color */
  primary: string
  /** Lighter variant of primary */
  primaryLight: string
  /** Glow effect color for primary */
  primaryGlow: string
  /** Secondary brand color */
  secondary: string
  /** Glow effect color for secondary */
  secondaryGlow: string
  /** Accent color for highlights */
  accent: string
  /** Success state color */
  success: string
  /** Error state color */
  error: string
  /** Main background color */
  bgPrimary: string
  /** Secondary/alternate background color */
  bgSecondary: string
  /** Glass effect background */
  bgGlass: string
  /** Card background color */
  cardBg: string
  /** Border color */
  border: string
  /** Border color on hover */
  borderHover: string
  /** Primary text color */
  textPrimary: string
  /** Secondary/muted text color */
  textSecondary: string
  /** Text on colored backgrounds */
  textLight: string
}

export type Typography = {
  /** Display/heading font family */
  fontDisplay: string
  /** Body text font family */
  fontBody: string
  /** Emoji font family */
  fontEmoji: string
}

export type Theme = {
  /** Unique identifier for the theme */
  id: string
  /** Display name of the theme */
  name: string
  /** Brief description */
  description: string
  /** Color scheme type */
  colorScheme: 'light' | 'dark'
  /** Color palette */
  colors: ColorPalette
  /** Typography settings */
  typography: Typography
}

export type ThemeId =
  | 'fresh-light'
  | 'ocean-depths'
  | 'tech-innovation'
  | 'midnight-galaxy'
  | 'forest-canopy'
  | 'sunset-boulevard'
  | 'arctic-frost'
  | 'desert-rose'
  | 'botanical-garden'
  | 'golden-hour'
  | 'modern-minimalist'
