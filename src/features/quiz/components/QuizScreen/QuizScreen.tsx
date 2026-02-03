import { useMemo } from 'react'

import type { QuizQuestion } from '../../../../lib/quiz'

import { useQuiz } from '../../hooks'
import type { QuizMode } from '../../types'
import { QuizMode as QuizModeUtil } from '../../types'
import { QuizCard } from '../QuizCard'
import { QuizChoices } from '../QuizChoices'
import { QuizProgressHeader } from '../QuizProgressHeader'
import { QuizResultFeedback } from '../QuizResultFeedback'
import { QuizResultSummary } from '../QuizResultSummary'

import './QuizScreen.scss'

type QuizScreenProps = {
  questions: QuizQuestion[]
  categoryName: string
  mode: QuizMode
  onBackToCategory: () => void
  onBackToHome: () => void
}

export const QuizScreen = ({
  questions,
  categoryName,
  mode,
  onBackToCategory,
  onBackToHome,
}: QuizScreenProps) => {
  const { state, currentQuestion, selectAnswer, goToNext, retry, result } =
    useQuiz(questions)

  // ランダムモードの場合、問題ごとにモードを決定（初回のみ）
  const resolvedMode = useMemo(() => QuizModeUtil.resolve(mode), [mode])

  const lastAnswer = state.answers[state.answers.length - 1]

  if (state.phase === 'completed' && result) {
    return (
      <div className="quiz-screen">
        <QuizResultSummary
          result={result}
          onRetry={retry}
          onBackToCategory={onBackToCategory}
          onBackToHome={onBackToHome}
        />
      </div>
    )
  }

  if (!currentQuestion) {
    return null
  }

  return (
    <div className="quiz-screen">
      <QuizProgressHeader
        current={state.currentIndex + 1}
        total={questions.length}
        categoryName={categoryName}
      />

      <QuizCard
        term={currentQuestion.term}
        meaning={currentQuestion.meaning}
        example={currentQuestion.example}
        mode={resolvedMode}
      />

      <QuizChoices
        choices={currentQuestion.choices}
        selectedIndex={lastAnswer?.selectedIndex ?? null}
        correctIndex={currentQuestion.answer}
        onSelect={selectAnswer}
        disabled={state.phase === 'feedback'}
        showResult={state.phase === 'feedback'}
      />

      {state.phase === 'feedback' && lastAnswer && (
        <QuizResultFeedback
          isCorrect={lastAnswer.isCorrect}
          correctAnswer={currentQuestion.choices[currentQuestion.answer] ?? ''}
          selectedAnswer={
            currentQuestion.choices[lastAnswer.selectedIndex] ?? ''
          }
          meaning={currentQuestion.meaning}
          onNext={goToNext}
        />
      )}
    </div>
  )
}
