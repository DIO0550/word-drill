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
} satisfies Meta<typeof Select>

export default meta
type Story = StoryObj<typeof meta>

const options = [
  { label: 'Option 1', value: 'opt1' },
  { label: 'Option 2', value: 'opt2' },
  { label: 'Option 3', value: 'opt3' },
]

export const Default: Story = {
  render: function Render(args) {
    const [value, setValue] = useState('opt1')
    return <Select {...args} value={value} onChange={setValue} />
  },
  args: {
    options,
    value: 'opt1',
    onChange: () => {},
  },
}
