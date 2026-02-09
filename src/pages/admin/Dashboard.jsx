import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  TrendingUp, 
  Users, 
  ShoppingBag, 
  UtensilsCrossed, 
  Banknote,
  ArrowUpRight,
  Clock,
  CheckCircle
} from 'lucide-react';
import api from '../../services/api';
import Loader from '../../components/common/Loader';

const Dashboard = () => {
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    totalOrders: 0,
    totalRevenue: 0,
    totalUsers: 0,
    totalFood: 0,
    recentOrders: []
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const [ordersRes, usersRes, foodRes] = await Promise.all([
        api.get('/orders'),
        api.get('/users'),
        api.get('/food')
      ]);

      const orders = ordersRes.data.success ? ordersRes.data.data : (Array.isArray(ordersRes.data) ? ordersRes.data : []);
      const users = usersRes.data.success ? usersRes.data.data : (Array.isArray(usersRes.data) ? usersRes.data : []);
      const food = foodRes.data.success ? foodRes.data.data : (Array.isArray(foodRes.data) ? foodRes.data : []);

      const revenue = orders.reduce((acc, order) => acc + (order.status === 'paid' ? order.total : 0), 0);
      
      setStats({
        totalOrders: orders.length,
        totalRevenue: revenue,
        totalUsers: users.length,
        totalFood: food.length,
        recentOrders: orders.slice(0, 5)
      });
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const statCards = [
    { label: 'Total Revenue', value: `Rs. ${stats.totalRevenue}`, icon: Banknote, color: 'text-green-600', bg: 'bg-green-100' },
    { label: 'Total Orders', value: stats.totalOrders, icon: ShoppingBag, color: 'text-blue-600', bg: 'bg-blue-100' },
    { label: 'Total Users', value: stats.totalUsers, icon: Users, color: 'text-purple-600', bg: 'bg-purple-100' },
    { label: 'Food Items', value: stats.totalFood, icon: UtensilsCrossed, color: 'text-orange-600', bg: 'bg-orange-100' },
  ];

  if (loading) return <div className="py-20"><Loader size="lg" /></div>;

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-gray-800">Admin Dashboard</h1>
        <p className="text-gray-500">Welcome back, here's what's happening today</p>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((stat, idx) => (
          <div key={idx} className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex items-center group hover:shadow-md transition-all">
            <div className={`${stat.bg} ${stat.color} p-4 rounded-xl mr-4 group-hover:scale-110 transition-transform`}>
              <stat.icon size={24} />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-400 uppercase tracking-wider">{stat.label}</p>
              <p className="text-2xl font-bold text-gray-800">{stat.value}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Recent Orders */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="p-6 border-b border-gray-50 flex justify-between items-center">
            <h2 className="text-xl font-bold text-gray-800">Recent Orders</h2>
            <button 
              onClick={() => navigate('/admin/orders')}
              className="text-primary text-sm font-bold flex items-center hover:underline"
            >
              View All <ArrowUpRight size={16} className="ml-1" />
            </button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-gray-50 text-gray-500 text-xs font-bold uppercase tracking-widest border-b border-gray-100">
                  <th className="px-6 py-4">ID</th>
                  <th className="px-6 py-4">User</th>
                  <th className="px-6 py-4">Amount</th>
                  <th className="px-6 py-4">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {stats.recentOrders.map((order) => (
                  <tr key={order._id} className="hover:bg-gray-50/50 transition-colors">
                    <td className="px-6 py-4 text-xs font-mono text-gray-400">#{order._id.slice(-6).toUpperCase()}</td>
                    <td className="px-6 py-4 font-medium text-gray-700">{order.user?.name || 'User'}</td>
                    <td className="px-6 py-4 font-bold text-gray-800">Rs. {order.total}</td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wider
                        ${order.status === 'paid' ? 'bg-gray-100 text-gray-600' : 'bg-blue-100 text-blue-600'}`}>
                        {order.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Quick Actions / Stats */}
        <div className="space-y-6">
          <div className="bg-gradient-to-br from-primary to-primary-dark p-6 rounded-2xl text-white shadow-lg shadow-primary/20">
            <h3 className="text-lg font-bold mb-4">Quick Actions</h3>
            <div className="space-y-3">
              <button 
                onClick={() => navigate('/admin/food')}
                className="w-full bg-white/20 hover:bg-white/30 py-2.5 rounded-xl text-sm font-bold backdrop-blur-sm transition-all text-left px-4 flex items-center"
              >
                <UtensilsCrossed size={18} className="mr-3" /> Add New Food Item
              </button>
              <button 
                onClick={() => navigate('/admin/users')}
                className="w-full bg-white/20 hover:bg-white/30 py-2.5 rounded-xl text-sm font-bold backdrop-blur-sm transition-all text-left px-4 flex items-center"
              >
                <Users size={18} className="mr-3" /> Manage Users
              </button>
            </div>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
            <h3 className="text-lg font-bold text-gray-800 mb-4">Activity Overview</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center text-sm text-gray-600">
                  <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                  Completed Orders
                </div>
                <span className="font-bold text-gray-800">{stats.recentOrders.filter(o => o.status === 'paid').length}</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center text-sm text-gray-600">
                  <div className="w-2 h-2 bg-blue-500 rounded-full mr-2"></div>
                  Active Orders
                </div>
                <span className="font-bold text-gray-800">{stats.recentOrders.filter(o => o.status !== 'paid').length}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
