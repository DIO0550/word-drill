import { expect, test } from 'vitest'
import { QuizMode } from './QuizMode'

test('from: valid modes are returned as is', () => {
  expect(QuizMode.from('term-to-meaning')).toBe(QuizMode.TERM_TO_MEANING)
  expect(QuizMode.from('meaning-to-term')).toBe(QuizMode.MEANING_TO_TERM)
  expect(QuizMode.from('random')).toBe(QuizMode.RANDOM)
})

test('from: invalid modes return default value', () => {
  expect(QuizMode.from('invalid')).toBe(QuizMode.TERM_TO_MEANING)
  expect(QuizMode.from(null)).toBe(QuizMode.TERM_TO_MEANING)
  expect(QuizMode.from(undefined)).toBe(QuizMode.TERM_TO_MEANING)
  expect(QuizMode.from(123)).toBe(QuizMode.TERM_TO_MEANING)
})

test('resolve: random mode returns term-to-meaning or meaning-to-term', () => {
  // Randomness makes exact assertion hard, but we can check if it returns valid non-random mode
  const resolved = QuizMode.resolve(QuizMode.RANDOM)
  expect([QuizMode.TERM_TO_MEANING, QuizMode.MEANING_TO_TERM]).toContain(resolved)
})

test('resolve: non-random mode returns itself', () => {
  expect(QuizMode.resolve(QuizMode.TERM_TO_MEANING)).toBe(QuizMode.TERM_TO_MEANING)
  expect(QuizMode.resolve(QuizMode.MEANING_TO_TERM)).toBe(QuizMode.MEANING_TO_TERM)
})
