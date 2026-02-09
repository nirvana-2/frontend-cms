import React, { useState, useEffect } from 'react';
import { Search, SlidersHorizontal, Utensils, UtensilsCrossed } from 'lucide-react';
import api from '../../services/api';
import FoodItemCard from '../../components/food/FoodItemCard';
import FoodDetailModal from '../../components/food/FoodDetailModal';
import CategoryFilter from '../../components/food/CategoryFilter';
import Loader from '../../components/common/Loader';
import Input from '../../components/common/Input';

const Menu = () => {
  const [foods, setFoods] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('all');
  const [categories, setCategories] = useState([]);
  const [showOutOfStock, setShowOutOfStock] = useState(true);
  const [selectedFood, setSelectedFood] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    fetchFoods();
  }, []);

  const handleProductClick = (food) => {
    setSelectedFood(food);
    setIsModalOpen(true);
  };

  const fetchFoods = async () => {
    try {
      const response = await api.get('/food');
      const foodData = response.data.success ? response.data.data : (Array.isArray(response.data) ? response.data : []);
      
      setFoods(foodData);
      // Extract unique categories
      const uniqueCategories = [...new Set(foodData.map(item => item.category))];
      setCategories(uniqueCategories);
    } catch (error) {
      console.error('Error fetching food:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredFoods = foods.filter(food => {
    const matchesSearch = food.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          food.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = activeCategory === 'all' || food.category === activeCategory;
    const matchesStock = showOutOfStock || food.available;
    return matchesSearch && matchesCategory && matchesStock;
  });

  return (
    <div className="space-y-8">
      {/* Header & Search */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
        <div className="flex items-center">
          <div className="bg-primary/10 p-3 rounded-xl mr-4">
            <UtensilsCrossed size={32} className="text-primary" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-gray-800 tracking-tight">Fresh Menu</h1>
            <p className="text-gray-500">Choose your favorite meal from our canteen</p>
          </div>
        </div>
        <div className="w-full md:w-96">
          <Input
            placeholder="Search for food..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            icon={Search}
            className="mb-0"
          />
        </div>
      </div>

      {/* Categories */}
      <div className="sticky top-20 z-10 bg-gray-50/80 backdrop-blur-md py-2 flex flex-col md:flex-row justify-between items-center gap-4">
        <CategoryFilter
          categories={categories}
          activeCategory={activeCategory}
          onCategoryChange={setActiveCategory}
        />
        <div className="flex items-center space-x-2 bg-white px-4 py-2 rounded-xl shadow-sm border border-gray-100">
          <input
            type="checkbox"
            id="show-out-of-stock"
            checked={showOutOfStock}
            onChange={(e) => setShowOutOfStock(e.target.checked)}
            className="w-4 h-4 rounded border-gray-300 text-primary focus:ring-primary"
          />
          <label htmlFor="show-out-of-stock" className="text-sm font-medium text-gray-700 cursor-pointer">
            Include Out of Stock
          </label>
        </div>
      </div>

      {/* Food Grid */}
      {loading ? (
        <div className="py-20">
          <Loader size="lg" />
        </div>
      ) : filteredFoods.length > 0 ? (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredFoods.map(food => (
              <FoodItemCard 
                key={food._id} 
                food={food} 
                onClick={() => handleProductClick(food)}
              />
            ))}
          </div>

          <FoodDetailModal 
            isOpen={isModalOpen} 
            onClose={() => setIsModalOpen(false)} 
            food={selectedFood} 
          />
        </>
      ) : (
        <div className="text-center py-20 bg-white rounded-2xl border border-dashed border-gray-300">
          <div className="bg-gray-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
            <Utensils className="text-gray-400" size={32} />
          </div>
          <h3 className="text-xl font-bold text-gray-800">No food items found</h3>
          <p className="text-gray-500">Try adjusting your search or category filter</p>
        </div>
      )}
    </div>
  );
};

export default Menu;
