import React, { useState, useEffect } from 'react';
import { 
  ClipboardList, 
  Clock, 
  CheckCircle2, 
  Package, 
  Utensils, 
  RefreshCw, 
  User, 
  Search,
  Filter,
  ChevronDown,
  XCircle,
  Eye,
  Trash2
} from 'lucide-react';
import api from '../../services/api';
import Loader from '../../components/common/Loader';
import Button from '../../components/common/Button';

const OrderList = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState('all');
  const [updatingId, setUpdatingId] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchOrders();
    const interval = setInterval(fetchOrders, 30000); // Auto-refresh every 30s
    return () => clearInterval(interval);
  }, []);

  const fetchOrders = async () => {
    try {
      const response = await api.get('/orders');
      const data = response.data.success ? response.data.data : (Array.isArray(response.data) ? response.data : []);
      setOrders(data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)));
    } catch (error) {
      console.error('Error fetching orders:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (orderId, newStatus) => {
    setUpdatingId(orderId);
    try {
      await api.put(`/orders/${orderId}/status`, { status: newStatus });
      await fetchOrders();
    } catch (error) {
      console.error('Error updating status:', error);
      alert('Failed to update status');
    } finally {
      setUpdatingId(null);
    }
  };

  const deleteOrder = async (orderId) => {
    if (!window.confirm('Are you sure you want to delete this order?')) return;
    try {
      await api.delete(`/orders/${orderId}`);
      await fetchOrders();
    } catch (error) {
      console.error('Error deleting order:', error);
      alert('Failed to delete order');
    }
  };

  const statusConfig = {
    pending: { color: 'bg-yellow-100 text-yellow-700 border-yellow-200', next: 'preparing', nextLabel: 'Start Preparing', icon: <Clock size={14} /> },
    preparing: { color: 'bg-blue-100 text-blue-700 border-blue-200', next: 'ready', nextLabel: 'Mark as Ready', icon: <Utensils size={14} /> },
    ready: { color: 'bg-green-100 text-green-700 border-green-200', next: 'paid', nextLabel: 'Mark Paid', icon: <CheckCircle2 size={14} /> },
    paid: { color: 'bg-gray-100 text-gray-700 border-gray-200', next: null, nextLabel: null, icon: <Package size={14} /> },
    cancelled: { color: 'bg-red-100 text-red-700 border-red-200', next: null, nextLabel: null, icon: <XCircle size={14} /> }
  };

  const filteredOrders = orders.filter(order => {
    const matchesStatus = filterStatus === 'all' || order.status === filterStatus;
    const matchesSearch = 
      order._id.toLowerCase().includes(searchTerm.toLowerCase()) || 
      (order.user?.name || '').toLowerCase().includes(searchTerm.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  if (loading && orders.length === 0) return <div className="py-20"><Loader size="lg" /></div>;

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Order Management</h1>
          <p className="text-gray-500">View and manage all orders across the system</p>
        </div>
        <Button variant="outline" size="sm" onClick={fetchOrders} className="flex items-center w-fit">
          <RefreshCw size={16} className={`mr-2 ${updatingId ? 'animate-spin' : ''}`} /> Refresh
        </Button>
      </div>

      {/* Filters & Search */}
      <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm flex flex-col md:flex-row gap-4 items-center">
        <div className="relative flex-1 w-full">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
          <input
            type="text"
            placeholder="Search by ID or User Name..."
            className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="flex items-center gap-2 w-full md:w-auto overflow-x-auto pb-2 md:pb-0">
          <Filter size={18} className="text-gray-400 mr-1" />
          {['all', 'pending', 'preparing', 'ready', 'paid', 'cancelled'].map((status) => (
            <button
              key={status}
              onClick={() => setFilterStatus(status)}
              className={`px-4 py-1.5 rounded-lg text-xs font-bold capitalize whitespace-nowrap transition-all
                ${filterStatus === status ? 'bg-primary text-white shadow-md' : 'bg-gray-100 text-gray-500 hover:bg-gray-200'}`}
            >
              {status}
            </button>
          ))}
        </div>
      </div>

      {/* Orders Table */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-gray-50 text-gray-500 text-xs font-bold uppercase tracking-widest border-b border-gray-100">
                <th className="px-6 py-4">Order Details</th>
                <th className="px-6 py-4">User</th>
                <th className="px-6 py-4">Items</th>
                <th className="px-6 py-4">Total</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filteredOrders.length > 0 ? (
                filteredOrders.map((order) => (
                  <tr key={order._id} className="hover:bg-gray-50/50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex flex-col">
                        <span className="text-xs font-mono text-gray-400">#{order._id.slice(-6).toUpperCase()}</span>
                        <span className="text-[10px] text-gray-400 flex items-center mt-1">
                          <Clock size={10} className="mr-1" />
                          {new Date(order.createdAt).toLocaleString()}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center">
                        <div className="bg-primary/10 p-2 rounded-lg mr-3">
                          <User size={14} className="text-primary" />
                        </div>
                        <span className="font-medium text-gray-700">{order.user?.name || 'User'}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-col gap-1">
                        {order.items.map((item, idx) => (
                          <span key={idx} className="text-xs text-gray-600">
                            <span className="font-bold text-gray-400">{item.quantity}x</span> {item.food?.name || 'Deleted Item'}
                          </span>
                        ))}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="font-bold text-gray-800">Rs. {order.total}</span>
                    </td>
                    <td className="px-6 py-4">
                      <div className={`flex items-center w-fit px-2.5 py-1 rounded-full border text-[10px] font-bold uppercase tracking-wider ${statusConfig[order.status]?.color || 'bg-gray-100 text-gray-700 border-gray-200'}`}>
                        {statusConfig[order.status]?.icon}
                        <span className="ml-1.5">{order.status}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex justify-end items-center gap-2">
                        {statusConfig[order.status]?.next ? (
                          <Button
                            onClick={() => updateStatus(order._id, statusConfig[order.status].next)}
                            loading={updatingId === order._id}
                            size="sm"
                            className="text-[10px] py-1 h-8 rounded-lg"
                          >
                            {statusConfig[order.status].nextLabel}
                          </Button>
                        ) : (
                          <span className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">Completed</span>
                        )}
                        <button 
                          onClick={() => deleteOrder(order._id)}
                          className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all"
                          title="Delete Order"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" className="px-6 py-12 text-center text-gray-500">
                    No orders found matching your criteria.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default OrderList;
