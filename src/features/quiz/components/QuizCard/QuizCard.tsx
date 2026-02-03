import { Card } from '../../../../components/Card/Card'

import type { QuizMode } from '../../types'

import './QuizCard.scss'

type QuizCardProps = {
  term: string
  meaning: string
  example?: string
  mode: Exclude<QuizMode, 'random'>
}

export const QuizCard = ({ term, meaning, example, mode }: QuizCardProps) => {
  const displayText = mode === 'term-to-meaning' ? term : meaning
  const label = mode === 'term-to-meaning' ? '用語' : '意味'

  return (
    <Card className="quiz-card">
      <div className="quiz-card__label">{label}</div>
      <div className="quiz-card__content">{displayText}</div>
      {example && mode === 'term-to-meaning' && (
        <div className="quiz-card__example">
          <span className="quiz-card__example-label">例文:</span>
          <code className="quiz-card__example-text">{example}</code>
        </div>
      )}
    </Card>
  )
}
