import { test, expect, beforeAll, afterAll, vi } from 'vitest'
import { StatsCalculator } from './statsCalculator'
import type { HistoryRecord } from '../../../lib/db/types'

const FIXED_NOW = new Date('2026-03-13T12:00:00Z').getTime()
const DAY_MS = 24 * 60 * 60 * 1000

beforeAll(() => {
  vi.useFakeTimers()
  vi.setSystemTime(FIXED_NOW)
})

afterAll(() => {
  vi.useRealTimers()
})

// T-020
test('getPeriodStart: \'this-week\' で今週月曜 00:00 のタイムスタンプが返る', () => {
  // 2026-03-13は金曜日。月曜日は2026-03-09。
  const d = new Date(FIXED_NOW)
  d.setDate(d.getDate() - 4) // 金(5) - 月(1) = 4日前
  d.setHours(0, 0, 0, 0)
  
  expect(StatsCalculator.getPeriodStart('this-week')).toBe(d.getTime())
})

// T-021
test('getPeriodStart: \'this-month\' で今月1日 00:00 のタイムスタンプが返る', () => {
  const d = new Date(FIXED_NOW)
  d.setDate(1)
  d.setHours(0, 0, 0, 0)
  
  expect(StatsCalculator.getPeriodStart('this-month')).toBe(d.getTime())
})

// T-022
test('getPeriodStart: \'all\' で 0 が返る', () => {
  expect(StatsCalculator.getPeriodStart('all')).toBe(0)
})

// T-010
test('calcOverallStats: 正答率が正しく計算される', () => {
  const records: HistoryRecord[] = [
    { questionId: 'q1', category: 'c1', correct: true, timestamp: FIXED_NOW },
    { questionId: 'q2', category: 'c1', correct: true, timestamp: FIXED_NOW },
    { questionId: 'q3', category: 'c1', correct: true, timestamp: FIXED_NOW },
    { questionId: 'q4', category: 'c1', correct: false, timestamp: FIXED_NOW },
    { questionId: 'q5', category: 'c1', correct: false, timestamp: FIXED_NOW },
  ]
  const stats = StatsCalculator.calcOverallStats(records, records)
  expect(stats.accuracyRate).toBe(60)
  expect(stats.totalAnswers).toBe(5)
  expect(stats.studyDays).toBe(1)
  expect(stats.streakDays).toBe(1)
})

// T-011
test('calcOverallStats: 回答0件で null が返る', () => {
  const stats = StatsCalculator.calcOverallStats([], [])
  expect(stats.accuracyRate).toBeNull()
  expect(stats.totalAnswers).toBe(0)
  expect(stats.studyDays).toBe(0)
  expect(stats.streakDays).toBe(0)
})

// T-012
test('calcStreakDays: 今日含む連続3日の学習で3が返る', () => {
  const records: HistoryRecord[] = [
    { questionId: 'q1', category: 'c1', correct: true, timestamp: FIXED_NOW },
    { questionId: 'q2', category: 'c1', correct: true, timestamp: FIXED_NOW - DAY_MS },
    { questionId: 'q3', category: 'c1', correct: true, timestamp: FIXED_NOW - 2 * DAY_MS },
  ]
  expect(StatsCalculator.calcStreakDays(records)).toBe(3)
})

// T-013
test('calcStreakDays: 1日空きがあると途切れる', () => {
  const records: HistoryRecord[] = [
    { questionId: 'q1', category: 'c1', correct: true, timestamp: FIXED_NOW },
    // 1日前（昨日）がない
    { questionId: 'q3', category: 'c1', correct: true, timestamp: FIXED_NOW - 2 * DAY_MS },
  ]
  expect(StatsCalculator.calcStreakDays(records)).toBe(1)
})

// T-014
test('calcStreakDays: 今日学習していない場合 0 が返る', () => {
  const records: HistoryRecord[] = [
    { questionId: 'q2', category: 'c1', correct: true, timestamp: FIXED_NOW - DAY_MS },
    { questionId: 'q3', category: 'c1', correct: true, timestamp: FIXED_NOW - 2 * DAY_MS },
  ]
  expect(StatsCalculator.calcStreakDays(records)).toBe(0)
})

