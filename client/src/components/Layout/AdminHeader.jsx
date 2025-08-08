import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  Package,
  Users,
  ShoppingCart,
  Settings,
  LogOut,
  ChevronDown,
  Bell,
} from "lucide-react";
import useAuthStore from "@/store/authStore";
import { batmanToast } from "@/utils/toast";

const AdminHeader = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuthStore();

  const navItems = [
    {
      name: "Dashboard",
      path: "/admin/dashboard",
      icon: LayoutDashboard,
    },
    {
      name: "Products",
      path: "/admin/products",
      icon: Package,
    },
    {
      name: "Orders",
      path: "/admin/orders",
      icon: ShoppingCart,
    },
    {
      name: "Users",
      path: "/admin/users",
      icon: Users,
    },
  ];

  const handleLogout = () => {
    logout();
    batmanToast.success("Administrator logged out successfully");
    navigate("/login");
  };

  return (
    <header className="bg-gray-900 border-b border-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo Section */}
          <div className="flex items-center">
            <Link to="/admin/dashboard" className="flex items-center space-x-3">
              <div className="p-2 rounded-lg bg-yellow-400/10 border border-yellow-400/20">
                <Settings className="h-6 w-6 text-yellow-400" />
              </div>
              <div>
                <h1 className="text-lg font-bold text-white">
                  Batman's Armory
                </h1>
                <p className="text-xs text-gray-400">Administrator Console</p>
              </div>
            </Link>
          </div>

          {/* Navigation */}
          <nav className="hidden md:flex items-center space-x-4">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`px-3 py-2 rounded-lg text-sm font-medium transition-all duration-300 flex items-center gap-2
                  ${
                    location.pathname === item.path
                      ? "bg-yellow-400/10 text-yellow-400"
                      : "text-gray-300 hover:text-yellow-400 hover:bg-yellow-400/5"
                  }`}
              >
                <item.icon className="h-4 w-4" />
                {item.name}
              </Link>
            ))}
          </nav>

          {/* Right Section */}
          <div className="flex items-center space-x-4">
            {/* Notifications */}
            <button className="relative p-2 text-gray-300 hover:text-yellow-400 transition-colors">
              <Bell className="h-5 w-5" />
              <span className="absolute top-0 right-0 h-2 w-2 rounded-full bg-yellow-400 animate-pulse"></span>
            </button>

            {/* Admin Profile Dropdown */}
            <div className="relative group">
              <button className="flex items-center space-x-3 px-3 py-2 rounded-lg bg-gray-800 hover:bg-gray-700 transition-all duration-300">
                <div className="flex items-center space-x-2">
                  <div className="w-8 h-8 rounded-lg bg-yellow-400/10 flex items-center justify-center">
                    <span className="text-yellow-400 font-bold">
                      {user?.name?.charAt(0).toUpperCase()}
                    </span>
                  </div>
                  <div className="hidden md:block text-left">
                    <p className="text-sm font-medium text-white">
                      {user?.name}
                    </p>
                    <p className="text-xs text-gray-400">Administrator</p>
                  </div>
                </div>
                <ChevronDown className="h-4 w-4 text-gray-400" />
              </button>

              {/* Dropdown Menu */}
              <div className="absolute right-0 mt-2 w-48 py-2 bg-gray-900 rounded-lg shadow-xl border border-gray-800 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300">
                <Link
                  to="/admin/settings"
                  className="block px-4 py-2 text-sm text-gray-300 hover:text-yellow-400 hover:bg-gray-800"
                >
                  Settings
                </Link>
                <button
                  onClick={handleLogout}
                  className="w-full text-left px-4 py-2 text-sm text-red-400 hover:text-red-300 hover:bg-red-950/50"
                >
                  Sign Out
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default AdminHeader;
