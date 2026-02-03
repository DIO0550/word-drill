import { useReducer } from 'react'

import type { QuizQuestion } from '../../../lib/quiz'

import { AnswerRecord, QuizResult, QuizState } from '../types'

/**
 * クイズのアクション
 */
type QuizAction =
  | {
      type: 'SELECT_ANSWER'
      questionId: string
      selectedIndex: number
      correctIndex: number
    }
  | { type: 'GO_TO_NEXT'; questionsLength: number }
  | { type: 'RETRY' }

/**
 * クイズの状態遷移を管理する reducer
 */
const quizReducer = (state: QuizState, action: QuizAction): QuizState => {
  switch (action.type) {
    case 'SELECT_ANSWER': {
      if (!QuizState.canSelectAnswer(state)) {
        return state
      }
      const record = AnswerRecord.create(
        action.questionId,
        action.selectedIndex,
        action.correctIndex
      )
      return QuizState.toFeedback(state, record)
    }
    case 'GO_TO_NEXT': {
      if (!QuizState.canGoToNext(state)) {
        return state
      }
      return QuizState.goToNext(state, action.questionsLength)
    }
    case 'RETRY':
      return QuizState.create()
  }
}

type UseQuizReturn = {
  state: QuizState
  currentQuestion: QuizQuestion | null
  selectAnswer: (index: number) => void
  goToNext: () => void
  retry: () => void
  result: QuizResult | null
}

/**
 * クイズの状態管理フック
 */
export const useQuiz = (questions: QuizQuestion[]): UseQuizReturn => {
  const [state, dispatch] = useReducer(quizReducer, QuizState.create())

  const currentQuestion = QuizState.isCompleted(state)
    ? null
    : (questions[state.currentIndex] ?? null)

  const selectAnswer = (selectedIndex: number) => {
    if (!currentQuestion) {
      return
    }
    dispatch({
      type: 'SELECT_ANSWER',
      questionId: currentQuestion.id,
      selectedIndex,
      correctIndex: currentQuestion.answer,
    })
  }

  const goToNext = () => {
    dispatch({ type: 'GO_TO_NEXT', questionsLength: questions.length })
  }

  const retry = () => {
    dispatch({ type: 'RETRY' })
  }

  const result = QuizState.isCompleted(state)
    ? QuizResult.create(state.answers)
    : null

  return {
    state,
    currentQuestion,
    selectAnswer,
    goToNext,
    retry,
    result,
  }
}

