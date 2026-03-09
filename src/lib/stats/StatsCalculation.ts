import type { StatsRecord } from '../db/types'

/**
 * 正解率（0〜100の整数）を計算する
 */
export type StatsCalculation = {
  questionId: string
  totalCount: number
  correctCount: number
  wrongCount: number
  correctRate: number
  lastAnswered: number
}

export const StatsCalculation = {
  /**
   * StatsRecord から StatsCalculation を生成する
   */
  fromRecord: (record: StatsRecord): StatsCalculation => {
    const totalCount = record.correctCount + record.wrongCount
    const correctRate = totalCount === 0
      ? 0
      : Math.round((record.correctCount / totalCount) * 100)

    return {
      questionId: record.questionId,
      totalCount,
      correctCount: record.correctCount,
      wrongCount: record.wrongCount,
      correctRate,
      lastAnswered: record.lastAnswered,
    }
  },

  /**
   * 複数のStatsRecordをまとめて集計する
   */
  fromRecords: (records: StatsRecord[]): StatsCalculation[] =>
    records.map(StatsCalculation.fromRecord),

  /**
   * 全体の正解率（0〜100の整数）を計算する
   */
  totalCorrectRate: (calculations: StatsCalculation[]): number => {
    const totalCorrect = calculations.reduce((acc, c) => acc + c.correctCount, 0)
    const totalAnswers = calculations.reduce((acc, c) => acc + c.totalCount, 0)
    if (totalAnswers === 0) { return 0 }
    return Math.round((totalCorrect / totalAnswers) * 100)
  },

  /**
   * 正解率でソートする（降順）
   */
  sortByCorrectRate: (calculations: StatsCalculation[]): StatsCalculation[] =>
    [...calculations].sort((a, b) => b.correctRate - a.correctRate),

  /**
   * 最後に回答した日時でソートする（降順）
   */
  sortByLastAnswered: (calculations: StatsCalculation[]): StatsCalculation[] =>
    [...calculations].sort((a, b) => b.lastAnswered - a.lastAnswered),
} as const
