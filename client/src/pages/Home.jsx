import { ShoppingBag, Truck, Shield, Zap, Eye, Moon, Star } from "lucide-react";
import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import useAuthStore from "../store/authStore";
import toast from "react-hot-toast";

// Mock components and hooks
const LoadingSpinner = ({ size }) => (
  <div
    className={`animate-spin rounded-full border-4 border-purple-400 border-t-transparent ${
      size === "lg" ? "h-16 w-16" : "h-8 w-8"
    }`}
  ></div>
);

const ProductCard = ({ product, className }) => (
  <div
    className={`p-6 rounded-xl transition-all duration-300 hover:scale-105 ${className}`}
  >
    <div className="bg-gray-700 h-48 rounded-lg mb-4 flex items-center justify-center">
      <span className="text-gray-400">Product Image</span>
    </div>
    <h3 className="text-lg font-bold text-white mb-2">{product.name}</h3>
    <p className="text-purple-400 font-bold">${product.price}</p>
  </div>
);

// Mock data
const useFeaturedProducts = () => ({
  data: [
    { _id: 1, name: "Batman Cowl", price: 299 },
    { _id: 2, name: "Utility Belt", price: 199 },
    { _id: 3, name: "Grappling Hook", price: 149 },
    { _id: 4, name: "Batmobile Model", price: 89 },
    { _id: 5, name: "Dark Knight Cape", price: 179 },
    { _id: 6, name: "Bat Signal", price: 249 },
    { _id: 7, name: "Wayne Tech Gadget", price: 399 },
    { _id: 8, name: "Arkham Mask", price: 129 },
  ],
  isLoading: false,
  error: null,
});

