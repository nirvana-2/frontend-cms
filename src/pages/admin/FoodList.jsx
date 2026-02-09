import React, { useState, useEffect } from 'react';
import { Utensils, Plus, Edit2, Trash2, Image as ImageIcon, Check, X, AlertCircle } from 'lucide-react';
import api from '../../services/api';
import Loader from '../../components/common/Loader';
import Button from '../../components/common/Button';
import Input from '../../components/common/Input';
import Modal from '../../components/common/Modal';

const FoodList = () => {
  const [foods, setFoods] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingFood, setEditingFood] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [showOutOfStock, setShowOutOfStock] = useState(true);

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    category: '',
    available: true,
    image: null
  });
  const [imagePreview, setImagePreview] = useState(null);

  useEffect(() => {
    fetchFoods();
  }, []);

  const fetchFoods = async () => {
    try {
      const response = await api.get('/food');
      const data = Array.isArray(response.data) ? response.data : response.data.data || [];
      setFoods(data);
    } catch (error) {
      console.error('Error fetching foods:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenModal = (food = null) => {
    if (food) {
      setEditingFood(food);
      setFormData({
        name: food.name,
        description: food.description,
        price: food.price,
        category: food.category,
        available: food.available,
        image: null
      });
      setImagePreview(food.image ? `http://localhost:3000${food.image}` : null);
    } else {
      setEditingFood(null);
      setFormData({
        name: '',
        description: '',
        price: '',
        category: '',
        available: true,
        image: null
      });
      setImagePreview(null);
    }
    setError('');
    setModalOpen(true);
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value
    });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData({ ...formData, image: file });
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError('');

    const data = new FormData();
    data.append('name', formData.name);
    data.append('description', formData.description);
    data.append('price', formData.price);
    data.append('category', formData.category);
    data.append('available', formData.available);
    if (formData.image) {
      data.append('image', formData.image);
    }

    try {
      if (editingFood) {
        await api.put(`/food/${editingFood._id}`, data, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
      } else {
        await api.post('/food', data, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
      }
      setModalOpen(false);
      fetchFoods();
    } catch (error) {
      setError(error.response?.data?.message || 'Something went wrong');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this item?')) return;
    try {
      await api.delete(`/food/${id}`);
      fetchFoods();
    } catch {
      alert('Failed to delete item');
    }
  };

  const handleToggleAvailability = async (food) => {
    try {
      const data = new FormData();
      data.append('available', !food.available);
      
      await api.put(`/food/${food._id}`, data, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      fetchFoods();
    } catch (error) {
      console.error('Error toggling availability:', error);
      alert('Failed to update availability');
    }
  };

  if (loading) return <div className="py-20"><Loader size="lg" /></div>;

  return (
    <div className="space-y-8">
      <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex flex-col md:flex-row justify-between items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-800 flex items-center">
            <Utensils className="mr-3 text-primary" size={32} /> Food Management
          </h1>
          <p className="text-gray-500">Add, edit or remove items from the canteen menu</p>
        </div>
        <Button onClick={() => handleOpenModal()} className="px-6 rounded-xl">
          <Plus size={20} className="mr-2" /> Add New Item
        </Button>
      </div>

      <div className="flex justify-end mb-4">
        <div className="flex items-center space-x-2 bg-white px-4 py-2 rounded-xl shadow-sm border border-gray-100">
          <input
            type="checkbox"
            id="admin-show-out-of-stock"
            checked={showOutOfStock}
            onChange={(e) => setShowOutOfStock(e.target.checked)}
            className="w-4 h-4 rounded border-gray-300 text-primary focus:ring-primary"
          />
          <label htmlFor="admin-show-out-of-stock" className="text-sm font-medium text-gray-700 cursor-pointer">
            Include Out of Stock
          </label>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-gray-50 text-gray-500 text-xs font-bold uppercase tracking-widest border-b border-gray-100">
                <th className="px-6 py-4">Image</th>
                <th className="px-6 py-4">Name & Category</th>
                <th className="px-6 py-4">Price</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {foods
                .filter(food => showOutOfStock || food.available)
                .map((food) => (
                <tr key={food._id} className="hover:bg-gray-50/50 transition-colors group">
                  <td className="px-6 py-4">
                    <img 
                      src={food.image ? `http://localhost:3000${food.image}` : 'https://via.placeholder.com/60'} 
                      alt={food.name}
                      className="w-12 h-12 rounded-lg object-cover border border-gray-100"
                      onError={(e) => { e.target.src = 'https://via.placeholder.com/60' }}
                    />
                  </td>
                  <td className="px-6 py-4">
                    <p className="font-bold text-gray-800">{food.name}</p>
                    <p className="text-xs text-gray-400 capitalize">{food.category}</p>
                  </td>
                  <td className="px-6 py-4 font-bold text-primary">Rs. {food.price}</td>
                  <td className="px-6 py-4">
                    <button
                      onClick={() => handleToggleAvailability(food)}
                      className={`flex items-center text-xs font-bold px-2 py-1 rounded-lg w-fit transition-all ${
                        food.available 
                          ? 'text-green-600 bg-green-50 hover:bg-green-100' 
                          : 'text-red-500 bg-red-50 hover:bg-red-100'
                      }`}
                      title={food.available ? 'Click to mark as Out of Stock' : 'Click to mark as Available'}
                    >
                      {food.available ? (
                        <>
                          <Check size={12} className="mr-1" /> Available
                        </>
                      ) : (
                        <>
                          <X size={12} className="mr-1" /> Out of Stock
                        </>
                      )}
                    </button>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex justify-end space-x-2">
                      <button 
                        onClick={() => handleOpenModal(food)}
                        className="p-2 text-gray-400 hover:text-primary hover:bg-primary/5 rounded-lg transition-all"
                      >
                        <Edit2 size={18} />
                      </button>
                      <button 
                        onClick={() => handleDelete(food._id)}
                        className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add/Edit Modal */}
      <Modal 
        isOpen={modalOpen} 
        onClose={() => !submitting && setModalOpen(false)}
        title={editingFood ? 'Edit Food Item' : 'Add New Food Item'}
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div className="p-3 bg-red-50 border-l-4 border-red-500 text-red-700 text-sm rounded flex items-center">
              <AlertCircle size={16} className="mr-2" /> {error}
            </div>
          )}

          <Input
            label="Food Name"
            name="name"
            value={formData.name}
            onChange={handleInputChange}
            placeholder="e.g. Chicken Burger"
            required
          />

          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Price (Rs.)"
              name="price"
              type="number"
              value={formData.price}
              onChange={handleInputChange}
              placeholder="0"
              required
            />
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
              <select
                name="category"
                value={formData.category}
                onChange={handleInputChange}
                className="w-full rounded-lg border border-gray-300 focus:ring-primary focus:border-primary p-2 outline-none text-sm"
                required
              >
                <option value="">Select Category</option>
                <option value="breakfast">Breakfast</option>
                <option value="lunch">Lunch</option>
                <option value="snacks">Snacks</option>
                <option value="drinks">Drinks</option>
              </select>
            </div>
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              className="w-full rounded-lg border border-gray-300 focus:ring-primary focus:border-primary p-2 outline-none text-sm"
              rows="3"
              placeholder="Brief description of the food..."
            ></textarea>
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">Food Image</label>
            <div className="flex items-center space-x-4">
              <div className="w-24 h-24 rounded-2xl border-2 border-dashed border-gray-200 flex items-center justify-center overflow-hidden bg-gray-50">
                {imagePreview ? (
                  <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
                ) : (
                  <ImageIcon size={32} className="text-gray-300" />
                )}
              </div>
              <div className="flex-1">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="hidden"
                  id="food-image-input"
                />
                <label 
                  htmlFor="food-image-input"
                  className="cursor-pointer inline-flex items-center px-4 py-2 bg-gray-100 text-gray-700 text-sm font-bold rounded-xl hover:bg-gray-200 transition-all"
                >
                  <ImageIcon size={16} className="mr-2" /> {imagePreview ? 'Change Image' : 'Upload Image'}
                </label>
                <p className="text-[10px] text-gray-400 mt-2 italic">Recommended size: 400x300px (JPG, PNG)</p>
              </div>
            </div>
          </div>

          <div className="flex items-center space-x-2 mb-6">
            <input
              type="checkbox"
              id="available-check"
              name="available"
              checked={formData.available}
              onChange={handleInputChange}
              className="w-5 h-5 rounded border-gray-300 text-primary focus:ring-primary"
            />
            <label htmlFor="available-check" className="text-sm font-medium text-gray-700 cursor-pointer">
              Mark as available for order
            </label>
          </div>

          <div className="flex space-x-3 pt-4">
            <Button
              variant="ghost"
              onClick={() => setModalOpen(false)}
              className="flex-1"
              disabled={submitting}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="flex-1"
              loading={submitting}
            >
              {editingFood ? 'Save Changes' : 'Add Food Item'}
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default FoodList;
