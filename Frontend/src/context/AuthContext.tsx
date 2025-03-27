import { createContext, useContext, useState, ReactNode } from "react";
import { useNavigate } from "react-router-dom";
import LoadingSkeleton from "../components/LoadingSkeleton";

interface User {
  uid?: string;
  email: string | null;
  name: string | null;
  photoURL: string | null;
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
  const [loading, setLoading] = useState<boolean>(false);
  const navigate = useNavigate();

  const login = async (userData: any) => {
    setLoading(true);
    setTimeout(() => {
      setUser({
        uid: userData.sub || "demo-uid",
        email: userData.email || "demo@example.com",
        name: userData.name || "Demo User",
        photoURL: userData.picture || `https://ui-avatars.com/api/?name=${userData.name || "Demo User"}`,
      });
      setLoading(false);
      navigate("/app"); // Redirect to dashboard after successful login
    }, 1500); // Simulating a delay of 1.5s for better UX
  };

  const logout = () => {
    setLoading(true);
    setTimeout(() => {
      setUser(null);
      setLoading(false);
      navigate("/"); // Redirect to landing page ("/") after logout
    }, 1500);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {loading ? <LoadingSkeleton /> : children}
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
