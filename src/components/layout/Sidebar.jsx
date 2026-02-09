import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
  LayoutDashboard, 
  UtensilsCrossed, 
  ShoppingCart, 
  ClipboardList, 
  History, 
  Users, 
  Settings,
  X
} from 'lucide-react';
import useAuth from '../../hooks/useAuth';

const Sidebar = ({ isOpen, toggleSidebar }) => {
  const { user } = useAuth();

  const studentLinks = [
    { to: '/menu', icon: UtensilsCrossed, label: 'Food Menu' },
    { to: '/cart', icon: ShoppingCart, label: 'My Cart' },
    { to: '/my-orders', icon: ClipboardList, label: 'My Orders' },
  ];

  const staffLinks = [
    { to: '/staff/orders', icon: ClipboardList, label: 'Order Processing' },
    { to: '/staff/history', icon: History, label: 'Order History' },
  ];

  const adminLinks = [
    { to: '/admin/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
    { to: '/admin/food', icon: UtensilsCrossed, label: 'Food Management' },
    { to: '/admin/orders', icon: ClipboardList, label: 'Order Management' },
    { to: '/admin/users', icon: Users, label: 'User Management' },
  ];

  const links = user?.role === 'admin' ? adminLinks : 
                user?.role === 'staff' ? staffLinks : studentLinks;

  const activeClass = 'bg-primary/10 text-primary border-r-4 border-primary font-bold';
  const inactiveClass = 'text-gray-600 hover:bg-gray-50 hover:text-primary transition-all duration-200';

  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 lg:hidden backdrop-blur-sm transition-opacity"
          onClick={toggleSidebar}
        ></div>
      )}

      {/* Sidebar */}
      <aside className={`
        fixed lg:static inset-y-0 left-0 z-50 w-64 bg-white border-r border-gray-100 transform transition-transform duration-300 ease-in-out
        ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
        <div className="flex flex-col h-full">
          <div className="p-6 flex items-center justify-between lg:hidden border-b border-gray-100">
            <div className="flex items-center">
              <UtensilsCrossed size={20} className="text-primary mr-2" />
              <span className="text-xl font-bold text-primary font-fredoka">Hamro Canteen</span>
            </div>
            <button onClick={toggleSidebar} className="p-1 rounded-md hover:bg-gray-100">
              <X size={24} />
            </button>
          </div>

          <div className="flex-1 py-6 space-y-1">
            {links.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                onClick={() => window.innerWidth < 1024 && toggleSidebar()}
                className={({ isActive }) => `
                  flex items-center px-6 py-3 text-sm font-medium
                  ${isActive ? activeClass : inactiveClass}
                `}
              >
                <link.icon size={20} className="mr-3" />
                {link.label}
              </NavLink>
            ))}
          </div>

          <div className="p-6 border-t border-gray-100">
            <div className="bg-gradient-to-br from-primary/5 to-secondary/5 p-4 rounded-xl border border-primary/10">
              <p className="text-xs font-bold text-primary uppercase tracking-wider mb-2">Need Help?</p>
              <p className="text-xs text-gray-500 mb-3">Check our documentation or contact support.</p>
              <button className="text-xs font-bold text-primary hover:underline">Support Center</button>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
