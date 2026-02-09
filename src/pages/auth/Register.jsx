import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, User, UserPlus, Eye, EyeOff, UserCircle, LogIn, Phone, UtensilsCrossed } from 'lucide-react';
import useAuth from '../../hooks/useAuth';
import Input from '../../components/common/Input';
import Button from '../../components/common/Button';

const Register = () => {
  const [formData, setFormData] = useState({ 
    name: '', 
    email: '', 
    phone: '',
    password: '', 
    confirmPassword: '',
    role: 'student' 
  });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const { register } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (error) setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (formData.password !== formData.confirmPassword) {
      return setError('Passwords do not match');
    }

    setLoading(true);

    // CRITICAL: DO NOT send confirmPassword to backend
    const { name, email, phone, password, role } = formData;
    const result = await register(name, email, password, phone, role);
    
    if (result.success) {
      navigate('/');
    } else {
      setError(result.message);
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* Left Panel: Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 bg-gray-50">
        <div className="max-w-md w-full">
          <div className="text-center mb-10 lg:hidden">
            <div className="inline-flex items-center justify-center p-2 bg-primary/10 rounded-xl mb-3">
              <UtensilsCrossed size={32} className="text-primary" />
            </div>
            <h1 className="text-3xl font-bold text-primary font-fredoka">Hamro Canteen</h1>
          </div>
          
          <div className="bg-white p-8 rounded-2xl shadow-xl border border-gray-100">
            <h2 className="text-2xl font-bold text-gray-800 mb-2">Create Account</h2>
            <p className="text-gray-500 mb-8">Join us for a better dining experience</p>

            {error && (
              <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 text-red-700 rounded-r-lg text-sm">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit}>
              <Input
                label="Full Name"
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="John Doe"
                icon={User}
                required
              />

              <Input
                label="Email Address"
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="john@example.com"
                icon={Mail}
                required
              />

              <Input
                label="Phone Number"
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                placeholder="98XXXXXXXX"
                icon={Phone}
                required
              />

              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  I am a <span className="text-red-500">*</span>
                </label>
                <div className="grid grid-cols-3 gap-4">
                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, role: 'student' })}
                    className={`py-2 px-2 rounded-lg border text-xs font-medium transition-all duration-200 flex items-center justify-center
                      ${formData.role === 'student' ? 'bg-primary/10 border-primary text-primary' : 'bg-white border-gray-300 text-gray-600 hover:bg-gray-50'}`}
                  >
                    Student
                  </button>
                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, role: 'staff' })}
                    className={`py-2 px-2 rounded-lg border text-xs font-medium transition-all duration-200 flex items-center justify-center
                      ${formData.role === 'staff' ? 'bg-primary/10 border-primary text-primary' : 'bg-white border-gray-300 text-gray-600 hover:bg-gray-50'}`}
                  >
                    Staff
                  </button>
                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, role: 'admin' })}
                    className={`py-2 px-2 rounded-lg border text-xs font-medium transition-all duration-200 flex items-center justify-center
                      ${formData.role === 'admin' ? 'bg-primary/10 border-primary text-primary' : 'bg-white border-gray-300 text-gray-600 hover:bg-gray-50'}`}
                  >
                    Admin
                  </button>
                </div>
              </div>

              <div className="relative">
                <Input
                  label="Password"
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="••••••••"
                  icon={Lock}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-9 text-gray-400 hover:text-gray-600 transition-colors"
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>

              <Input
                label="Confirm Password"
                type={showPassword ? 'text' : 'password'}
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                placeholder="••••••••"
                icon={Lock}
                required
              />

              <Button
                type="submit"
                loading={loading}
                className="w-full py-3 text-lg mt-4"
              >
                {!loading && <UserPlus className="mr-2 h-5 w-5" />}
                Sign Up
              </Button>
            </form>

            <p className="text-center mt-8 text-gray-600">
              Already have an account?{' '}
              <Link to="/login" className="font-bold text-primary hover:text-primary-dark transition-colors">
                Sign In
              </Link>
            </p>
          </div>
        </div>
      </div>

      {/* Right Panel: Branding with Background Image */}
      <div 
        className="hidden lg:flex lg:w-1/2 relative items-center justify-center p-12 text-white bg-cover bg-center"
        style={{ backgroundImage: 'url("https://images.unsplash.com/photo-1556742502-ec7c0e9f34b1?q=80&w=2070&auto=format&fit=crop")' }}
      >
        <div className="absolute inset-0 bg-gradient-to-br from-secondary/90 to-primary/90 backdrop-blur-[2px]"></div>
        
        <div className="relative z-10 max-w-md text-center">
          <div className="inline-flex items-center justify-center p-3 bg-white/20 rounded-2xl mb-6 backdrop-blur-md">
            <UtensilsCrossed size={48} className="text-white" />
          </div>
          <h1 className="text-6xl font-bold mb-6 font-fredoka tracking-tight">Hamro Canteen</h1>
          <p className="text-xl opacity-90 leading-relaxed">
            Join thousands of students and staff members using Hamro Canteen for their daily meals.
          </p>
          <div className="mt-12 space-y-4">
            <div className="flex items-start text-left bg-white/10 p-5 rounded-2xl backdrop-blur-md border border-white/10 hover:bg-white/20 transition-all">
              <div className="bg-white/20 p-2 rounded-xl mr-4">
                <UserCircle className="h-6 w-6" />
              </div>
              <div>
                <p className="font-bold text-lg">Personalized Profiles</p>
                <p className="opacity-80 text-sm">Track your orders and preferences easily.</p>
              </div>
            </div>
            <div className="flex items-start text-left bg-white/10 p-5 rounded-2xl backdrop-blur-md border border-white/10 hover:bg-white/20 transition-all">
              <div className="bg-white/20 p-2 rounded-xl mr-4">
                <LogIn className="h-6 w-6" />
              </div>
              <div>
                <p className="font-bold text-lg">Secure Access</p>
                <p className="opacity-80 text-sm">Your data and transactions are always protected.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
