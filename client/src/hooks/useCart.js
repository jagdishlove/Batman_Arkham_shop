import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import api from "@/lib/api"
import useAuthStore from "@/store/authStore"
import { batmanToast } from "@/utils/toast";

const cartApi = {
  getCart: async () => {
    const response = await api.get("/cart")
    return response.data.data.cart
  },

  addToCart: async ({ productId, quantity }) => {
    const response = await api.post("/cart/add", { productId, quantity })
    return response.data.data.cart
  },

  updateCart: async ({ productId, quantity }) => {
    const response = await api.put("/cart/update", { productId, quantity })
    return response.data.data.cart
  },

  removeFromCart: async (productId) => {
    const response = await api.delete(`/cart/remove/${productId}`)
    return response.data.data.cart
  },

  clearCart: async () => {
    const response = await api.delete("/cart/clear")
    return response.data.data.cart
  },
}

export const useCart = () => {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated)

  return useQuery({
    queryKey: ["cart"],
    queryFn: cartApi.getCart,
    enabled: isAuthenticated,
    staleTime: 1 * 60 * 1000,
  })
}

export const useAddToCart = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: cartApi.addToCart,
    onSuccess: (cart) => {
      queryClient.setQueryData(["cart"], cart)
      batmanToast.success("Added to cart!")
    },
    onError: (error) => {
      batmanToast.error(error.response?.data?.message || "Failed to add to cart")
    },
  })
}

export const useUpdateCart = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: cartApi.updateCart,
    onSuccess: (cart) => {
      queryClient.setQueryData(["cart"], cart)
    },
    onError: (error) => {
      batmanToast.error(error.response?.data?.message || "Failed to update cart")
    },
  })
}

export const useRemoveFromCart = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: cartApi.removeFromCart,
    onSuccess: (cart) => {
      queryClient.setQueryData(["cart"], cart)
      batmanToast.success("Removed from cart")
    },
    onError: (error) => {
      batmanToast.error(error.response?.data?.message || "Failed to remove from cart")
    },
  })
}

export const useClearCart = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: cartApi.clearCart,
    onSuccess: (cart) => {
      queryClient.setQueryData(["cart"], cart)
      batmanToast.success("Cart cleared")
    },
    onError: (error) => {
      batmanToast.error(error.response?.data?.message || "Failed to clear cart")
    },
  })
}
