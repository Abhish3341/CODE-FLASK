import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const PrivateRoute = () => {
  const { user, loading } = useAuth();

  console.log("Checking auth in PrivateRoute:", { user, loading });

  if (loading) return <div className="text-white text-center mt-10">Loading...</div>;

  return user ? <Outlet /> : <Navigate to="/login" replace />;
};

export default PrivateRoute;
