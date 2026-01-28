import { useState } from 'react'
import { Link, useParams } from '@tanstack/react-router'
import { mainCategories } from '../../data/categories'
import type { SubCategory } from '../../data/categories'
import './CategorySettingsPage.scss'

type QuestionCount = 10 | 20 | 'all'
type QuizMode = 'meaning' | 'term' | 'random'

const questionCountOptions: { value: QuestionCount; label: string }[] = [
  { value: 10, label: '10問' },
  { value: 20, label: '20問' },
  { value: 'all', label: '全部' },
]

const quizModeOptions: { value: QuizMode; label: string }[] = [
  { value: 'meaning', label: '意味を当てる' },
  { value: 'term', label: '用語を当てる' },
  { value: 'random', label: 'ランダム' },
]

export const CategorySettingsPage = () => {
  const { categoryId } = useParams({ from: '/category/$categoryId' })
  
  const category = mainCategories.find((c) => c.id === categoryId)
  
  const [selectedSubCategory, setSelectedSubCategory] = useState<SubCategory | null>(
    category?.subCategories[0] ?? null
  )
  const [questionCount, setQuestionCount] = useState<QuestionCount>(10)
  const [quizMode, setQuizMode] = useState<QuizMode>('meaning')

  if (!category) {
    return (
      <div className="category-settings-page">
        <div className="category-settings-page__error">
          <p>カテゴリが見つかりませんでした</p>
          <Link to="/" className="category-settings-page__back-link">
            トップに戻る
          </Link>
        </div>
      </div>
    )
  }

  const handleStart = () => {
    // TODO: クイズページ実装後に遷移を追加
    console.log('クイズ開始:', {
      category: category.name,
      subCategory: selectedSubCategory?.name,
      subCategoryId: selectedSubCategory?.id,
      questionCount,
      quizMode,
    })
  }

  return (
    <div className="category-settings-page">
      <header className="category-settings-page__header">
        <Link to="/" className="category-settings-page__back-button">
          ← 戻る
        </Link>
        <div className="category-settings-page__title-area">
          <span className="category-settings-page__icon">{category.icon}</span>
          <h1 className="category-settings-page__title">{category.name}</h1>
        </div>
      </header>

      <div className="category-settings-page__content">
        <section className="category-settings-page__section">
          <h2 className="category-settings-page__section-title">
            サブカテゴリを選択
          </h2>
          <div className="subcategory-list">
            {category.subCategories.map((sub) => (
              <label
                key={sub.id}
                className={`subcategory-radio ${
                  selectedSubCategory?.id === sub.id ? 'subcategory-radio--selected' : ''
                }`}
              >
                <input
                  type="radio"
                  name="subcategory"
                  value={sub.id}
                  checked={selectedSubCategory?.id === sub.id}
                  onChange={() => setSelectedSubCategory(sub)}
                  className="subcategory-radio__input"
                />
                <span className="subcategory-radio__icon">{sub.icon}</span>
                <div className="subcategory-radio__content">
                  <span className="subcategory-radio__name">{sub.name}</span>
                  <span className="subcategory-radio__word-count">
                    {sub.wordCount} 問
                  </span>
                </div>
                <span className="subcategory-radio__indicator" />
              </label>
            ))}
          </div>
        </section>

        <section className="category-settings-page__section">
          <h2 className="category-settings-page__section-title">問題数</h2>
          <div className="option-group">
            {questionCountOptions.map((option) => (
              <label
                key={option.value}
                className={`option-button ${
                  questionCount === option.value ? 'option-button--selected' : ''
                }`}
              >
                <input
                  type="radio"
                  name="questionCount"
                  value={option.value}
                  checked={questionCount === option.value}
                  onChange={() => setQuestionCount(option.value)}
                  className="option-button__input"
                />
                <span className="option-button__label">{option.label}</span>
              </label>
            ))}
          </div>
        </section>

        <section className="category-settings-page__section">
          <h2 className="category-settings-page__section-title">出題モード</h2>
          <div className="option-group">
            {quizModeOptions.map((option) => (
              <label
                key={option.value}
                className={`option-button ${
                  quizMode === option.value ? 'option-button--selected' : ''
                }`}
              >
                <input
                  type="radio"
                  name="quizMode"
                  value={option.value}
                  checked={quizMode === option.value}
                  onChange={() => setQuizMode(option.value)}
                  className="option-button__input"
                />
                <span className="option-button__label">{option.label}</span>
              </label>
            ))}
          </div>
        </section>

        <button
          type="button"
          className="category-settings-page__start-button"
          onClick={handleStart}
          disabled={!selectedSubCategory}
        >
          開始する
        </button>
      </div>
    </div>
  )
}
