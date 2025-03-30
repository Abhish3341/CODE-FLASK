import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Github } from 'lucide-react';
import { GoogleLogin } from '@react-oauth/google';
import { jwtDecode } from 'jwt-decode';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';

const CodeFlaskLogo = "/codeflask.svg";

const Login = () => {
  const { login } = useAuth();
  const { theme } = useTheme();
  const navigate = useNavigate();

  const handleGoogleSuccess = async (credentialResponse: any) => {
    const decoded = jwtDecode(credentialResponse.credential);
    await login(decoded);
  };

  const handleGithubLogin = async () => {
    const clientId = import.meta.env.VITE_GITHUB_CLIENT_ID;
    // Use the exact callback URL that's configured in GitHub OAuth app settings
    const redirectUri = 'http://localhost:5173/auth/github/callback'; // Update this to your actual redirect URI
    // Ensure the redirect URI matches the one registered in your GitHub OAuth app settings
    
    // GitHub OAuth scopes we need
    const scope = 'read:user user:email';
    
    // Construct the GitHub OAuth URL with state parameter for security
    const state = crypto.randomUUID(); // Generate random state
    sessionStorage.setItem('github_oauth_state', state); // Store state for verification
    
    const githubUrl = `https://github.com/login/oauth/authorize?client_id=${clientId}&redirect_uri=${encodeURIComponent(redirectUri)}&scope=${scope}&state=${state}`;
    
    // Redirect to GitHub
    window.location.href = githubUrl;
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[var(--color-bg-primary)] p-6">
      {/* Logo Section with Redirect */}
      <a href="/" className="mb-6 transition-transform transform hover:scale-110">
        <img src={CodeFlaskLogo} alt="CodeFlask Logo" className="h-16" />
      </a>

      <div className="card p-8 w-full max-w-md">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold mb-2 text-[var(--color-text-primary)]">Welcome to CodeFlask</h2>
          <p className="text-[var(--color-text-secondary)]">Sign in to continue coding</p>
        </div>

        <form className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-[var(--color-text-primary)] mb-2">Email</label>
            <input
              type="email"
              className="w-full px-4 py-2 bg-[var(--color-bg-secondary)] text-[var(--color-text-primary)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--color-button-primary)]"
              placeholder="Enter your email"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-[var(--color-text-primary)] mb-2">Password</label>
            <input
              type="password"
              className="w-full px-4 py-2 bg-[var(--color-bg-secondary)] text-[var(--color-text-primary)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--color-button-primary)]"
              placeholder="Enter your password"
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <input
                type="checkbox"
                id="remember"
                className="h-4 w-4 rounded border-[var(--color-border)] text-[var(--color-button-primary)] focus:ring-[var(--color-button-primary)]"
              />
              <label htmlFor="remember" className="ml-2 text-sm text-[var(--color-text-primary)]">
                Remember me
              </label>
            </div>
            <a href="#" className="text-sm text-[var(--color-button-primary)] hover:text-[var(--color-button-primary-hover)]">
              Forgot password?
            </a>
          </div>

          <button
            type="submit"
            className="button button-primary w-full"
          >
            Sign in
          </button>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-[var(--color-border)]"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-[var(--color-bg-card)] text-[var(--color-text-secondary)]">Or continue with</span>
            </div>
          </div>

          <div className="space-y-3">
            <div className="flex justify-center">
              <GoogleLogin
                onSuccess={handleGoogleSuccess}
                onError={() => console.log('Login Failed')}
                theme={theme === 'dark' ? 'filled_black' : 'outline'}
                size="large"
                width="320"
                useOneTap={false}
              
                auto_select={false}
              />
            </div>

            <button
              type="button"
              onClick={handleGithubLogin}
              className="w-full py-3 px-4 bg-[var(--color-bg-secondary)] hover:bg-[var(--color-border)] rounded-lg transition-colors font-medium flex items-center justify-center gap-2 text-[var(--color-text-primary)]"
            >
              <Github className="w-5 h-5" />
              Continue with GitHub
            </button>
          </div>

          <p className="text-center text-sm text-[var(--color-text-secondary)]">
            Don't have an account?{' '}
            <a href="#" className="text-[var(--color-button-primary)] hover:text-[var(--color-button-primary-hover)] font-medium">
              Sign up
            </a>
          </p>
        </form>
      </div>
    </div>
  );
};

export default Login;