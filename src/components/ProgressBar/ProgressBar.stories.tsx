import type { Meta, StoryObj } from '@storybook/react'
import { ProgressBar } from './ProgressBar'
import '../../app/styles/main.scss'

const meta = {
  title: 'Components/ProgressBar',
  component: ProgressBar,
  tags: ['autodocs'],
} satisfies Meta<typeof ProgressBar>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    value: 5,
    max: 10,
    label: 'Progress',
  },
}

export const Full: Story = {
  args: {
    value: 10,
    max: 10,
    label: 'Completed',
  },
}

export const Zero: Story = {
  args: {
    value: 0,
    max: 10,
    label: 'Start',
  },
}
