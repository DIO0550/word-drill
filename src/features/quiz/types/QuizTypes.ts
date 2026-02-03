/**
 * クイズモード
 */
export type QuizMode = 'term-to-meaning' | 'meaning-to-term' | 'random'

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
} as const

/**
 * 回答記録
 */
export type AnswerRecord = {
  questionId: string
  selectedIndex: number
  correctIndex: number
  isCorrect: boolean
}

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

/**
 * クイズ結果
 */
export type QuizResult = {
  correctCount: number
  totalCount: number
  answers: AnswerRecord[]
}

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

/**
 * クイズ状態
 */
export type QuizPhase = 'playing' | 'feedback' | 'completed'

export type QuizState = {
  phase: QuizPhase
  currentIndex: number
  answers: AnswerRecord[]
}

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