const Home = () => {
  const { data: featuredProducts, isLoading, error } = useFeaturedProducts();
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [isLoaded, setIsLoaded] = useState(false);
  const [loadingProgress, setLoadingProgress] = useState(0);

  const { isAuthenticated } = useAuthStore();
  const navigate = useNavigate();

  useEffect(() => {
    // Simulate loading progress
    const progressInterval = setInterval(() => {
      setLoadingProgress((prev) => {
        if (prev >= 100) {
          clearInterval(progressInterval);
          setTimeout(() => setIsLoaded(true), 500);
          return 100;
        }
        return prev + Math.random() * 15;
      });
    }, 200);

    return () => clearInterval(progressInterval);
  }, []);

  const becomeMember = () => {
    if (isAuthenticated) {
      toast.success("You are already a Knight of Gotham!");
    } else {
      navigate("/signup");
    }
  };

  const handleMouseMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setMousePos({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    });
  };

  if (!isLoaded) {
    return (
      <div className="fixed inset-0 bg-black flex flex-col items-center justify-center z-50 overflow-hidden">
        {/* Animated background */}
        <div className="absolute inset-0">
          <div className="absolute top-20 left-20 w-32 h-32 bg-yellow-500 rounded-full opacity-10 animate-pulse"></div>
          <div className="absolute bottom-40 right-32 w-48 h-48 bg-purple-600 rounded-full opacity-10 animate-pulse animation-delay-1000"></div>
          <div className="absolute top-1/2 left-1/4 w-24 h-24 bg-blue-500 rounded-full opacity-10 animate-pulse animation-delay-2000"></div>
        </div>

        {/* Bat signal effect */}
        <div className="relative mb-12">
          <div className="absolute inset-0 bg-yellow-400 rounded-full blur-3xl opacity-20 animate-pulse"></div>
          <div className="relative bg-gradient-to-r from-yellow-400 to-orange-500 p-8 rounded-full shadow-2xl">
            <div className="relative">
              {/* Batman logo placeholder */}
              <div className="w-24 h-24 bg-black rounded-full flex items-center justify-center">
                <div className="text-yellow-400 text-4xl font-bold">🦇</div>
              </div>
              <div className="absolute inset-0 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full animate-ping opacity-20"></div>
            </div>
          </div>
        </div>

        {/* Loading text with typewriter effect */}
        <div className="text-center mb-8">
          <h1 className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-yellow-400 via-orange-500 to-red-500 bg-clip-text text-transparent mb-4 animate-pulse">
            DARK KNIGHT'S DOMAIN
          </h1>
          <p className="text-xl text-gray-400 font-mono tracking-widest animate-pulse">
            {loadingProgress < 30
              ? "INITIALIZING GOTHAM SYSTEMS..."
              : loadingProgress < 60
              ? "CONNECTING TO WAYNE ENTERPRISES..."
              : loadingProgress < 90
              ? "LOADING BATMAN PROTOCOLS..."
              : "READY TO PROTECT GOTHAM..."}
          </p>
        </div>

        {/* Progress bar */}
        <div className="w-80 h-2 bg-gray-800 rounded-full overflow-hidden mb-4">
          <div
            className="h-full bg-gradient-to-r from-yellow-400 to-orange-500 transition-all duration-300 ease-out shadow-lg"
            style={{ width: `${loadingProgress}%` }}
          >
            <div className="h-full bg-gradient-to-r from-transparent to-white opacity-30 animate-pulse"></div>
          </div>
        </div>

        <div className="text-yellow-400 font-mono text-lg font-bold">
          {Math.round(loadingProgress)}%
        </div>

        {/* Floating particles */}
        <div className="absolute inset-0 pointer-events-none">
          {[...Array(20)].map((_, i) => (
            <div
              key={i}
              className="absolute w-1 h-1 bg-yellow-400 rounded-full animate-pulse opacity-30"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 3}s`,
                animationDuration: `${2 + Math.random() * 3}s`,
              }}
            ></div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-gray-200 font-sans overflow-x-hidden">
      {/* Floating background elements */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-20 right-20 w-96 h-96 bg-yellow-500 rounded-full mix-blend-multiply filter blur-3xl opacity-5 animate-pulse"></div>
        <div className="absolute bottom-40 left-20 w-80 h-80 bg-purple-600 rounded-full mix-blend-multiply filter blur-3xl opacity-5 animate-pulse animation-delay-2000"></div>
        <div className="absolute top-1/2 left-1/2 w-64 h-64 bg-blue-600 rounded-full mix-blend-multiply filter blur-3xl opacity-5 animate-pulse animation-delay-4000"></div>
      </div>

      {/* Hero Section */}
      <section
        className="relative h-screen flex items-center justify-center overflow-hidden"
        onMouseMove={handleMouseMove}
      >
        {/* Dynamic background with spotlight effect */}
        <div
          className="absolute inset-0 transition-all duration-300"
          style={{
            background: `
              radial-gradient(circle at ${mousePos.x}px ${mousePos.y}px, 
                rgba(255, 193, 7, 0.1) 0%, 
                rgba(138, 43, 226, 0.05) 30%, 
                transparent 60%),
              linear-gradient(45deg, 
                rgba(0, 0, 0, 0.9) 0%, 
                rgba(30, 30, 30, 0.8) 50%, 
                rgba(0, 0, 0, 0.9) 100%)
            `,
          }}
        />

        {/* Animated grid overlay */}
        <div
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage: `
              linear-gradient(rgba(255, 193, 7, 0.1) 1px, transparent 1px),
              linear-gradient(90deg, rgba(255, 193, 7, 0.1) 1px, transparent 1px)
            `,
            backgroundSize: "50px 50px",
            animation: "grid-move 20s linear infinite",
          }}
        />

        {/* Content */}
        <div className="relative z-10 max-w-6xl text-center px-6">
          {/* Main title with multiple effects */}
          <div className="relative mb-8">
            <h1 className="text-7xl md:text-9xl font-black mb-6 relative">
              <span className="absolute inset-0 bg-gradient-to-r from-yellow-400 via-orange-500 to-red-500 bg-clip-text text-transparent blur-sm">
                DARK KNIGHT'S
              </span>
              <span className="relative bg-gradient-to-r from-yellow-400 via-orange-500 to-red-500 bg-clip-text text-transparent animate-pulse">
                DARK KNIGHT'S
              </span>
            </h1>
            <h1 className="text-7xl md:text-9xl font-black relative">
              <span className="absolute inset-0 bg-gradient-to-r from-purple-400 via-pink-500 to-blue-500 bg-clip-text text-transparent blur-sm">
                DOMAIN
              </span>
              <span className="relative bg-gradient-to-r from-purple-400 via-pink-500 to-blue-500 bg-clip-text text-transparent animate-pulse">
                DOMAIN
              </span>
            </h1>
          </div>

          {/* Subtitle with glitch effect */}
          <div className="relative mb-12">
            <p className="text-3xl md:text-4xl font-light tracking-[0.5em] uppercase text-gray-400 mb-4 font-mono">
              JUSTICE • VENGEANCE • SHADOWS
            </p>
            <div className="flex justify-center items-center gap-4 text-yellow-400">
              <Moon className="h-6 w-6 animate-pulse" />
              <span className="text-lg font-mono">GOTHAM AWAITS</span>
              <Eye className="h-6 w-6 animate-pulse" />
            </div>
          </div>

          {/* CTA Buttons with enhanced styling */}
          <div className="flex flex-col sm:flex-row justify-center gap-8">
            <Link
              to="/products"
              className="group relative px-12 py-4 text-xl font-bold text-black bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full shadow-2xl hover:scale-110 transform transition-all duration-300 overflow-hidden"
            >
              <span className="absolute inset-0 bg-gradient-to-r from-yellow-400 to-orange-500 blur opacity-50 group-hover:opacity-75 transition-opacity"></span>
              <span className="relative flex items-center gap-3">
                <Zap className="h-6 w-6" />
                ENTER THE DOMAIN
                <Zap className="h-6 w-6" />
              </span>
            </Link>

            <Link
              to="/products"
              className="group relative px-12 py-4 text-xl font-bold text-yellow-400 border-2 border-yellow-400 rounded-full hover:bg-yellow-400/10 hover:scale-110 transform transition-all duration-300 overflow-hidden"
            >
              <span className="absolute inset-0 bg-yellow-400 opacity-0 group-hover:opacity-10 transition-opacity"></span>
              <span className="relative flex items-center gap-3">
                <Eye className="h-6 w-6" />
                BROWSE ARSENAL
              </span>
            </Link>
          </div>
        </div>

        {/* Floating Batman symbols */}
        <div className="absolute inset-0 pointer-events-none">
          {[...Array(6)].map((_, i) => (
            <div
              key={i}
              className="absolute text-yellow-400 text-6xl opacity-5 animate-pulse"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 5}s`,
                animationDuration: `${3 + Math.random() * 4}s`,
              }}
            >
              🦇
            </div>
          ))}
        </div>
      </section>

      {/* Features Section */}
      <section className="py-32 bg-gradient-to-b from-black via-gray-900 to-black relative">
        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <div className="text-center mb-20">
            <h2 className="text-5xl md:text-6xl font-black text-center mb-8">
              <span className="bg-gradient-to-r from-yellow-400 to-orange-500 bg-clip-text text-transparent">
                WHY CHOOSE
              </span>
              <br />
              <span className="bg-gradient-to-r from-purple-400 to-pink-500 bg-clip-text text-transparent">
                THE DOMAIN?
              </span>
            </h2>
            <div className="w-32 h-1 bg-gradient-to-r from-yellow-400 to-orange-500 mx-auto"></div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            {[
              {
                icon: <ShoppingBag className="h-16 w-16 text-yellow-400" />,
                title: "LEGENDARY ARSENAL",
                desc: "Thousands of gadgets and gear across Gotham's finest collections.",
                gradient: "from-yellow-400 to-orange-500",
              },
              {
                icon: <Truck className="h-16 w-16 text-purple-400" />,
                title: "BATMOBILE DELIVERY",
                desc: "Lightning-fast delivery across all of Gotham City and beyond.",
                gradient: "from-purple-400 to-pink-500",
              },
              {
                icon: <Shield className="h-16 w-16 text-blue-400" />,
                title: "WAYNE SECURITY",
                desc: "Your identity and transactions protected by Wayne Tech encryption.",
                gradient: "from-blue-400 to-cyan-500",
              },
            ].map(({ icon, title, desc, gradient }) => (
              <div
                key={title}
                className="group relative bg-gray-900/50 backdrop-blur-sm rounded-2xl p-10 border border-gray-800 hover:border-yellow-400/50 transition-all duration-500 hover:scale-105 hover:-translate-y-2"
              >
                {/* Glow effect */}
                <div
                  className={`absolute inset-0 bg-gradient-to-r ${gradient} rounded-2xl blur opacity-0 group-hover:opacity-20 transition-opacity duration-500`}
                ></div>

                <div className="relative z-10 flex flex-col items-center text-center">
                  <div className="mb-8 p-4 rounded-full bg-gray-800 group-hover:bg-gray-700 transition-colors">
                    {icon}
                  </div>
                  <h3
                    className={`text-2xl font-bold mb-4 bg-gradient-to-r ${gradient} bg-clip-text text-transparent`}
                  >
                    {title}
                  </h3>
                  <p className="text-gray-400 max-w-xs leading-relaxed">
                    {desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-32 bg-gradient-to-b from-black via-gray-900 to-black relative">
        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <div className="flex flex-col md:flex-row justify-between items-center mb-16">
            <div>
              <h2 className="text-4xl md:text-5xl font-black mb-4">
                <span className="bg-gradient-to-r from-yellow-400 to-orange-500 bg-clip-text text-transparent">
                  FEATURED
                </span>
                <br />
                <span className="bg-gradient-to-r from-purple-400 to-pink-500 bg-clip-text text-transparent">
                  EQUIPMENT
                </span>
              </h2>
              <div className="w-24 h-1 bg-gradient-to-r from-yellow-400 to-orange-500"></div>
            </div>

            <Link
              to="/products"
              className="mt-8 md:mt-0 group px-8 py-3 border-2 border-yellow-400 text-yellow-400 rounded-full hover:bg-yellow-400/10 transition-all duration-300"
            >
              <span className="flex items-center gap-2">
                VIEW ALL GEAR
                <Star className="h-5 w-5 group-hover:rotate-180 transition-transform duration-300" />
              </span>
            </Link>
          </div>

          {isLoading && (
            <div className="flex justify-center py-16">
              <LoadingSpinner size="lg" />
            </div>
          )}

          {error && (
            <div className="text-center py-16">
              <p className="text-red-500 text-xl">
                System malfunction detected. Unable to load equipment.
              </p>
            </div>
          )}

          {/* {featuredProducts && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {featuredProducts.map((product, index) => (
                <div key={product._id} className="group relative">
                  <div className="absolute inset-0 bg-gradient-to-r from-yellow-400/20 to-purple-400/20 rounded-2xl blur opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                  <ProductCard
                    product={product}
                    className="relative bg-gray-900/80 backdrop-blur-sm border border-gray-800 group-hover:border-yellow-400/50 shadow-xl hover:shadow-2xl hover:shadow-yellow-400/20"
                  />
                </div>
              ))}
            </div>
          )} */}
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative py-32 overflow-hidden">
        {/* Background with moving elements */}
        <div className="absolute inset-0 bg-gradient-to-r from-yellow-500/10 via-purple-600/10 to-blue-600/10"></div>
        <div className="absolute inset-0">
          <div className="absolute top-20 left-20 w-64 h-64 bg-yellow-400 rounded-full opacity-5 animate-pulse"></div>
          <div className="absolute bottom-20 right-20 w-80 h-80 bg-purple-600 rounded-full opacity-5 animate-pulse animation-delay-1000"></div>
        </div>

        <div className="relative z-10 max-w-4xl mx-auto px-6 text-center">
          <h2 className="text-5xl md:text-7xl font-black mb-8">
            <span className="bg-gradient-to-r from-yellow-400 via-orange-500 to-red-500 bg-clip-text text-transparent">
              JOIN THE
            </span>
            <br />
            <span className="bg-gradient-to-r from-purple-400 via-pink-500 to-blue-500 bg-clip-text text-transparent">
              DARK SIDE
            </span>
          </h2>

          <p className="text-2xl md:text-3xl text-gray-400 mb-12 max-w-2xl mx-auto leading-relaxed font-light">
            Become a guardian of Gotham. Join thousands who have embraced the
            shadows.
          </p>

          <button
            onClick={() => becomeMember()}
            className="group relative inline-flex items-center gap-4 px-16 py-6 text-2xl font-bold text-black bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full shadow-2xl hover:scale-110 transform transition-all duration-500 overflow-hidden"
          >
            <span className="absolute inset-0 bg-gradient-to-r from-yellow-400 to-orange-500 blur-lg opacity-50 group-hover:opacity-100 transition-opacity"></span>
            <span className="relative flex items-center gap-4">
              <Moon className="h-8 w-8 group-hover:rotate-180 transition-transform duration-500" />
              BECOME A KNIGHT
              <Zap className="h-8 w-8 group-hover:animate-bounce" />
            </span>
          </button>
        </div>
      </section>

      <style jsx>{`
        @keyframes grid-move {
          0% {
            transform: translate(0, 0);
          }
          100% {
            transform: translate(50px, 50px);
          }
        }
        .animation-delay-1000 {
          animation-delay: 1s;
        }
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        .animation-delay-4000 {
          animation-delay: 4s;
        }
      `}</style>
    </div>
  );
};

export default Home;
