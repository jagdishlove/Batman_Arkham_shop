import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { Star, ShoppingCart, ArrowLeft, Shield, Zap } from "lucide-react";
import { useNavigate } from "react-router-dom";
import useCartStore from "../store/cartStore";
import { batmanToast } from "@/utils/toast";
import { get } from "../lib/http";
import { QUERY_KEYS } from "../constants/queryKeys";
import { useStandardQuery } from "../lib/useStandardQuery";
import { formatPrice } from "../utils";

const BatmanProductDetail = () => {
  const { id: productId } = useParams();
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const navigate = useNavigate();
  const { addToCart, getAvailableStock, setInitialStock } = useCartStore();

  // Reset selected image when product changes
  useEffect(() => {
    setSelectedImage(0);
    setQuantity(1);
  }, [productId]);

  const {
    data: productData,
    isLoading,
    error,
  } = useStandardQuery(
    ["product", productId], // Unique query key per product
    () => get(`/products/${productId}`),
    {
      errorMsg: "Failed to fetch product",
      enabled: !!productId,
      refetchOnMount: true, // Force refetch on mount
      cacheTime: 0, // Don't cache the response
    }
  );

  // Safely access product data
  const product = productData?.product;

  useEffect(() => {
    if (product?.stock) {
      setInitialStock(product.id, product.stock);
    }
  }, [product?.stock, product?.id, setInitialStock]);

  const availableStock = getAvailableStock(product?.id);
  const isOutOfStock = availableStock <= 0;

  // Loading state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="animate-spin rounded-full h-16 w-16 border-4 border-yellow-400 border-t-transparent" />
      </div>
    );
  }

  // Error state
  if (error || !product) {
    return (
      <div className="min-h-screen bg-black flex flex-col items-center justify-center text-center px-4">
        <Shield className="h-16 w-16 text-red-400 mb-4" />
        <h2 className="text-2xl font-bold text-white mb-2">
          Product Not Found
        </h2>
        <p className="text-gray-400 mb-4">
          {error?.message || "This product doesn't exist in the arsenal."}
        </p>
        <button
          onClick={() => navigate("/products")}
          className="px-6 py-2 bg-yellow-400/10 text-yellow-400 rounded-full hover:bg-yellow-400/20 transition-colors"
        >
          Back to Arsenal
        </button>
      </div>
    );
  }

  const handleBack = () => {
    navigate("/products");
  };

  const handleAddToCart = () => {
    const success = addToCart(product);
    if (success) {
      batmanToast.success("Added to loadout");
    } else {
      batmanToast.error("Item out of stock");
    }
  };

  // Images safety check
  const images = product?.images || [];
  const currentImage = images[selectedImage] || images[0];

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100">
      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Back Button */}
        <button
          onClick={handleBack}
          className="flex items-center space-x-2 text-gray-400 hover:text-yellow-400 mb-8 transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          <span className="text-sm tracking-wide">BACK TO ARSENAL</span>
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Product Images */}
          <div className="space-y-6">
            <div className="aspect-square bg-gray-800 border border-gray-700 relative overflow-hidden">
              <img
                src={currentImage?.url || "/api/placeholder/500/500"}
                alt={product?.name}
                className="w-full h-full object-cover opacity-90"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-gray-900/20 to-transparent"></div>
            </div>

            {images.length > 1 && (
              <div className="flex space-x-3">
                {images.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImage(index)}
                    className={`w-20 h-20 bg-gray-800 border-2 overflow-hidden transition-colors ${
                      selectedImage === index
                        ? "border-yellow-400"
                        : "border-gray-700 hover:border-gray-600"
                    }`}
                  >
                    <img
                      src={image.url || "/api/placeholder/80/80"}
                      alt={`View ${index + 1}`}
                      className="w-full h-full object-cover opacity-80"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Product Info */}
          <div className="space-y-8">
            {/* Header */}
            <div>
              <div className="flex items-center space-x-3 mb-3">
                <Shield className="h-5 w-5 text-yellow-400" />
                <span className="text-gray-400 text-sm tracking-widest uppercase">
                  {product?.category}
                </span>
              </div>
              <h1 className="text-3xl font-light text-white mb-4 tracking-wide">
                {product?.name}
              </h1>
            </div>

            {/* Rating */}
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-1">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`h-4 w-4 ${
                      i < Math.floor(product?.rating?.rate)
                        ? "text-yellow-400 fill-current"
                        : "text-gray-600"
                    }`}
                  />
                ))}
              </div>
              <span className="text-gray-400 text-sm">
                ({product?.rating?.count} field reports)
              </span>
            </div>

            {/* Price */}
            <div className="flex flex-wrap justify-center items-baseline space-x-4">
              <span className="text-3xl font-light text-white">
                {formatPrice(product?.price)}
              </span>
              {product?.originalPrice && (
                <span className="text-lg text-gray-500 line-through">
                  {formatPrice(product?.originalPrice)}
                </span>
              )}
            </div>

            {/* Description */}
            <div className="border-t border-gray-800 pt-6">
              <h3 className="text-lg font-medium mb-4 text-yellow-400 tracking-wide">
                SPECIFICATIONS
              </h3>
              <p className="text-gray-300 leading-relaxed">
                {product?.description}
              </p>
            </div>

            {/* Quantity & Stock */}
            <div className="grid grid-cols-2 gap-6 py-6 border-y border-gray-800">
              <div>
                <label className="block text-gray-400 text-sm mb-3 tracking-wide uppercase">
                  Quantity
                </label>
                <select
                  value={quantity}
                  onChange={(e) => setQuantity(Number.parseInt(e.target.value))}
                  className="w-full bg-gray-800 border border-gray-700 text-gray-100 px-4 py-3 focus:border-yellow-400 focus:outline-none transition-colors"
                  disabled={!product?.inStock}
                >
                  {[...Array(Math.min(product?.stock, 10))]?.map((_, i) => (
                    <option key={i + 1} value={i + 1}>
                      {i + 1}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <span className="block text-gray-400 text-sm mb-3 tracking-wide uppercase">
                  Availability
                </span>
                <div className="flex items-center space-x-2 mt-3">
                  <div
                    className={`w-2 h-2 rounded-full ${
                      product?.inStock ? "bg-green-400" : "bg-red-400"
                    }`}
                  ></div>
                  <span
                    className={`text-sm ${
                      product?.inStock ? "text-green-400" : "text-red-400"
                    }`}
                  >
                    {product?.inStock
                      ? `${product?.stock} units ready`
                      : "Currently unavailable"}
                  </span>
                </div>
              </div>
            </div>

            {/* Add to Cart */}
            <button
              onClick={handleAddToCart}
              disabled={isOutOfStock}
              className={`w-full py-3 px-4 rounded-lg font-bold transition-all duration-300
                ${
                  isOutOfStock
                    ? "bg-gray-800 text-gray-500 cursor-not-allowed"
                    : "bg-gradient-to-r from-yellow-400 to-orange-500 text-black hover:from-yellow-300 hover:to-orange-400"
                }`}
            >
              {isOutOfStock ? "OUT OF STOCK" : "ADD TO LOADOUT"}
            </button>

            {/* Tags */}
            {product?.tags && product?.tags.length > 0 && (
              <div>
                <h3 className="text-gray-400 text-sm mb-4 tracking-wide uppercase">
                  Classifications
                </h3>
                <div className="flex flex-wrap gap-2">
                  {product?.tags.map((tag, index) => (
                    <span
                      key={index}
                      className="px-3 py-1 bg-gray-800 border border-gray-700 text-gray-300 text-xs tracking-wide uppercase"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Additional Info */}
            <div className="bg-gray-800/50 border border-gray-700 p-6 mt-8">
              <div className="flex items-start space-x-3">
                <Zap className="h-5 w-5 text-yellow-400 mt-1 flex-shrink-0" />
                <div>
                  <h4 className="text-white font-medium mb-2">
                    Mission Critical Equipment
                  </h4>
                  <p className="text-gray-400 text-sm">
                    All tactical gear undergoes rigorous field testing and meets
                    Wayne Enterprises' highest quality standards. Backed by our
                    lifetime replacement guarantee.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BatmanProductDetail;
