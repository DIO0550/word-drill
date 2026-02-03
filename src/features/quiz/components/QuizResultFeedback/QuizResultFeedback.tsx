import { Button } from '../../../../components/Button/Button'
import { Card } from '../../../../components/Card/Card'

import './QuizResultFeedback.scss'

type QuizResultFeedbackProps = {
  isCorrect: boolean
  correctAnswer: string
  selectedAnswer: string
  meaning: string
  onNext: () => void
}

export const QuizResultFeedback = ({
  isCorrect,
  correctAnswer,
  meaning,
  onNext,
}: QuizResultFeedbackProps) => {
  return (
    <div className="quiz-result-feedback">
      <Card
        className={`quiz-result-feedback__card ${isCorrect ? 'quiz-result-feedback__card--correct' : 'quiz-result-feedback__card--incorrect'}`}
      >
        <div className="quiz-result-feedback__icon">
          {isCorrect ? '✓' : '✗'}
        </div>
        <div className="quiz-result-feedback__status">
          {isCorrect ? '正解！' : '不正解...'}
        </div>
        {!isCorrect && (
          <div className="quiz-result-feedback__correct-answer">
            <span className="quiz-result-feedback__label">正解:</span>
            <span className="quiz-result-feedback__value">{correctAnswer}</span>
          </div>
        )}
        <div className="quiz-result-feedback__meaning">
          <span className="quiz-result-feedback__label">意味:</span>
          <span className="quiz-result-feedback__value">{meaning}</span>
        </div>
      </Card>
      <Button
        variant="primary"
        size="large"
        fullWidth
        onClick={onNext}
        className="quiz-result-feedback__next-button"
      >
        次へ
      </Button>
    </div>
  )
}
