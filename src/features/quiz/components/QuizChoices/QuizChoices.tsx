import { Button } from '../../../../components/Button/Button'

import './QuizChoices.scss'

type QuizChoicesProps = {
  choices: string[]
  selectedIndex: number | null
  correctIndex?: number
  onSelect: (index: number) => void
  disabled?: boolean
  showResult?: boolean
}

export const QuizChoices = ({
  choices,
  selectedIndex,
  correctIndex,
  onSelect,
  disabled = false,
  showResult = false,
}: QuizChoicesProps) => {
  const getButtonVariant = (index: number) => {
    if (!showResult) {
      return selectedIndex === index ? 'primary' : 'secondary'
    }

    if (index === correctIndex) {
      return 'primary'
    }
    if (index === selectedIndex && index !== correctIndex) {
      return 'tertiary'
    }
    return 'secondary'
  }

  const getButtonClassName = (index: number) => {
    if (!showResult) {
      return ''
    }

    if (index === correctIndex) {
      return 'quiz-choices__button--correct'
    }
    if (index === selectedIndex && index !== correctIndex) {
      return 'quiz-choices__button--incorrect'
    }
    return ''
  }

  return (
    <div className="quiz-choices">
      {choices.map((choice, index) => (
        <Button
          key={index}
          variant={getButtonVariant(index)}
          size="large"
          fullWidth
          onClick={() => onSelect(index)}
          disabled={disabled}
          className={`quiz-choices__button ${getButtonClassName(index)}`}
        >
          <span className="quiz-choices__index">{index + 1}</span>
          <span className="quiz-choices__text">{choice}</span>
        </Button>
      ))}
    </div>
  )
}
