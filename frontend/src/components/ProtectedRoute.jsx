import { Navigate, useLocation } from "react-router-dom";
import { getStoredToken } from "../lib/auth";

function ProtectedRoute({ children }) {
  const token = getStoredToken();
  const location = useLocation();

  if (!token) {
    return (
      <Navigate to="/login" replace state={{ from: location.pathname }} />
    );
  }

  return children;
}

export default ProtectedRoute;