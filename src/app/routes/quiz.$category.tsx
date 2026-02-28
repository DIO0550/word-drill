import { createFileRoute, Outlet } from '@tanstack/react-router'

const QuizComponent = () => {
  return (
    <>
      <Outlet />
    </>
  )
}

export const Route = createFileRoute('/quiz/$category')({
  component: QuizComponent,
})
