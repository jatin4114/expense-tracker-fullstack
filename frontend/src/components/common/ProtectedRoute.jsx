import { Navigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

// wraps pages that need you to be logged in - if there's no token,
// bounce back to the login page instead of showing the page
function ProtectedRoute({ children }) {
  const { isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return children;
}

export default ProtectedRoute;
