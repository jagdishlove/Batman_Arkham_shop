import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import api from "@/lib/api"
import useAuthStore from "@/store/authStore"
import { batmanToast } from "@/utils/toast";

const ordersApi = {
  getOrders: async (page = 1, limit = 10) => {
    const response = await api.get(`/orders?page=${page}&limit=${limit}`)
    return response.data.data
  },

  getOrder: async (orderId) => {
    const response = await api.get(`/orders/${orderId}`)
    return response.data.data.order
  },

  createOrder: async (orderData) => {
    const response = await api.post("/orders/create", orderData)
    return response.data.data.order
  },
}

export const useOrders = (page = 1, limit = 10) => {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated)

  return useQuery({
    queryKey: ["orders", page, limit],
    queryFn: () => ordersApi.getOrders(page, limit),
    enabled: isAuthenticated,
    staleTime: 2 * 60 * 1000,
  })
}

export const useOrder = (orderId) => {
  return useQuery({
    queryKey: ["orders", orderId],
    queryFn: () => ordersApi.getOrder(orderId),
    enabled: !!orderId,
    staleTime: 5 * 60 * 1000,
  })
}

export const useCreateOrder = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ordersApi.createOrder,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["orders"] })
      queryClient.invalidateQueries({ queryKey: ["cart"] })
      batmanToast.success("Order created successfully!")
    },
    onError: (error) => {
      batmanToast.error(error.response?.data?.message || "Failed to create order")
    },
  })
}
