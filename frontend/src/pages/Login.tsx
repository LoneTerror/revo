import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Vote, Shield, UserCircle } from 'lucide-react';

type UserRole = 'admin' | 'officer';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [selectedRole, setSelectedRole] = useState<UserRole>('admin');
  const [error, setError] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();
  // const location = useLocation();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    try {
      const success = await login(username, password, selectedRole);
      if (success) {
        navigate(selectedRole === 'admin' ? '/dashboard' : '/verifyvoter');
      } else {
        setError('Invalid credentials');
      }
    } catch (err) {
      console.error('Login error:', err);
      setError('An error occurred during login');
    }
  };

  return (
    <div className="pt-16 min-h-screen bg-gradient-to-br from-blue-600 to-blue-800 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-xl p-8 w-full max-w-md">
        <div className="flex flex-col items-center mb-8">
          <div className="flex items-center gap-2 text-blue-600 mb-2">
            <Vote size={32} />
            <Shield size={32} />
          </div>
          <h1 className="text-2xl font-bold text-gray-900">Rev-Vote Login</h1>
          <p className="text-gray-600">Authentication Required</p>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-md text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="flex gap-4 mb-4">
            <button
              type="button"
              onClick={() => setSelectedRole('admin')}
              className={`flex-1 py-2 px-4 rounded-md flex items-center justify-center gap-2 ${
                selectedRole === 'admin'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-600'
              }`}
            >
              <Shield size={20} />
              Admin
            </button>
            <button
              type="button"
              onClick={() => setSelectedRole('officer')}
              className={`flex-1 py-2 px-4 rounded-md flex items-center justify-center gap-2 ${
                selectedRole === 'officer'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-600'
              }`}
            >
              <UserCircle size={20} />
              Polling Officer
            </button>
          </div>

          <div>
            <label htmlFor="username" className="block text-sm font-medium text-gray-700">
              Username
            </label>
            <input
              type="text"
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 p-2 border"
              required
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700">
              Password
            </label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 p-2 border"
              required
            />
          </div>

          <button
            type="submit"
            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Sign in as {selectedRole === 'admin' ? 'Administrator' : 'Polling Officer'}
          </button>
        </form>

        <div className="mt-4 text-sm text-gray-600 text-center">
          <p>Demo Credentials:</p>
          <p>Admin: admin / admin123</p>
          <p>Officer: officer / officer123</p>
        </div>
      </div>
    </div>
  );
};

export default Login;