import { useRef, useEffect } from "react";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import useAuthStore from "@/store/authStore";
import { batmanToast } from "@/utils/toast";

const PublicRouteGuard = () => {
  const { isAuthenticated, user } = useAuthStore();
  const location = useLocation();
  const hasChecked = useRef(false);

  useEffect(() => {
    if (isAuthenticated && !hasChecked.current) {
      hasChecked.current = true;
    }
  }, [isAuthenticated]);

  // Only redirect admin users to dashboard
  if (isAuthenticated && user?.role === "admin") {
    return (
      <Navigate
        to="/admin/dashboard"
        state={{ from: location.pathname }}
        replace
      />
    );
  }

  // Allow access to public routes for regular users and non-authenticated users
  return <Outlet />;
};

export default PublicRouteGuard;
