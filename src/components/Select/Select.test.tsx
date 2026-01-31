import { render, screen, fireEvent } from '@testing-library/react'
import { Select } from './Select'
import { expect, vi, test, beforeAll } from 'vitest'

// jsdomにはscrollIntoViewが実装されていないためモック
beforeAll(() => {
  Element.prototype.scrollIntoView = vi.fn()
})

const options = [
  { label: 'Option 1', value: 'opt1' },
  { label: 'Option 2', value: 'opt2' },
  { label: 'Option 3', value: 'opt3' },
]

test('Select: トリガーボタンが選択値を表示する', () => {
  const handleChange = vi.fn()
  render(<Select options={options} value="opt1" onChange={handleChange} />)

  const trigger = screen.getByRole('button')
  expect(trigger).toHaveTextContent('Option 1')
})

test('Select: placeholderが値未選択時に表示される', () => {
  const handleChange = vi.fn()
  render(
    <Select options={options} value="" onChange={handleChange} placeholder="選択してください" />
  )

  const trigger = screen.getByRole('button')
  expect(trigger).toHaveTextContent('選択してください')
})

test('Select: クリックでドロップダウンが開く', () => {
  const handleChange = vi.fn()
  render(<Select options={options} value="opt1" onChange={handleChange} />)

  const trigger = screen.getByRole('button')
  fireEvent.click(trigger)

  expect(screen.getByRole('listbox')).toBeInTheDocument()
  expect(screen.getAllByRole('option')).toHaveLength(3)
})

test('Select: オプションをクリックするとonChangeが呼ばれる', () => {
  const handleChange = vi.fn()
  render(<Select options={options} value="opt1" onChange={handleChange} />)

  fireEvent.click(screen.getByRole('button'))
  fireEvent.click(screen.getByRole('option', { name: 'Option 2' }))

  expect(handleChange).toHaveBeenCalledWith('opt2')
})

test('Select: 選択後にドロップダウンが閉じる', () => {
  const handleChange = vi.fn()
  render(<Select options={options} value="opt1" onChange={handleChange} />)

  fireEvent.click(screen.getByRole('button'))
  fireEvent.click(screen.getByRole('option', { name: 'Option 2' }))

  expect(screen.queryByRole('listbox')).not.toBeInTheDocument()
})

test('Select: Escapeキーでドロップダウンが閉じる', () => {
  const handleChange = vi.fn()
  render(<Select options={options} value="opt1" onChange={handleChange} />)

  const trigger = screen.getByRole('button')
  fireEvent.click(trigger)
  expect(screen.getByRole('listbox')).toBeInTheDocument()

  fireEvent.keyDown(trigger, { key: 'Escape' })
  expect(screen.queryByRole('listbox')).not.toBeInTheDocument()
})

test('Select: ArrowDownキーでドロップダウンが開く', () => {
  const handleChange = vi.fn()
  render(<Select options={options} value="opt1" onChange={handleChange} />)

  const trigger = screen.getByRole('button')
  fireEvent.keyDown(trigger, { key: 'ArrowDown' })

  expect(screen.getByRole('listbox')).toBeInTheDocument()
})

test('Select: disabledの場合クリックが無効', () => {
  const handleChange = vi.fn()
  render(<Select options={options} value="opt1" onChange={handleChange} disabled />)

  const trigger = screen.getByRole('button')
  expect(trigger).toBeDisabled()
})

test('Select: 選択中のオプションにaria-selected属性がある', () => {
  const handleChange = vi.fn()
  render(<Select options={options} value="opt2" onChange={handleChange} />)

  fireEvent.click(screen.getByRole('button'))

  const selectedOption = screen.getByRole('option', { name: 'Option 2' })
  expect(selectedOption).toHaveAttribute('aria-selected', 'true')
})
