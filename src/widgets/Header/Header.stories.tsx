import type { Meta, StoryObj } from '@storybook/react-vite'
import { Header } from './Header'
import { createRouter, RouterProvider, createRootRoute, createMemoryHistory } from '@tanstack/react-router'

const meta: Meta<typeof Header> = {
  title: 'Components/Header',
  component: Header,
  decorators: [
    (Story) => {
      const rootRoute = createRootRoute({
        component: () => <Story />,
      })
      const router = createRouter({
        routeTree: rootRoute,
        history: createMemoryHistory(),
      })
      return <RouterProvider router={router} />
    },
  ],
}

export default meta
type Story = StoryObj<typeof Header>

export const Default: Story = {}
