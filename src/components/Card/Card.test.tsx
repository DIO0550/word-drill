import { render, screen, fireEvent } from '@testing-library/react'
import { Card } from './Card'
import { describe, it, expect, vi } from 'vitest'

describe('Card', () => {
  it('renders children correctly', () => {
    render(<Card>Card Content</Card>)
    expect(screen.getByText('Card Content')).toBeInTheDocument()
  })

  it('handles onClick event', () => {
    const handleClick = vi.fn()
    render(<Card onClick={handleClick}>Clickable</Card>)
    
    fireEvent.click(screen.getByText('Clickable'))
    expect(handleClick).toHaveBeenCalledTimes(1)
  })

  it('applies interactive class when onClick is provided', () => {
    const { container } = render(<Card onClick={() => {}}>Interactive</Card>)
    expect(container.firstChild).toHaveClass('card--interactive')
  })
})
