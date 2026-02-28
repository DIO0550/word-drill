import { createFileRoute } from '@tanstack/react-router'

import type { QuizQuestion } from '../../lib/quiz'
import { QuizPlayPage, QuestionCount, QuizMode } from '../../features/quiz'

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

import { mainCategories } from '../../features/category/data/categories'

const QuizPlayComponent = () => {
  const params = Route.useParams()
  const search = Route.useSearch()
  
  const category = 'category' in params ? params.category : ''
  const mainCategory = mainCategories.find((c) => c.id === category)
  const categoryName = mainCategory?.name ?? category

  console.log('Quiz Settings:', {
    category,
    subCategoryId: search.subCategoryId,
    questionCount: search.questionCount,
    mode: search.quizMode
  })

  // TODO: search.subCategoryId や search.questionCount に基づいて実際の問題データをフィルタリングする
  // 今回はモックデータを指定の件数だけスライスして疑似的に反映する
  const displayCount = search.questionCount === 'all' ? mockQuestions.length : search.questionCount;
  const filteredQuestions = mockQuestions.slice(0, displayCount);
  
  return (
    <QuizPlayPage
      categoryId={category}
      categoryName={categoryName}
      questions={filteredQuestions}
      mode={search.quizMode}
    />
  )
}

type QuizPlaySearchParams = {
  subCategoryId?: string
  questionCount: number | 'all'
  quizMode: 'term-to-meaning' | 'meaning-to-term' | 'random'
}

export const Route = createFileRoute('/quiz/$category/play')({
  component: QuizPlayComponent,
  validateSearch: (search: Record<string, unknown>): QuizPlaySearchParams => {
    return {
      subCategoryId: typeof search.subCategoryId === 'string' ? search.subCategoryId : undefined,
      questionCount: QuestionCount.from(search.questionCount),
      quizMode: QuizMode.from(search.quizMode),
    }
  },
})
