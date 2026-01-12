import { Navigate, Outlet } from "react-router-dom";

const isAuthenticated = () => {
  return Boolean(localStorage.getItem("authToken"));
};

export default function ProtectedRoute({ redirectTo = "/agent/login" }) {
  return isAuthenticated() ? <Outlet /> : <Navigate to={redirectTo} replace />;
}
