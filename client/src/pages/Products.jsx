import { useState } from "react";
import {
  Search,
  Filter,
  Grid3X3,
  List,
  Eye,
  Zap,
  Shield,
  Star,
  ChevronLeft,
  ChevronRight,
  Sword,
  Target,
} from "lucide-react";

// Mock components and hooks
const LoadingSpinner = ({ size }) => (
  <div
    className={`animate-spin rounded-full border-4 border-yellow-400 border-t-transparent ${
      size === "lg" ? "h-16 w-16" : "h-8 w-8"
    }`}
  ></div>
);

const ProductCard = ({ product, className, viewMode }) => (
  <div
    className={`group relative bg-gray-900/60 backdrop-blur-sm border border-gray-800 rounded-xl overflow-hidden hover:border-yellow-400/50 transition-all duration-500 hover:scale-105 hover:-translate-y-2 ${className}`}
  >
    {/* Glow effect */}
    <div className="absolute inset-0 bg-gradient-to-r from-yellow-400/10 to-purple-400/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

    <div className="relative z-10 p-6">
      <div className="bg-gray-800 h-48 rounded-lg mb-4 flex items-center justify-center relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-yellow-400/10 to-purple-400/10 opacity-0 group-hover:opacity-100 transition-opacity"></div>
        <span className="text-gray-500 text-lg font-mono">CLASSIFIED</span>
        <div className="absolute top-2 right-2 bg-yellow-400 text-black text-xs px-2 py-1 rounded-full font-bold">
          {product.category?.toUpperCase() || "GEAR"}
        </div>
      </div>

      <div className="space-y-3">
        <h3 className="text-lg font-bold text-white group-hover:text-yellow-400 transition-colors">
          {product.name}
        </h3>

        <div className="flex items-center justify-between">
          <span className="text-2xl font-black bg-gradient-to-r from-yellow-400 to-orange-500 bg-clip-text text-transparent">
            ${product.price}
          </span>
          <div className="flex items-center gap-1">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                className={`h-4 w-4 ${
                  i < (product.rating || 4)
                    ? "text-yellow-400 fill-yellow-400"
                    : "text-gray-600"
                }`}
              />
            ))}
          </div>
        </div>

        <button className="w-full bg-gradient-to-r from-gray-800 to-gray-700 hover:from-yellow-400/20 hover:to-orange-500/20 text-white py-3 rounded-lg font-bold transition-all duration-300 border border-gray-700 hover:border-yellow-400/50">
          <span className="flex items-center justify-center gap-2">
            <Target className="h-4 w-4" />
            ACQUIRE GEAR
          </span>
        </button>
      </div>
    </div>
  </div>
);

// Mock hook
const useProducts = (filters) => ({
  data: {
    products: [
      {
        _id: 1,
        name: "Batman Tactical Cowl",
        price: 599,
        category: "armor",
        rating: 5,
      },
      {
        _id: 2,
        name: "Utility Belt Pro",
        price: 299,
        category: "gear",
        rating: 5,
      },
      {
        _id: 3,
        name: "Grappling Hook System",
        price: 899,
        category: "gadgets",
        rating: 4,
      },
      {
        _id: 4,
        name: "Batmobile Remote",
        price: 199,
        category: "vehicles",
        rating: 4,
      },
      {
        _id: 5,
        name: "Night Vision Goggles",
        price: 449,
        category: "gear",
        rating: 5,
      },
      {
        _id: 6,
        name: "Smoke Pellets (12-Pack)",
        price: 89,
        category: "gadgets",
        rating: 4,
      },
      { _id: 7, name: "Kevlar Cape", price: 799, category: "armor", rating: 5 },
      {
        _id: 8,
        name: "Batarang Set",
        price: 149,
        category: "weapons",
        rating: 4,
      },
      {
        _id: 9,
        name: "Wayne Tech Tablet",
        price: 1299,
        category: "tech",
        rating: 5,
      },
    ],
    pagination: {
      currentPage: 1,
      totalPages: 3,
      totalProducts: 27,
      hasPrev: false,
      hasNext: true,
    },
  },
  isLoading: false,
  error: null,
});

