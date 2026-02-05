import type { AnswerRecord, QuizResult as QuizResultType } from '../types'
export type QuizResult = QuizResultType

export const QuizResult = {
  create: (answers: AnswerRecord[]): QuizResult => ({
    correctCount: answers.filter((a) => a.isCorrect).length,
    totalCount: answers.length,
    answers,
  }),

  /**
   * 正答率を取得する (0-100)
   */
  getAccuracyRate: (result: QuizResult): number => {
    if (result.totalCount === 0) {
      return 0
    }
    return Math.round((result.correctCount / result.totalCount) * 100)
  },
} as const
