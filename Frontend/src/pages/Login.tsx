import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Github } from 'lucide-react';
import { GoogleLogin } from '@react-oauth/google';
import { jwtDecode } from 'jwt-decode';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import axiosInstance from '../utils/axiosConfig';

const CodeFlaskLogo = "/codeflask.svg";

const Login = () => {
  const { login } = useAuth();
  const { theme } = useTheme();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSignUp, setIsSignUp] = useState(false);
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isLoading) return;
    
    setError('');
    setIsLoading(true);
    
    try {
      const endpoint = isSignUp ? '/api/auth/register' : '/api/auth/login'; // Updated endpoint path
      const data = isSignUp 
        ? { email, password, firstname: firstName, lastname: lastName }
        : { email, password };
      
      const response = await axiosInstance.post(endpoint, data);
      
      if (response.data.user && response.data.token) {
        localStorage.setItem('auth_token', response.data.token);
        await login(response.data.user);
      } else {
        throw new Error('Invalid response from server');
      }
    } catch (error: any) {
      const errorMessage = error.response?.data?.error || error.message || 'An error occurred. Please try again.';
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSuccess = async (credentialResponse: any) => {
    if (isLoading) return;

    try {
      setIsLoading(true);
      setError('');
      const decoded: any = jwtDecode(credentialResponse.credential);
      
      if (!decoded.email || !decoded.given_name || !decoded.family_name) {
        throw new Error('Missing required information from Google account');
      }

      const googleData = {
        email: decoded.email,
        given_name: decoded.given_name,
        family_name: decoded.family_name,
        picture: decoded.picture || '',
        sub: decoded.sub
      };

      const response = await axiosInstance.post('/api/auth/google', googleData);
      
      if (response.data.user && response.data.token) {
        localStorage.setItem('auth_token', response.data.token);
        await login(response.data.user);
      } else {
        throw new Error('Invalid response from server');
      }
    } catch (error: any) {
      const errorMessage = error.response?.data?.error || error.message || 'Failed to authenticate with Google';
      setError(errorMessage);
      console.error('Google auth error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleGithubLogin = () => {
    if (isLoading) return;

    const clientId = import.meta.env.VITE_GITHUB_CLIENT_ID;
    const redirectUri = `${window.location.origin}/github-callback`;
    const scope = 'read:user user:email';
    
    const state = crypto.randomUUID();
    sessionStorage.setItem('github_oauth_state', state);
    
    const githubUrl = `https://github.com/login/oauth/authorize?client_id=${clientId}&redirect_uri=${encodeURIComponent(redirectUri)}&scope=${scope}&state=${state}`;
    
    window.location.href = githubUrl;
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[var(--color-bg-primary)] p-6">
      <Link to="/" className="mb-6 transition-transform transform hover:scale-110">
        <img src={CodeFlaskLogo} alt="CodeFlask Logo" className="h-16" />
      </Link>

      <div className="card p-8 w-full max-w-md">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold mb-2 text-[var(--color-text-primary)]">
            {isSignUp ? 'Create Account' : 'Welcome Back'}
          </h2>
          <p className="text-[var(--color-text-secondary)]">
            {isSignUp ? 'Sign up to start coding' : 'Sign in to continue coding'}
          </p>
        </div>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4" role="alert">
            <span className="block sm:inline">{error}</span>
          </div>
        )}

        <form onSubmit={handleEmailSubmit} className="space-y-4 mb-6">
          {isSignUp && (
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-[var(--color-text-secondary)] mb-1">
                  First Name
                </label>
                <input
                  type="text"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  className="w-full px-4 py-2 rounded-lg bg-[var(--color-bg-secondary)] text-[var(--color-text-primary)] border border-[var(--color-border)]"
                  required
                  disabled={isLoading}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-[var(--color-text-secondary)] mb-1">
                  Last Name
                </label>
                <input
                  type="text"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  className="w-full px-4 py-2 rounded-lg bg-[var(--color-bg-secondary)] text-[var(--color-text-primary)] border border-[var(--color-border)]"
                  required
                  disabled={isLoading}
                />
              </div>
            </div>
          )}
          
          <div>
            <label className="block text-sm font-medium text-[var(--color-text-secondary)] mb-1">
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2 rounded-lg bg-[var(--color-bg-secondary)] text-[var(--color-text-primary)] border border-[var(--color-border)]"
              required
              disabled={isLoading}
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-[var(--color-text-secondary)] mb-1">
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2 rounded-lg bg-[var(--color-bg-secondary)] text-[var(--color-text-primary)] border border-[var(--color-border)]"
              required
              disabled={isLoading}
              minLength={6}
            />
          </div>

          <button
            type="submit"
            className="w-full py-3 px-4 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={isLoading}
          >
            {isLoading ? 'Please wait...' : (isSignUp ? 'Create Account' : 'Sign In')}
          </button>
        </form>

        <div className="relative mb-6">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-[var(--color-border)]"></div>
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-2 bg-[var(--color-bg-card)] text-[var(--color-text-secondary)]">
              Or continue with
            </span>
          </div>
        </div>

        <div className="space-y-4">
          <div className="flex justify-center">
            <GoogleLogin
              onSuccess={handleGoogleSuccess}
              onError={() => setError('Google authentication failed')}
              theme={theme === 'dark' ? 'filled_black' : 'outline'}
              size="large"
              width="320"
              useOneTap={false}
              auto_select={false}
              disabled={isLoading}
            />
          </div>

          <button
            type="button"
            onClick={handleGithubLogin}
            className="w-full py-3 px-4 bg-[var(--color-bg-secondary)] hover:bg-[var(--color-border)] rounded-lg transition-colors font-medium flex items-center justify-center gap-2 text-[var(--color-text-primary)] disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={isLoading}
          >
            <Github className="w-5 h-5" />
            Continue with GitHub
          </button>
        </div>

        <div className="mt-6 text-center text-sm">
          <span className="text-[var(--color-text-secondary)]">
            {isSignUp ? 'Already have an account?' : "Don't have an account?"}
          </span>
          <button
            onClick={() => {
              setIsSignUp(!isSignUp);
              setError('');
            }}
            className="ml-2 text-indigo-600 hover:text-indigo-500 font-medium disabled:opacity-50"
            disabled={isLoading}
            type="button"
          >
            {isSignUp ? 'Sign in' : 'Sign up'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Login;