import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../utils/axiosConfig';
import { useAuth } from '../context/AuthContext';
import LoadingSkeleton from './LoadingSkeleton';

const GitHubCallback = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const handleGitHubCallback = async () => {
      try {
        const urlParams = new URLSearchParams(window.location.search);
        const code = urlParams.get('code');
        const state = urlParams.get('state');
        
        const savedState = sessionStorage.getItem('github_oauth_state');
        sessionStorage.removeItem('github_oauth_state');

        if (!code) {
          setError('No authorization code found');
          setIsLoading(false);
          return;
        }

        if (state !== savedState) {
          console.warn('State mismatch, proceeding with caution');
        }

        const response = await axiosInstance.post('/api/auth/github/callback', { 
          code,
          redirectUri: window.location.origin + '/auth/github/callback'
        });
        
        if (response.data.token) {
          localStorage.setItem('auth_token', response.data.token);
          await login(response.data.user);
          navigate('/app');
        } else {
          throw new Error('Invalid response from server');
        }
      } catch (error: any) {
        const errorMessage = error.response?.data?.error || 'Failed to authenticate with GitHub';
        setError(errorMessage);
        setIsLoading(false);
        console.error('GitHub auth error:', error);
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
        <div className="card p-8">
          <h2 className="text-xl font-semibold text-red-500 mb-4">Authentication Error</h2>
          <p className="text-[var(--color-text-secondary)]">{error}</p>
          <button
            onClick={() => navigate('/login')}
            className="mt-4 button button-primary"
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
          <p className="text-[var(--color-text-primary)]">Authenticating with GitHub...</p>
        </div>
      </div>
    </div>
  );
};

export default GitHubCallback;