import { Navigate } from "react-router-dom";
import { useState, useEffect } from "react";

const AdminProtectedRoute = ({ children }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthorized, setIsAuthorized] = useState(false);

  useEffect(() => {
    // Check multiple conditions for admin access
    const adminLogged = localStorage.getItem("adminLogged");
    const userEmail = localStorage.getItem("userEmail");
    const adminEmail = localStorage.getItem("adminEmail");
    
    // If adminLogged exists AND (either adminEmail exists or userEmail matches admin criteria)
    if (adminLogged === 'true') {
      // Additional check: verify it's actually an admin email
      const emailToCheck = adminEmail || userEmail;
      
      // You can add more specific checks here
      // For now, if adminLogged is true and we have an email, allow access
      if (emailToCheck) {
        setIsAuthorized(true);
      } else {
        setIsAuthorized(false);
      }
    } else {
      setIsAuthorized(false);
    }
    
    setIsLoading(false);
  }, []);

  if (isLoading) {
    return <div className="flex justify-center items-center h-screen">
      <div className="text-center">
        <div className="spinner-border animate-spin inline-block w-8 h-8 border-4 rounded-full" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    </div>;
  }

  if (!isAuthorized) {
    // Clear any invalid admin session
    localStorage.removeItem("adminLogged");
    localStorage.removeItem("adminEmail");
    return <Navigate to="/login" replace />;
  }

  return children;
};

export default AdminProtectedRoute;