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
        setError(error.message || 'Authentication failed');
      } finally {
        setIsLoading(false);
      }
    };

    handleGitHubCallback();
  }, [navigate, login]);

  if (isLoading) {
    return <LoadingSkeleton />;
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
