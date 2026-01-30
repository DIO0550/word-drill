import './Select.scss'

export type SelectOption = {
  label: string
  value: string | number
}

type SelectProps = {
  options: SelectOption[]
  value: string | number
  onChange: (value: string) => void
  disabled?: boolean
  className?: string
}

export const Select = ({ options, value, onChange, disabled = false, className = '' }: SelectProps) => {
  return (
    <div className={`select-wrapper ${className}`}>
      <select
        className="select-wrapper__input"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        disabled={disabled}
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  )
}
