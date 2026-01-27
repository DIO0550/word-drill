import { Link } from '@tanstack/react-router'
import type { MainCategory } from '../../data/categories'
import './MainCategoryCard.scss'

type MainCategoryCardProps = {
  category: MainCategory
}

export const MainCategoryCard = ({ category }: MainCategoryCardProps) => {
  const totalWordCount = category.subCategories.reduce(
    (sum, sub) => sum + sub.wordCount,
    0
  )

  return (
    <Link
      to="/category/$categoryId"
      params={{ categoryId: category.id }}
      className="main-category-card"
    >
      <div className="main-category-card__header">
        <span className="main-category-card__icon">{category.icon}</span>
        <h2 className="main-category-card__title">{category.name}</h2>
        <p className="main-category-card__description">{category.description}</p>
      </div>

      <div className="main-category-card__info">
        <div className="main-category-card__stat">
          <span className="main-category-card__stat-value">
            {category.subCategories.length}
          </span>
          <span className="main-category-card__stat-label">カテゴリ</span>
        </div>
        <div className="main-category-card__stat">
          <span className="main-category-card__stat-value">{totalWordCount}</span>
          <span className="main-category-card__stat-label">問題</span>
        </div>
      </div>

      <div className="main-category-card__subcategories">
        {category.subCategories.slice(0, 3).map((sub) => (
          <span key={sub.id} className="subcategory-tag">
            {sub.icon} {sub.name}
          </span>
        ))}
        {category.subCategories.length > 3 && (
          <span className="subcategory-tag subcategory-tag--more">
            +{category.subCategories.length - 3}
          </span>
        )}
      </div>

      <span className="main-category-card__cta">
        学習を始める →
      </span>
    </Link>
  )
}
