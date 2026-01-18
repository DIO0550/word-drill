import { Link } from '@tanstack/react-router'
import type { Category } from '../../data/categories'
import './CategoryCard.css'

interface CategoryCardProps {
  category: Category
}

export function CategoryCard({ category }: CategoryCardProps) {
  return (
    <Link
      to="/quiz/$category"
      params={{ category: category.id }}
      className="category-card"
    >
      <span className="category-card__icon">{category.icon}</span>
      <h2 className="category-card__name">{category.name}</h2>
      <p className="category-card__description">{category.description}</p>
      <span className="category-card__word-count">
        <span className="category-card__word-count-icon">📝</span>
        {category.wordCount} 単語
      </span>
    </Link>
  )
}
