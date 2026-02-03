import { ProgressBar } from '../../../../components/ProgressBar/ProgressBar'

import './QuizProgressHeader.scss'

type QuizProgressHeaderProps = {
  current: number
  total: number
  categoryName?: string
}

export const QuizProgressHeader = ({
  current,
  total,
  categoryName,
}: QuizProgressHeaderProps) => {
  return (
    <header className="quiz-progress-header">
      {categoryName && (
        <h2 className="quiz-progress-header__category">{categoryName}</h2>
      )}
      <ProgressBar
        value={current}
        max={total}
        showLabel
        label="進捗"
        className="quiz-progress-header__progress"
      />
    </header>
  )
}
