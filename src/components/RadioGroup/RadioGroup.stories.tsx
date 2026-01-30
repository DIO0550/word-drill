import type { Meta, StoryObj } from '@storybook/react'
import { RadioGroup } from './RadioGroup'
import { useState } from 'react'
import '../../app/styles/main.scss'

const meta = {
  title: 'Components/RadioGroup',
  component: RadioGroup,
  tags: ['autodocs'],
  argTypes: {
      onChange: { action: 'changed' }
  }
} satisfies Meta<typeof RadioGroup>

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
    return <RadioGroup {...args} value={value} onChange={setValue} />
  },
  args: {
    options,
    value: 'opt1',
    name: 'demo-radio',
    onChange: () => {},
  },
}