const Products = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [viewMode, setViewMode] = useState("grid");
  const [filters, setFilters] = useState({
    search: "",
    category: "all",
    sort: "default",
    minPrice: "",
    maxPrice: "",
  });

  const {
    data: productsData,
    isLoading,
    error,
  } = useProducts({
    ...filters,
    page: currentPage,
    limit: 12,
  });

  const products = productsData?.products || [];
  const pagination = productsData?.pagination || {};

  const handleFilterChange = (key, value) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);
    setCurrentPage(1);
  };

  const categories = [
    { value: "all", label: "All Equipment", icon: "🦇" },
    { value: "armor", label: "Armor & Protection", icon: "🛡️" },
    { value: "gadgets", label: "Gadgets & Tools", icon: "⚡" },
    { value: "weapons", label: "Combat Gear", icon: "⚔️" },
    { value: "vehicles", label: "Vehicle Tech", icon: "🚗" },
    { value: "tech", label: "Wayne Tech", icon: "💻" },
  ];

  const sortOptions = [
    { value: "default", label: "Default Order" },
    { value: "price_low", label: "Price: Low to High" },
    { value: "price_high", label: "Price: High to Low" },
    { value: "rating", label: "Highest Rated" },
    { value: "newest", label: "Newest Arrivals" },
  ];

  return (
    <div className="min-h-screen bg-black text-white relative overflow-hidden">
      {/* Background effects */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-20 right-20 w-96 h-96 bg-yellow-500 rounded-full mix-blend-multiply filter blur-3xl opacity-5 animate-pulse"></div>
        <div className="absolute bottom-20 left-20 w-80 h-80 bg-purple-600 rounded-full mix-blend-multiply filter blur-3xl opacity-5 animate-pulse animation-delay-1000"></div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Filters Sidebar */}
          <div className="lg:w-1/4">
            <div className="sticky top-32">
              {/* Filter Header */}
              <div className="bg-gray-900/80 backdrop-blur-sm border border-gray-800 rounded-2xl p-6 mb-6">
                <div className="flex items-center gap-3 mb-6">
                  <div className="p-2 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-lg">
                    <Filter className="h-5 w-5 text-black" />
                  </div>
                  <h3 className="text-xl font-black bg-gradient-to-r from-yellow-400 to-orange-500 bg-clip-text text-transparent">
                    FILTER ARSENAL
                  </h3>
                </div>

                <div className="space-y-6">
                  {/* Search */}
                  <div>
                    <label className="block text-sm font-bold text-gray-400 mb-3 uppercase tracking-wider">
                      Search Database
                    </label>
                    <div className="relative group">
                      <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-500 h-5 w-5 z-10" />
                      <input
                        type="text"
                        placeholder="Search equipment..."
                        value={filters.search}
                        onChange={(e) =>
                          handleFilterChange("search", e.target.value)
                        }
                        className="w-full pl-12 pr-4 py-3 bg-gray-800/60 backdrop-blur-sm border border-gray-700 rounded-full text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent transition-all duration-300"
                      />
                    </div>
                  </div>

                  {/* Category */}
                  <div>
                    <label className="block text-sm font-bold text-gray-400 mb-3 uppercase tracking-wider">
                      Equipment Category
                    </label>
                    <div className="space-y-2">
                      {categories.map((category) => (
                        <button
                          key={category.value}
                          onClick={() =>
                            handleFilterChange("category", category.value)
                          }
                          className={`w-full text-left p-3 rounded-lg transition-all duration-300 flex items-center gap-3 ${
                            filters.category === category.value
                              ? "bg-gradient-to-r from-yellow-400/20 to-orange-500/20 border border-yellow-400/50 text-yellow-400"
                              : "bg-gray-800/40 border border-gray-700/50 text-gray-400 hover:bg-gray-700/40 hover:text-white"
                          }`}
                        >
                          <span className="text-lg">{category.icon}</span>
                          <span className="font-medium">{category.label}</span>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Sort */}
                  <div>
                    <label className="block text-sm font-bold text-gray-400 mb-3 uppercase tracking-wider">
                      Sort Protocol
                    </label>
                    <select
                      value={filters.sort}
                      onChange={(e) =>
                        handleFilterChange("sort", e.target.value)
                      }
                      className="w-full px-4 py-3 bg-gray-800/60 backdrop-blur-sm border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent transition-all duration-300"
                    >
                      {sortOptions.map((option) => (
                        <option
                          key={option.value}
                          value={option.value}
                          className="bg-gray-800"
                        >
                          {option.label}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Price Range */}
                  <div>
                    <label className="block text-sm font-bold text-gray-400 mb-3 uppercase tracking-wider">
                      Price Range ($)
                    </label>
                    <div className="grid grid-cols-2 gap-3">
                      <input
                        type="number"
                        placeholder="Min"
                        value={filters.minPrice}
                        onChange={(e) =>
                          handleFilterChange("minPrice", e.target.value)
                        }
                        className="px-4 py-3 bg-gray-800/60 backdrop-blur-sm border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent transition-all duration-300"
                      />
                      <input
                        type="number"
                        placeholder="Max"
                        value={filters.maxPrice}
                        onChange={(e) =>
                          handleFilterChange("maxPrice", e.target.value)
                        }
                        className="px-4 py-3 bg-gray-800/60 backdrop-blur-sm border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent transition-all duration-300"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Products Grid */}
          <div className="lg:w-3/4">
            {/* Header */}
            <div className="bg-gray-900/80 backdrop-blur-sm border border-gray-800 rounded-2xl p-6 mb-8">
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                  <h1 className="text-4xl font-black mb-2">
                    <span className="bg-gradient-to-r from-yellow-400 to-orange-500 bg-clip-text text-transparent">
                      BATMAN'S
                    </span>
                    <span className="bg-gradient-to-r from-purple-400 to-pink-500 bg-clip-text text-transparent ml-3">
                      ARSENAL
                    </span>
                  </h1>
                  <p className="text-gray-400 flex items-center gap-2">
                    <Shield className="h-4 w-4" />
                    {pagination.totalProducts || 0} pieces of equipment
                    available
                  </p>
                </div>

                <div className="flex items-center gap-3">
                  <span className="text-sm text-gray-400 font-mono">VIEW:</span>
                  <div className="flex bg-gray-800/60 rounded-lg p-1">
                    <button
                      onClick={() => setViewMode("grid")}
                      className={`p-2 rounded transition-all duration-300 ${
                        viewMode === "grid"
                          ? "bg-yellow-400 text-black"
                          : "text-gray-400 hover:text-white"
                      }`}
                    >
                      <Grid3X3 className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => setViewMode("list")}
                      className={`p-2 rounded transition-all duration-300 ${
                        viewMode === "list"
                          ? "bg-yellow-400 text-black"
                          : "text-gray-400 hover:text-white"
                      }`}
                    >
                      <List className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Loading State */}
            {isLoading && (
              <div className="flex flex-col items-center justify-center py-20">
                <LoadingSpinner size="lg" />
                <p className="text-yellow-400 font-mono mt-4 animate-pulse">
                  SCANNING ARMORY DATABASE...
                </p>
              </div>
            )}

            {/* Error State */}
            {error && (
              <div className="text-center py-20">
                <div className="bg-red-900/20 border border-red-500/50 rounded-xl p-8 max-w-md mx-auto">
                  <Zap className="h-12 w-12 text-red-400 mx-auto mb-4" />
                  <p className="text-red-400 text-xl font-bold">
                    SYSTEM BREACH DETECTED
                  </p>
                  <p className="text-gray-400 mt-2">
                    Unable to access equipment database
                  </p>
                </div>
              </div>
            )}

            {/* No Products */}
            {products.length === 0 && !isLoading && (
              <div className="text-center py-20">
                <div className="bg-gray-900/60 border border-gray-700 rounded-xl p-8 max-w-md mx-auto">
                  <Eye className="h-12 w-12 text-gray-500 mx-auto mb-4" />
                  <p className="text-gray-400 text-xl font-bold">
                    NO EQUIPMENT FOUND
                  </p>
                  <p className="text-gray-500 mt-2">
                    No gear matches your search criteria
                  </p>
                </div>
              </div>
            )}

            {/* Products Grid */}
            {products.length > 0 && (
              <>
                <div
                  className={`grid gap-6 ${
                    viewMode === "grid"
                      ? "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3"
                      : "grid-cols-1"
                  }`}
                >
                  {products.map((product) => (
                    <ProductCard
                      key={product._id}
                      product={product}
                      viewMode={viewMode}
                    />
                  ))}
                </div>

                {/* Pagination */}
                {pagination.totalPages > 1 && (
                  <div className="mt-12 bg-gray-900/80 backdrop-blur-sm border border-gray-800 rounded-2xl p-6">
                    <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
                      <button
                        onClick={() => setCurrentPage(currentPage - 1)}
                        disabled={!pagination.hasPrev}
                        className="group flex items-center gap-2 px-6 py-3 bg-gray-800/60 hover:bg-yellow-400/20 border border-gray-700 hover:border-yellow-400/50 rounded-lg text-white disabled:opacity-50 disabled:hover:bg-gray-800/60 disabled:hover:border-gray-700 transition-all duration-300"
                      >
                        <ChevronLeft className="h-4 w-4" />
                        <span className="font-mono">PREVIOUS</span>
                      </button>

                      <div className="flex items-center gap-4">
                        <span className="text-gray-400 font-mono">
                          PAGE {pagination.currentPage} OF{" "}
                          {pagination.totalPages}
                        </span>
                        <div className="flex gap-2">
                          {[...Array(Math.min(pagination.totalPages, 5))].map(
                            (_, i) => {
                              const pageNum = i + 1;
                              return (
                                <button
                                  key={pageNum}
                                  onClick={() => setCurrentPage(pageNum)}
                                  className={`w-10 h-10 rounded-lg font-mono transition-all duration-300 ${
                                    pageNum === pagination.currentPage
                                      ? "bg-yellow-400 text-black"
                                      : "bg-gray-800/60 text-gray-400 hover:bg-gray-700/60 hover:text-white"
                                  }`}
                                >
                                  {pageNum}
                                </button>
                              );
                            }
                          )}
                        </div>
                      </div>

                      <button
                        onClick={() => setCurrentPage(currentPage + 1)}
                        disabled={!pagination.hasNext}
                        className="group flex items-center gap-2 px-6 py-3 bg-gray-800/60 hover:bg-yellow-400/20 border border-gray-700 hover:border-yellow-400/50 rounded-lg text-white disabled:opacity-50 disabled:hover:bg-gray-800/60 disabled:hover:border-gray-700 transition-all duration-300"
                      >
                        <span className="font-mono">NEXT</span>
                        <ChevronRight className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                )}
              </>
            )}
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

export default Products;
