import { useRef, useEffect } from "react";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import useAuthStore from "@/store/authStore";
import { batmanToast } from "@/utils/toast";

const UserRoute = () => {
  const { isAuthenticated, user } = useAuthStore();
  const location = useLocation();
  const hasChecked = useRef(false);

  useEffect(() => {
    if (!isAuthenticated && !hasChecked.current) {
      batmanToast.error("Access denied. Authentication required.");
      hasChecked.current = true;
    }
  }, [isAuthenticated]);

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location.pathname }} replace />;
  }

  // If admin tries to access user routes, redirect to admin dashboard
  if (user.role === "admin") {
    return <Navigate to="/admin/dashboard" replace />;
  }

  return <Outlet />;
};

export default UserRoute;
