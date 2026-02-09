import React, { useState, useEffect } from 'react';
import { ClipboardList, Clock, CheckCircle2, Package, Utensils, RefreshCw, User, Search } from 'lucide-react';
import api from '../../services/api';
import Loader from '../../components/common/Loader';
import Button from '../../components/common/Button';

const OrderProcessing = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState('all');
  const [updatingId, setUpdatingId] = useState(null);

  useEffect(() => {
    fetchOrders();
    const interval = setInterval(fetchOrders, 30000); // Auto-refresh every 30s
    return () => clearInterval(interval);
  }, []);

  const fetchOrders = async () => {
    try {
      const response = await api.get('/orders');
      const data = Array.isArray(response.data) ? response.data : response.data.data || [];
      
      // Filter out 'paid' for active processing
      const activeOrders = data.filter(order => order.status !== 'paid' && order.status !== 'cancelled');
      setOrders(activeOrders.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)));
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

  const statusConfig = {
    pending: { color: 'bg-yellow-100 text-yellow-700 border-yellow-200', next: 'preparing', nextLabel: 'Start Preparing', icon: <Clock size={16} /> },
    preparing: { color: 'bg-blue-100 text-blue-700 border-blue-200', next: 'ready', nextLabel: 'Mark as Ready', icon: <Utensils size={16} /> },
    ready: { color: 'bg-green-100 text-green-700 border-green-200', next: 'paid', nextLabel: 'Mark Paid', icon: <CheckCircle2 size={16} /> }
  };

  const filteredOrders = filterStatus === 'all' 
    ? orders 
    : orders.filter(order => order.status === filterStatus);

  if (loading && orders.length === 0) return <div className="py-20"><Loader size="lg" /></div>;

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Order Processing</h1>
          <p className="text-gray-500">Manage and update active canteen orders</p>
        </div>
        <div className="flex items-center space-x-2">
          <Button variant="outline" size="sm" onClick={fetchOrders} className="flex items-center">
            <RefreshCw size={16} className={`mr-2 ${updatingId ? 'animate-spin' : ''}`} /> Refresh
          </Button>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex space-x-2 bg-gray-100 p-1 rounded-xl w-fit">
        {['all', 'pending', 'preparing', 'ready'].map((status) => (
          <button
            key={status}
            onClick={() => setFilterStatus(status)}
            className={`px-6 py-2 rounded-lg text-sm font-bold capitalize transition-all
              ${filterStatus === status ? 'bg-white text-primary shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
          >
            {status}
          </button>
        ))}
      </div>

      {/* Orders Grid */}
      {filteredOrders.length > 0 ? (
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
          {filteredOrders.map((order) => (
            <div key={order._id} className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden flex flex-col">
              <div className="p-6 border-b border-gray-50 flex justify-between items-start">
                <div className="flex items-center space-x-4">
                  <div className="bg-primary/10 p-3 rounded-xl">
                    <User className="text-primary" size={24} />
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-800">{order.user?.name || 'User'}</h3>
                    <p className="text-xs text-gray-400 font-mono">#{order._id.slice(-6).toUpperCase()}</p>
                  </div>
                </div>
                <div className={`flex items-center px-3 py-1 rounded-full border text-xs font-bold capitalize ${statusConfig[order.status]?.color || 'bg-gray-100 text-gray-700 border-gray-200'}`}>
                  {statusConfig[order.status]?.icon || <Clock size={16} />}
                  <span className="ml-1.5">{order.status}</span>
                </div>
              </div>

              <div className="p-6 flex-1 bg-gray-50/30">
                <div className="space-y-3">
                  {order.items.map((item, idx) => (
                    <div key={idx} className="flex justify-between items-center text-sm">
                      <div className="flex items-center space-x-3">
                        <span className="bg-white px-2 py-0.5 rounded border border-gray-100 font-bold text-gray-600">{item.quantity}</span>
                        <span className="text-gray-700">{item.food?.name || 'Deleted Item'}</span>
                      </div>
                      <span className="text-gray-400 font-mono">Rs. {item.price * item.quantity}</span>
                    </div>
                  ))}
                </div>
                <div className="mt-6 pt-4 border-t border-gray-100 flex justify-between items-center">
                  <span className="text-sm font-medium text-gray-500">Total Amount</span>
                  <span className="text-xl font-bold text-primary">Rs. {order.total}</span>
                </div>
              </div>

              <div className="p-4 bg-white border-t border-gray-50">
                {statusConfig[order.status]?.next && (
                  <Button
                    onClick={() => updateStatus(order._id, statusConfig[order.status].next)}
                    loading={updatingId === order._id}
                    className="w-full justify-center py-3 rounded-xl"
                    variant={order.status === 'ready' ? 'secondary' : 'primary'}
                  >
                    {statusConfig[order.status].nextLabel}
                  </Button>
                )}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-20 bg-white rounded-3xl border border-dashed border-gray-200">
          <div className="bg-gray-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle2 className="text-gray-400" size={32} />
          </div>
          <h2 className="text-2xl font-bold text-gray-800">No orders in queue</h2>
          <p className="text-gray-500">Active orders waiting for processing will appear here.</p>
        </div>
      )}
    </div>
  );
};

export default OrderProcessing;
