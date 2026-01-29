import type { Meta, StoryObj } from '@storybook/react'
import { Button } from './Button'

const meta = {
  title: 'Components/Button',
  component: Button,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'select',
      options: ['primary', 'secondary', 'tertiary'],
      description: 'ボタンのスタイルバリアント',
    },
    size: {
      control: 'select',
      options: ['small', 'medium', 'large'],
      description: 'ボタンのサイズ',
    },
    fullWidth: {
      control: 'boolean',
      description: '幅を100%にするか',
    },
    disabled: {
      control: 'boolean',
      description: '無効状態',
    },
  },
} satisfies Meta<typeof Button>

export default meta
type Story = StoryObj<typeof meta>

// デフォルト
export const Primary: Story = {
  args: {
    children: 'ボタン',
    variant: 'primary',
  },
}

export const Secondary: Story = {
  args: {
    children: 'ボタン',
    variant: 'secondary',
  },
}

export const Tertiary: Story = {
  args: {
    children: 'ボタン',
    variant: 'tertiary',
  },
}

// サイズ
export const Small: Story = {
  args: {
    children: 'Small',
    size: 'small',
  },
}

export const Medium: Story = {
  args: {
    children: 'Medium',
    size: 'medium',
  },
}

export const Large: Story = {
  args: {
    children: 'Large',
    size: 'large',
  },
}

// 状態
export const Disabled: Story = {
  args: {
    children: '無効なボタン',
    disabled: true,
  },
}

// フルワイズ
export const FullWidth: Story = {
  args: {
    children: '幅100%のボタン',
    fullWidth: true,
  },
  decorators: [
    (Story) => (
      <div style={{ width: '300px' }}>
        <Story />
      </div>
    ),
  ],
}

// すべてのバリアント
export const AllVariants: Story = {
  args: {
    children: 'All Variants',
  },
  render: () => (
    <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
      <Button variant="primary">Primary</Button>
      <Button variant="secondary">Secondary</Button>
      <Button variant="tertiary">Tertiary</Button>
    </div>
  ),
}

// すべてのサイズ
export const AllSizes: Story = {
  args: {
    children: 'All Sizes',
  },
  render: () => (
    <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
      <Button size="small">Small</Button>
      <Button size="medium">Medium</Button>
      <Button size="large">Large</Button>
    </div>
  ),
}
