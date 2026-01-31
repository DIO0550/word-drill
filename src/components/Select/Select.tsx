import { useState, useRef, useEffect, useCallback } from 'react'
import './Select.scss'

export type SelectOption = {
  label: string
  value: string | number
}

type SelectProps = {
  options: SelectOption[]
  value: string | number
  onChange: (value: string | number) => void
  placeholder?: string
  disabled?: boolean
  className?: string
}

export const Select = ({
  options,
  value,
  onChange,
  placeholder = '選択してください',
  disabled = false,
  className = '',
}: SelectProps) => {
  const [isOpen, setIsOpen] = useState(false)
  const [highlightedIndex, setHighlightedIndex] = useState(-1)
  const containerRef = useRef<HTMLDivElement>(null)
  const listRef = useRef<HTMLUListElement>(null)

  const selectedOption = options.find((opt) => opt.value === value)
  const selectedIndex = options.findIndex((opt) => opt.value === value)

  // 外側クリックで閉じる
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside)
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [isOpen])

  // ハイライトされた項目をスクロールで見えるようにする
  useEffect(() => {
    if (isOpen && listRef.current && highlightedIndex >= 0) {
      const highlightedElement = listRef.current.children[highlightedIndex] as HTMLElement
      if (highlightedElement) {
        highlightedElement.scrollIntoView({ block: 'nearest' })
      }
    }
  }, [isOpen, highlightedIndex])

  const openDropdown = useCallback(() => {
    const initialIndex = selectedIndex >= 0 ? selectedIndex : 0
    setHighlightedIndex(initialIndex)
    setIsOpen(true)
  }, [selectedIndex])

  const closeDropdown = useCallback(() => {
    setIsOpen(false)
  }, [])

  const handleToggle = useCallback(() => {
    if (!disabled) {
      if (isOpen) {
        closeDropdown()
      } else {
        openDropdown()
      }
    }
  }, [disabled, isOpen, openDropdown, closeDropdown])

  const handleSelect = useCallback(
    (optionValue: string | number) => {
      onChange(optionValue)
      setIsOpen(false)
    },
    [onChange]
  )

  const handleKeyDown = useCallback(
    (event: React.KeyboardEvent) => {
      if (disabled) {
        return
      }

      switch (event.key) {
        case 'Enter':
        case ' ':
          event.preventDefault()
          if (isOpen && highlightedIndex >= 0) {
            handleSelect(options[highlightedIndex].value)
          } else {
            openDropdown()
          }
          break
        case 'Escape':
          event.preventDefault()
          closeDropdown()
          break
        case 'ArrowDown':
          event.preventDefault()
          if (!isOpen) {
            openDropdown()
          } else {
            setHighlightedIndex((prev) => (prev < options.length - 1 ? prev + 1 : prev))
          }
          break
        case 'ArrowUp':
          event.preventDefault()
          if (isOpen) {
            setHighlightedIndex((prev) => (prev > 0 ? prev - 1 : prev))
          }
          break
        case 'Home':
          event.preventDefault()
          if (isOpen) {
            setHighlightedIndex(0)
          }
          break
        case 'End':
          event.preventDefault()
          if (isOpen) {
            setHighlightedIndex(options.length - 1)
          }
          break
      }
    },
    [disabled, isOpen, highlightedIndex, options, handleSelect, openDropdown, closeDropdown]
  )

  return (
    <div
      ref={containerRef}
      className={`select ${isOpen ? 'select--open' : ''} ${disabled ? 'select--disabled' : ''} ${className}`}
    >
      <button
        type="button"
        className="select__trigger"
        onClick={handleToggle}
        onKeyDown={handleKeyDown}
        disabled={disabled}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        aria-labelledby="select-label"
      >
        <span className="select__value">
          {selectedOption ? selectedOption.label : placeholder}
        </span>
        <span className="select__arrow" aria-hidden="true">
          <svg
            width="12"
            height="12"
            viewBox="0 0 12 12"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M2.5 4.5L6 8L9.5 4.5"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </span>
      </button>

      {isOpen && (
        <ul
          ref={listRef}
          className="select__dropdown"
          role="listbox"
          aria-activedescendant={
            highlightedIndex >= 0 ? `select-option-${highlightedIndex}` : undefined
          }
        >
          {options.map((option, index) => (
            <li
              key={option.value}
              id={`select-option-${index}`}
              className={`select__option ${
                value === option.value ? 'select__option--selected' : ''
              } ${highlightedIndex === index ? 'select__option--highlighted' : ''}`}
              role="option"
              aria-selected={value === option.value}
              onClick={() => handleSelect(option.value)}
              onMouseEnter={() => setHighlightedIndex(index)}
            >
              {option.label}
              {value === option.value && (
                <span className="select__check" aria-hidden="true">
                  <svg
                    width="14"
                    height="14"
                    viewBox="0 0 14 14"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M11.5 4L5.5 10L2.5 7"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </span>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
