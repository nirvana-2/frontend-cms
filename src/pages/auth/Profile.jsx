import React from 'react';
import { User, Mail, Shield, Calendar, LogOut, Phone } from 'lucide-react';
import useAuth from '../../hooks/useAuth';
import Button from '../../components/common/Button';

const Profile = () => {
  const { user, logout } = useAuth();

  if (!user) return null;

  const roleColors = {
    admin: 'bg-red-100 text-red-700',
    staff: 'bg-blue-100 text-blue-700',
    student: 'bg-green-100 text-green-700'
  };

  return (
    <div className="max-w-2xl mx-auto space-y-8 animate-slideUp">
      <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm text-center">
        <div className="h-24 w-24 rounded-full bg-primary/10 flex items-center justify-center text-primary text-4xl font-bold mx-auto mb-6 border-4 border-white shadow-lg">
          {user.name.charAt(0).toUpperCase()}
        </div>
        <h1 className="text-3xl font-bold text-gray-800">{user.name}</h1>
        <div className={`mt-2 inline-flex items-center px-3 py-1 rounded-full text-xs font-bold uppercase tracking-widest ${roleColors[user.role]}`}>
          <Shield size={12} className="mr-1.5" /> {user.role}
        </div>
      </div>

      <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-gray-50">
          <h2 className="text-xl font-bold text-gray-800">Account Details</h2>
        </div>
        <div className="p-8 space-y-6">
          <div className="flex items-center">
            <div className="h-10 w-10 rounded-xl bg-gray-50 flex items-center justify-center text-gray-400 mr-4">
              <User size={20} />
            </div>
            <div>
              <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Full Name</p>
              <p className="text-gray-700 font-medium">{user.name}</p>
            </div>
          </div>

          <div className="flex items-center">
            <div className="h-10 w-10 rounded-xl bg-gray-50 flex items-center justify-center text-gray-400 mr-4">
              <Mail size={20} />
            </div>
            <div>
              <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Email Address</p>
              <p className="text-gray-700 font-medium">{user.email}</p>
            </div>
          </div>

          <div className="flex items-center">
            <div className="h-10 w-10 rounded-xl bg-gray-50 flex items-center justify-center text-gray-400 mr-4">
              <Phone size={20} />
            </div>
            <div>
              <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Phone Number</p>
              <p className="text-gray-700 font-medium">{user.phone || 'Not provided'}</p>
            </div>
          </div>

          <div className="flex items-center">
            <div className="h-10 w-10 rounded-xl bg-gray-50 flex items-center justify-center text-gray-400 mr-4">
              <Calendar size={20} />
            </div>
            <div>
              <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Account Created</p>
              <p className="text-gray-700 font-medium">{new Date().toLocaleDateString()}</p>
            </div>
          </div>
        </div>
        <div className="p-8 bg-gray-50 flex justify-center">
          <Button 
            variant="danger" 
            onClick={logout}
            className="px-8 rounded-xl shadow-lg shadow-red-500/10"
          >
            <LogOut size={18} className="mr-2" /> Sign Out
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Profile;
