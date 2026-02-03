import { createFileRoute } from '@tanstack/react-router'

import type { QuizQuestion } from '../../lib/quiz'
import { QuizPlayPage } from '../../features/quiz'

// モックデータ（デモ用）
const mockQuestions: QuizQuestion[] = [
  {
    id: 'q1',
    term: 'ownership',
    meaning:
      'Rustにおけるメモリ管理の基本概念。各値は所有者を持ち、所有者がスコープを抜けると値は解放される。',
    choices: ['所有権', '借用', 'ライフタイム', '参照'],
    answer: 0,
    example:
      'let s1 = String::from("hello"); let s2 = s1; // s1 の ownership が s2 に移動',
  },
  {
    id: 'q2',
    term: 'borrowing',
    meaning: '所有権を移動せずに値を参照すること。',
    choices: ['所有権', '借用', 'ライフタイム', '参照'],
    answer: 1,
  },
  {
    id: 'q3',
    term: 'lifetime',
    meaning: '参照が有効な期間を表す。',
    choices: ['所有権', '借用', 'ライフタイム', '参照'],
    answer: 2,
  },
]

const categoryNameMap: Record<string, string> = {
  'tech-programming': 'プログラミング',
  'tech-infra': 'インフラ/クラウド',
  'tech-security': 'セキュリティ',
  general: '一般英単語',
  'general-toeic': 'TOEIC向け',
}

const QuizPlayComponent = () => {
  const params = Route.useParams()
  const category = 'category' in params ? params.category : ''
  const categoryName = categoryNameMap[category] ?? category

  return (
    <QuizPlayPage
      categoryId={category}
      categoryName={categoryName}
      questions={mockQuestions}
      mode="term-to-meaning"
    />
  )
}

export const Route = createFileRoute('/quiz/$category/play')({
  component: QuizPlayComponent,
})
