"use client"

import { Link } from "react-router-dom"
import { Star, ShoppingCart } from "lucide-react"
import { formatPrice } from "@/lib/utils"
import { useAddToCart } from "@/hooks/useCart"
import useAuthStore from "@/store/authStore"
import toast from "react-hot-toast"

const ProductCard = ({ product }) => {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated)
  const addToCartMutation = useAddToCart()

  const handleAddToCart = (e) => {
    e.preventDefault()

    if (!isAuthenticated) {
      toast.error("Please login to add items to cart")
      return
    }

    if (!product.inStock) {
      toast.error("Product is out of stock")
      return
    }

    addToCartMutation.mutate({
      productId: product._id,
      quantity: 1,
    })
  }

  return (
    <div className="card group hover:shadow-lg transition-shadow duration-200">
      <Link to={`/products/${product._id}`}>
        <div className="relative overflow-hidden rounded-t-lg">
          <img
            src={product.images[0]?.url || "/placeholder.svg?height=200&width=300"}
            alt={product.name}
            className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-200"
          />
          {!product.inStock && (
            <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
              <span className="text-white font-semibold">Out of Stock</span>
            </div>
          )}
        </div>
      </Link>

      <div className="p-4">
        <Link to={`/products/${product._id}`}>
          <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2 hover:text-blue-600">{product.name}</h3>
        </Link>

        <p className="text-sm text-gray-600 mb-2 line-clamp-2">{product.description}</p>

        <div className="flex items-center mb-3">
          <div className="flex items-center">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                className={`h-4 w-4 ${
                  i < Math.floor(product.rating.average) ? "text-yellow-400 fill-current" : "text-gray-300"
                }`}
              />
            ))}
          </div>
          <span className="text-sm text-gray-600 ml-2">({product.rating.count})</span>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <span className="text-lg font-bold text-gray-900">{formatPrice(product.price)}</span>
            {product.originalPrice && (
              <span className="text-sm text-gray-500 line-through">{formatPrice(product.originalPrice)}</span>
            )}
          </div>

          <button
            onClick={handleAddToCart}
            disabled={!product.inStock || addToCartMutation.isPending}
            className="btn btn-primary btn-sm flex items-center space-x-1 disabled:opacity-50"
          >
            <ShoppingCart className="h-4 w-4" />
            <span>Add</span>
          </button>
        </div>
      </div>
    </div>
  )
}

export default ProductCard
