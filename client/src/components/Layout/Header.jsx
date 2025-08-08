import {
  ShoppingCart,
  User,
  Search,
  Menu,
  LogOut,
  Zap,
  Star,
  Sparkles,
} from "lucide-react";
import { useState, useEffect, useCallback } from "react";
import { Link, useNavigate } from "react-router-dom";
import logo from "@/assets/logo.svg"; // Assuming you have a logo image
import useAuthStore from "../../store/authStore";
import useCartStore from "../../store/cartStore";

const useCart = () => ({
  data: { items: [{ quantity: 2 }, { quantity: 1 }] },
});

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const navigate = useNavigate();

  const { user, isAuthenticated, logout } = useAuthStore();
  const items = useCartStore((state) => state.items);
  const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);

  // Determine if the user is an admin
  const isAdmin = isAuthenticated && user?.role === "admin";
  // Set the correct home/logo link based on user role
  const homeLink = isAdmin ? "/admin/dashboard" : "/";

  // Close menu when route changes
  useEffect(() => {
    const cleanup = () => {
      setIsMenuOpen(false);
    };

    // Clean up when component unmounts or route changes
    return cleanup;
  }, [navigate]);

  // Handle scroll effect with debounce
  useEffect(() => {
    let timeoutId;
    const handleScroll = () => {
      if (timeoutId) clearTimeout(timeoutId);
      timeoutId = setTimeout(() => {
        setScrolled(window.scrollY > 20);
      }, 100);
    };

    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
      if (timeoutId) clearTimeout(timeoutId);
    };
  }, []);

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (isMenuOpen && !event.target.closest(".mobile-menu")) {
        setIsMenuOpen(false);
      }
    };

    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, [isMenuOpen]);

  // First, update the handleLogout function to be more robust
  const handleLogout = useCallback(async () => {
    try {
      // Close mobile menu first
      setIsMenuOpen(false);

      // Get current role before logout
      const wasAdmin = user?.role === "admin";

      // Perform logout
      await logout();

      // Clear any other stores if needed (like cart)
      // Example: clearCart();

      // Navigate based on previous role
      if (wasAdmin) {
        // For admin, navigate to login
        navigate("/login", { replace: true });
      } else {
        // For regular users, navigate to home
        navigate("/", { replace: true });
      }
    } catch (error) {
      console.error("Logout failed:", error);
    }
  }, [logout, navigate, user?.role]);

  const handleMenuItemClick = () => {
    setIsMenuOpen(false);
  };

  // Update mobile menu with click handler
  const MobileMenuItem = ({ to, children }) => (
    <Link
      to={to}
      className="block text-white hover:text-purple-400 font-medium transition-colors duration-300 py-2"
      onClick={handleMenuItemClick}
    >
      {children}
    </Link>
  );

  // Add a protection for admin routes
  useEffect(() => {
    if (!isAuthenticated && window.location.pathname.startsWith("/admin")) {
      navigate("/login", { replace: true });
    }
  }, [isAuthenticated, navigate]);

  return (
    <>
      {/* Animated background effects */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
        <div className="absolute -top-40 -right-32 w-96 h-96 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>
        <div className="absolute -bottom-40 -left-32 w-96 h-96 bg-blue-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse animation-delay-2000"></div>
        <div className="absolute top-40 left-1/2 w-96 h-96 bg-pink-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse animation-delay-4000"></div>
      </div>

      <header
        className={`fixed top-0 w-full z-50 transition-all duration-500 ${
          scrolled
            ? "bg-gray-900/95 backdrop-blur-xl shadow-2xl shadow-purple-500/20"
            : "bg-gradient-to-r from-gray-900 via-purple-900 to-blue-900"
        }`}
      >
        {/* Glowing top border */}
        <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-purple-500 via-pink-500 to-blue-500 animate-pulse"></div>

        <div className="mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="flex items-center justify-between h-20">
            {/* Logo with conditional link */}
            <Link to={homeLink} className="flex items-center space-x-3 group">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-blue-600 rounded-full blur-lg opacity-75 group-hover:opacity-100 transition-opacity animate-pulse"></div>
                <div className="relative bg-gradient-to-r from-purple-600 to-blue-600 p-2 rounded-full">
                  <img
                    className="h-8 w-8 text-white animate-bounce"
                    src={logo}
                    alt="logo"
                  />
                </div>
              </div>
              <div className="relative">
                <span className="text-2xl font-bold bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 bg-clip-text text-transparent animate-pulse">
                  Arkham Alley
                </span>
                <div className="text-sm font-medium text-gray-300 flex items-center gap-1">
                  <Sparkles className="h-3 w-3 text-yellow-400 animate-spin" />
                  Market
                  <Star className="h-3 w-3 text-yellow-400 animate-pulse" />
                </div>
              </div>
            </Link>

            {/* Navigation */}
            <nav className="hidden md:flex items-center space-x-8">
              <Link
                to={homeLink}
                className="relative text-white hover:text-purple-400 font-medium transition-colors duration-300 group"
              >
                Home
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-purple-500 to-blue-500 group-hover:w-full transition-all duration-300"></span>
              </Link>

              {/* Hide Products link for admins */}
              {!isAdmin && (
                <Link
                  to="/products"
                  className="relative text-white hover:text-purple-400 font-medium transition-colors duration-300 group"
                >
                  Products
                  <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-purple-500 to-blue-500 group-hover:w-full transition-all duration-300"></span>
                </Link>
              )}

              {isAuthenticated ? (
                <>
                  {/* Hide Cart for admins */}
                  {!isAdmin && (
                    <Link to="/cart" className="relative group">
                      <div className="relative p-2 rounded-full bg-gray-800/50 hover:bg-gray-700/50 transition-all duration-300 hover:scale-110">
                        <ShoppingCart className="h-6 w-6 text-white group-hover:text-purple-400 transition-colors" />
                        {itemCount > 0 && (
                          <span className="absolute -top-1 -right-1 bg-gradient-to-r from-pink-500 to-purple-500 text-white text-xs rounded-full h-6 w-6 flex items-center justify-center font-bold animate-bounce">
                            {itemCount}
                          </span>
                        )}
                      </div>
                    </Link>
                  )}

                  {/* User dropdown with glow */}
                  <div className="relative group">
                    <button className="flex items-center space-x-2 px-4 py-2 rounded-full bg-gray-800/50 hover:bg-gray-700/50 transition-all duration-300 hover:scale-105">
                      <div className="relative">
                        <User className="h-6 w-6 text-white group-hover:text-purple-400 transition-colors" />
                        <div className="absolute inset-0 bg-purple-500 rounded-full blur opacity-0 group-hover:opacity-50 transition-opacity"></div>
                      </div>
                      <span className="font-medium text-white group-hover:text-purple-400 transition-colors">
                        {user?.name}
                      </span>
                    </button>

                    {/* Dropdown with glassmorphism */}
                    <div className="absolute right-0 mt-3 w-56 bg-gray-900/90 backdrop-blur-xl rounded-2xl shadow-2xl shadow-purple-500/20 py-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 transform translate-y-2 group-hover:translate-y-0 border border-gray-700/50">
                      <div className="absolute -top-2 right-6 w-4 h-4 bg-gray-900/90 backdrop-blur-xl transform rotate-45 border-l border-t border-gray-700/50"></div>

                      {/* Hide My Orders for admins */}
                      {!isAdmin && (
                        <Link
                          to="/orders"
                          className="block px-6 py-3 text-sm text-gray-300 hover:text-white hover:bg-gradient-to-r hover:from-purple-600/20 hover:to-blue-600/20 transition-all duration-200 mx-2 rounded-lg"
                        >
                          <div className="flex items-center gap-3">
                            <Star className="h-4 w-4" />
                            My Orders
                          </div>
                        </Link>
                      )}

                      <button
                        onClick={handleLogout}
                        className="w-full group flex items-center gap-3 px-6 py-3 text-red-400 hover:text-red-300 hover:bg-red-500/10 transition-all duration-300"
                      >
                        <div className="relative flex items-center gap-3 w-full">
                          <LogOut className="h-4 w-4 group-hover:rotate-12 transition-transform duration-300" />
                          <span className="font-medium">Sign Out</span>
                          <div className="absolute inset-0 bg-gradient-to-r from-red-500/0 via-red-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-lg"></div>
                        </div>
                      </button>
                    </div>
                  </div>
                </>
              ) : (
                <div className="flex items-center space-x-4">
                  <Link
                    to="/login"
                    className="text-white hover:text-purple-400 font-medium transition-colors duration-300"
                  >
                    Login
                  </Link>
                  <Link
                    to="/signup"
                    className="relative px-6 py-2 font-medium text-white transition-all duration-300 hover:scale-105"
                  >
                    <span className="absolute inset-0 bg-gradient-to-r from-purple-600 to-blue-600 rounded-full"></span>
                    <span className="absolute inset-0 bg-gradient-to-r from-purple-600 to-blue-600 rounded-full blur opacity-50 hover:opacity-75 transition-opacity"></span>
                    <span className="relative">Sign Up</span>
                  </Link>
                </div>
              )}
            </nav>

            {/* Mobile menu button with animation */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                setIsMenuOpen(!isMenuOpen);
              }}
              className="md:hidden p-3 rounded-full bg-gray-800/50 hover:bg-gray-700/50 transition-all duration-300 hover:scale-110 focus:outline-none focus:ring-2 focus:ring-purple-500"
              aria-label="Toggle menu"
            >
              <Menu
                className={`h-6 w-6 text-white transition-transform duration-300 ${
                  isMenuOpen ? "rotate-90" : ""
                }`}
              />
            </button>
          </div>

          {/* Mobile Menu */}
          <div
            className={`mobile-menu fixed inset-x-0 top-20 md:hidden transition-all duration-300 transform ${
              isMenuOpen
                ? "translate-y-0 opacity-100 visible"
                : "-translate-y-2 opacity-0 invisible"
            }`}
          >
            <div className="bg-gray-900/95 backdrop-blur-xl border-t border-gray-800 shadow-2xl">
              <div className="max-w-7xl mx-auto px-4 py-3">
                {/* Add User Profile Section at Top */}
                {isAuthenticated && (
                  <div className="mb-6 p-4 border-b border-gray-800">
                    <div className="flex items-center gap-3">
                      <div className="p-3 rounded-full bg-gradient-to-r from-purple-600/20 to-blue-600/20 border border-purple-500/20">
                        <User className="h-6 w-6 text-purple-400" />
                      </div>
                      <div>
                        <h3 className="text-lg font-bold bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
                          {user?.name || "Agent"}
                        </h3>
                        <p className="text-sm text-gray-400">{user?.email}</p>
                      </div>
                    </div>
                  </div>
                )}

                <nav className="space-y-4">
                  <MobileMenuItem to={homeLink}>
                    <div className="flex items-center gap-3">
                      <Zap className="h-5 w-5" />
                      <span>Home</span>
                    </div>
                  </MobileMenuItem>

                  {/* Hide Products for admins */}
                  {!isAdmin && (
                    <MobileMenuItem to="/products">
                      <div className="flex items-center gap-3">
                        <Star className="h-5 w-5" />
                        <span>Products</span>
                      </div>
                    </MobileMenuItem>
                  )}

                  {isAuthenticated ? (
                    <>
                      {/* Hide Cart and Orders for admins */}
                      {!isAdmin && (
                        <>
                          <MobileMenuItem to="/cart">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-3">
                                <ShoppingCart className="h-5 w-5" />
                                <span>Cart</span>
                              </div>
                              {itemCount > 0 && (
                                <span className="px-2.5 py-0.5 bg-gradient-to-r from-purple-600 to-blue-600 text-white text-xs font-bold rounded-full">
                                  {itemCount}
                                </span>
                              )}
                            </div>
                          </MobileMenuItem>

                          <MobileMenuItem to="/orders">
                            <div className="flex items-center gap-3">
                              <Star className="h-5 w-5" />
                              <span>My Orders</span>
                            </div>
                          </MobileMenuItem>
                        </>
                      )}

                      <button
                        onClick={handleLogout}
                        className="w-full group flex items-center gap-3 px-4 py-3 text-red-400 hover:text-red-300 transition-colors duration-300 relative overflow-hidden"
                      >
                        <div className="absolute inset-0 bg-gradient-to-r from-red-950/0 via-red-950/50 to-red-950/0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                        <div className="relative flex items-center gap-3">
                          <LogOut className="h-5 w-5 group-hover:rotate-12 transition-transform duration-300" />
                          <span className="font-medium tracking-wide">
                            SIGN OUT
                          </span>
                        </div>
                      </button>
                    </>
                  ) : (
                    <div className="space-y-3 pt-4 mt-4 border-t border-gray-800">
                      <MobileMenuItem to="/login">
                        <div className="flex items-center gap-3">
                          <User className="h-5 w-5" />
                          <span>Login</span>
                        </div>
                      </MobileMenuItem>

                      <Link
                        to="/signup"
                        onClick={handleMenuItemClick}
                        className="block w-full px-4 py-3 text-center font-medium text-white bg-gradient-to-r from-purple-600 to-blue-600 rounded-lg hover:opacity-90 transition-all duration-300 hover:scale-105"
                      >
                        Sign Up
                      </Link>
                    </div>
                  )}
                </nav>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom glow effect */}
        <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-purple-500 to-transparent opacity-50"></div>
      </header>
    </>
  );
};

export default Header;
