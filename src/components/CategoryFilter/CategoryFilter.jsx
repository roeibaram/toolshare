import './CategoryFilter.css'

export function CategoryFilter({ activeCategory, categories, onCategoryChange }) {
  return (
    <div className="category-filter" role="group" aria-label="Filter by tool category">
      {categories.map((category) => (
        <button
          aria-pressed={activeCategory === category}
          className={`category-filter__button ${activeCategory === category ? 'category-filter__button--active' : ''}`}
          key={category}
          onClick={() => onCategoryChange(category)}
          type="button"
        >
          {category}
        </button>
      ))}
    </div>
  )
}
