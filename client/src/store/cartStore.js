import create from "zustand";
import { persist } from "zustand/middleware";

const useCartStore = create(
  persist(
    (set, get) => ({
      items: [],
      addItem: (product, quantity) =>
        set((state) => {
          const existingItem = state.items.find(
            (item) => item._id === product._id
          );

          // Check stock availability
          if (existingItem) {
            const newQuantity = existingItem.quantity + quantity;
            if (newQuantity > product.stock) {
              throw new Error("Not enough stock available");
            }
            return {
              items: state.items.map((item) =>
                item._id === product._id
                  ? { ...item, quantity: newQuantity }
                  : item
              ),
            };
          }

          if (quantity > product.stock) {
            throw new Error("Not enough stock available");
          }

          return {
            items: [...state.items, { ...product, quantity }],
          };
        }),
      removeItem: (productId) =>
        set((state) => ({
          items: state.items.filter((item) => item._id !== productId),
        })),
      updateQuantity: (productId, quantity) =>
        set((state) => {
          const item = state.items.find((item) => item._id === productId);
          if (!item) return state;

          if (quantity > item.stock) {
            throw new Error("Not enough stock available");
          }

          return {
            items: state.items.map((item) =>
              item._id === productId ? { ...item, quantity } : item
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
        return items.some((item) => item._id === productId);
      },
      getItemQuantity: (productId) => {
        const items = get().items;
        const item = items.find((item) => item._id === productId);
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
      name: "batman-cart-storage",
      getStorage: () => localStorage,
    }
  )
);

export default useCartStore;
