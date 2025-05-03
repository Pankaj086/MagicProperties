import React, { useContext, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const Navbar = () => {
  const { user, logout, isAuthenticated, isAdmin } = useContext(AuthContext);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav className="bg-white shadow-md py-4">
      <div className="container mx-auto px-4 flex justify-between items-center">
        {/* Logo */}
        <Link to="/" className="text-2xl font-bold text-blue-600">MagicProperties</Link>

        {/* Mobile menu button */}
        <button
          type="button"
          className="md:hidden text-gray-700"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            {mobileMenuOpen ? (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            ) : (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16m-7 6h7" />
            )}
          </svg>
        </button>

        {/* Desktop Navigation Links */}
        <div className="hidden md:flex items-center space-x-6">
          <Link to="/" className="text-gray-700 hover:text-blue-600">Home</Link>
          <Link to="/properties" className="text-gray-700 hover:text-blue-600">Properties</Link>
          
          {isAuthenticated ? (
            <>
              {isAdmin && (
                <Link to="/admin/dashboard" className="text-gray-700 hover:text-blue-600">
                  Admin Dashboard
                </Link>
              )}
              <div className="relative group">
                <button className="text-gray-700 hover:text-blue-600">
                  {user.name} ▼
                </button>
                <div className="absolute right-0 w-48 mt-2 py-1 bg-white rounded-md shadow-xl z-10 hidden group-hover:block">
                  <Link to="/profile" className="block px-4 py-2 text-gray-700 hover:bg-blue-600 hover:text-white">
                    Profile
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="block w-full text-left px-4 py-2 text-gray-700 hover:bg-blue-600 hover:text-white"
                  >
                    Logout
                  </button>
                </div>
              </div>
            </>
          ) : (
            <>
              <Link to="/login" className="text-gray-700 hover:text-blue-600">Login</Link>
              <Link to="/register" className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700">
                Register
              </Link>
            </>
          )}
        </div>
      </div>

      {/* Mobile Navigation Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white py-2 px-4">
          <Link to="/" className="block py-2 text-gray-700 hover:text-blue-600">Home</Link>
          <Link to="/properties" className="block py-2 text-gray-700 hover:text-blue-600">Properties</Link>
          
          {isAuthenticated ? (
            <>
              {isAdmin && (
                <Link to="/admin/dashboard" className="block py-2 text-gray-700 hover:text-blue-600">
                  Admin Dashboard
                </Link>
              )}
              <Link to="/profile" className="block py-2 text-gray-700 hover:text-blue-600">
                Profile
              </Link>
              <button
                onClick={handleLogout}
                className="block w-full text-left py-2 text-gray-700 hover:text-blue-600"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="block py-2 text-gray-700 hover:text-blue-600">Login</Link>
              <Link to="/register" className="block py-2 text-gray-700 hover:text-blue-600">Register</Link>
            </>
          )}
        </div>
      )}
    </nav>
  );
};

export default Navbar;
