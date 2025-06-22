import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../utils/axiosConfig';
import { useAuth } from '../context/AuthContext';
import LoadingSkeleton from './LoadingSkeleton';

const GitHubCallback = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [conflictInfo, setConflictInfo] = useState<{
    type: string;
    authMethod: string;
    message: string;
  } | null>(null);
  const hasHandled = useRef(false); // 🔒 prevents double execution in dev

  useEffect(() => {
    const handleGitHubCallback = async () => {
      if (hasHandled.current) return; // 👈 Prevent re-run in dev
      hasHandled.current = true;

      try {
        const urlParams = new URLSearchParams(window.location.search);
        const code = urlParams.get('code');
        const incomingState = urlParams.get('state');

        const savedState = sessionStorage.getItem('github_oauth_state');
        sessionStorage.removeItem('github_oauth_state');

        if (!code) {
          throw new Error('No authorization code received');
        }

        if (!savedState || !incomingState || savedState !== incomingState) {
          throw new Error('State validation failed - please try again');
        }

        const redirectUri = `${window.location.origin}/auth/github/callback`;
        const response = await axiosInstance.post('/api/auth/github/callback', { 
          code,
          redirectUri
        });

        if (!response.data?.token || !response.data?.user) {
          throw new Error('Invalid response from server');
        }

        localStorage.setItem('auth_token', response.data.token);
        await login(response.data.user);
        navigate('/app', { replace: true });
      } catch (error: any) {
        console.error('GitHub auth error:', error);
        
        const errorData = error.response?.data;
        
        // Handle email conflict errors
        if (errorData?.conflictType === 'email_already_exists') {
          setConflictInfo({
            type: errorData.conflictType,
            authMethod: errorData.existingAuthMethod,
            message: errorData.error
          });
          setError(''); // Clear generic error since we're showing conflict info
        } else {
          setError(error.message || 'Authentication failed');
          setConflictInfo(null);
        }
      } finally {
        setIsLoading(false);
      }
    };

    handleGitHubCallback();
  }, [navigate, login]);

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

  const getConflictIcon = (authMethod: string) => {
    switch (authMethod) {
      case 'google':
        return (
          <svg className="w-8 h-8" viewBox="0 0 24 24">
            <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
            <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
          </svg>
        );
      case 'email':
        return (
          <svg className="w-8 h-8 text-orange-500" fill="currentColor" viewBox="0 0 24 24">
            <path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"/>
          </svg>
        );
      default:
        return (
          <svg className="w-8 h-8 text-red-500" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
          </svg>
        );
    }
  };

  if (isLoading) {
    return <LoadingSkeleton />;
  }

  if (conflictInfo) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[var(--color-bg-primary)]">
        <div className="card p-8 max-w-md w-full text-center">
          <div className="mb-6">
            {getConflictIcon(conflictInfo.authMethod)}
          </div>
          <h2 className="text-xl font-semibold text-[var(--color-text-primary)] mb-4">
            Email Already Registered
          </h2>
          <p className="text-[var(--color-text-secondary)] mb-6">
            {conflictInfo.message}
          </p>
          <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg mb-6">
            <p className="text-sm text-blue-700 dark:text-blue-300">
              <strong>Security Note:</strong> For your protection, each email can only be associated with one authentication method.
            </p>
          </div>
          <div className="space-y-3">
            <button
              onClick={() => navigate('/login', { replace: true })}
              className="button button-primary w-full"
            >
              Try Different Email
            </button>
            <button
              onClick={() => navigate('/login', { replace: true })}
              className="button button-secondary w-full"
            >
              Use {getProviderName(conflictInfo.authMethod)} Sign In
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[var(--color-bg-primary)]">
        <div className="card p-8 max-w-md w-full text-center">
          <h2 className="text-xl font-semibold text-red-500 mb-4">Authentication Failed</h2>
          <p className="text-[var(--color-text-secondary)] mb-6">{error}</p>
          <button
            onClick={() => navigate('/login', { replace: true })}
            className="button button-primary w-full"
          >
            Return to Login
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-[var(--color-bg-primary)]">
      <div className="card p-8">
        <div className="flex items-center gap-4">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-indigo-500"></div>
          <p className="text-[var(--color-text-primary)]">Completing authentication...</p>
        </div>
      </div>
    </div>
  );
};

export default GitHubCallback;