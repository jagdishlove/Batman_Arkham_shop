import { create } from "zustand";
import { persist } from "zustand/middleware";

const useCartStore = create(
  persist(
    (set, get) => ({
      items: [],
      stockLevels: {}, // Track stock levels

      // Add stock management
      setInitialStock: (productId, stock) => {
        set((state) => ({
          stockLevels: {
            ...state.stockLevels,
            [productId]: stock,
          },
        }));
      },

      // Get available stock
      getAvailableStock: (productId) => {
        const { stockLevels, items } = get();
        const cartItem = items.find((item) => item.id === productId);
        const reservedStock = cartItem?.quantity || 0;
        return (stockLevels[productId] || 0) - reservedStock;
      },

      // Update addToCart
      addToCart: (product) => {
        const { items, stockLevels } = get();
        const availableStock = get().getAvailableStock(product.id);

        if (availableStock <= 0) return false;

        const existingItem = items.find((item) => item.id === product.id);

        if (existingItem) {
          if (existingItem.quantity >= stockLevels[product.id]) return false;

          set((state) => ({
            items: state.items.map((item) =>
              item.id === product.id
                ? { ...item, quantity: item.quantity + 1 }
                : item
            ),
          }));
        } else {
          set((state) => ({
            items: [...state.items, { ...product, quantity: 1 }],
          }));
        }

        return true;
      },

      // Update removeFromCart
      removeFromCart: (productId) => {
        set((state) => ({
          items: state.items.filter((item) => item.id !== productId),
        }));
      },

      updateQuantity: (productId, quantity) =>
        set((state) => {
          const item = state.items.find((item) => item.id === productId);
          if (!item) return state;

          const availableStock = get().getAvailableStock(productId);

          if (quantity > availableStock) {
            throw new Error("Not enough stock available");
          }

          return {
            items: state.items.map((item) =>
              item.id === productId ? { ...item, quantity } : item
            ),
          };
        }),

      clearCart: () => set({ items: [] }),

      getCartTotal: () => {
        const items = get().items;
        return items.reduce((sum, item) => sum + item.price * item.quantity, 0);
      },

      getItemsCount: () => {
        const items = get().items;
        return items.reduce((sum, item) => sum + item.quantity, 0);
      },

      isInCart: (productId) => {
        const items = get().items;
        return items.some((item) => item.id === productId);
      },

      getItemQuantity: (productId) => {
        const items = get().items;
        const item = items.find((item) => item.id === productId);
        return item ? item.quantity : 0;
      },

      getShippingCost: () => {
        const total = get().getCartTotal();
        return total > 100 ? 0 : 10;
      },

      getTaxAmount: () => {
        const total = get().getCartTotal();
        return total * 0.1; // 10% tax
      },

      getFinalTotal: () => {
        const subtotal = get().getCartTotal();
        const shipping = get().getShippingCost();
        const tax = get().getTaxAmount();
        return subtotal + shipping + tax;
      },
    }),
    {
      name: "cart-storage",
      getStorage: () => localStorage,
    }
  )
);

export default useCartStore;
