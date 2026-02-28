import { useNavigate } from '@tanstack/react-router'

import type { QuizQuestion } from '../../../../lib/quiz'

import type { QuizMode } from '../../types'
import { QuizScreen } from '../QuizScreen'

import './QuizPlayPage.scss'

type QuizPlayPageProps = {
  categoryId: string
  categoryName: string
  questions: QuizQuestion[]
  mode: QuizMode
}

export const QuizPlayPage = ({
  categoryId,
  categoryName,
  questions,
  mode,
}: QuizPlayPageProps) => {
  const navigate = useNavigate()

  const handleBackToCategory = () => {
    navigate({ to: '/category/$categoryId', params: { categoryId: categoryId } })
  }

  const handleBackToHome = () => {
    navigate({ to: '/' })
  }

  return (
    <div className="quiz-play-page">
      <QuizScreen
        questions={questions}
        categoryName={categoryName}
        mode={mode}
        onBackToCategory={handleBackToCategory}
        onBackToHome={handleBackToHome}
      />
    </div>
  )
}
