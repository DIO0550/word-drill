import './RadioGroup.scss'

export type RadioOption = {
  label: string
  value: string
}

type RadioGroupProps = {
  options: RadioOption[]
  value: string
  onChange: (value: string) => void
  name: string
  className?: string
}

export const RadioGroup = ({ options, value, onChange, name, className = '' }: RadioGroupProps) => {
  return (
    <div className={`radio-group ${className}`} role="radiogroup">
      {options.map((option) => (
        <label
          key={option.value}
          className={`radio-group__item ${value === option.value ? 'radio-group__item--selected' : ''}`}
        >
          <input
            type="radio"
            name={name}
            value={option.value}
            checked={value === option.value}
            onChange={(e) => onChange(e.target.value)}
            className="radio-group__input"
          />
          <span className="radio-group__label">{option.label}</span>
        </label>
      ))}
    </div>
  )
}
