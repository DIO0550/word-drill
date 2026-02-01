/**
 * バリデーションエラー
 */
export type ValidationError = {
  path: string
  message: string
}

export const ValidationError = {
  create: (path: string, message: string): ValidationError => ({ path, message }),
} as const
