import { render, screen, fireEvent } from '@testing-library/react'
import { RadioGroup } from './RadioGroup'
import { describe, it, expect, vi } from 'vitest'

describe('RadioGroup', () => {
  const options = [
    { label: 'Option 1', value: 'opt1' },
    { label: 'Option 2', value: 'opt2' },
  ]
  const handleChange = vi.fn()

  it('renders all options', () => {
    render(<RadioGroup options={options} value="opt1" onChange={handleChange} name="test-radio" />)
    expect(screen.getByLabelText('Option 1')).toBeInTheDocument()
    expect(screen.getByLabelText('Option 2')).toBeInTheDocument()
  })

  it('calls onChange when an option is selected', () => {
    render(<RadioGroup options={options} value="opt1" onChange={handleChange} name="test-radio" />)
    fireEvent.click(screen.getByLabelText('Option 2'))
    expect(handleChange).toHaveBeenCalledWith('opt2')
  })

  it('highlights the selected option', () => {
    render(<RadioGroup options={options} value="opt1" onChange={handleChange} name="test-radio" />)
    expect(screen.getByLabelText('Option 1')).toBeChecked()
    expect(screen.getByLabelText('Option 2')).not.toBeChecked()
  })
})
