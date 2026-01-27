import { createFileRoute } from '@tanstack/react-router'
import { CategorySettingsPage } from '../components/CategorySettingsPage/CategorySettingsPage'

export const Route = createFileRoute('/category/$categoryId')({
  component: CategorySettingsPage,
})
