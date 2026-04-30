import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';
import { Lock, User, AlertCircle } from 'lucide-react';

const Login = () => {
  const [formData, setFormData] = useState({ id: '', pass: '' });
  const [error, setError] = useState('');
  const { login } = useAppContext();
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');
    
    if (login(formData.id.toLowerCase(), formData.pass)) {
      navigate('/dashboard');
    } else {
      setError('Invalid ID or Password. Please try again.');
    }
  };

  return (
    <div className="flex-1 flex items-center justify-center p-4 bg-gray-50">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100">
          <div className="p-8">
            <h2 className="text-3xl font-extrabold text-center text-gray-900 mb-8">Role-Based Access</h2>
            
            {error && (
              <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 flex items-center gap-3 text-red-700">
                <AlertCircle className="w-5 h-5 flex-shrink-0" />
                <p className="text-sm font-medium">{error}</p>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">User ID</label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-400">
                    <User className="w-5 h-5" />
                  </span>
                  <input
                    type="text"
                    required
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                    placeholder="e.g. admin, supplier"
                    value={formData.id}
                    onChange={(e) => setFormData({ ...formData, id: e.target.value })}
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Password</label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-400">
                    <Lock className="w-5 h-5" />
                  </span>
                  <input
                    type="password"
                    required
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                    placeholder="••••••••"
                    value={formData.pass}
                    onChange={(e) => setFormData({ ...formData, pass: e.target.value })}
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-3 bg-blue-600 text-white rounded-xl font-bold text-lg hover:bg-blue-700 active:scale-95 transition-all shadow-lg shadow-blue-200"
              >
                Sign In
              </button>
            </form>
          </div>

          <div className="px-8 py-6 bg-gray-50 border-t border-gray-100">
            <p className="text-sm font-bold text-gray-500 mb-3 uppercase tracking-wider">Demo Accounts:</p>
            <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-[10px] font-mono">
              <span className="text-gray-600">ID: admin / admin123</span>
              <span className="text-gray-600">ID: supplier / supply123</span>
              <span className="text-gray-600">ID: manufacturer / manu123</span>
              <span className="text-gray-600">ID: distributor / dist123</span>
              <span className="text-gray-600">ID: retailer / retail123</span>
              <span className="text-gray-600 font-bold">ID: manager / manage123</span>
              <span className="text-gray-600 font-bold">ID: warehouse / ware123</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
