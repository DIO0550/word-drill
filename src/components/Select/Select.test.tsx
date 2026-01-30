import { render, screen, fireEvent } from '@testing-library/react'
import { Select } from './Select'
import { describe, it, expect, vi } from 'vitest'

describe('Select', () => {
  const options = [
    { label: 'Option 1', value: 'opt1' },
    { label: 'Option 2', value: 'opt2' },
  ]
  const handleChange = vi.fn()

  it('renders options correctly', () => {
    render(<Select options={options} value="opt1" onChange={handleChange} />)
    expect(screen.getByRole('combobox')).toBeInTheDocument()
    expect(screen.getByRole('option', { name: 'Option 1' })).toBeInTheDocument()
    expect(screen.getByRole('option', { name: 'Option 2' })).toBeInTheDocument()
  })

  it('calls onChange when value changes', () => {
    render(<Select options={options} value="opt1" onChange={handleChange} />)
    fireEvent.change(screen.getByRole('combobox'), { target: { value: 'opt2' } })
    expect(handleChange).toHaveBeenCalledWith('opt2')
  })
})
