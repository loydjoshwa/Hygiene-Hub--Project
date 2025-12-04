// PublicRoute.jsx
import { Navigate } from "react-router-dom";
import { useAuth } from "../Context/CartContext";

const PublicRoute = ({ children }) => {
  const { currentUser } = useAuth();

  if (currentUser) {
    return <Navigate to="/" replace />;
  }

  return children;
};

export default PublicRoute;
