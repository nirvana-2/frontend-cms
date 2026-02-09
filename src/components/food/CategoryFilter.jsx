import React from 'react';

const CategoryFilter = ({ categories, activeCategory, onCategoryChange }) => {
  return (
    <div className="flex space-x-2 overflow-x-auto pb-4 no-scrollbar">
      <button
        onClick={() => onCategoryChange('all')}
        className={`px-6 py-2 rounded-full text-sm font-bold transition-all duration-200 whitespace-nowrap
          ${activeCategory === 'all' 
            ? 'bg-primary text-white shadow-md shadow-primary/20' 
            : 'bg-white text-gray-600 hover:bg-gray-100 border border-gray-200'}`}
      >
        All Items
      </button>
      {categories.map((category) => (
        <button
          key={category}
          onClick={() => onCategoryChange(category)}
          className={`px-6 py-2 rounded-full text-sm font-bold transition-all duration-200 whitespace-nowrap capitalize
            ${activeCategory === category 
              ? 'bg-primary text-white shadow-md shadow-primary/20' 
              : 'bg-white text-gray-600 hover:bg-gray-100 border border-gray-200'}`}
        >
          {category}
        </button>
      ))}
    </div>
  );
};

export default CategoryFilter;
