import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { useAuth } from '../../context/AuthContext';
import { Mail, Lock, User, UserPlus, Leaf } from 'lucide-react';
import axios from 'axios';
import { GoogleLogin } from '@react-oauth/google';

import { useTranslation } from 'react-i18next';

const API_URL = "http://localhost:8000";

const Register = () => {
  const { t } = useTranslation();
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const response = await axios.post(`${API_URL}/auth/register`, {
        full_name: fullName,
        email,
        password
      });
      toast.success('Registration successful! Logging you in...');
      login(response.data.access_token);
    } catch (error: any) {
      toast.error(error.response?.data?.detail || 'Registration failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSuccess = async (credentialResponse: any) => {
    try {
      const response = await axios.post(`${API_URL}/auth/google`, {
        credential: credentialResponse.credential
      });
      toast.success('Google Authentication successful!');
      login(response.data.access_token);
    } catch (error) {
       toast.error('Google Authentication failed.');
    }
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] flex items-center justify-center p-4">
      <div className="max-w-md w-full glass-card p-8 rounded-2xl relative overflow-hidden">
        {/* Background decorative elements */}
        <div className="absolute top-0 right-0 -mr-16 -mt-16 w-32 h-32 rounded-full bg-krishi-green/10 blur-2xl"></div>
        <div className="absolute bottom-0 left-0 -ml-16 -mb-16 w-32 h-32 rounded-full bg-krishi-green/10 blur-2xl"></div>
        
        <div className="relative z-10 text-center mb-8">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-krishi-green/10 text-krishi-green mb-4">
            <Leaf size={24} />
          </div>
          <h1 className="text-3xl font-bold font-inter text-gray-900 tracking-tight">{t('auth_create')}</h1>
          <p className="text-gray-500 mt-2 font-inter">{t('auth_register_sub')}</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 relative z-10">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5 ml-1">{t('auth_name')}</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <User size={18} className="text-gray-400" />
              </div>
              <input
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="block w-full pl-10 pr-3 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-krishi-green focus:border-krishi-green sm:text-sm bg-white/50 backdrop-blur-sm transition-colors"
                placeholder="John Doe"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5 ml-1">{t('auth_email')}</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Mail size={18} className="text-gray-400" />
              </div>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="block w-full pl-10 pr-3 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-krishi-green focus:border-krishi-green sm:text-sm bg-white/50 backdrop-blur-sm transition-colors"
                placeholder="you@example.com"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5 ml-1">{t('auth_password')}</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Lock size={18} className="text-gray-400" />
              </div>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="block w-full pl-10 pr-3 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-krishi-green focus:border-krishi-green sm:text-sm bg-white/50 backdrop-blur-sm transition-colors"
                placeholder="••••••••"
                required
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full flex justify-center items-center py-2.5 px-4 rounded-xl text-sm font-medium text-white bg-krishi-green hover:bg-black transition-all duration-300 shadow-sm disabled:opacity-70 disabled:cursor-not-allowed mt-2"
          >
            {isLoading ? 'Creating account...' : (
              <>
                <UserPlus size={18} className="mr-2" />
                {t('auth_signup_btn')}
              </>
            )}
          </button>
        </form>

        <div className="mt-6 relative z-10">
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-200"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-[#f9fafc] text-gray-500 font-medium">{t('auth_or_google')}</span>
            </div>
          </div>

          <div className="mt-6 flex justify-center">
             <GoogleLogin
                onSuccess={handleGoogleSuccess}
                onError={() => {
                  toast.error('Google Authentication failed.');
                }}
                theme="outline"
                size="large"
                shape="pill"
             />
          </div>
        </div>

        <p className="mt-8 text-center text-sm font-medium text-gray-500 relative z-10">
          {t('auth_yes_account')}{' '}
          <Link to="/login" className="text-krishi-green hover:text-black hover:underline transition-colors">
            {t('auth_signin_btn')}
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Register;
