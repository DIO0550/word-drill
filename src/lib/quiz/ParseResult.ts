import type { ValidationError } from './ValidationError'

/**
 * パース結果
 */
export type ParseResult<T> =
  | { success: true; data: T }
  | { success: false; errors: ValidationError[] }

export const ParseResult = {
  ok: <T>(data: T): ParseResult<T> => ({ success: true, data }),
  err: <T>(errors: ValidationError[]): ParseResult<T> => ({ success: false, errors }),
} as const
