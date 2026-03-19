interface CategoryFilterProps {
  categories: string[];
  selectedCategory: string;
  onSelectCategory: (category: string) => void;
}

export default function CategoryFilter({
  categories,
  selectedCategory,
  onSelectCategory,
}: CategoryFilterProps) {
  if (categories.length === 0) return null;

  const baseClass =
    'px-3 py-1.5 rounded-full text-sm transition cursor-pointer';

  return (
    <div className="mb-6 flex flex-wrap gap-2">
      <button
        onClick={() => onSelectCategory('')}
        className={`${baseClass} ${
          selectedCategory === ''
            ? 'bg-gray-900 text-white'
            : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
        }`}
      >
        Semua
      </button>

      {categories.map((category) => {
        const isActive = selectedCategory === category;

        return (
          <button
            key={category}
            onClick={() => onSelectCategory(category)}
            className={`${baseClass} ${
              isActive
                ? 'bg-gray-900 text-white'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            #{category}
          </button>
        );
      })}
    </div>
  );
}
