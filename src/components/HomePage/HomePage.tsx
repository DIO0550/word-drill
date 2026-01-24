import { mainCategories } from '../../data/categories'
import { MainCategoryCard } from '../MainCategoryCard/MainCategoryCard'
import './HomePage.css'

export const HomePage = () => {
  return (
    <div className="home-page">
      <section className="home-page__hero">
        <h1 className="home-page__title">英単語ドリル</h1>
        <p className="home-page__subtitle">
          カテゴリを選んで学習を始めましょう
        </p>
      </section>
      <div className="home-page__categories">
        {mainCategories.map((category) => (
          <MainCategoryCard key={category.id} category={category} />
        ))}
      </div>
    </div>
  )
}
