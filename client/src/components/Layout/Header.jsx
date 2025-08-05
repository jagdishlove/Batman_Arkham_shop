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
import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import logo from "@/assets/logo.svg"; // Assuming you have a logo image
import useAuthStore from "../../store/authStore";
import toast from "react-hot-toast";

const useCart = () => ({
  data: { items: [{ quantity: 2 }, { quantity: 1 }] },
});

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [scrolled, setScrolled] = useState(false);
  const navigate = useNavigate();

  const { user, isAuthenticated, logout } = useAuthStore();
  const { data: cart } = useCart();

  const cartItemsCount =
    cart?.items?.reduce((sum, item) => sum + item.quantity, 0) || 0;

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleLogout = () => {
    logout();
    toast.success("You have been logged out."); // Optional toast
    navigate("/login"); // Redirect to login or landing page
  };

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
            {/* Logo with glow effect */}
            <Link to="/" className="flex items-center space-x-3 group">
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
                to="/products"
                className="relative text-white hover:text-purple-400 font-medium transition-colors duration-300 group"
              >
                Products
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-purple-500 to-blue-500 group-hover:w-full transition-all duration-300"></span>
              </Link>

              {isAuthenticated ? (
                <>
                  {/* Cart with animation */}
                  <Link to="/cart" className="relative group">
                    <div className="relative p-2 rounded-full bg-gray-800/50 hover:bg-gray-700/50 transition-all duration-300 hover:scale-110">
                      <ShoppingCart className="h-6 w-6 text-white group-hover:text-purple-400 transition-colors" />
                      {cartItemsCount > 0 && (
                        <span className="absolute -top-1 -right-1 bg-gradient-to-r from-pink-500 to-purple-500 text-white text-xs rounded-full h-6 w-6 flex items-center justify-center font-bold animate-bounce">
                          {cartItemsCount}
                        </span>
                      )}
                    </div>
                  </Link>

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

                      <Link
                        to="/orders"
                        className="block px-6 py-3 text-sm text-gray-300 hover:text-white hover:bg-gradient-to-r hover:from-purple-600/20 hover:to-blue-600/20 transition-all duration-200 mx-2 rounded-lg"
                      >
                        <div className="flex items-center gap-3">
                          <Star className="h-4 w-4" />
                          My Orders
                        </div>
                      </Link>

                      <button
                        onClick={handleLogout}
                        className="w-[90%] m-auto block px-6 py-3 text-sm text-gray-300 hover:text-white hover:bg-gradient-to-r hover:from-purple-600/20 hover:to-blue-600/20 transition-all duration-200  rounded-lg"
                      >
                        <div className="flex items-center gap-3">
                          <LogOut className="h-4 w-4" />
                          Logout
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
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden p-3 rounded-full bg-gray-800/50 hover:bg-gray-700/50 transition-all duration-300 hover:scale-110"
            >
              <Menu
                className={`h-6 w-6 text-white transition-transform duration-300 ${
                  isMenuOpen ? "rotate-90" : ""
                }`}
              />
            </button>
          </div>

          {/* Mobile menu with slide animation */}
          <div
            className={`md:hidden overflow-hidden transition-all duration-500 ${
              isMenuOpen ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
            }`}
          >
            <div className="py-6 border-t border-gray-700/50">
              <div className="space-y-6">
                <Link
                  to="/products"
                  className="block text-white hover:text-purple-400 font-medium transition-colors duration-300 py-2"
                >
                  Products
                </Link>

                {isAuthenticated ? (
                  <>
                    <Link
                      to="/cart"
                      className="flex items-center space-x-3 text-white hover:text-purple-400 transition-colors duration-300 py-2"
                    >
                      <ShoppingCart className="h-5 w-5" />
                      <span>Cart ({cartItemsCount})</span>
                    </Link>
                    <Link
                      to="/orders"
                      className="block text-white hover:text-purple-400 font-medium transition-colors duration-300 py-2"
                    >
                      My Orders
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="flex items-center space-x-3 text-white hover:text-red-400 transition-colors duration-300 py-2"
                    >
                      <LogOut className="h-5 w-5" />
                      <span>Logout</span>
                    </button>
                  </>
                ) : (
                  <div className="space-y-4">
                    <Link
                      to="/login"
                      className="block text-white hover:text-purple-400 font-medium transition-colors duration-300 py-2"
                    >
                      Login
                    </Link>
                    <Link
                      to="/signup"
                      className="relative inline-block px-6 py-3 font-medium text-white transition-all duration-300"
                    >
                      <span className="absolute inset-0 bg-gradient-to-r from-purple-600 to-blue-600 rounded-full"></span>
                      <span className="relative">Sign Up</span>
                    </Link>
                  </div>
                )}
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
