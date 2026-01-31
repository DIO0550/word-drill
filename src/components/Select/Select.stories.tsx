import type { Meta, StoryObj } from '@storybook/react'
import { Select } from './Select'
import { useState } from 'react'
import '../../app/styles/main.scss'

const meta = {
  title: 'Components/Select',
  component: Select,
  tags: ['autodocs'],
  argTypes: {
    onChange: { action: 'changed' },
  },
  parameters: {
    layout: 'centered',
  },
  decorators: [
    (Story) => (
      <div style={{ width: '280px' }}>
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof Select>

export default meta
type Story = StoryObj<typeof meta>

const basicOptions = [
  { label: 'Option 1', value: 'opt1' },
  { label: 'Option 2', value: 'opt2' },
  { label: 'Option 3', value: 'opt3' },
]

const themeOptions = [
  { label: '☀️ ライトテーマ', value: 'light' },
  { label: '🌙 ダークテーマ', value: 'dark' },
  { label: '🎨 カラフルテーマ', value: 'colorful' },
]

const manyOptions = Array.from({ length: 15 }, (_, i) => ({
  label: `アイテム ${i + 1}`,
  value: `item-${i + 1}`,
}))

export const Default: Story = {
  render: function Render(args) {
    const [value, setValue] = useState<string | number>('opt1')
    return <Select {...args} value={value} onChange={setValue} />
  },
  args: {
    options: basicOptions,
    value: 'opt1',
    onChange: () => {},
  },
}

export const WithPlaceholder: Story = {
  render: function Render(args) {
    const [value, setValue] = useState<string | number>('')
    return <Select {...args} value={value} onChange={setValue} />
  },
  args: {
    options: basicOptions,
    value: '',
    placeholder: '選択してください',
    onChange: () => {},
  },
}

export const ThemeSelector: Story = {
  render: function Render(args) {
    const [value, setValue] = useState<string | number>('light')
    return <Select {...args} value={value} onChange={setValue} />
  },
  args: {
    options: themeOptions,
    value: 'light',
    onChange: () => {},
  },
}

export const ManyOptions: Story = {
  render: function Render(args) {
    const [value, setValue] = useState<string | number>('item-1')
    return <Select {...args} value={value} onChange={setValue} />
  },
  args: {
    options: manyOptions,
    value: 'item-1',
    onChange: () => {},
  },
}

export const Disabled: Story = {
  args: {
    options: basicOptions,
    value: 'opt1',
    disabled: true,
    onChange: () => {},
  },
}
