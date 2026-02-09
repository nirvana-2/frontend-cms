import React, { createContext, useState, useEffect, useCallback } from 'react';
import toast from 'react-hot-toast';
import api from '../services/api';
import useAuth from '../hooks/useAuth';

// eslint-disable-next-line react-refresh/only-export-components
export const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState({ items: [], total: 0 });
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();

  const fetchCart = useCallback(async () => {
    if (!user) return;
    setLoading(true);
    try {
      const response = await api.get('/cart');
      const data = response.data.success ? response.data.data : response.data;
      
      // Ensure we have an items array and calculate total if backend doesn't provide it
      const cartItems = data.cartItems || data.items || [];
      const total = data.total || cartItems.reduce((acc, item) => acc + (item.price * (item.qty || item.quantity)), 0);
      
      setCart({
        ...data,
        items: cartItems,
        total
      });
    } catch (error) {
      console.error('Error fetching cart:', error);
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    fetchCart();
  }, [fetchCart]);

  const addToCart = async (foodId, quantity = 1) => {
    try {
      const response = await api.post('/cart', { foodId, quantity });
      if (response.data.success || response.status === 200 || response.status === 201) {
        await fetchCart();
        toast.success('Added to cart!');
        return { success: true };
      }
    } catch (error) {
      console.error('Error adding to cart:', error);
      toast.error(error.response?.data?.message || 'Failed to add to cart');
      return { success: false, message: error.response?.data?.message || 'Failed to add to cart' };
    }
  };

  const updateQuantity = async (foodId, quantity) => {
    if (quantity < 1) return removeFromCart(foodId);
    try {
      const response = await api.put(`/cart/${foodId}`, { quantity });
      if (response.data.success || response.status === 200) {
        await fetchCart();
        return { success: true };
      }
    } catch (error) {
      console.error('Error updating cart:', error);
      toast.error('Failed to update quantity');
      return { success: false, message: error.response?.data?.message || 'Failed to update quantity' };
    }
  };

  const removeFromCart = async (foodId) => {
    try {
      const response = await api.delete(`/cart/${foodId}`);
      if (response.data.success || response.status === 200) {
        await fetchCart();
        toast.success('Removed from cart');
        return { success: true };
      }
    } catch (error) {
      console.error('Error removing from cart:', error);
      toast.error('Failed to remove item');
      return { success: false, message: error.response?.data?.message || 'Failed to remove item' };
    }
  };

  const clearCart = () => {
    setCart({ items: [], total: 0 });
  };

  return (
    <CartContext.Provider value={{ 
      cart, 
      loading, 
      addToCart, 
      updateQuantity, 
      removeFromCart, 
      fetchCart,
      clearCart 
    }}>
      {children}
    </CartContext.Provider>
  );
};
