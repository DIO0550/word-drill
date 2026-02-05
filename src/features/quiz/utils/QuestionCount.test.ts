import { expect, test } from 'vitest'
import { QuestionCount } from './QuestionCount'

test('from: valid counts are returned', () => {
  expect(QuestionCount.from(10)).toBe(QuestionCount.TEN)
  expect(QuestionCount.from(20)).toBe(QuestionCount.TWENTY)
  expect(QuestionCount.from('all')).toBe(QuestionCount.ALL)
})

test('from: string numbers are parsed', () => {
  expect(QuestionCount.from('10')).toBe(QuestionCount.TEN)
  expect(QuestionCount.from('20')).toBe(QuestionCount.TWENTY)
})

test('from: invalid counts return default value', () => {
  expect(QuestionCount.from(5)).toBe(QuestionCount.TEN)
  expect(QuestionCount.from('15')).toBe(QuestionCount.TEN)
  expect(QuestionCount.from('abc')).toBe(QuestionCount.TEN)
  expect(QuestionCount.from(null)).toBe(QuestionCount.TEN)
})
