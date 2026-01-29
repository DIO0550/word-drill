import { it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { Button } from './Button'

it('Buttonはchildrenを正しく表示する', () => {
  render(<Button>Click me</Button>)
  expect(screen.getByRole('button', { name: 'Click me' })).toBeInTheDocument()
})

it('Buttonはデフォルトでprimary/mediumクラスを適用する', () => {
  render(<Button>Button</Button>)
  const button = screen.getByRole('button')
  expect(button).toHaveClass('button', 'button--primary', 'button--medium')
})

it('Buttonはsecondaryバリアントを適用する', () => {
  render(<Button variant="secondary">Button</Button>)
  expect(screen.getByRole('button')).toHaveClass('button--secondary')
})

it('Buttonはtertiaryバリアントを適用する', () => {
  render(<Button variant="tertiary">Button</Button>)
  expect(screen.getByRole('button')).toHaveClass('button--tertiary')
})

it('Buttonはsmallサイズを適用する', () => {
  render(<Button size="small">Button</Button>)
  expect(screen.getByRole('button')).toHaveClass('button--small')
})

it('Buttonはlargeサイズを適用する', () => {
  render(<Button size="large">Button</Button>)
  expect(screen.getByRole('button')).toHaveClass('button--large')
})

it('ButtonはfullWidth時にクラスを適用する', () => {
  render(<Button fullWidth>Button</Button>)
  expect(screen.getByRole('button')).toHaveClass('button--full-width')
})

it('Buttonはクリック時にonClickを呼び出す', () => {
  const handleClick = vi.fn()
  render(<Button onClick={handleClick}>Button</Button>)

  fireEvent.click(screen.getByRole('button'))
  expect(handleClick).toHaveBeenCalledTimes(1)
})

it('Buttonはdisabled時にクリックしてもonClickを呼び出さない', () => {
  const handleClick = vi.fn()
  render(<Button onClick={handleClick} disabled>Button</Button>)

  fireEvent.click(screen.getByRole('button'))
  expect(handleClick).not.toHaveBeenCalled()
})

it('Buttonはカスタムclassを追加できる', () => {
  render(<Button className="custom-class">Button</Button>)
  expect(screen.getByRole('button')).toHaveClass('custom-class')
})

it('Buttonはtype属性を設定できる', () => {
  render(<Button type="submit">Button</Button>)
  expect(screen.getByRole('button')).toHaveAttribute('type', 'submit')
})
