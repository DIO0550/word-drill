import type { QuestionCount as QuestionCountType } from '../types'
export type QuestionCount = QuestionCountType

export const QuestionCount = {
  ALL: 'all' as const,
  TEN: 10 as const,
  TWENTY: 20 as const,

  /**
   * 不明な値からQuestionCountを生成する
   * デフォルトは10問
   */
  from: (value: unknown): QuestionCount => {
    if (value === 'all' || value === 10 || value === 20) {
      return value
    }
    // 文字列からの変換
    if (value === '10') {
      return 10
    }
    if (value === '20') {
      return 20
    }
    
    return 10
  },
} as const
