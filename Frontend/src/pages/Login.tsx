import React from 'react';
import { Github } from 'lucide-react';
import { GoogleLogin } from '@react-oauth/google';
import { jwtDecode } from 'jwt-decode';
import { useAuth } from '../context/AuthContext';

const CodeFlaskLogo = "/codeflask.svg"; // Correct way to reference public assets

const Login = () => {
  const { login } = useAuth();

  const handleGoogleSuccess = async (credentialResponse: any) => {
    const decoded = jwtDecode(credentialResponse.credential);
    await login(decoded);
  };

  const handleGithubLogin = () => {
    console.log('GitHub login clicked');
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-900 p-6">
      {/* Logo Section with Redirect */}
      <a href="/" className="mb-6 transition-transform transform hover:scale-110">
        <img src={CodeFlaskLogo} alt="CodeFlask Logo" className="h-16" />
      </a>

      <div className="bg-gray-800 p-8 rounded-xl w-full max-w-md">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold mb-2 text-white">Welcome to CodeFlask</h2>
          <p className="text-gray-400">Sign in to continue coding</p>
        </div>

        <form className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-white mb-2">Email</label>
            <input
              type="email"
              className="w-full px-4 py-2 bg-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              placeholder="Enter your email"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-white mb-2">Password</label>
            <input
              type="password"
              className="w-full px-4 py-2 bg-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              placeholder="Enter your password"
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <input
                type="checkbox"
                id="remember"
                className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
              />
              <label htmlFor="remember" className="ml-2 text-sm text-white">
                Remember me
              </label>
            </div>
            <a href="#" className="text-sm text-indigo-500 hover:text-indigo-400">
              Forgot password?
            </a>
          </div>

          <button
            type="submit"
            className="w-full py-3 px-4 bg-indigo-600 hover:bg-indigo-700 rounded-lg transition-colors font-medium text-white"
          >
            Sign in
          </button>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-600"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-gray-800 text-gray-400">Or continue with</span>
            </div>
          </div>

          <div className="space-y-3">
            <div className="flex justify-center">
              <GoogleLogin
                onSuccess={handleGoogleSuccess}
                onError={() => console.log('Login Failed')}
                theme="filled_black"
                size="large"
                width="320"
                useOneTap={false}
                flow="implicit"
                auto_select={false}
              />
            </div>

            <button
              type="button"
              onClick={handleGithubLogin}
              className="w-full py-3 px-4 bg-gray-700 hover:bg-gray-600 rounded-lg transition-colors font-medium flex items-center justify-center gap-2 text-white"
            >
              <Github className="w-5 h-5" />
              Continue with GitHub
            </button>
          </div>

          <p className="text-center text-sm text-gray-400">
            Don't have an account?{' '}
            <a href="#" className="text-indigo-500 hover:text-indigo-400 font-medium">
              Sign up
            </a>
          </p>
        </form>
      </div>
    </div>
  );
};

export default Login;
