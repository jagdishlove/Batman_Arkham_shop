import { create } from "zustand";
import { persist } from "zustand/middleware";

const useAuthStore = create(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      isAuthenticated: false,

      // Set token and user together
      setAuth: (user, token) => {
        set({ user, token, isAuthenticated: true });
      },

      // Update user partially
      updateUser: (userData) => {
        const updatedUser = { ...get().user, ...userData };
        set({ user: updatedUser });
      },

      // Clear everything on logout
      logout: () => {
        set({ user: null, token: null, isAuthenticated: false });
      },

      login: (userData) => {
        set({
          user: userData,
          isAuthenticated: true,
        });
        // Redirect based on role
        if (userData.role === "admin") {
          return "/admin/dashboard";
        }
        return "/";
      },
    }),
    {
      name: "auth-storage", // key in localStorage
      partialize: (state) => ({
        user: state.user,
        token: state.token,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
);

export default useAuthStore;
