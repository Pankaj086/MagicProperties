import React, { createContext, useState, useEffect } from 'react';
import api from '../api/axios';
import { toast } from 'react-toastify';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if user is logged in
    const loadUser = async () => {
      try {
        const token = localStorage.getItem('token');
        if (token) {
          const { data } = await api.get('/users/profile');
          setUser(data);
        }
      } catch (error) {
        localStorage.removeItem('token');
      } finally {
        setLoading(false);
      }
    };

    loadUser();
  }, []);

  const login = async (email, password) => {
    try {
      setLoading(true);
      const { data } = await api.post('/users/login', { email, password });
      localStorage.setItem('token', data.token);
      setUser(data);
      toast.success('Login successful');
      return true;
    } catch (error) {
      toast.error(error.response?.data?.message || 'Login failed');
      return false;
    } finally {
      setLoading(false);
    }
  };

  const register = async (name, email, password) => {
    try {
      setLoading(true);
      const { data } = await api.post('/users/register', { name, email, password });
      localStorage.setItem('token', data.token);
      setUser(data);
      toast.success('Registration successful');
      return true;
    } catch (error) {
      toast.error(error.response?.data?.message || 'Registration failed');
      return false;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
    toast.success('Logged out successfully');
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        register,
        logout,
        isAuthenticated: !!user,
        isAdmin: user?.isAdmin,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
