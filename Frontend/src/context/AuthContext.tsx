import { createContext, useContext, useState, ReactNode, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import LoadingSkeleton from "../components/LoadingSkeleton";

interface User {
  id: string;
  email: string;
  firstname: string;
  lastname: string;
  picture?: string;
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

  // Check for existing token on mount
  useEffect(() => {
    const token = localStorage.getItem('auth_token');
    if (token) {
      try {
        const decoded = jwtDecode<DecodedToken>(token);
        // Check if token is expired
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
        }
      } catch (error) {
        console.error('Token decode error:', error);
        localStorage.removeItem('auth_token');
        setUser(null);
      }
    }
    setLoading(false);
  }, []);

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
        picture: userData.picture
      });
      navigate("/app");
    } catch (error) {
      console.error('Login error:', error);
      setUser(null);
      navigate("/login");
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    setLoading(true);
    localStorage.removeItem('auth_token');
    setUser(null);
    navigate("/");
    setLoading(false);
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