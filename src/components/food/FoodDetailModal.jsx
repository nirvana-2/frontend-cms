import React, { useState } from 'react';
import { Plus, ShoppingCart, AlertCircle, Clock, Utensils } from 'lucide-react';
import Modal from '../common/Modal';
import Button from '../common/Button';
import useCart from '../../hooks/useCart';

const FoodDetailModal = ({ isOpen, onClose, food }) => {
  const { addToCart } = useCart();
  const [adding, setAdding] = useState(false);
  const [added, setAdded] = useState(false);

  if (!food) return null;

  const handleAddToCart = async () => {
    setAdding(true);
    const result = await addToCart(food._id, 1);
    setAdding(false);
    
    if (result?.success) {
      setAdded(true);
      setTimeout(() => setAdded(false), 2000);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Food Details">
      <div className="space-y-6">
        {/* Image Section */}
        <div className="relative h-64 rounded-2xl overflow-hidden shadow-inner bg-gray-100">
          <img
            src={food.image ? `http://localhost:3000${food.image}` : 'https://via.placeholder.com/600x400?text=No+Image'}
            alt={food.name}
            className="w-full h-full object-cover"
            onError={(e) => { e.target.src = 'https://via.placeholder.com/600x400?text=No+Image' }}
          />
          {!food.available && (
            <div className="absolute inset-0 bg-black/60 backdrop-blur-[2px] flex items-center justify-center">
              <span className="bg-red-500 text-white px-6 py-2 rounded-full text-lg font-bold flex items-center shadow-lg border border-red-400">
                <AlertCircle size={20} className="mr-2" /> Out of Stock
              </span>
            </div>
          )}
          <div className="absolute top-4 right-4">
            <span className="bg-primary text-white font-bold px-4 py-2 rounded-xl shadow-lg text-lg">
              Rs. {food.price}
            </span>
          </div>
        </div>

        {/* Info Section */}
        <div className="space-y-4">
          <div className="flex justify-between items-start">
            <div>
              <h2 className="text-3xl font-bold text-gray-800">{food.name}</h2>
              <span className="inline-block mt-2 text-xs uppercase tracking-widest font-bold px-3 py-1 rounded-full bg-primary/10 text-primary">
                {food.category}
              </span>
            </div>
            {food.available && (
              <span className="flex items-center text-green-600 text-sm font-bold bg-green-50 px-3 py-1 rounded-full border border-green-100">
                <div className="w-2 h-2 bg-green-500 rounded-full mr-2 animate-pulse"></div>
                Available Now
              </span>
            )}
          </div>

          <div className="bg-gray-50 p-4 rounded-2xl border border-gray-100">
            <h4 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-2 flex items-center">
              <Utensils size={14} className="mr-2" /> Description
            </h4>
            <p className="text-gray-600 leading-relaxed">
              {food.description || "No description available for this item."}
            </p>
          </div>

          <div className="flex items-center space-x-6 text-sm text-gray-500 px-1">
            <div className="flex items-center">
              <Clock size={16} className="mr-2 text-primary" />
              <span>Freshly Prepared</span>
            </div>
            <div className="flex items-center">
              <AlertCircle size={16} className="mr-2 text-primary" />
              <span>Allergy Info Available</span>
            </div>
          </div>
        </div>

        {/* Action Section */}
        <div className="pt-4">
          <Button
            onClick={handleAddToCart}
            disabled={!food.available || added}
            loading={adding}
            className={`w-full py-4 text-lg font-bold shadow-lg shadow-primary/20 transition-all active:scale-95 ${
              added ? 'bg-green-500 hover:bg-green-600 border-green-500 shadow-green-200' : ''
            }`}
          >
            {!food.available ? (
              'Currently Unavailable'
            ) : added ? (
              'Added to Your Cart!'
            ) : (
              <>
                <ShoppingCart size={22} className="mr-3" /> Add to Cart - Rs. {food.price}
              </>
            )}
          </Button>
          <p className="text-center text-xs text-gray-400 mt-4 italic">
            Prices are inclusive of all taxes.
          </p>
        </div>
      </div>
    </Modal>
  );
};

export default FoodDetailModal;
