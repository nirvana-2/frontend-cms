import React, { useState, useEffect } from 'react';
import { ClipboardList, Clock, CheckCircle2, Package, Utensils, ChevronDown, ChevronUp } from 'lucide-react';
import api from '../../services/api';
import Loader from '../../components/common/Loader';

const MyOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expandedOrder, setExpandedOrder] = useState(null);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const response = await api.get('/orders/myorders');
      const orderData = response.data.success ? response.data.data : (Array.isArray(response.data) ? response.data : []);
      
      setOrders(orderData.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)));
    } catch (error) {
      console.error('Error fetching orders:', error);
    } finally {
      setLoading(false);
    }
  };

  const statusColors = {
    pending: 'bg-yellow-100 text-yellow-700 border-yellow-200',
    preparing: 'bg-blue-100 text-blue-700 border-blue-200',
    ready: 'bg-green-100 text-green-700 border-green-200',
    paid: 'bg-purple-100 text-purple-700 border-purple-200',
    cancelled: 'bg-red-100 text-red-700 border-red-200'
  };

  const statusIcons = {
    pending: <Clock size={16} className="mr-1.5" />,
    preparing: <Utensils size={16} className="mr-1.5" />,
    ready: <Package size={16} className="mr-1.5" />,
    paid: <CheckCircle2 size={16} className="mr-1.5" />,
    cancelled: <ClipboardList size={16} className="mr-1.5" />
  };

  const toggleExpand = (orderId) => {
    setExpandedOrder(expandedOrder === orderId ? null : orderId);
  };

  if (loading) return <div className="py-20"><Loader size="lg" /></div>;

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
        <h1 className="text-3xl font-bold text-gray-800 flex items-center">
          <ClipboardList className="mr-3 text-primary" size={32} /> My Orders
        </h1>
        <p className="text-gray-500">Track the status of your recent meals</p>
      </div>

      {orders.length > 0 ? (
        <div className="space-y-4">
          {orders.map((order) => (
            <div 
              key={order._id} 
              className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden transition-all hover:shadow-md"
            >
              {/* Order Header */}
              <div 
                className="p-4 md:p-6 flex flex-wrap items-center justify-between cursor-pointer"
                onClick={() => toggleExpand(order._id)}
              >
                <div className="flex items-center space-x-4">
                  <div className="bg-gray-100 p-3 rounded-xl">
                    <Package className="text-gray-500" size={24} />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Order ID</p>
                    <p className="font-bold text-gray-800">#{order._id.slice(-6).toUpperCase()}</p>
                  </div>
                </div>

                <div className="hidden md:block">
                  <p className="text-xs font-bold text-gray-400 uppercase tracking-widest text-right">Placed On</p>
                  <p className="text-gray-600">{new Date(order.createdAt).toLocaleDateString()} {new Date(order.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
                </div>

                <div className="flex items-center space-x-6">
                  <div className="text-right">
                    <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Total Amount</p>
                    <p className="text-lg font-bold text-primary">Rs. {order.total}</p>
                  </div>
                  
                  <div className={`
                    flex items-center px-3 py-1.5 rounded-full border text-sm font-bold capitalize
                    ${statusColors[order.status]}
                  `}>
                    {statusIcons[order.status]}
                    {order.status}
                  </div>

                  {expandedOrder === order._id ? <ChevronUp className="text-gray-400" /> : <ChevronDown className="text-gray-400" />}
                </div>
              </div>

              {/* Order Details (Expandable) */}
              {expandedOrder === order._id && (
                <div className="px-6 pb-6 bg-gray-50/50 border-t border-gray-50 animate-fadeIn">
                  <div className="pt-6 space-y-4">
                    <h4 className="text-xs font-bold text-gray-400 uppercase tracking-widest">Order Items</h4>
                    <div className="bg-white rounded-xl border border-gray-100 divide-y divide-gray-50">
                      {order.items.map((item, idx) => (
                        <div key={idx} className="p-4 flex justify-between items-center text-sm">
                          <div className="flex items-center space-x-3">
                            <span className="w-6 h-6 flex items-center justify-center bg-gray-100 rounded text-xs font-bold text-gray-500">
                              {item.quantity}x
                            </span>
                            <span className="font-medium text-gray-700">{item.food.name}</span>
                          </div>
                          <span className="font-bold text-gray-800">Rs. {item.price * item.quantity}</span>
                        </div>
                      ))}
                    </div>
                    
                    <div className="flex justify-between items-center pt-2">
                      <div className="text-xs text-gray-400">
                        <span className="font-bold">Note:</span> Please show your Order ID at the counter to pick up your meal once it's ready.
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-20 bg-white rounded-3xl border border-dashed border-gray-200">
          <div className="bg-gray-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4">
            <ClipboardList className="text-gray-400" size={32} />
          </div>
          <h2 className="text-2xl font-bold text-gray-800">No orders yet</h2>
          <p className="text-gray-500">Your order history will appear here once you place an order.</p>
        </div>
      )}
    </div>
  );
};

export default MyOrders;
