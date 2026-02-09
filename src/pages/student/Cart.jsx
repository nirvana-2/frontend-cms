import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import { Trash2, Plus, Minus, ShoppingBag, ArrowRight, ChevronLeft } from 'lucide-react';
import useCart from '../../hooks/useCart';
import api from '../../services/api';
import Button from '../../components/common/Button';
import Loader from '../../components/common/Loader';

const Cart = () => {
  const { cart, loading, updateQuantity, removeFromCart, clearCart } = useCart();
  const [checkoutLoading, setCheckoutLoading] = useState(false);
  const navigate = useNavigate();

  const handleCheckout = async () => {
    if (cart.items.length === 0) return;
    
    setCheckoutLoading(true);
    try {
      const response = await api.post('/orders');
      if (response.data.success || response.status === 201 || response.status === 200) {
        clearCart();
        toast.success('Order placed successfully!');
        navigate('/my-orders');
      }
    } catch (error) {
      console.error('Checkout error:', error);
      alert(error.response?.data?.message || 'Failed to place order');
    } finally {
      setCheckoutLoading(false);
    }
  };

  if (loading && cart.items.length === 0) {
    return <div className="py-20"><Loader size="lg" /></div>;
  }

  return (
    <div className="max-w-5xl mx-auto space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-800 flex items-center">
            <ShoppingBag className="mr-3 text-primary" size={32} /> Your Cart
          </h1>
          <p className="text-gray-500">Review items before placing your order</p>
        </div>
        <Link to="/menu" className="text-primary font-bold flex items-center hover:underline">
          <ChevronLeft size={20} /> Back to Menu
        </Link>
      </div>

      {cart.items.length > 0 ? (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items List */}
          <div className="lg:col-span-2 space-y-4">
            {cart.items.map((item) => (
              <div key={item.food} className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm flex items-center group transition-all hover:shadow-md">
                <img 
                  src={item.image ? `http://localhost:3000${item.image}` : 'https://via.placeholder.com/100?text=No+Image'} 
                  alt={item.name}
                  className="w-20 h-20 rounded-xl object-cover mr-4"
                  onError={(e) => { e.target.src = 'https://via.placeholder.com/100?text=No+Image' }}
                />
                <div className="flex-1">
                  <h3 className="font-bold text-gray-800 text-lg">{item.name}</h3>
                  <p className="text-primary font-bold">Rs. {item.price}</p>
                </div>
                
                <div className="flex items-center space-x-3 mr-6">
                  <button 
                    onClick={() => updateQuantity(item.food, (item.qty || item.quantity) - 1)}
                    className="p-1 rounded-lg bg-gray-100 text-gray-600 hover:bg-gray-200"
                  >
                    <Minus size={18} />
                  </button>
                  <span className="font-bold w-6 text-center">{item.qty || item.quantity}</span>
                  <button 
                    onClick={() => updateQuantity(item.food, (item.qty || item.quantity) + 1)}
                    className="p-1 rounded-lg bg-gray-100 text-gray-600 hover:bg-gray-200"
                  >
                    <Plus size={18} />
                  </button>
                </div>

                <div className="text-right mr-4 w-24">
                  <p className="text-sm text-gray-400">Total</p>
                  <p className="font-bold text-gray-800">Rs. {item.price * (item.qty || item.quantity)}</p>
                </div>

                <button 
                  onClick={() => removeFromCart(item.food)}
                  className="p-2 text-gray-300 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all"
                >
                  <Trash2 size={20} />
                </button>
              </div>
            ))}
          </div>

          {/* Summary Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-xl sticky top-24">
              <h2 className="text-xl font-bold text-gray-800 mb-6">Order Summary</h2>
              
              <div className="space-y-4 mb-8">
                <div className="flex justify-between text-gray-500">
                  <span>Subtotal</span>
                  <span>Rs. {cart.total}</span>
                </div>
                <div className="flex justify-between text-gray-500">
                  <span>Service Tax</span>
                  <span>Rs. 0</span>
                </div>
                <div className="pt-4 border-t border-gray-100 flex justify-between">
                  <span className="text-lg font-bold text-gray-800">Grand Total</span>
                  <span className="text-lg font-bold text-primary">Rs. {cart.total}</span>
                </div>
              </div>

              <Button
                onClick={handleCheckout}
                loading={checkoutLoading}
                className="w-full py-4 text-lg rounded-xl shadow-lg shadow-primary/20"
              >
                Place Order <ArrowRight size={20} className="ml-2" />
              </Button>
              
              <p className="mt-4 text-xs text-center text-gray-400">
                By clicking "Place Order", you agree to our terms of service and order policies.
              </p>
            </div>
          </div>
        </div>
      ) : (
        <div className="text-center py-20 bg-white rounded-3xl border border-dashed border-gray-200">
          <div className="bg-primary/5 w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-6">
            <ShoppingBag className="text-primary/40" size={48} />
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Your cart is empty</h2>
          <p className="text-gray-500 mb-8 max-w-xs mx-auto">Looks like you haven't added anything to your cart yet.</p>
          <Link to="/menu">
            <Button variant="primary" className="px-8 rounded-xl">
              Browse Menu
            </Button>
          </Link>
        </div>
      )}
    </div>
  );
};

export default Cart;
