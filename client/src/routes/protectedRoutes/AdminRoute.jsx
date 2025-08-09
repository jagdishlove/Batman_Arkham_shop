import { useRef, useEffect } from "react";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import useAuthStore from "@/store/authStore";
import { batmanToast } from "@/utils/toast";

const AdminRoute = () => {
  const { isAuthenticated, user } = useAuthStore();
  const location = useLocation();
  const hasChecked = useRef(false);

  useEffect(() => {
    if (!isAuthenticated && !hasChecked.current) {
      hasChecked.current = true;
    }
  }, [isAuthenticated]);

  if (!isAuthenticated || user?.role !== "admin") {
    return <Navigate to="/login" state={{ from: location.pathname }} replace />;
  }

  return <Outlet />;
};

export default AdminRoute;
