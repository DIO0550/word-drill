import type { AnswerRecord, QuizState as QuizStateType } from '../types'
export type QuizState = QuizStateType

export const QuizState = {
  create: (): QuizState => ({
    phase: 'playing',
    currentIndex: 0,
    answers: [],
  }),

  canSelectAnswer: (state: QuizState): boolean => state.phase === 'playing',
  canGoToNext: (state: QuizState): boolean => state.phase === 'feedback',
  isCompleted: (state: QuizState): boolean => state.phase === 'completed',

  /**
   * 次の問題に進むと完了するかどうかを判定する
   */
  isLastQuestion: (state: QuizState, questionsLength: number): boolean =>
    state.currentIndex + 1 >= questionsLength,

  /**
   * 回答を選択してフィードバック状態に遷移する
   */
  toFeedback: (state: QuizState, record: AnswerRecord): QuizState => ({
    ...state,
    phase: 'feedback',
    answers: [...state.answers, record],
  }),

  /**
   * 次の問題に進む、または完了状態に遷移する
   */
  goToNext: (state: QuizState, questionsLength: number): QuizState => {
    const isLast = state.currentIndex + 1 >= questionsLength
    return {
      ...state,
      phase: isLast ? 'completed' : 'playing',
      currentIndex: isLast ? state.currentIndex : state.currentIndex + 1,
    }
  },
} as const
