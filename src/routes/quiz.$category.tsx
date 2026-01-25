import { createFileRoute } from '@tanstack/react-router'

const QuizComponent = () => {
  const { category } = Route.useParams()
  return <div>Quiz Category: {category}</div>
}

export const Route = createFileRoute('/quiz/$category')({
  component: QuizComponent,
})
