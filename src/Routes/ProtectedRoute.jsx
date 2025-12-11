import { Navigate } from "react-router-dom";
import { useAuth } from "../Context/CartContext";
import { toast } from "react-toastify";

const ProtectedRoute = ({ children }) => {
  const { currentUser, isSessionActive } = useAuth();

  if (!currentUser || !isSessionActive()) {
    toast.error("please login first")
    return <Navigate to="/login" replace />;
  }

  return children;
};

export default ProtectedRoute;
