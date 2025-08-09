import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import api from "@/lib/api";
import useAuthStore from "@/store/authStore";
import { batmanToast } from "@/utils/toast";

// Auth API functions
const authApi = {
  login: async (credentials) => {
    const response = await api.post("/auth/login", credentials);
    return response.data.data;
  },

  register: async (userData) => {
    const response = await api.post("/auth/register", userData);
    return response.data.data;
  },

  getProfile: async () => {
    const response = await api.get("/auth/profile");
    return response.data.data.user;
  },
};

export const useLogin = () => {
  const setAuth = useAuthStore((state) => state.setAuth);
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: authApi.login,
    onSuccess: (data) => {
      const { user, token } = data;
      setAuth(user, token);
      queryClient.setQueryData(["auth", "profile"], user);
      batmanToast.success("Login successful!");
    },
    onError: (error) => {
      batmanToast.error(error.response?.data?.message || "Login failed");
    },
  });
};

export const useRegister = () => {
  const setAuth = useAuthStore((state) => state.setAuth);
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: authApi.register,
    onSuccess: (data) => {
      const { user, token } = data;
      setAuth(user, token);
      queryClient.setQueryData(["auth", "profile"], user);
      batmanToast.success("Registration successful!");
    },
    onError: (error) => {
      batmanToast.error(error.response?.data?.message || "Registration failed");
    },
  });
};

export const useProfile = () => {
  const token = useAuthStore((state) => state.token);

  return useQuery({
    queryKey: ["auth", "profile"],
    queryFn: authApi.getProfile,
    enabled: !!token,
    staleTime: 10 * 60 * 1000,
  });
};
