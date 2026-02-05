import type { QuizMode as QuizModeType } from '../types'
export type QuizMode = QuizModeType

export const QuizMode = {
  /** 用語から意味を当てる */
  TERM_TO_MEANING: 'term-to-meaning' as const,
  /** 意味から用語を当てる */
  MEANING_TO_TERM: 'meaning-to-term' as const,
  /** ランダム */
  RANDOM: 'random' as const,

  /**
   * ランダムモードの場合、実際のモードを決定する
   */
  resolve: (mode: QuizMode): Exclude<QuizMode, 'random'> => {
    if (mode === 'random') {
      return Math.random() < 0.5 ? 'term-to-meaning' : 'meaning-to-term'
    }
    return mode
  },

  /**
   * 不明な値からQuizModeを生成する
   * 不正な値の場合はデフォルト値(term-to-meaning)を返す
   */
  from: (value: unknown): QuizMode => {
    if (
      value === 'term-to-meaning' ||
      value === 'meaning-to-term' ||
      value === 'random'
    ) {
      return value
    }
    return 'term-to-meaning'
  },
} as const
