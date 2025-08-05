import { useQuery } from "@tanstack/react-query"
import api from "@/lib/api"

const productsApi = {
  getProducts: async (filters = {}) => {
    const params = new URLSearchParams()
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== "" && value !== "all") {
        params.append(key, value.toString())
      }
    })

    const response = await api.get(`/products?${params}`)
    return response.data.data
  },

  getProduct: async (productId) => {
    const response = await api.get(`/products/${productId}`)
    return response.data.data.product
  },

  getFeaturedProducts: async (limit = 8) => {
    const response = await api.get(`/products/featured/list?limit=${limit}`)
    return response.data.data.products
  },
}

export const useProducts = (filters = {}) => {
  return useQuery({
    queryKey: ["products", filters],
    queryFn: () => productsApi.getProducts(filters),
    staleTime: 2 * 60 * 1000,
  })
}

export const useProduct = (productId) => {
  return useQuery({
    queryKey: ["products", productId],
    queryFn: () => productsApi.getProduct(productId),
    enabled: !!productId,
    staleTime: 5 * 60 * 1000,
  })
}

export const useFeaturedProducts = (limit = 8) => {
  return useQuery({
    queryKey: ["products", "featured", limit],
    queryFn: () => productsApi.getFeaturedProducts(limit),
    staleTime: 10 * 60 * 1000,
  })
}
