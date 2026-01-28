import { createFileRoute } from '@tanstack/react-router'
import { CategorySettingsPage } from '../../features/category/components/CategorySettingsPage/CategorySettingsPage'

export const Route = createFileRoute('/category/$categoryId')({
  component: CategorySettingsPage,
})
