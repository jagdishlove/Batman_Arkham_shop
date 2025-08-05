import { create } from "zustand"
import { persist } from "zustand/middleware"

const useCartStore = create(
  persist(
    (set, get) => ({
      items: [],
      totalItems: 0,
      totalAmount: 0,

      addItem: (product, quantity = 1) => {
        const items = get().items
        const existingItem = items.find((item) => item.id === product.id)

        let newItems
        if (existingItem) {
          newItems = items.map((item) =>
            item.id === product.id ? { ...item, quantity: item.quantity + quantity } : item,
          )
        } else {
          newItems = [...items, { ...product, quantity }]
        }

        const totalItems = newItems.reduce((sum, item) => sum + item.quantity, 0)
        const totalAmount = newItems.reduce((sum, item) => sum + item.price * item.quantity, 0)

        set({ items: newItems, totalItems, totalAmount })
      },

      removeItem: (productId) => {
        const items = get().items.filter((item) => item.id !== productId)
        const totalItems = items.reduce((sum, item) => sum + item.quantity, 0)
        const totalAmount = items.reduce((sum, item) => sum + item.price * item.quantity, 0)

        set({ items, totalItems, totalAmount })
      },

      updateQuantity: (productId, quantity) => {
        if (quantity <= 0) {
          get().removeItem(productId)
          return
        }

        const items = get().items.map((item) => (item.id === productId ? { ...item, quantity } : item))

        const totalItems = items.reduce((sum, item) => sum + item.quantity, 0)
        const totalAmount = items.reduce((sum, item) => sum + item.price * item.quantity, 0)

        set({ items, totalItems, totalAmount })
      },

      clearCart: () => {
        set({ items: [], totalItems: 0, totalAmount: 0 })
      },
    }),
    {
      name: "cart-storage",
    },
  ),
)

export default useCartStore
