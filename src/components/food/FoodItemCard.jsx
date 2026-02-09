import React, { useState } from 'react';
import { Plus, ShoppingCart, AlertCircle } from 'lucide-react';
import Button from '../common/Button';
import useCart from '../../hooks/useCart';

const FoodItemCard = ({ food, onClick }) => {
  const { addToCart } = useCart();
  const [adding, setAdding] = useState(false);
  const [added, setAdded] = useState(false);

  const handleAddToCart = async (e) => {
    e.stopPropagation(); // Prevent card click (opening modal)
    setAdding(true);
    const result = await addToCart(food._id, 1);
    setAdding(false);
    
    if (result?.success) {
      setAdded(true);
      setTimeout(() => setAdded(false), 2000);
    }
  };

  return (
    <div 
      onClick={onClick}
      className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 group cursor-pointer"
    >
      <div className="relative h-48 overflow-hidden">
        <img
          src={food.image ? `http://localhost:3000${food.image}` : 'https://via.placeholder.com/400x300?text=No+Image'}
          alt={food.name}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
          onError={(e) => { e.target.src = 'https://via.placeholder.com/400x300?text=No+Image' }}
        />
        {!food.available && (
          <div className="absolute inset-0 bg-black/60 backdrop-blur-[2px] flex items-center justify-center">
            <span className="bg-red-500 text-white px-4 py-1 rounded-full text-sm font-bold flex items-center shadow-lg border border-red-400 animate-pulse">
              <AlertCircle size={16} className="mr-2" /> Out of Stock
            </span>
          </div>
        )}
        <div className="absolute top-3 right-3">
          <span className="bg-white/90 backdrop-blur-md text-primary font-bold px-3 py-1 rounded-lg shadow-sm text-sm">
            Rs. {food.price}
          </span>
        </div>
      </div>

      <div className="p-5">
        <div className="flex justify-between items-start mb-2">
          <h3 className="text-lg font-bold text-gray-800 group-hover:text-primary transition-colors">
            {food.name}
          </h3>
          <span className="text-[10px] uppercase tracking-widest font-bold px-2 py-0.5 rounded bg-gray-100 text-gray-500">
            {food.category}
          </span>
        </div>
        
        <p className="text-gray-500 text-sm line-clamp-2 mb-4 h-10">
          {food.description}
        </p>

        <Button
          onClick={handleAddToCart}
          disabled={!food.available || added}
          loading={adding}
          className={`w-full justify-center rounded-xl transition-all ${added ? 'bg-green-500 hover:bg-green-600 border-green-500' : ''}`}
          variant={food.available ? (added ? 'success' : 'primary') : 'ghost'}
        >
          {!food.available ? (
            'Out of Stock'
          ) : added ? (
            'Added to Cart!'
          ) : (
            <>
              <Plus size={18} className="mr-2" /> Add to Cart
            </>
          )}
        </Button>
      </div>
    </div>
  );
};

export default FoodItemCard;
