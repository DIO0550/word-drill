import type { Meta, StoryObj } from '@storybook/react'
import { Layout } from './Layout'
import { createMemoryHistory, RouterProvider, createRootRoute, createRouter } from '@tanstack/react-router'
import '../../app/styles/main.scss'

const meta = {
  title: 'Components/Layout',
  component: Layout,
  parameters: {
    layout: 'fullscreen',
  },
  decorators: [
    (Story) => {
      const rootRoute = createRootRoute({
        component: Story,
      })
      const router = createRouter({ routeTree: rootRoute, history: createMemoryHistory() })
      return <RouterProvider router={router} />
    },
  ],
  tags: ['autodocs'],
} satisfies Meta<typeof Layout>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    children: 'Layout Content',
  },
}
