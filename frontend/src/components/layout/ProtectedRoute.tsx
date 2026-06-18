import { Navigate, Outlet } from "react-router-dom";

export function ProtectedRoute() {
  const isAuthenticated = localStorage.getItem("isAuthenticated") === "true";
  const token = localStorage.getItem("access_token");

  // If there is no token or authentication flag, redirect to login page
  if (!isAuthenticated || !token) {
    return <Navigate to="/login" replace />;
  }

  // If authenticated, render the child components (Dashboard, Projects, etc.)
  return <Outlet />;
}
