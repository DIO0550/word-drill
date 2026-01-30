import './ProgressBar.scss'

type ProgressBarProps = {
  value: number
  max: number
  showLabel?: boolean
  className?: string
  label?: string
}

export const ProgressBar = ({ value, max, showLabel = true, className = '', label }: ProgressBarProps) => {
  const percentage = Math.min(Math.max((value / max) * 100, 0), 100)

  return (
    <div className={`progress-bar ${className}`} role="progressbar" aria-valuenow={value} aria-valuemin={0} aria-valuemax={max}>
      {showLabel && (
        <div className="progress-bar__label">
          <span>{label}</span>
          <span>{`${value} / ${max}`}</span>
        </div>
      )}
      <div className="progress-bar__track">
        <div
          className="progress-bar__fill"
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  )
}
