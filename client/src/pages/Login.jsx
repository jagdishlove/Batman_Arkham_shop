import { useEffect, useState } from "react";
import { Eye, EyeOff, Shield, AlertCircle, CheckCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";
import api from "@/lib/api"; // <-- use your custom axios instance

import useAuthStore from "../store/authStore";
import { post } from "../lib/http";
import { useStandardMutation } from "../lib/useStandardMutation";
import toast from "react-hot-toast";

const loginApi = async ({ email, password }) => {
  const res = await api.post("/auth/login", { email, password });
  return res.data;
};

const BatmanLogin = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});

  const navigate = useNavigate();
  const { isAuthenticated, setAuth } = useAuthStore();
  const loginApi = (data) => post("/auth/login", data);

  useEffect(() => {
    if (isAuthenticated) {
      navigate("/");
    }
  }, [isAuthenticated, navigate]);

  // React Query mutation
  const { mutate, isPending } = useStandardMutation(loginApi, {
    successMsg: "Login Successful!",
    sideEffects: (res) => {
      const { token, user } = res.data.data;
      setAuth(user, token);
    },
  });

  // Validation rules
  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email) return "Access credentials required";
    if (!emailRegex.test(email)) return "Invalid security clearance format";
    return "";
  };

  const validatePassword = (password) => {
    if (!password) return "Security code required";
    if (password.length < 6)
      return "Security code must be at least 6 characters";
    return "";
  };

  const validateForm = () => {
    const newErrors = {
      email: validateEmail(formData.email),
      password: validatePassword(formData.password),
    };
    setErrors(newErrors);
    return !newErrors.email && !newErrors.password;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Real-time validation
    if (touched[name]) {
      const error =
        name === "email" ? validateEmail(value) : validatePassword(value);
      setErrors((prev) => ({
        ...prev,
        [name]: error,
      }));
    }
  };

  const handleBlur = (e) => {
    const { name } = e.target;
    setTouched((prev) => ({
      ...prev,
      [name]: true,
    }));

    const error =
      name === "email"
        ? validateEmail(formData[name])
        : validatePassword(formData[name]);
    setErrors((prev) => ({
      ...prev,
      [name]: error,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setTouched({ email: true, password: true });

    if (validateForm()) {
      mutate(formData);
    }
  };

  const handleCreateAccount = () => {
    navigate("/signup");
  };

  const getInputStatus = (fieldName) => {
    if (!touched[fieldName]) return "default";
    return errors[fieldName] ? "error" : "success";
  };

  return (
    <div className="min-h-screen bg-black text-gray-100 flex items-center justify-center relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-black to-gray-800"></div>
      <div
        className="absolute inset-0"
        style={{
          backgroundImage: `radial-gradient(circle at 20% 30%, rgba(255, 193, 7, 0.1) 0%, transparent 50%),
                          radial-gradient(circle at 80% 70%, rgba(255, 193, 7, 0.05) 0%, transparent 50%)`,
        }}
      ></div>

      {/* Animated Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 border border-yellow-400/20 rotate-45 transform"></div>
        <div className="absolute bottom-1/4 right-1/4 w-64 h-64 border border-yellow-400/10 rotate-12 transform"></div>
      </div>

      <div className="relative z-10 w-full max-w-md px-6">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-yellow-400/10 border border-yellow-400/30 mb-6">
            <Shield className="w-10 h-10 text-yellow-400" />
          </div>
          <h1 className="text-3xl font-light tracking-wider text-white mb-2">
            ACCESS CONTROL
          </h1>
          <div className="w-16 h-px bg-yellow-400 mx-auto mb-4"></div>
          <p className="text-gray-400 text-sm">
            Secure authentication required for Batcave systems
          </p>
        </div>

        {/* Login Form */}
        <div className="bg-gray-900/50 backdrop-blur-sm border border-gray-800 p-8">
          {/* Show API error */}
          {errors.api && (
            <p className="text-red-400 text-xs mb-4 tracking-wide text-center">
              {errors.api}
            </p>
          )}
          <form onSubmit={handleSubmit}>
            <div className="space-y-8">
              {/* Email Field */}
              <div>
                <label
                  htmlFor="email"
                  className="block text-gray-400 text-sm mb-3 tracking-wide uppercase"
                >
                  Security Clearance ID
                </label>
                <div className="relative">
                  <input
                    id="email"
                    name="email"
                    type="email"
                    required
                    value={formData.email}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    className={`w-full bg-black/50 border-b-2 px-0 py-4 text-gray-100 placeholder-gray-500 focus:outline-none transition-colors ${
                      getInputStatus("email") === "error"
                        ? "border-red-400 focus:border-red-400"
                        : getInputStatus("email") === "success"
                        ? "border-green-400 focus:border-green-400"
                        : "border-gray-700 focus:border-yellow-400"
                    }`}
                    placeholder="Enter your access credentials"
                  />
                  {touched.email && (
                    <div className="absolute right-0 top-4">
                      {errors.email ? (
                        <AlertCircle className="w-5 h-5 text-red-400" />
                      ) : (
                        <CheckCircle className="w-5 h-5 text-green-400" />
                      )}
                    </div>
                  )}
                </div>
                {touched.email && errors.email && (
                  <p className="text-red-400 text-xs mt-2 tracking-wide">
                    {errors.email}
                  </p>
                )}
              </div>

              {/* Password Field */}
              <div>
                <label
                  htmlFor="password"
                  className="block text-gray-400 text-sm mb-3 tracking-wide uppercase"
                >
                  Security Code
                </label>
                <div className="relative">
                  <input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    required
                    value={formData.password}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    className={`w-full bg-black/50 border-b-2 px-0 py-4 pr-12 text-gray-100 placeholder-gray-500 focus:outline-none transition-colors ${
                      getInputStatus("password") === "error"
                        ? "border-red-400 focus:border-red-400"
                        : getInputStatus("password") === "success"
                        ? "border-green-400 focus:border-green-400"
                        : "border-gray-700 focus:border-yellow-400"
                    }`}
                    placeholder="Enter your security code"
                  />
                  <div className="absolute right-0 top-4 flex items-center space-x-2">
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="text-gray-400 hover:text-yellow-400 transition-colors"
                    >
                      {showPassword ? (
                        <EyeOff className="w-5 h-5" />
                      ) : (
                        <Eye className="w-5 h-5" />
                      )}
                    </button>
                    {touched.password &&
                      (errors.password ? (
                        <AlertCircle className="w-5 h-5 text-red-400" />
                      ) : (
                        <CheckCircle className="w-5 h-5 text-green-400" />
                      ))}
                  </div>
                </div>
                {touched.password && errors.password && (
                  <p className="text-red-400 text-xs mt-2 tracking-wide">
                    {errors.password}
                  </p>
                )}
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isPending}
                className="w-full bg-yellow-400 hover:bg-yellow-300 text-black font-medium py-4 tracking-widest transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
              >
                {isPending ? (
                  <>
                    <div className="w-5 h-5 border-2 border-black/30 border-t-black rounded-full animate-spin"></div>
                    <span>AUTHENTICATING...</span>
                  </>
                ) : (
                  <span>Login</span>
                )}
              </button>

              {/* Create Account Link */}
              <div className="text-center pt-6 border-t border-gray-800">
                <p className="text-gray-400 text-sm mb-2">New operative?</p>
                <button
                  type="button"
                  onClick={handleCreateAccount}
                  className="text-yellow-400 hover:text-yellow-300 text-sm tracking-wide transition-colors"
                >
                  Sign up for recruitment
                </button>
              </div>
            </div>
          </form>
        </div>

        {/* Footer */}
        <div className="text-center mt-8">
          <p className="text-gray-500 text-xs tracking-widest">
            WAYNE ENTERPRISES SECURE NETWORK
          </p>
          <div className="flex items-center justify-center space-x-1 mt-2">
            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
            <p className="text-gray-500 text-xs">SYSTEM ONLINE</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BatmanLogin;