// T-015
test('calcCategoryStats: メインカテゴリの正答率が配下の合計から計算される', () => {
  const records: HistoryRecord[] = [
    { questionId: 'q1', category: 'prog-rust', correct: true, timestamp: FIXED_NOW },
    { questionId: 'q2', category: 'prog-rust', correct: false, timestamp: FIXED_NOW },
    { questionId: 'q3', category: 'prog-javascript', correct: true, timestamp: FIXED_NOW },
  ]
  const stats = StatsCalculator.calcCategoryStats(records)
  const progStats = stats.find((s) => s.id === 'programming')
  expect(progStats).toBeDefined()
  expect(progStats?.totalAnswers).toBe(3)
  // 2問正解 / 3問中 = 66.6... -> 67%
  expect(progStats?.accuracyRate).toBe(67)
  
  // サブカテゴリの確認
  const rustStats = progStats?.subCategories.find(s => s.id === 'prog-rust')
  expect(rustStats?.totalAnswers).toBe(2)
  expect(rustStats?.accuracyRate).toBe(50)
})

// T-016
test('calcCategoryStats: 未知のカテゴリIDが「その他」にまとめられる', () => {
  const records: HistoryRecord[] = [
    { questionId: 'q1', category: 'unknown-cat-1', correct: true, timestamp: FIXED_NOW },
    { questionId: 'q2', category: 'unknown-cat-1', correct: false, timestamp: FIXED_NOW },
  ]
  const stats = StatsCalculator.calcCategoryStats(records)
  const otherStats = stats.find((s) => s.id === 'other')
  expect(otherStats).toBeDefined()
  expect(otherStats?.name).toBe('その他')
  expect(otherStats?.totalAnswers).toBe(2)
  expect(otherStats?.accuracyRate).toBe(50)
  expect(otherStats?.subCategories[0].id).toBe('unknown-cat-1')
})

// T-017
test('calcWeakWords: 正答率50%以下+回答2回以上のみ抽出', () => {
  const records: HistoryRecord[] = [
    // 50% (対象)
    { questionId: 'q1', category: 'c1', correct: true, timestamp: FIXED_NOW },
    { questionId: 'q1', category: 'c1', correct: false, timestamp: FIXED_NOW },
    // 0% (対象)
    { questionId: 'q2', category: 'c1', correct: false, timestamp: FIXED_NOW },
    { questionId: 'q2', category: 'c1', correct: false, timestamp: FIXED_NOW },
    // 100% (非対象)
    { questionId: 'q3', category: 'c1', correct: true, timestamp: FIXED_NOW },
    { questionId: 'q3', category: 'c1', correct: true, timestamp: FIXED_NOW },
  ]
  const weakWords = StatsCalculator.calcWeakWords(records)
  expect(weakWords.length).toBe(2)
  const qIds = weakWords.map(w => w.questionId)
  expect(qIds).toContain('q1')
  expect(qIds).toContain('q2')
  expect(qIds).not.toContain('q3')
})

// T-018
test('calcWeakWords: 正答率の低い順にソートされる', () => {
  const records: HistoryRecord[] = [
    // q1: 50% (1/2)
    { questionId: 'q1', category: 'c1', correct: true, timestamp: FIXED_NOW },
    { questionId: 'q1', category: 'c1', correct: false, timestamp: FIXED_NOW },
    // q2: 33% (1/3)
    { questionId: 'q2', category: 'c1', correct: true, timestamp: FIXED_NOW },
    { questionId: 'q2', category: 'c1', correct: false, timestamp: FIXED_NOW },
    { questionId: 'q2', category: 'c1', correct: false, timestamp: FIXED_NOW },
    // q3: 0% (0/2)
    { questionId: 'q3', category: 'c1', correct: false, timestamp: FIXED_NOW },
    { questionId: 'q3', category: 'c1', correct: false, timestamp: FIXED_NOW },
  ]
  const weakWords = StatsCalculator.calcWeakWords(records)
  expect(weakWords.map(w => w.questionId)).toEqual(['q3', 'q2', 'q1'])
})

// T-019
test('calcWeakWords: 回答1回のみの問題は含まれない', () => {
  const records: HistoryRecord[] = [
    // 0% (1回のみ -> 非対象)
    { questionId: 'q1', category: 'c1', correct: false, timestamp: FIXED_NOW },
  ]
  const weakWords = StatsCalculator.calcWeakWords(records)
  expect(weakWords.length).toBe(0)
})
