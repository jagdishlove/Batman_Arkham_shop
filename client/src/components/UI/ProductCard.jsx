import { Link } from "react-router-dom";
import { Star, ShoppingCart } from "lucide-react";
import { useAddToCart } from "@/hooks/useCart";
import useAuthStore from "@/store/authStore";
import { batmanToast } from "@/utils/toast";
import { formatPrice } from "../../utils";

const ProductRating = ({ rating }) => {
  const rateValue = rating?.rate || rating?.average || 0;
  const count = rating?.count || 0;

  return (
    <div className="flex items-center gap-2">
      <div className="flex">
        {[...Array(5)].map((_, index) => {
          const starValue = index + 1;
          const fillPercent = Math.min(
            100,
            Math.max(0, (rateValue - index) * 100)
          );

          return (
            <span key={index} className="relative">
              {/* Empty star (background) */}
              <Star size={14} className="text-gray-600" />
              {/* Filled star (overlay) */}
              <Star
                size={14}
                className="text-yellow-400 absolute top-0 left-0 overflow-hidden"
                style={{
                  clipPath: `inset(0 ${100 - fillPercent}% 0 0)`,
                }}
              />
            </span>
          );
        })}
      </div>
      <span className="text-xs text-gray-400">
        {rateValue.toFixed(1)} ({count})
      </span>
    </div>
  );
};

const ProductCard = ({ product }) => {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const addToCartMutation = useAddToCart();

  const handleAddToCart = (e) => {
    e.preventDefault();

    if (!isAuthenticated) {
      batmanToast.error("Please login to add items to cart");
      return;
    }

    if (!product.inStock) {
      batmanToast.error("Product is out of stock");
      return;
    }

    addToCartMutation.mutate({
      productId: product.id,
      quantity: 1,
    });
  };

  // Reconstruct image URL from numbered keys
  const imageUrl = product.images?.[0].url;

  const discount =
    product.originalPrice && product.price
      ? Math.round(
          ((product.originalPrice - product.price) / product.originalPrice) *
            100
        )
      : 0;

  return (
    <div className="bg-gray-900 rounded-xl overflow-hidden border border-gray-800 hover:border-yellow-500/60 transition-all">
      {/* Image section */}
      <div className="relative aspect-[4/3] overflow-hidden bg-gray-800">
        <img
          src={imageUrl}
          alt={product.name}
          loading="lazy"
          className="w-full h-full object-cover"
        />
        {!product.inStock && (
          <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
            <span className="text-white font-semibold px-3 py-1 bg-red-500/80 rounded-full text-sm">
              Out of Stock
            </span>
          </div>
        )}
        {discount > 0 && (
          <span className="absolute top-2 right-2 bg-yellow-500 text-black text-xs font-bold px-2 py-1 rounded">
            -{discount}%
          </span>
        )}
      </div>

      {/* Content section */}
      <div className="p-4 flex flex-col h-[calc(100%-aspect-ratio-4/3)]">
        <div className="flex items-start justify-between gap-2 mb-2">
          <h3 className="font-semibold text-white line-clamp-2">
            {product.name}
          </h3>
          <span className="text-xs px-2 py-1 bg-gray-800 text-gray-300 rounded shrink-0">
            {product.category}
          </span>
        </div>

        <ProductRating rating={product.rating} />

        <div className="mt-auto pt-4">
          <div className="flex items-end justify-between mb-3">
            <div className="flex flex-col">
              <span className="text-lg font-bold text-yellow-400">
                {formatPrice(product.price)}
              </span>
              {discount > 0 && (
                <span className="text-sm text-gray-500 line-through">
                  {formatPrice(product.originalPrice)}
                </span>
              )}
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Link
              to={`/products/${product.id}`}
              className="flex-1 text-center px-3 py-3 bg-gray-800 text-white text-sm font-medium rounded-md hover:bg-gray-700 transition-colors"
            >
              View Details
            </Link>
          </div>
        </div>

        {product.stock <= 5 && product.stock > 0 && (
          <p className="mt-2 text-xs text-orange-400">
            Only {product.stock} left in stock
          </p>
        )}
      </div>
    </div>
  );
};

export default ProductCard;
