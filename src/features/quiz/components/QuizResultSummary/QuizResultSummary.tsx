import { Button } from '../../../../components/Button/Button'
import { Card } from '../../../../components/Card/Card'

import { QuizResult } from '../../index'

import './QuizResultSummary.scss'

type QuizResultSummaryProps = {
  result: QuizResult
  onRetry: () => void
  onBackToCategory: () => void
  onBackToHome: () => void
}

export const QuizResultSummary = ({
  result,
  onRetry,
  onBackToCategory,
  onBackToHome,
}: QuizResultSummaryProps) => {
  const accuracyRate = QuizResult.getAccuracyRate(result)
  const isExcellent = accuracyRate >= 80
  const isGood = accuracyRate >= 60

  const getResultEmoji = () => {
    if (isExcellent) {
      return '🎉'
    }
    if (isGood) {
      return '👍'
    }
    return '💪'
  }

  const getResultMessage = () => {
    if (isExcellent) {
      return '素晴らしい！'
    }
    if (isGood) {
      return 'よくできました！'
    }
    return 'もう少し頑張ろう！'
  }

  return (
    <div className="quiz-result-summary">
      <Card className="quiz-result-summary__card">
        <div className="quiz-result-summary__emoji">{getResultEmoji()}</div>
        <div className="quiz-result-summary__message">{getResultMessage()}</div>

        <div className="quiz-result-summary__stats">
          <div className="quiz-result-summary__stat">
            <span className="quiz-result-summary__stat-label">正答数</span>
            <span className="quiz-result-summary__stat-value">
              {result.correctCount} / {result.totalCount}
            </span>
          </div>
          <div className="quiz-result-summary__stat">
            <span className="quiz-result-summary__stat-label">正答率</span>
            <span
              className={`quiz-result-summary__stat-value ${isExcellent ? 'quiz-result-summary__stat-value--excellent' : isGood ? 'quiz-result-summary__stat-value--good' : ''}`}
            >
              {accuracyRate}%
            </span>
          </div>
        </div>
      </Card>

      <div className="quiz-result-summary__actions">
        <Button variant="primary" size="large" fullWidth onClick={onRetry}>
          もう一度
        </Button>
        <Button
          variant="secondary"
          size="large"
          fullWidth
          onClick={onBackToCategory}
        >
          カテゴリに戻る
        </Button>
        <Button
          variant="tertiary"
          size="large"
          fullWidth
          onClick={onBackToHome}
        >
          ホームに戻る
        </Button>
      </div>
    </div>
  )
}
