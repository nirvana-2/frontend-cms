import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ShoppingCart, User, LogOut, Menu, Bell, UtensilsCrossed } from 'lucide-react';
import useAuth from '../../hooks/useAuth';
import useCart from '../../hooks/useCart';

const Navbar = ({ toggleSidebar }) => {
  const { user, logout } = useAuth();
  const { cart } = useCart();
  const [showProfileMenu, setShowProfileMenu] = useState(false);

  const cartCount = cart?.items?.reduce((total, item) => total + item.quantity, 0) || 0;

  return (
    <nav className="bg-white border-b border-gray-100 sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <button
              onClick={toggleSidebar}
              className="p-2 rounded-md text-gray-600 lg:hidden hover:bg-gray-100 focus:outline-none"
            >
              <Menu size={24} />
            </button>
            <Link to="/" className="flex-shrink-0 flex items-center ml-2 lg:ml-0 group">
              <div className="bg-primary/10 p-1.5 rounded-lg mr-2 group-hover:bg-primary group-hover:text-white transition-all duration-300">
                <UtensilsCrossed size={20} className="text-primary group-hover:text-white" />
              </div>
              <span className="text-2xl font-bold text-primary font-fredoka tracking-tight">Hamro Canteen</span>
            </Link>
          </div>

          <div className="flex items-center space-x-4">
            {user?.role === 'student' && (
              <Link
                to="/cart"
                className="p-2 rounded-full text-gray-600 hover:bg-gray-100 relative transition-colors"
              >
                <ShoppingCart size={22} />
                {cartCount > 0 && (
                  <span className="absolute top-0 right-0 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-white transform translate-x-1/2 -translate-y-1/2 bg-secondary rounded-full">
                    {cartCount}
                  </span>
                )}
              </Link>
            )}

            <button className="p-2 rounded-full text-gray-600 hover:bg-gray-100 transition-colors">
              <Bell size={22} />
            </button>

            <div className="relative">
              <button
                onClick={() => setShowProfileMenu(!showProfileMenu)}
                className="flex items-center space-x-2 p-1 rounded-full hover:bg-gray-100 transition-colors focus:outline-none"
              >
                <div className="h-8 w-8 rounded-full bg-primary flex items-center justify-center text-white text-sm font-bold">
                  {user?.name?.charAt(0).toUpperCase() || 'U'}
                </div>
                <span className="hidden md:block text-sm font-medium text-gray-700">
                  {user?.name?.split(' ')[0]}
                </span>
              </button>

              {showProfileMenu && (
                <div className="absolute right-0 mt-2 w-48 rounded-xl shadow-lg bg-white ring-1 ring-black ring-opacity-5 py-1 z-50">
                  <div className="px-4 py-2 border-b border-gray-100">
                    <p className="text-sm font-bold text-gray-800">{user?.name}</p>
                    <p className="text-xs text-gray-500 capitalize">{user?.role}</p>
                  </div>
                  <Link
                    to="/profile"
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 flex items-center"
                    onClick={() => setShowProfileMenu(false)}
                  >
                    <User size={16} className="mr-2" /> Profile
                  </Link>
                  <button
                    onClick={logout}
                    className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-50 flex items-center"
                  >
                    <LogOut size={16} className="mr-2" /> Sign Out
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
