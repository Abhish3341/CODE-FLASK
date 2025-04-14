import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Github, Eye, EyeOff } from 'lucide-react';
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
  const [showPassword, setShowPassword] = useState(false);
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
      const endpoint = isSignUp ? '/api/auth/register' : '/api/auth/login';
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

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
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
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-2 rounded-lg bg-[var(--color-bg-secondary)] text-[var(--color-text-primary)] border border-[var(--color-border)] pr-12"
                required
                disabled={isLoading}
                minLength={6}
              />
              <button
                type="button"
                onClick={togglePasswordVisibility}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] transition-colors"
              >
                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
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
          <div>
            <button
              type="button"
              onClick={() => {
                const googleLoginButton = document.querySelector('[role="button"]');
                if (googleLoginButton instanceof HTMLElement) {
                  googleLoginButton.click();
                }
              }}
              className="w-full py-3 px-4 bg-[var(--color-bg-secondary)] hover:bg-[var(--color-border)] rounded-lg transition-colors font-medium flex items-center justify-center gap-2 text-[var(--color-text-primary)] disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={isLoading}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" viewBox="0 0 48 48">
                <path fill="#FFC107" d="M43.611,20.083H42V20H24v8h11.303c-1.649,4.657-6.08,8-11.303,8c-6.627,0-12-5.373-12-12c0-6.627,5.373-12,12-12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C12.955,4,4,12.955,4,24c0,11.045,8.955,20,20,20c11.045,0,20-8.955,20-20C44,22.659,43.862,21.35,43.611,20.083z"/>
                <path fill="#FF3D00" d="M6.306,14.691l6.571,4.819C14.655,15.108,18.961,12,24,12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C16.318,4,9.656,8.337,6.306,14.691z"/>
                <path fill="#4CAF50" d="M24,44c5.166,0,9.86-1.977,13.409-5.192l-6.19-5.238C29.211,35.091,26.715,36,24,36c-5.202,0-9.619-3.317-11.283-7.946l-6.522,5.025C9.505,39.556,16.227,44,24,44z"/>
                <path fill="#1976D2" d="M43.611,20.083H42V20H24v8h11.303c-0.792,2.237-2.231,4.166-4.087,5.571c0.001-0.001,0.002-0.001,0.003-0.002l6.19,5.238C36.971,39.205,44,34,44,24C44,22.659,43.862,21.35,43.611,20.083z"/>
              </svg>
              Continue with Google
            </button>
          </div>
          <div style={{ display: 'none' }}>
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