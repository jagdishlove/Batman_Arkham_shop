import { ShoppingBag, Truck, Shield, Zap, Eye, Moon, Star } from "lucide-react";
import { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import useAuthStore from "../store/authStore";
import { batmanToast } from "@/utils/toast";
import "@/styles/home.css";
import { QUERY_KEYS } from "@/constants/queryKeys";
import { get } from "@/lib/http";
import { useStandardQuery } from "@/lib/useStandardQuery";

const LoadingSpinner = ({ size }) => (
  <div
    role="status"
    aria-live="polite"
    aria-label="Loading"
    className={`animate-spin rounded-full border-4 border-purple-400 border-t-transparent ${
      size === "lg" ? "h-16 w-16" : "h-8 w-8"
    }`}
  ></div>
);

const ProductCard = ({ product, className }) => {
  return (
    <div
      className={`relative p-6 flex flex-col justify-center rounded-2xl shadow-lg border border-gray-800 bg-gray-900/80 backdrop-blur-sm
      hover:scale-105 hover:shadow-yellow-400/50 transform transition duration-300 ${className}`}
    >
      <div className="bg-gray-800 h-48 rounded-lg mb-4 overflow-hidden">
        {product?.images?.length > 0 ? (
          <img
            src={product.images[0].url}
            alt={product.images[0].alt || product.name}
            className="w-full h-full object-cover hover:scale-110 transition-transform duration-300"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <span className="text-gray-400 select-none">
              No Image Available
            </span>
          </div>
        )}
      </div>
      <div className="space-y-2">
        <div className="flex items-start justify-between">
          <h3 className="text-lg font-bold text-white flex-1">
            {product.name}
          </h3>
          {product.category && (
            <span className="text-xs bg-gray-800 text-gray-400 px-2 py-1 rounded-full">
              {product.category}
            </span>
          )}
        </div>
        <div className="flex justify-between items-center">
          <p className="text-yellow-400 font-bold">${product.price}</p>
          {product.originalPrice && (
            <p className="text-gray-500 line-through text-sm">
              ${product.originalPrice}
            </p>
          )}
        </div>
        <div className="flex items-center justify-between">
          {product.rating && (
            <div className="flex items-center gap-2">
              <Star className="h-4 w-4 text-yellow-400 fill-current" />
              <span className="text-gray-400 text-sm">
                {product.rating.rate} ({product.rating.count})
              </span>
            </div>
          )}
          {product.inStock ? (
            <span className="text-xs text-green-400">In Stock</span>
          ) : (
            <span className="text-xs text-red-400">Out of Stock</span>
          )}
        </div>
        {product.brand && (
          <div className="pt-2 border-t border-gray-800">
            <span className="text-xs text-gray-500">{product.brand}</span>
          </div>
        )}
      </div>
    </div>
  );
};

const Home = () => {
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [isLoaded, setIsLoaded] = useState(false);
  const [loadingProgress, setLoadingProgress] = useState(0);

  const { isAuthenticated } = useAuthStore();
  const navigate = useNavigate();

  // New cursor states
  const [cursorPosition, setCursorPosition] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);
  const [introScreen, setIntroScreen] = useState(
    sessionStorage.getItem("introScreen") === "true"
  );

  const getProduct = () => get("/products");

  const {
    data: products,
    isLoading,
    error,
  } = useStandardQuery(QUERY_KEYS.PRODUCTS.all, getProduct, {
    errorMsg: "Failed to fetch products",
  });

  // Smooth mouse position for spotlight with easing
  const mousePosRef = useRef({ x: 0, y: 0 });
  useEffect(() => {
    const lerp = (start, end, amt) => start + (end - start) * amt;

    let animationFrameId;
    const animate = () => {
      setMousePos((pos) => {
        const newX = lerp(pos.x, mousePosRef.current.x, 0.15);
        const newY = lerp(pos.y, mousePosRef.current.y, 0.15);
        return { x: newX, y: newY };
      });
      animationFrameId = requestAnimationFrame(animate);
    };
    animate();
    return () => cancelAnimationFrame(animationFrameId);
  }, []);

  const becomeMember = () => {
    if (isAuthenticated) {
      batmanToast.success("You are already a Knight of Gotham!");
    } else {
      navigate("/signup");
    }
  };

  const handleMouseMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    mousePosRef.current = {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    };

    // Update cursor position
    setCursorPosition({ x: e.clientX, y: e.clientY });
  };

  useEffect(() => {
    sessionStorage.setItem("introScreen", "true");
    // Simulate loading progress
    const progressInterval = setInterval(() => {
      setLoadingProgress((prev) => {
        if (prev >= 100) {
          clearInterval(progressInterval);
          setTimeout(() => setIsLoaded(true), 500);
          return 100;
        }
        return Math.min(100, prev + Math.random() * 15);
      });
    }, 200);

    return () => clearInterval(progressInterval);
  }, []);

  // Update cursor position on mouse move
  useEffect(() => {
    const updateCursor = (e) => {
      setCursorPosition({ x: e.clientX, y: e.clientY });
    };

    window.addEventListener("mousemove", updateCursor);
    return () => window.removeEventListener("mousemove", updateCursor);
  }, []);

  const handleProductClick = (productId) => {
    if (!isAuthenticated) {
      batmanToast.error("Please login to view product details");
      navigate("/login");
      return;
    }
    navigate(`/products/${productId}`);
  };

  const handleViewAllProducts = (e) => {
    e.preventDefault();
    if (!isAuthenticated) {
      batmanToast.error("Please login to access the arsenal");
      navigate("/login");
      return;
    }
    navigate("/products");
  };

  if (!isLoaded && !introScreen) {
    return (
      <main
        className="fixed inset-0 bg-black flex flex-col items-center justify-center z-50 overflow-hidden"
        aria-label="Loading screen"
      >
        {/* Animated background */}
        <div className="absolute inset-0" aria-hidden="true">
          <div className="absolute top-20 left-20 w-32 h-32 bg-yellow-500 rounded-full opacity-10 animate-pulse"></div>
          <div className="absolute bottom-40 right-32 w-48 h-48 bg-purple-600 rounded-full opacity-10 animate-pulse animation-delay-1000"></div>
          <div className="absolute top-1/2 left-1/4 w-24 h-24 bg-blue-500 rounded-full opacity-10 animate-pulse animation-delay-2000"></div>
        </div>

        {/* Bat signal effect */}
        <div className="relative mb-12" aria-hidden="true">
          <div className="absolute inset-0 bg-yellow-400 rounded-full blur-3xl opacity-20 animate-pulse"></div>
          <div className="relative bg-gradient-to-r from-yellow-400 to-orange-500 p-8 rounded-full shadow-2xl">
            <div className="relative">
              <div className="w-24 h-24 bg-black rounded-full flex items-center justify-center">
                <div className="text-yellow-400 text-4xl font-bold select-none">
                  🦇
                </div>
              </div>
              <div className="absolute inset-0 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full animate-ping opacity-20"></div>
            </div>
          </div>
        </div>

        {/* Loading text with typewriter effect */}
        <div className="text-center mb-8">
          <h1
            className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-yellow-400 via-orange-500 to-red-500 bg-clip-text text-transparent mb-4 animate-pulse"
            aria-live="polite"
          >
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
        <div
          className="w-80 h-2 bg-gray-800 rounded-full overflow-hidden mb-4"
          aria-hidden="true"
        >
          <div
            className="h-full bg-gradient-to-r from-yellow-400 to-orange-500 transition-all duration-300 ease-out shadow-lg relative"
            style={{ width: `${loadingProgress}%` }}
          >
            <div className="h-full bg-gradient-to-r from-transparent to-white opacity-30 animate-pulse"></div>
          </div>
        </div>

        <div
          className="text-yellow-400 font-mono text-lg font-bold"
          aria-live="polite"
        >
          {Math.round(loadingProgress)}%
        </div>

        {/* Floating particles */}
        <div
          className="absolute inset-0 pointer-events-none"
          aria-hidden="true"
        >
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
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-black text-gray-200 font-sans overflow-x-hidden">
      {/* Custom Cursor */}
      {isHovered && (
        <div
          className="custom-cursor"
          style={{
            left: cursorPosition.x,
            top: cursorPosition.y,
          }}
        >
          <span className="text-yellow-400 text-2xl" style={{ lineHeight: 0 }}>
            🦇
          </span>
        </div>
      )}

      {/* Update your Hero section */}
      <section
        className={`relative h-screen flex items-center justify-center overflow-hidden ${
          isHovered ? "bat-cursor" : ""
        }`}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        onMouseMove={handleMouseMove}
        aria-label="Hero section"
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
          aria-hidden="true"
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
          aria-hidden="true"
        />

        {/* Content */}
        <div className="relative z-10 max-w-6xl text-center px-6">
          {/* Main title with optimized single text and glow effect */}
          <div className="relative mb-8">
            <h1
              className="text-7xl md:text-9xl font-black mb-6 relative
                bg-gradient-to-r from-yellow-400 via-orange-500 to-red-500 bg-clip-text text-transparent
                text-shadow-glow"
              tabIndex={0}
            >
              DARK KNIGHT'S
            </h1>
            <h1
              className="text-7xl md:text-9xl font-black relative
                bg-gradient-to-r from-purple-400 via-pink-500 to-blue-500 bg-clip-text text-transparent
                text-shadow-glow"
              tabIndex={0}
            >
              DOMAIN
            </h1>
          </div>

          {/* Subtitle with glitch effect */}
          <div className="relative mb-12">
            <p
              className="text-3xl md:text-4xl font-light tracking-[0.5em] uppercase text-gray-400 mb-4 font-mono"
              tabIndex={0}
            >
              JUSTICE • VENGEANCE • SHADOWS
            </p>
            <div
              className="flex justify-center items-center gap-4 text-yellow-400"
              aria-hidden="true"
            >
              <Moon className="h-6 w-6 animate-pulse" />
              <span className="text-lg font-mono select-none">
                GOTHAM AWAITS
              </span>
              <Eye className="h-6 w-6 animate-pulse" />
            </div>
          </div>

          {/* CTA Buttons with enhanced styling and focus states */}
          <div className="flex flex-col sm:flex-row justify-center gap-8">
            <Link
              to="/products"
              className="group relative px-12 py-4 text-xl font-bold text-yellow-400 border-2 border-yellow-400 rounded-full
                hover:bg-yellow-400/10 hover:scale-110 transform transition-all duration-300 overflow-hidden
                focus:outline-none focus:ring-4 focus:ring-yellow-400 focus:ring-opacity-50 bat-cursor"
              onMouseEnter={() => {
                const cursor = document.querySelector(".custom-cursor");
                if (cursor) cursor.classList.add("hover");
              }}
              onMouseLeave={() => {
                const cursor = document.querySelector(".custom-cursor");
                if (cursor) cursor.classList.remove("hover");
              }}
            >
              <span className="absolute inset-0 bg-yellow-400 opacity-0 group-hover:opacity-10 transition-opacity"></span>
              <span className="relative flex items-center gap-3 select-none">
                <Eye className="h-6 w-6" />
                BROWSE ARSENAL
              </span>
            </Link>
          </div>
        </div>

        {/* Floating Batman symbols */}
        <div
          className="absolute inset-0 pointer-events-none"
          aria-hidden="true"
        >
          {[...Array(6)].map((_, i) => (
            <div
              key={i}
              className="absolute text-yellow-400 text-6xl opacity-5 animate-pulse select-none"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 5}s`,
                animationDuration: `${3 + Math.random() * 4}s`,
                transform: `rotate(${Math.random() * 360}deg) scale(${
                  0.8 + Math.random() * 0.4
                })`,
              }}
            >
              🦇
            </div>
          ))}
        </div>
      </section>

      {/* Features Section */}
      <section
        className="py-32 bg-gradient-to-b from-black via-gray-900 to-black relative"
        aria-labelledby="features-title"
      >
        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <div className="text-center mb-20">
            <h2
              id="features-title"
              className="text-5xl md:text-6xl font-black text-center mb-8"
              tabIndex={0}
            >
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
                icon: (
                  <ShoppingBag
                    className="h-16 w-16 text-yellow-400"
                    aria-hidden="true"
                  />
                ),
                title: "LEGENDARY ARSENAL",
                desc: "Thousands of gadgets and gear across Gotham's finest collections.",
                gradient: "from-yellow-400 to-orange-500",
              },
              {
                icon: (
                  <Truck
                    className="h-16 w-16 text-purple-400"
                    aria-hidden="true"
                  />
                ),
                title: "BATMOBILE DELIVERY",
                desc: "Lightning-fast delivery across all of Gotham City and beyond.",
                gradient: "from-purple-400 to-pink-500",
              },
              {
                icon: (
                  <Shield
                    className="h-16 w-16 text-blue-400"
                    aria-hidden="true"
                  />
                ),
                title: "WAYNE SECURITY",
                desc: "Your identity and transactions protected by Wayne Tech encryption.",
                gradient: "from-blue-400 to-cyan-500",
              },
            ].map(({ icon, title, desc, gradient }) => (
              <article
                key={title}
                className="group relative bg-gray-900/50 backdrop-blur-sm rounded-2xl p-10 border border-gray-800 hover:border-yellow-400/50 transition-all duration-500 hover:scale-105 hover:-translate-y-2"
              >
                {/* Glow effect */}
                <div
                  className={`absolute inset-0 bg-gradient-to-r ${gradient} rounded-2xl blur opacity-0 group-hover:opacity-20 transition-opacity duration-500`}
                  aria-hidden="true"
                ></div>

                <div className="relative z-10 flex flex-col items-center text-center">
                  <div className="mb-8 p-4 rounded-full bg-gray-800 group-hover:bg-gray-700 transition-colors">
                    {icon}
                  </div>
                  <h3
                    className={`text-2xl font-bold mb-4 bg-gradient-to-r ${gradient} bg-clip-text text-transparent`}
                    tabIndex={0}
                  >
                    {title}
                  </h3>
                  <p
                    className="text-gray-400 max-w-xs leading-relaxed"
                    tabIndex={0}
                  >
                    {desc}
                  </p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section
        className="py-32 bg-gradient-to-b from-black via-gray-900 to-black relative"
        aria-labelledby="featured-products-title"
      >
        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <h2
            id="featured-products-title"
            className="text-5xl md:text-6xl font-black text-center mb-12"
            tabIndex={0}
          >
            <span className="bg-gradient-to-r from-yellow-400 to-orange-500 bg-clip-text text-transparent">
              FEATURED
            </span>{" "}
            <span className="bg-gradient-to-r from-purple-400 to-pink-500 bg-clip-text text-transparent">
              PRODUCTS
            </span>
          </h2>

          {isLoading ? (
            <div className="flex justify-center my-20">
              <LoadingSpinner size="lg" />
            </div>
          ) : error ? (
            <div className="text-center py-20">
              <p className="text-red-500 text-lg mb-4">
                Failed to load featured products.
              </p>
              <button
                onClick={() => refetch()}
                className="px-6 py-2 bg-yellow-400/10 text-yellow-400 rounded-full hover:bg-yellow-400/20 transition-colors"
              >
                Try Again
              </button>
            </div>
          ) : !products?.products?.length ? (
            <div className="text-center py-20 bg-gray-900/50 rounded-2xl border border-gray-800">
              <div className="mb-6">
                <Shield className="h-16 w-16 text-yellow-400/50 mx-auto" />
              </div>
              <h3 className="text-2xl font-bold text-gray-400 mb-2">
                No Products Available
              </h3>
              <p className="text-gray-500 max-w-md mx-auto">
                The Batcave's arsenal is currently being restocked. Check back
                later for new equipment.
              </p>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-10">
                {products?.products.slice(0, 8).map((product) => (
                  <div
                    key={product.id}
                    onClick={() => handleProductClick(product.id)}
                    className="cursor-pointer"
                  >
                    <ProductCard product={product} />
                  </div>
                ))}
              </div>

              <div className="mt-12 flex justify-center">
                <button
                  onClick={handleViewAllProducts}
                  className="px-6 py-2 bg-yellow-400/10 text-yellow-400 rounded-full hover:bg-yellow-400/20 transition-colors"
                >
                  View All Products
                </button>
              </div>
            </>
          )}
        </div>
      </section>

      {/* Become a member */}
      <section
        className="py-20 bg-gradient-to-r from-yellow-400 to-orange-500 text-black text-center"
        aria-labelledby="become-member-title"
      >
        <h2
          id="become-member-title"
          className="text-4xl md:text-5xl font-extrabold mb-6"
          tabIndex={0}
        >
          BECOME A KNIGHT OF GOTHAM
        </h2>
        <p className="mb-8 max-w-xl mx-auto font-light tracking-wide">
          Become a guardian of Gotham. Join thousands who have embraced the
          shadows.
        </p>
        <button
          onClick={becomeMember}
          className="px-10 py-4 bg-black bg-opacity-90 text-white rounded-full font-bold hover:bg-opacity-100 transition-colors focus:outline-none focus:ring-4 focus:ring-yellow-400 focus:ring-opacity-70"
          aria-label="Become a Knight of Gotham"
        >
          BECOME A KNIGHT
        </button>
      </section>

      <style>
        {`
          /* Glow text shadow */
          .text-shadow-glow {
            text-shadow:
              0 0 8px rgba(255, 193, 7, 0.8),
              0 0 15px rgba(255, 193, 7, 0.6),
              0 0 20px rgba(255, 193, 7, 0.4);
          }

          /* Grid move animation */
          @keyframes grid-move {
            0% { background-position: 0 0, 0 0; }
            100% { background-position: 50px 50px, 50px 50px; }
          }

          /* Animation delays */
          .animation-delay-1000 { animation-delay: 1s; }
          .animation-delay-2000 { animation-delay: 2s; }
          .animation-delay-4000 { animation-delay: 4s; }

          /* Reduced motion support */
          @media (prefers-reduced-motion: reduce) {
            .animate-pulse,
            .animate-spin,
            .animate-bounce,
            .animation-delay-1000,
            .animation-delay-2000,
            .animation-delay-4000 {
              animation: none !important;
            }
          }
        `}
      </style>
    </main>
  );
};

export default Home;
