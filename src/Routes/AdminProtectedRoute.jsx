import { Navigate } from "react-router-dom";
import { useState, useEffect } from "react";

const AdminProtectedRoute = ({ children }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthorized, setIsAuthorized] = useState(false);

  useEffect(() => {
   
    const adminLogged = localStorage.getItem("adminLogged");
    const userEmail = localStorage.getItem("userEmail");
    const adminEmail = localStorage.getItem("adminEmail");
    
    if (adminLogged === 'true') {
     
      const emailToCheck = adminEmail || userEmail;
      
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
    localStorage.removeItem("adminLogged");
    localStorage.removeItem("adminEmail");
    return <Navigate to="/login" replace />;
  }

  return children;
};

export default AdminProtectedRoute;