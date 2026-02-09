import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Mail, Lock, LogIn, Eye, EyeOff, UtensilsCrossed } from 'lucide-react';
import useAuth from '../../hooks/useAuth';
import Input from '../../components/common/Input';
import Button from '../../components/common/Button';

const Login = () => {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (error) setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const result = await login(formData.email, formData.password);
    
    if (result.success) {
      const from = location.state?.from?.pathname || '/';
      navigate(from, { replace: true });
    } else {
      setError(result.message);
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* Left Panel: Branding with Background Image */}
      <div 
        className="hidden lg:flex lg:w-1/2 relative items-center justify-center p-12 text-white bg-cover bg-center"
        style={{ backgroundImage: 'url("https://images.unsplash.com/photo-1567529684892-0f296707ef2e?q=80&w=2070&auto=format&fit=crop")' }}
      >
        <div className="absolute inset-0 bg-gradient-to-br from-primary/90 to-secondary/90 backdrop-blur-[2px]"></div>
        
        <div className="relative z-10 max-w-md text-center">
          <div className="inline-flex items-center justify-center p-3 bg-white/20 rounded-2xl mb-6 backdrop-blur-md">
            <UtensilsCrossed size={48} className="text-white" />
          </div>
          <h1 className="text-6xl font-bold mb-6 font-fredoka tracking-tight">Hamro Canteen</h1>
          <p className="text-xl opacity-90 leading-relaxed">
            Fresh meals, organized service, and a seamless dining experience for students and staff.
          </p>
          <div className="mt-12 grid grid-cols-2 gap-6 text-sm">
            <div className="bg-white/10 p-5 rounded-2xl backdrop-blur-md border border-white/20 hover:bg-white/20 transition-all">
              <p className="font-bold text-lg mb-1">Fast Ordering</p>
              <p className="opacity-80">Skip the queue, order online</p>
            </div>
            <div className="bg-white/10 p-5 rounded-2xl backdrop-blur-md border border-white/20 hover:bg-white/20 transition-all">
              <p className="font-bold text-lg mb-1">Real-time Stats</p>
              <p className="opacity-80">Track your meal status</p>
            </div>
          </div>
        </div>
      </div>

      {/* Right Panel: Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 bg-gray-50">
        <div className="max-w-md w-full">
          <div className="text-center mb-10 lg:hidden">
            <div className="inline-flex items-center justify-center p-2 bg-primary/10 rounded-xl mb-3">
              <UtensilsCrossed size={32} className="text-primary" />
            </div>
            <h1 className="text-3xl font-bold text-primary font-fredoka">Hamro Canteen</h1>
          </div>
          
          <div className="bg-white p-8 rounded-2xl shadow-xl border border-gray-100">
            <h2 className="text-2xl font-bold text-gray-800 mb-2">Welcome Back</h2>
            <p className="text-gray-500 mb-8">Please enter your details to sign in</p>

            {error && (
              <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 text-red-700 rounded-r-lg text-sm animate-shake">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit}>
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

              <div className="flex items-center justify-between mb-6">
                <label className="flex items-center text-sm text-gray-600 cursor-pointer">
                  <input type="checkbox" className="w-4 h-4 rounded border-gray-300 text-primary focus:ring-primary mr-2" />
                  Remember me
                </label>
                <a href="#" className="text-sm font-semibold text-primary hover:text-primary-dark transition-colors">
                  Forgot password?
                </a>
              </div>

              <Button
                type="submit"
                loading={loading}
                className="w-full py-3 text-lg"
              >
                {!loading && <LogIn className="mr-2 h-5 w-5" />}
                Sign In
              </Button>
            </form>

            <p className="text-center mt-8 text-gray-600">
              Don't have an account?{' '}
              <Link to="/register" className="font-bold text-primary hover:text-primary-dark transition-colors">
                Sign Up
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
