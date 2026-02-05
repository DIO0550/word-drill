import type { AnswerRecord as AnswerRecordType } from '../types'
export type AnswerRecord = AnswerRecordType

export const AnswerRecord = {
  create: (
    questionId: string,
    selectedIndex: number,
    correctIndex: number
  ): AnswerRecord => ({
    questionId,
    selectedIndex,
    correctIndex,
    isCorrect: selectedIndex === correctIndex,
  }),
} as const
