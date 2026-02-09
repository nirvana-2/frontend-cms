import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import useAuth from './hooks/useAuth';
import ProtectedRoute from './components/layout/ProtectedRoute';
import Navbar from './components/layout/Navbar';
import Sidebar from './components/layout/Sidebar';
import Footer from './components/layout/Footer';

// Auth Pages
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import Profile from './pages/auth/Profile';

// Student Pages
import Menu from './pages/student/Menu';
import Cart from './pages/student/Cart';
import MyOrders from './pages/student/MyOrders';

// Staff Pages
import OrderProcessing from './pages/staff/OrderProcessing';
import OrderHistory from './pages/staff/OrderHistory';

// Admin Pages
import Dashboard from './pages/admin/Dashboard';
import FoodList from './pages/admin/FoodList';
import UserList from './pages/admin/UserList';
import OrderList from './pages/admin/OrderList';

// Layout Wrapper for Protected Routes
const Layout = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar toggleSidebar={toggleSidebar} />
      <div className="flex flex-1 overflow-hidden">
        <Sidebar isOpen={sidebarOpen} toggleSidebar={toggleSidebar} />
        <main className="flex-1 overflow-y-auto p-4 md:p-6 lg:p-8">
          <div className="max-w-7xl mx-auto">
            {children}
          </div>
        </main>
      </div>
      <Footer />
    </div>
  );
};

const AppRoutes = () => {
  const { user } = useAuth();

  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/login" element={!user ? <Login /> : <Navigate to="/" replace />} />
      <Route path="/register" element={!user ? <Register /> : <Navigate to="/" replace />} />

      {/* Protected Routes Wrapper */}
      <Route
        path="/*"
        element={
          <ProtectedRoute>
            <Layout>
              <Routes>
                <Route path="/" element={<Navigate to={user?.role === 'admin' ? '/admin/dashboard' : user?.role === 'staff' ? '/staff/orders' : '/menu'} replace />} />
                <Route path="/profile" element={<Profile />} />
                
                {/* Student Routes */}
                <Route path="/menu" element={<ProtectedRoute allowedRoles={['student']}><Menu /></ProtectedRoute>} />
                <Route path="/cart" element={<ProtectedRoute allowedRoles={['student']}><Cart /></ProtectedRoute>} />
                <Route path="/my-orders" element={<ProtectedRoute allowedRoles={['student']}><MyOrders /></ProtectedRoute>} />

                {/* Staff Routes */}
                <Route path="/staff/orders" element={<ProtectedRoute allowedRoles={['staff', 'admin']}><OrderProcessing /></ProtectedRoute>} />
                <Route path="/staff/history" element={<ProtectedRoute allowedRoles={['staff', 'admin']}><OrderHistory /></ProtectedRoute>} />

                {/* Admin Routes */}
                <Route path="/admin/dashboard" element={<ProtectedRoute allowedRoles={['admin']}><Dashboard /></ProtectedRoute>} />
                <Route path="/admin/food" element={<ProtectedRoute allowedRoles={['admin']}><FoodList /></ProtectedRoute>} />
                <Route path="/admin/users" element={<ProtectedRoute allowedRoles={['admin']}><UserList /></ProtectedRoute>} />
                <Route path="/admin/orders" element={<ProtectedRoute allowedRoles={['admin']}><OrderList /></ProtectedRoute>} />
                
                {/* Fallback */}
                <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>
            </Layout>
          </ProtectedRoute>
        }
      />
    </Routes>
  );
};

function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <Toaster position="top-center" reverseOrder={false} />
        <Router>
          <AppRoutes />
        </Router>
      </CartProvider>
    </AuthProvider>
  );
}

export default App;
