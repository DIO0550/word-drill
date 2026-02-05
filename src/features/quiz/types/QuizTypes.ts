/**
 * クイズモード
 */
export type QuizMode = 'term-to-meaning' | 'meaning-to-term' | 'random'

/**
 * 回答記録
 */
export type AnswerRecord = {
  questionId: string
  selectedIndex: number
  correctIndex: number
  isCorrect: boolean
}

/**
 * クイズ結果
 */
export type QuizResult = {
  correctCount: number
  totalCount: number
  answers: AnswerRecord[]
}

/**
 * クイズ状態
 */
export type QuizPhase = 'playing' | 'feedback' | 'completed'

export type QuizState = {
  phase: QuizPhase
  currentIndex: number
  answers: AnswerRecord[]
}

/**
 * 出題数
 */
export type QuestionCount = 10 | 20 | 'all'
