import { act, renderHook } from '@testing-library/react'
import { expect, test } from 'vitest'

import type { QuizQuestion } from '../../../lib/quiz'

import { useQuiz } from './useQuiz'

const mockQuestions: QuizQuestion[] = [
  {
    id: 'q1',
    term: 'ownership',
    meaning: 'メモリ管理の基本概念',
    choices: ['所有権', '借用', 'ライフタイム', '参照'],
    answer: 0,
  },
  {
    id: 'q2',
    term: 'borrowing',
    meaning: '参照の一時的な貸し出し',
    choices: ['所有権', '借用', 'ライフタイム', '参照'],
    answer: 1,
  },
  {
    id: 'q3',
    term: 'lifetime',
    meaning: '参照が有効な期間',
    choices: ['所有権', '借用', 'ライフタイム', '参照'],
    answer: 2,
  },
]

test('初期状態が正しいこと', () => {
  const { result } = renderHook(() => useQuiz(mockQuestions))

  expect(result.current.state.phase).toBe('playing')
  expect(result.current.state.currentIndex).toBe(0)
  expect(result.current.state.answers).toHaveLength(0)
  expect(result.current.currentQuestion).toEqual(mockQuestions[0])
  expect(result.current.result).toBeNull()
})

test('回答選択で状態がfeedbackに変わること', () => {
  const { result } = renderHook(() => useQuiz(mockQuestions))

  act(() => {
    result.current.selectAnswer(0)
  })

  expect(result.current.state.phase).toBe('feedback')
  expect(result.current.state.answers).toHaveLength(1)
  expect(result.current.state.answers[0]).toEqual({
    questionId: 'q1',
    selectedIndex: 0,
    correctIndex: 0,
    isCorrect: true,
  })
})

test('正解の判定が正しいこと', () => {
  const { result } = renderHook(() => useQuiz(mockQuestions))

  act(() => {
    result.current.selectAnswer(0)
  })

  expect(result.current.state.answers[0]?.isCorrect).toBe(true)
})

test('不正解の判定が正しいこと', () => {
  const { result } = renderHook(() => useQuiz(mockQuestions))

  act(() => {
    result.current.selectAnswer(1)
  })

  expect(result.current.state.answers[0]?.isCorrect).toBe(false)
})

test('goToNextで次の問題に進むこと', () => {
  const { result } = renderHook(() => useQuiz(mockQuestions))

  act(() => {
    result.current.selectAnswer(0)
  })
  act(() => {
    result.current.goToNext()
  })

  expect(result.current.state.phase).toBe('playing')
  expect(result.current.state.currentIndex).toBe(1)
  expect(result.current.currentQuestion).toEqual(mockQuestions[1])
})

test('全問終了後に完了状態になること', () => {
  const { result } = renderHook(() => useQuiz(mockQuestions))

  // 3問すべてに回答
  for (let i = 0; i < 3; i++) {
    act(() => {
      result.current.selectAnswer(i)
    })
    act(() => {
      result.current.goToNext()
    })
  }

  expect(result.current.state.phase).toBe('completed')
  expect(result.current.currentQuestion).toBeNull()
  expect(result.current.result).not.toBeNull()
  expect(result.current.result?.totalCount).toBe(3)
  expect(result.current.result?.correctCount).toBe(3)
})

test('リトライで初期状態に戻ること', () => {
  const { result } = renderHook(() => useQuiz(mockQuestions))

  // 1問回答
  act(() => {
    result.current.selectAnswer(0)
  })
  act(() => {
    result.current.goToNext()
  })

  // リトライ
  act(() => {
    result.current.retry()
  })

  expect(result.current.state.phase).toBe('playing')
  expect(result.current.state.currentIndex).toBe(0)
  expect(result.current.state.answers).toHaveLength(0)
  expect(result.current.currentQuestion).toEqual(mockQuestions[0])
})

test('playing以外でselectAnswerを呼んでも変化しないこと', () => {
  const { result } = renderHook(() => useQuiz(mockQuestions))

  act(() => {
    result.current.selectAnswer(0)
  })

  const answersLength = result.current.state.answers.length

  // feedbackフェーズで再度selectAnswerを呼ぶ
  act(() => {
    result.current.selectAnswer(1)
  })

  expect(result.current.state.answers).toHaveLength(answersLength)
})

test('feedback以外でgoToNextを呼んでも変化しないこと', () => {
  const { result } = renderHook(() => useQuiz(mockQuestions))

  const initialIndex = result.current.state.currentIndex

  // playingフェーズでgoToNextを呼ぶ
  act(() => {
    result.current.goToNext()
  })

  expect(result.current.state.currentIndex).toBe(initialIndex)
})

test('QuizResult.getAccuracyRateが正しく計算されること', () => {
  const { result } = renderHook(() => useQuiz(mockQuestions))

  // 2問正解、1問不正解
  act(() => result.current.selectAnswer(0)) // 正解
  act(() => result.current.goToNext())
  act(() => result.current.selectAnswer(1)) // 正解
  act(() => result.current.goToNext())
  act(() => result.current.selectAnswer(0)) // 不正解 (正解は2)
  act(() => result.current.goToNext())

  expect(result.current.result?.correctCount).toBe(2)
  expect(result.current.result?.totalCount).toBe(3)
})
