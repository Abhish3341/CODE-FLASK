import React, { useState, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { Github, Eye, EyeOff, AlertTriangle, Info, Code2, Sun, Moon } from 'lucide-react';
import { GoogleLogin } from '@react-oauth/google';
import { jwtDecode } from 'jwt-decode';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import axiosInstance from '../utils/axiosConfig';

const Login = () => {
  const { login } = useAuth();
  const { theme, toggleTheme, isDarkMode } = useTheme();
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isSignUp, setIsSignUp] = useState(false);
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [conflictInfo, setConflictInfo] = useState<{
    type: string;
    authMethod: string;
    message: string;
  } | null>(null);

  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isLoading) return;
    
    setError('');
    setConflictInfo(null);
    setIsLoading(true);
    
    try {
      const endpoint = isSignUp ? '/api/auth/register' : '/api/auth/login';
      const data = isSignUp 
        ? { email, password, firstname: firstName, lastname: lastName }
        : { email, password };
      
      console.log(`📤 Submitting ${isSignUp ? 'registration' : 'login'} request to ${import.meta.env.VITE_API_URL}${endpoint}`);
      
      const response = await axiosInstance.post(endpoint, data);
      
      if (response.data.user && response.data.token) {
        localStorage.setItem('auth_token', response.data.token);
        await login(response.data.user);
      } else {
        throw new Error('Invalid response from server');
      }
    } catch (error: any) {
      console.error('Authentication error:', error);
      
      const errorData = error.response?.data;
      
      // Handle email conflict errors with minimal messaging
      if (errorData?.conflictType === 'email_already_exists') {
        setConflictInfo({
          type: errorData.conflictType,
          authMethod: errorData.existingAuthMethod,
          message: errorData.error
        });
        setError(''); // Clear generic error since we're showing conflict info
      } else if (errorData?.conflictType === 'oauth_conflict') {
        setConflictInfo({
          type: errorData.conflictType,
          authMethod: errorData.authMethod,
          message: errorData.error
        });
        setError('');
      } else {
        // Generic error handling
        const errorMessage = errorData?.error || error.message || 'Authentication failed';
        setError(errorMessage);
        setConflictInfo(null);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSuccess = async (credentialResponse: any) => {
    if (isLoading) return;

    try {
      setIsLoading(true);
      setError('');
      setConflictInfo(null);
      
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

      console.log('📤 Submitting Google OAuth data to API:', googleData.email);
      console.log(`API URL: ${import.meta.env.VITE_API_URL}/api/auth/google`);
      
      const response = await axiosInstance.post('/api/auth/google', googleData);
      
      if (response.data.user && response.data.token) {
        localStorage.setItem('auth_token', response.data.token);
        await login(response.data.user);
      } else {
        throw new Error('Invalid response from server');
      }
    } catch (error: any) {
      console.error('Google OAuth error:', error);
      
      const errorData = error.response?.data;
      
      // Handle email conflict errors
      if (errorData?.conflictType === 'email_already_exists') {
        setConflictInfo({
          type: errorData.conflictType,
          authMethod: errorData.existingAuthMethod,
          message: errorData.error
        });
        setError('');
      } else {
        const errorMessage = errorData?.error || error.message || 'Failed to authenticate with Google';
        setError(errorMessage);
        setConflictInfo(null);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleGithubLogin = useCallback(() => {
    if (isLoading) return;

    try {
      setError('');
      setConflictInfo(null);
      sessionStorage.removeItem('github_oauth_state');
      
      const clientId = import.meta.env.VITE_GITHUB_CLIENT_ID;
      if (!clientId) {
        throw new Error('GitHub client ID not configured');
      }

      const redirectUri = `${window.location.origin}/auth/github/callback`;
      const scope = 'read:user user:email';
      const state = crypto.randomUUID();
      
      sessionStorage.setItem('github_oauth_state', state);
      
      const params = new URLSearchParams({
        client_id: clientId,
        redirect_uri: redirectUri,
        scope,
        state,
        allow_signup: 'true'
      });

      window.location.href = `https://github.com/login/oauth/authorize?${params}`;
    } catch (error: any) {
      setError(error.message || 'Failed to initialize GitHub login');
    }
  }, [isLoading]);

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const getConflictIcon = (authMethod: string) => {
    switch (authMethod) {
      case 'google':
        return (
          <svg className="w-4 h-4 sm:w-5 sm:h-5" viewBox="0 0 24 24">
            <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
            <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
          </svg>
        );
      case 'github':
        return <Github className="w-4 h-4 sm:w-5 sm:h-5" />;
      case 'email':
        return <AlertTriangle className="w-4 h-4 sm:w-5 sm:h-5" />;
      default:
        return <Info className="w-4 h-4 sm:w-5 sm:h-5" />;
    }
  };

  const getConflictColor = (authMethod: string) => {
    switch (authMethod) {
      case 'google':
        return 'border-blue-200 bg-blue-50 dark:border-blue-800 dark:bg-blue-900/20';
      case 'github':
        return 'border-gray-200 bg-gray-50 dark:border-gray-800 dark:bg-gray-900/20';
      case 'email':
        return 'border-orange-200 bg-orange-50 dark:border-orange-800 dark:bg-orange-900/20';
      default:
        return 'border-red-200 bg-red-50 dark:border-red-800 dark:bg-red-900/20';
    }
  };

  const getConflictTextColor = (authMethod: string) => {
    switch (authMethod) {
      case 'google':
        return 'text-blue-700 dark:text-blue-200';
      case 'github':
        return 'text-gray-700 dark:text-gray-200';
      case 'email':
        return 'text-orange-700 dark:text-orange-200';
      default:
        return 'text-red-700 dark:text-red-200';
    }
  };

  const getProviderName = (authMethod: string) => {
    switch (authMethod) {
      case 'google':
        return 'Google';
      case 'github':
        return 'GitHub';
      case 'email':
        return 'Email/Password';
      default:
        return 'OAuth';
    }
  };

  const clearConflictAndError = () => {
    setError('');
    setConflictInfo(null);
  };

  const handleRedirect = () => {
    window.scrollTo(0, 0);
  };

  return (
    <div className={`min-h-screen flex flex-col transition-colors duration-300 ${
      isDarkMode 
        ? 'bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900' 
        : 'bg-gradient-to-br from-slate-50 via-indigo-50 to-slate-50'
    }`}>
      {/* Header */}
      <header className={`border-b transition-colors duration-300 ${
        isDarkMode 
          ? 'border-slate-700 bg-slate-900/50 backdrop-blur-lg' 
          : 'border-slate-200 bg-white/50 backdrop-blur-lg'
      }`}>
        <nav className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <Link to="/" onClick={handleRedirect} className="flex items-center gap-2 cursor-pointer group">
              <div className="p-2 rounded-lg bg-gradient-to-r from-indigo-500 to-purple-600 group-hover:from-indigo-600 group-hover:to-purple-700 transition-all duration-300">
                <Code2 className="w-6 h-6 text-white" />
              </div>
              <span className={`text-xl font-bold transition-colors duration-300 ${
                isDarkMode ? 'text-white' : 'text-slate-900'
              }`}>
                CodeFlask
              </span>
            </Link>
            
            <button
              onClick={toggleTheme}
              className={`p-2 rounded-lg transition-all duration-300 hover:scale-105 ${
                isDarkMode 
                  ? 'hover:bg-slate-800 text-slate-300' 
                  : 'hover:bg-slate-100 text-slate-600'
              }`}
              aria-label="Toggle theme"
            >
              {isDarkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </button>
          </div>
        </nav>
      </header>

      {/* Main Content */}
      <div className="flex-1 flex flex-col items-center justify-center p-4 sm:p-6">
        <div className={`group p-6 sm:p-8 w-full max-w-md rounded-2xl transition-all duration-300 hover:scale-[1.02] hover:shadow-2xl ${
          isDarkMode 
            ? 'bg-slate-800/60 backdrop-blur-lg border border-slate-700 hover:border-indigo-500/50' 
            : 'bg-white/80 backdrop-blur-lg border border-slate-200 hover:border-indigo-300 shadow-lg'
        }`}>
          <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/5 to-purple-500/5 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          
          <div className="relative z-10">
            <div className="text-center mb-6 sm:mb-8">
              <h2 className={`text-2xl sm:text-3xl font-bold mb-2 transition-colors duration-300 ${
                isDarkMode ? 'text-white' : 'text-slate-900'
              }`}>
                {isSignUp ? 'Create Account' : 'Welcome Back'}
              </h2>
              <p className={`text-sm sm:text-base transition-colors duration-300 ${
                isDarkMode ? 'text-slate-300' : 'text-slate-600'
              }`}>
                {isSignUp ? 'Sign up to start coding' : 'Sign in to continue coding'}
              </p>
            </div>

            {/* Minimal Email Conflict Warning - Only show when there's an actual conflict */}
            {conflictInfo && (
              <div className={`border rounded-lg p-3 mb-4 ${getConflictColor(conflictInfo.authMethod)}`}>
                <div className="flex items-center gap-2">
                  <div className={`${getConflictTextColor(conflictInfo.authMethod)}`}>
                    {getConflictIcon(conflictInfo.authMethod)}
                  </div>
                  <p className={`text-xs sm:text-sm ${getConflictTextColor(conflictInfo.authMethod)}`}>
                    {conflictInfo.message}
                  </p>
                </div>
              </div>
            )}

            {/* Generic Error Message */}
            {error && !conflictInfo && (
              <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4" role="alert">
                <span className="block sm:inline text-sm sm:text-base">{error}</span>
              </div>
            )}

            <form onSubmit={handleEmailSubmit} className="space-y-4 mb-6">
              {isSignUp && (
                <div className="grid grid-cols-2 gap-3 sm:gap-4">
                  <div>
                    <label className={`block text-sm font-medium mb-1 transition-colors duration-300 ${
                      isDarkMode ? 'text-slate-300' : 'text-slate-600'
                    }`}>
                      First Name
                    </label>
                    <input
                      type="text"
                      value={firstName}
                      onChange={(e) => {
                        setFirstName(e.target.value);
                        clearConflictAndError();
                      }}
                      className={`w-full px-3 sm:px-4 py-2 rounded-lg border text-sm sm:text-base transition-all duration-300 focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 ${
                        isDarkMode 
                          ? 'bg-slate-700/50 text-white border-slate-600 focus:bg-slate-700' 
                          : 'bg-white/70 text-slate-900 border-slate-300 focus:bg-white'
                      }`}
                      required
                      disabled={isLoading}
                    />
                  </div>
                  <div>
                    <label className={`block text-sm font-medium mb-1 transition-colors duration-300 ${
                      isDarkMode ? 'text-slate-300' : 'text-slate-600'
                    }`}>
                      Last Name
                    </label>
                    <input
                      type="text"
                      value={lastName}
                      onChange={(e) => {
                        setLastName(e.target.value);
                        clearConflictAndError();
                      }}
                      className={`w-full px-3 sm:px-4 py-2 rounded-lg border text-sm sm:text-base transition-all duration-300 focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 ${
                        isDarkMode 
                          ? 'bg-slate-700/50 text-white border-slate-600 focus:bg-slate-700' 
                          : 'bg-white/70 text-slate-900 border-slate-300 focus:bg-white'
                      }`}
                      required
                      disabled={isLoading}
                    />
                  </div>
                </div>
              )}
              
              <div>
                <label className={`block text-sm font-medium mb-1 transition-colors duration-300 ${
                  isDarkMode ? 'text-slate-300' : 'text-slate-600'
                }`}>
                  Email
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    clearConflictAndError();
                  }}
                  className={`w-full px-3 sm:px-4 py-2 rounded-lg border text-sm sm:text-base transition-all duration-300 focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 ${
                    isDarkMode 
                      ? 'bg-slate-700/50 text-white border-slate-600 focus:bg-slate-700' 
                      : 'bg-white/70 text-slate-900 border-slate-300 focus:bg-white'
                  }`}
                  required
                  disabled={isLoading}
                />
              </div>
              
              <div>
                <label className={`block text-sm font-medium mb-1 transition-colors duration-300 ${
                  isDarkMode ? 'text-slate-300' : 'text-slate-600'
                }`}>
                  Password
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => {
                      setPassword(e.target.value);
                      clearConflictAndError();
                    }}
                    className={`w-full px-3 sm:px-4 py-2 rounded-lg border pr-10 sm:pr-12 text-sm sm:text-base transition-all duration-300 focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 ${
                      isDarkMode 
                        ? 'bg-slate-700/50 text-white border-slate-600 focus:bg-slate-700' 
                        : 'bg-white/70 text-slate-900 border-slate-300 focus:bg-white'
                    }`}
                    required
                    disabled={isLoading}
                    minLength={6}
                  />
                  <button
                    type="button"
                    onClick={togglePasswordVisibility}
                    className={`absolute right-3 top-1/2 transform -translate-y-1/2 transition-all duration-300 hover:scale-110 ${
                      isDarkMode ? 'text-slate-400 hover:text-white' : 'text-slate-500 hover:text-slate-900'
                    }`}
                  >
                    {showPassword ? <EyeOff className="w-4 h-4 sm:w-5 sm:h-5" /> : <Eye className="w-4 h-4 sm:w-5 sm:h-5" />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-2.5 sm:py-3 px-4 bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white rounded-lg transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl font-medium disabled:opacity-50 disabled:cursor-not-allowed text-sm sm:text-base"
                disabled={isLoading}
              >
                {isLoading ? 'Please wait...' : (isSignUp ? 'Create Account' : 'Sign In')}
              </button>
            </form>

            <div className="relative mb-6">
              <div className="absolute inset-0 flex items-center">
                <div className={`w-full border-t transition-colors duration-300 ${
                  isDarkMode ? 'border-slate-600' : 'border-slate-300'
                }`}></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className={`px-2 transition-colors duration-300 ${
                  isDarkMode 
                    ? 'bg-slate-800/60 text-slate-400' 
                    : 'bg-white/80 text-slate-500'
                }`}>
                  Or continue with
                </span>
              </div>
            </div>

            <div className="space-y-3 sm:space-y-4">
              <div>
                <button
                  type="button"
                  onClick={() => {
                    clearConflictAndError();
                    const googleLoginButton = document.querySelector('[role="button"]');
                    if (googleLoginButton instanceof HTMLElement) {
                      googleLoginButton.click();
                    }
                  }}
                  className={`w-full py-2.5 sm:py-3 px-4 rounded-lg transition-all duration-300 transform hover:scale-105 font-medium flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed text-sm sm:text-base shadow-lg hover:shadow-xl ${
                    isDarkMode 
                      ? 'bg-slate-700/50 hover:bg-slate-700 text-white border border-slate-600 hover:border-slate-500' 
                      : 'bg-white/70 hover:bg-white text-slate-900 border border-slate-300 hover:border-slate-400'
                  }`}
                  disabled={isLoading}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 sm:w-5 sm:h-5" viewBox="0 0 48 48">
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
                  
                />
              </div>
              <button
                type="button"
                onClick={() => {
                  clearConflictAndError();
                  handleGithubLogin();
                }}
                className={`w-full py-2.5 sm:py-3 px-4 rounded-lg transition-all duration-300 transform hover:scale-105 font-medium flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed text-sm sm:text-base shadow-lg hover:shadow-xl ${
                  isDarkMode 
                    ? 'bg-slate-700/50 hover:bg-slate-700 text-white border border-slate-600 hover:border-slate-500' 
                    : 'bg-white/70 hover:bg-white text-slate-900 border border-slate-300 hover:border-slate-400'
                }`}
                disabled={isLoading}
              >
                <Github className="w-4 h-4 sm:w-5 sm:h-5" />
                Continue with GitHub
              </button>
            </div>

            <div className="mt-6 text-center text-sm">
              <span className={`transition-colors duration-300 ${
                isDarkMode ? 'text-slate-400' : 'text-slate-500'
              }`}>
                {isSignUp ? 'Already have an account?' : "Don't have an account?"}
              </span>
              <button
                onClick={() => {
                  setIsSignUp(!isSignUp);
                  clearConflictAndError();
                }}
                className="ml-2 text-indigo-500 hover:text-indigo-400 font-medium disabled:opacity-50 transition-colors duration-300"
                disabled={isLoading}
                type="button"
              >
                {isSignUp ? 'Sign in' : 'Sign up'}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className={`py-6 sm:py-8 border-t transition-colors duration-300 ${
        isDarkMode 
          ? 'border-slate-700 bg-slate-900/50' 
          : 'border-slate-200 bg-white/50'
      }`}>
        <div className="container mx-auto px-4 sm:px-6">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <Link to="/" onClick={handleRedirect} className="flex items-center gap-2 cursor-pointer group">
                <div className="p-1.5 rounded-lg bg-gradient-to-r from-indigo-500 to-purple-600">
                  <Code2 className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                </div>
                <span className={`font-semibold transition-colors duration-300 ${
                  isDarkMode ? 'text-white' : 'text-slate-900'
                }`}>
                  CodeFlask
                </span>
              </Link>
            </div>
            <div className={`text-xs sm:text-sm transition-colors duration-300 ${
              isDarkMode ? 'text-slate-400' : 'text-slate-500'
            }`}>
              © 2025 CodeFlask. All rights reserved.
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Login;