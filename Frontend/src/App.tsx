import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { GoogleOAuthProvider } from "@react-oauth/google";
import { AuthProvider } from "./context/AuthContext";
import { ThemeProvider } from "./context/ThemeContext";
import AppLayout from "./layouts/AppLayout";
import Landing from "./pages/Landing";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import PrivateRoute from "./components/PrivateRoute";

function App() {
  const googleClientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;

  if (!googleClientId) {
    console.error("Google Client ID is not configured");
    return null;
  }

  return (
    <GoogleOAuthProvider 
      clientId={googleClientId}
      onScriptLoadError={(error) => console.error('Google OAuth script failed to load:', error)}
      onScriptLoadSuccess={() => console.log('Google OAuth script loaded successfully')}
    >
      <Router>
        <ThemeProvider>
          <AuthProvider>
            <Routes>
              <Route path="/" element={<Landing />} />
              <Route path="/login" element={<Login />} />
              {/* 🔹 Protected Routes */}
              <Route element={<PrivateRoute />}>
                <Route path="/dashboard" element={<Dashboard />} />
              </Route>
              <Route path="/app/*" element={<AppLayout />} />
            </Routes>
          </AuthProvider>
        </ThemeProvider>
      </Router>
    </GoogleOAuthProvider>
  );
}

export default App;