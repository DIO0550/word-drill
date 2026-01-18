import { Link } from '@tanstack/react-router'
import type { MainCategory } from '../../data/categories'
import './MainCategoryCard.css'

interface MainCategoryCardProps {
  category: MainCategory
}

export function MainCategoryCard({ category }: MainCategoryCardProps) {
  return (
    <div className="main-category-card">
      <div className="main-category-card__header">
        <span className="main-category-card__icon">{category.icon}</span>
        <h2 className="main-category-card__title">{category.name}</h2>
        <p className="main-category-card__description">{category.description}</p>
      </div>
      
      <div className="main-category-card__subcategories">
        {category.subCategories.map((sub) => (
          <Link
            key={sub.id}
            to="/quiz/$category"
            params={{ category: sub.id }}
            className="subcategory-item"
          >
            <span className="subcategory-item__icon">{sub.icon}</span>
            <div className="subcategory-item__content">
              <span className="subcategory-item__name">{sub.name}</span>
              <span className="subcategory-item__word-count">{sub.wordCount} 単語</span>
            </div>
            <span className="subcategory-item__arrow">→</span>
          </Link>
        ))}
      </div>
    </div>
  )
}
