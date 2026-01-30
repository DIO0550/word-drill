import type { Meta, StoryObj } from '@storybook/react'
import { Card } from './Card'
import '../../app/styles/main.scss'

const meta = {
  title: 'Components/Card',
  component: Card,
  tags: ['autodocs'],
} satisfies Meta<typeof Card>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    children: 'Card Content',
  },
}

export const Interactive: Story = {
  args: {
    children: 'Clickable Card',
    onClick: () => alert('Clicked!'),
  },
}
