import { Navigate, Outlet } from "react-router-dom";

const isAuthenticated = () => {
  // Replace later with Context / API-based auth
  return Boolean(localStorage.getItem("authToken"));
};

export default function ProtectedRoute() {
  return isAuthenticated() ? <Outlet /> : <Navigate to="/login" replace />;
}
