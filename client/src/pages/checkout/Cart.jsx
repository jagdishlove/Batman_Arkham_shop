import {
  Trash2,
  Plus,
  Minus,
  ShoppingBag,
  Shield,
  Lock,
  Eye,
  Target,
  AlertTriangle,
} from "lucide-react";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { batmanToast } from "@/utils/toast"; // Adjust path as needed
import useCartStore from "@/store/cartStore";
import { formatPrice } from "@/utils";
import useAuthStore from "@/store/authStore";

// Mock components and hooks
const LoadingSpinner = ({ size }) => (
  <div
    className={`animate-spin rounded-full border-4 border-yellow-400 border-t-transparent ${
      size === "lg" ? "h-16 w-16" : "h-8 w-8"
    }`}
  ></div>
);

const Cart = () => {
  const [showClearConfirm, setShowClearConfirm] = useState(false);
  const navigate = useNavigate();

  // Get cart data and actions from Zustand store
  const { items, updateQuantity, removeFromCart, clearCart, getCartTotal } =
    useCartStore();

  // Calculate totals
  const subtotal = getCartTotal();
  const tax = subtotal * 0.1;
  const shipping = subtotal > 100 ? 0 : 10;
  const total = subtotal + tax + shipping;

  const handleUpdateQuantity = (productId, newQuantity) => {
    try {
      updateQuantity(productId, newQuantity);
    } catch (error) {
      batmanToast.error(error.message);
    }
  };

  const handleRemoveItem = (productId) => {
    removeFromCart(productId);
    batmanToast.success("Item removed from storage");
  };

  const handleClearCart = () => {
    if (showClearConfirm) {
      clearCart();
      setShowClearConfirm(false);
      batmanToast.success("Storage cleared");
    } else {
      setShowClearConfirm(true);
      setTimeout(() => setShowClearConfirm(false), 3000);
    }
  };

  const handleCheckout = () => {
    navigate("/checkout");
  };

  const { isAuthenticated, isLoading } = useAuthStore();

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="max-w-md mx-auto px-6 text-center">
          <div className="bg-gray-900/60 backdrop-blur-sm border border-gray-800 rounded-2xl p-8">
            <div className="mb-6">
              <div className="relative">
                <div className="absolute inset-0 bg-red-500 rounded-full blur-lg opacity-20"></div>
                <div className="relative bg-red-600 p-4 rounded-full w-20 h-20 mx-auto flex items-center justify-center">
                  <Lock className="h-10 w-10 text-white" />
                </div>
              </div>
            </div>
            <h2 className="text-2xl font-black mb-4 bg-gradient-to-r from-red-400 to-pink-500 bg-clip-text text-transparent">
              ACCESS DENIED
            </h2>
            <p className="text-gray-400 mb-8 leading-relaxed">
              Authentication required to access equipment storage
            </p>
            <Link
              to="/login"
              className="inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-yellow-400 to-orange-500 text-black font-bold rounded-full hover:scale-105 transition-all duration-300"
            >
              <Shield className="h-5 w-5" />
              AUTHENTICATE
            </Link>
          </div>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <LoadingSpinner size="lg" />
          <p className="text-yellow-400 font-mono mt-4 animate-pulse">
            ACCESSING EQUIPMENT STORAGE...
          </p>
        </div>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="max-w-md mx-auto px-6 text-center">
          <div className="bg-gray-900/60 backdrop-blur-sm border border-gray-800 rounded-2xl p-8">
            <div className="mb-6">
              <div className="relative">
                <div className="absolute inset-0 bg-gray-600 rounded-full blur-lg opacity-20"></div>
                <div className="relative bg-gray-700 p-4 rounded-full w-20 h-20 mx-auto flex items-center justify-center">
                  <ShoppingBag className="h-10 w-10 text-gray-400" />
                </div>
              </div>
            </div>
            <h2 className="text-2xl font-black mb-4 text-gray-300">
              STORAGE EMPTY
            </h2>
            <p className="text-gray-500 mb-8 leading-relaxed">
              No equipment currently in your tactical storage
            </p>
            <Link
              to="/products"
              className="inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-yellow-400 to-orange-500 text-black font-bold rounded-full hover:scale-105 transition-all duration-300"
            >
              <Target className="h-5 w-5" />
              BROWSE ARSENAL
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white relative overflow-hidden">
      {/* Background effects - minimal */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-20 right-20 w-96 h-96 bg-yellow-500 rounded-full mix-blend-multiply filter blur-3xl opacity-3 animate-pulse"></div>
        <div className="absolute bottom-20 left-20 w-80 h-80 bg-purple-600 rounded-full mix-blend-multiply filter blur-3xl opacity-3 animate-pulse animation-delay-1000"></div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 sm:gap-6 mb-8 sm:mb-12">
          <div>
            <h1 className="text-3xl sm:text-4xl font-black mb-2">
              <span className="bg-gradient-to-r from-yellow-400 to-orange-500 bg-clip-text text-transparent">
                EQUIPMENT
              </span>
              <span className="text-gray-300 ml-2 sm:ml-3">STORAGE</span>
            </h1>
            <p className="text-gray-500 flex items-center gap-2 font-mono text-sm">
              <Shield className="h-4 w-4" />
              {items.length} items in tactical storage
            </p>
          </div>

          <button
            onClick={handleClearCart}
            className={`group flex items-center gap-3 px-4 sm:px-6 py-2 sm:py-3 rounded-lg font-bold transition-all duration-300 text-sm sm:text-base ${
              showClearConfirm
                ? "bg-red-600/20 border-2 border-red-500 text-red-400"
                : "bg-gray-800/60 border border-gray-700 text-gray-400 hover:border-red-500/50 hover:text-red-400"
            }`}
          >
            {showClearConfirm ? (
              <>
                <AlertTriangle className="h-4 w-4" />
                CONFIRM CLEAR
              </>
            ) : (
              <>
                <Trash2 className="h-4 w-4" />
                CLEAR CART
              </>
            )}
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-4">
            {items.map((item, index) => (
              <div
                key={item.id}
                className="group bg-gray-900/40 backdrop-blur-sm border border-gray-800 rounded-xl p-4 sm:p-6 hover:border-gray-700 transition-all duration-300"
              >
                <div className="flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-6">
                  {/* Product Image */}
                  <div className="relative">
                    <div className="w-full h-32 sm:w-20 sm:h-20 bg-gray-800 rounded-lg flex items-center justify-center overflow-hidden">
                      <img
                        src={item.images[0].url}
                        alt={item.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="absolute top-2 right-2 sm:-top-2 sm:-right-2 bg-yellow-400 text-black text-xs px-2 py-1 rounded-full font-bold">
                      #{index + 1}
                    </div>
                  </div>

                  {/* Product Info */}
                  <div className="flex-1 min-w-0">
                    <button
                      onClick={() => navigate(`/products/${item.id}`)}
                      className="text-lg font-bold text-white hover:text-yellow-400 transition-colors duration-300 block truncate"
                    >
                      {item.name}
                    </button>
                    <p className="text-gray-400 font-mono text-sm mt-1">
                      Unit Price: {formatPrice(item.price)}
                    </p>
                    <div className="flex items-center gap-2 mt-2">
                      <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                      <span className="text-xs text-green-400 font-mono">
                        {item.stock} units available
                      </span>
                    </div>
                  </div>

                  {/* Controls Section */}
                  <div className="flex flex-row flex-wrap sm:flex-col justify-between items-center sm:items-end gap-4 mt-4 sm:mt-0">
                    {/* Quantity Controls */}
                    <div className="flex items-center gap-3 bg-gray-800/60 rounded-lg p-2">
                      <button
                        onClick={() =>
                          handleUpdateQuantity(item.id, item.quantity - 1)
                        }
                        disabled={item.quantity <= 1}
                        className="p-2 rounded-md bg-gray-700 hover:bg-gray-600 disabled:opacity-50 disabled:hover:bg-gray-700 transition-colors"
                      >
                        <Minus className="h-4 w-4 text-white" />
                      </button>

                      <span className="w-12 text-center font-mono text-lg font-bold text-yellow-400">
                        {item.quantity}
                      </span>

                      <button
                        onClick={() =>
                          handleUpdateQuantity(item.id, item.quantity + 1)
                        }
                        disabled={item.quantity >= item.stock}
                        className="p-2 rounded-md bg-gray-700 hover:bg-gray-600 disabled:opacity-50 disabled:hover:bg-gray-700 transition-colors"
                      >
                        <Plus className="h-4 w-4 text-white" />
                      </button>
                    </div>

                    {/* Price and Remove */}
                    <div className="flex items-center sm:flex-col sm:items-end gap-4 sm:gap-2">
                      <p className="text-xl font-black bg-gradient-to-r from-yellow-400 to-orange-500 bg-clip-text text-transparent order-1 sm:order-none">
                        {formatPrice(item.price * item.quantity)}
                      </p>
                      <button
                        onClick={() => handleRemoveItem(item.id)}
                        className="p-2 rounded-lg bg-red-600/20 hover:bg-red-600/30 text-red-400 hover:text-red-300 transition-all duration-300 group"
                      >
                        <Trash2 className="h-4 w-4 group-hover:scale-110 transition-transform" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="sticky top-20 sm:top-32">
              <div className="bg-gray-900/60 backdrop-blur-sm border border-gray-800 rounded-2xl p-4 sm:p-6">
                <div className="flex items-center gap-3 mb-6">
                  <div className="p-2 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-lg">
                    <Eye className="h-5 w-5 text-black" />
                  </div>
                  <h2 className="text-xl font-black text-white">
                    MISSION SUMMARY
                  </h2>
                </div>

                <div className="space-y-4 mb-6">
                  <div className="flex justify-between items-center py-2 border-b border-gray-800">
                    <span className="text-gray-400 font-mono">
                      Equipment Cost
                    </span>
                    <span className="text-white font-mono">
                      {formatPrice(subtotal)}
                    </span>
                  </div>

                  <div className="flex justify-between items-center py-2 border-b border-gray-800">
                    <span className="text-gray-400 font-mono">
                      Security Tax
                    </span>
                    <span className="text-white font-mono">
                      {formatPrice(tax)}
                    </span>
                  </div>

                  <div className="flex justify-between items-center py-2 border-b border-gray-800">
                    <span className="text-gray-400 font-mono">Delivery</span>
                    <span className="text-white font-mono">
                      {shipping === 0 ? (
                        <span className="text-green-400">FREE</span>
                      ) : (
                        formatPrice(shipping)
                      )}
                    </span>
                  </div>

                  <div className="flex flex-wrap justify-between items-center py-3 bg-gray-800/40 rounded-lg px-4">
                    <span className="text-lg font-black text-yellow-400">
                      TOTAL COST
                    </span>
                    <span className="text-2xl font-black bg-gradient-to-r from-yellow-400 to-orange-500 bg-clip-text text-transparent">
                      {formatPrice(total)}
                    </span>
                  </div>
                </div>

                <div className="space-y-3 mt-6">
                  <button
                    onClick={handleCheckout}
                    className="w-full bg-gradient-to-r from-yellow-400 to-orange-500 text-black font-bold py-3 sm:py-4 rounded-lg hover:scale-105 transition-all duration-300 flex items-center justify-center gap-2 sm:gap-3 text-sm sm:text-base"
                  >
                    <Lock className="h-4 w-4 sm:h-5 sm:w-5" />
                    SECURE CHECKOUT
                  </button>

                  <Link
                    to="/products"
                    className="block w-full bg-gray-800/60 hover:bg-gray-700/60 border border-gray-700 hover:border-gray-600 text-white font-bold py-3 sm:py-4 rounded-lg transition-all duration-300 text-center text-sm sm:text-base"
                  >
                    CONTINUE MISSION
                  </Link>
                </div>

                {/* Security Notice */}
                <div className="mt-6 p-4 bg-gray-800/40 rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <Shield className="h-4 w-4 text-green-400" />
                    <span className="text-sm font-mono text-green-400">
                      SECURE TRANSACTION
                    </span>
                  </div>
                  <p className="text-xs text-gray-500">
                    Protected by Wayne Enterprises encryption technology
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        .animation-delay-1000 {
          animation-delay: 1s;
        }
      `}</style>
    </div>
  );
};

export default Cart;
