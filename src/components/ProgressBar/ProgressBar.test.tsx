import { render, screen } from '@testing-library/react'
import { ProgressBar } from './ProgressBar'
import { describe, it, expect } from 'vitest'

describe('ProgressBar', () => {
  it('renders correctly with default props', () => {
    render(<ProgressBar value={50} max={100} label="Progress" />)
    expect(screen.getByRole('progressbar')).toBeInTheDocument()
    expect(screen.getByText('Progress')).toBeInTheDocument()
    expect(screen.getByText('50 / 100')).toBeInTheDocument()
  })

  it('does not show label when showLabel is false', () => {
    render(<ProgressBar value={50} max={100} showLabel={false} label="Progress" />)
    expect(screen.queryByText('Progress')).not.toBeInTheDocument()
  })

  it('calculates width correctly', () => {
      // Since width is set via style, it's hard to test exact pixels without getComputedStyle but we can check the inline style
      const { container } = render(<ProgressBar value={50} max={100} />)
      const fill = container.querySelector('.progress-bar__fill')
      expect(fill).toHaveStyle('width: 50%')
  })
})
