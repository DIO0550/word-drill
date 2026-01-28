import { createFileRoute } from '@tanstack/react-router'

const StatsComponent = () => {
  return <div>Statistics Page</div>
}

export const Route = createFileRoute('/stats')({
  component: StatsComponent,
})
