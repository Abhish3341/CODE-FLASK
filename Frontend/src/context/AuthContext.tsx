import { createContext, useContext, useState, ReactNode, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import LoadingSkeleton from "../components/LoadingSkeleton";
import axiosInstance from "../utils/axiosConfig";

interface User {
  id: string;
  email: string;
  firstname: string;
  lastname: string;
  picture?: string;
  isOAuthUser?: boolean;
  authMethod?: 'email' | 'google' | 'github';
  canEditEmail?: boolean;
}

interface DecodedToken {
  id: string;
  email: string;
  firstname: string;
  lastname: string;
  exp: number;
}

interface AuthContextType {
  user: User | null;
  login: (userData: any) => Promise<void>;
  logout: () => void;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('auth_token');
    if (token) {
      try {
        const decoded = jwtDecode<DecodedToken>(token);
        if (decoded.exp * 1000 < Date.now()) {
          localStorage.removeItem('auth_token');
          setUser(null);
        } else {
          setUser({
            id: decoded.id,
            email: decoded.email,
            firstname: decoded.firstname,
            lastname: decoded.lastname
          });
          
          // Start session tracking for authenticated users
          startSessionTracking(decoded.id);
        }
      } catch (error) {
        console.error('Token decode error:', error);
        localStorage.removeItem('auth_token');
        setUser(null);
      }
    }
    setLoading(false);
  }, []);

  // Session tracking functions
  const startSessionTracking = async (userId: string) => {
    try {
      await axiosInstance.post('/api/time/session/start', {
        sessionType: 'login'
      });
      console.log('📅 Session tracking started');
      
      // Set up periodic activity updates (every 5 minutes)
      const activityInterval = setInterval(async () => {
        try {
          await axiosInstance.post('/api/time/session/activity');
        } catch (error) {
          console.error('Failed to update session activity:', error);
        }
      }, 5 * 60 * 1000); // 5 minutes

      // Store interval ID for cleanup
      window.sessionActivityInterval = activityInterval;
    } catch (error) {
      console.error('Failed to start session tracking:', error);
    }
  };

  const endSessionTracking = async () => {
    try {
      await axiosInstance.post('/api/time/session/end');
      console.log('📅 Session tracking ended');
      
      // Clear activity interval
      if (window.sessionActivityInterval) {
        clearInterval(window.sessionActivityInterval);
        delete window.sessionActivityInterval;
      }
    } catch (error) {
      console.error('Failed to end session tracking:', error);
    }
  };

  const login = async (userData: any) => {
    setLoading(true);
    try {
      const token = localStorage.getItem('auth_token');
      if (!token) throw new Error('No token found');

      const decoded = jwtDecode<DecodedToken>(token);
      setUser({
        id: decoded.id,
        email: decoded.email,
        firstname: decoded.firstname,
        lastname: decoded.lastname,
        picture: userData.picture,
        isOAuthUser: userData.isOAuthUser || false,
        authMethod: userData.authMethod || 'email',
        canEditEmail: userData.canEditEmail !== false // Default to true if not specified
      });
      
      // Start session tracking
      await startSessionTracking(decoded.id);
      
      navigate("/app");
    } catch (error) {
      console.error('Login error:', error);
      setUser(null);
      navigate("/login");
    } finally {
      // Add a small delay to show loading state
      setTimeout(() => setLoading(false), 500);
    }
  };

  const logout = async () => {
    setLoading(true);
    
    // End session tracking
    await endSessionTracking();
    
    localStorage.removeItem('auth_token');
    setUser(null);
    
    // Add a small delay to show loading state
    setTimeout(() => {
      navigate("/");
      setLoading(false);
    }, 500);
  };

  if (loading) {
    return <LoadingSkeleton />;
  }

  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

// Extend Window interface for TypeScript
declare global {
  interface Window {
    sessionActivityInterval?: NodeJS.Timeout;
  }
}