import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Vote, Shield, LogIn, LogOut, UserCircle } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

const Navbar = () => {
  const { isAuthenticated, logout, role, username } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav className="bg-white shadow-sm fixed top-0 left-0 right-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex items-center space-x-2">
              <div className="flex items-center gap-2 text-blue-600">
                <img src="https://i.imgur.com/Do9TlC0.png" width={30} alt="Rev-Vote Logo" />
              </div>
              <span className="text-xl font-trainone text-cyan-600">Rev-Vote</span>
            </Link>
            <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
              <Link
                to="/"
                className={`inline-flex items-center px-1 pt-1 text-sm font-medium ${
                  location.pathname === '/'
                    ? 'text-blue-600 border-b-2 border-blue-600'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                Home
              </Link>
              {isAuthenticated && role === 'admin' && (
                <Link
                  to="/dashboard"
                  className={`inline-flex items-center px-1 pt-1 text-sm font-medium ${
                    location.pathname.startsWith('/dashboard')
                      ? 'text-blue-600 border-b-2 border-blue-600'
                      : 'text-gray-500 hover:text-gray-700'
                  }`}
                >
                  Dashboard
                </Link>
              )}
              {isAuthenticated && role === 'officer' && (
                <Link
                  to="/officer"
                  className={`inline-flex items-center px-1 pt-1 text-sm font-medium ${
                    location.pathname.startsWith('/officer')
                      ? 'text-blue-600 border-b-2 border-blue-600'
                      : 'text-gray-500 hover:text-gray-700'
                  }`}
                >
                  Officer Panel
                </Link>
              )}
              {isAuthenticated && (
                <Link
                  to="/verifyvoter"
                  className={`inline-flex items-center px-1 pt-1 text-sm font-medium ${
                    location.pathname.startsWith('/verifyvoter')
                      ? 'text-blue-600 border-b-2 border-blue-600'
                      : 'text-gray-500 hover:text-gray-700'
                  }`}
                >
                  Verify Voter
                </Link>
              )}
            </div>
          </div>
          <div className="flex items-center space-x-4">
            {isAuthenticated && (
              <div className="flex items-center text-sm text-gray-700">
                <span className="mr-2">
                  {role === 'admin' ? <Shield className="h-4 w-4" /> : <UserCircle className="h-4 w-4" />}
                </span>
                <span>{username}</span>
              </div>
            )}
            {isAuthenticated ? (
              <button
                onClick={handleLogout}
                className="flex items-center px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-100"
              >
                <LogOut className="h-5 w-5 mr-2" />
                Logout
              </button>
            ) : (
              <Link
                to="/login"
                className="flex items-center px-3 py-2 rounded-md text-sm font-medium text-blue-600 hover:text-blue-700 hover:bg-blue-50"
              >
                <LogIn className="h-5 w-5 mr-2" />
                Login
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;