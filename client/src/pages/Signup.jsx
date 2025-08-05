import { useEffect, useState } from "react";
import {
  Eye,
  EyeOff,
  UserPlus,
  AlertCircle,
  CheckCircle,
  Shield,
  Phone,
  User,
  Mail,
  Lock,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useStandardMutation } from "../lib/useStandardMutation";
import { post } from "../lib/http";
import useAuthStore from "../store/authStore";
import toast from "react-hot-toast";

const BatmanSignup = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    phone: "",
  });



  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});

  const navigate = useNavigate();

  const signUpApi = (data) => post("/auth/register", data);

 

  // Validation rules
  const validateName = (name) => {
    if (!name.trim()) return "Operative name required";
    if (name.trim().length < 2) return "Name must be at least 2 characters";
    if (!/^[a-zA-Z\s]+$/.test(name))
      return "Name can only contain letters and spaces";
    return "";
  };

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email) return "Secure communication channel required";
    if (!emailRegex.test(email)) return "Invalid communication format";
    return "";
  };

  const validatePhone = (phone) => {
    if (phone && !/^\+?[\d\s\-\(\)]+$/.test(phone))
      return "Invalid contact format";
    if (phone && phone.replace(/\D/g, "").length < 10)
      return "Contact number too short";
    return "";
  };

  const validatePassword = (password) => {
    if (!password) return "Security protocol required";
    if (password.length < 8)
      return "Security protocol must be at least 8 characters";
    if (!/(?=.*[a-z])/.test(password)) return "Must contain lowercase letter";
    if (!/(?=.*[A-Z])/.test(password)) return "Must contain uppercase letter";
    if (!/(?=.*\d)/.test(password)) return "Must contain number";
    if (!/(?=.*[@$!%*?&])/.test(password))
      return "Must contain special character";
    return "";
  };

  const validateConfirmPassword = (confirmPassword, password) => {
    if (!confirmPassword) return "Security protocol confirmation required";
    if (confirmPassword !== password) return "Security protocols do not match";
    return "";
  };

  // React Query mutation
  const { mutate, isPending } = useStandardMutation(signUpApi, {
    successMsg: "Sign up Successful!",
    sideEffects: (res) => {
      navigate("/login");
    },
  });

  const validateForm = () => {
    const newErrors = {
      name: validateName(formData.name),
      email: validateEmail(formData.email),
      phone: validatePhone(formData.phone),
      password: validatePassword(formData.password),
      confirmPassword: validateConfirmPassword(
        formData.confirmPassword,
        formData.password
      ),
    };
    setErrors(newErrors);
    return Object.values(newErrors).every((error) => !error);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Real-time validation
    if (touched[name]) {
      let error = "";
      switch (name) {
        case "name":
          error = validateName(value);
          break;
        case "email":
          error = validateEmail(value);
          break;
        case "phone":
          error = validatePhone(value);
          break;
        case "password":
          error = validatePassword(value);
          break;
        case "confirmPassword":
          error = validateConfirmPassword(value, formData.password);
          break;
      }
      setErrors((prev) => ({ ...prev, [name]: error }));

      // Re-validate confirm password when password changes
      if (name === "password" && touched.confirmPassword) {
        setErrors((prev) => ({
          ...prev,
          confirmPassword: validateConfirmPassword(
            formData.confirmPassword,
            value
          ),
        }));
      }
    }
  };

  const handleBlur = (e) => {
    const { name } = e.target;
    setTouched((prev) => ({ ...prev, [name]: true }));

    let error = "";
    switch (name) {
      case "name":
        error = validateName(formData[name]);
        break;
      case "email":
        error = validateEmail(formData[name]);
        break;
      case "phone":
        error = validatePhone(formData[name]);
        break;
      case "password":
        error = validatePassword(formData[name]);
        break;
      case "confirmPassword":
        error = validateConfirmPassword(formData[name], formData.password);
        break;
    }
    setErrors((prev) => ({ ...prev, [name]: error }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setTouched({
      name: true,
      email: true,
      phone: true,
      password: true,
      confirmPassword: true,
    });

    if (validateForm()) {
      // Simulate registration
      mutate(formData);
    }
  };

  const handleSignIn = () => {
    navigate("/login");
  };

  const getInputStatus = (fieldName) => {
    if (!touched[fieldName]) return "default";
    return errors[fieldName] ? "error" : "success";
  };

  const getPasswordStrength = (password) => {
    if (!password) return { strength: 0, label: "", color: "" };

    let score = 0;
    if (password.length >= 8) score++;
    if (/(?=.*[a-z])/.test(password)) score++;
    if (/(?=.*[A-Z])/.test(password)) score++;
    if (/(?=.*\d)/.test(password)) score++;
    if (/(?=.*[@$!%*?&])/.test(password)) score++;

    const levels = [
      { strength: 0, label: "Very Weak", color: "bg-red-500" },
      { strength: 1, label: "Weak", color: "bg-red-400" },
      { strength: 2, label: "Fair", color: "bg-yellow-500" },
      { strength: 3, label: "Good", color: "bg-yellow-400" },
      { strength: 4, label: "Strong", color: "bg-green-400" },
      { strength: 5, label: "Very Strong", color: "bg-green-500" },
    ];

    return levels[score];
  };

  const passwordStrength = getPasswordStrength(formData.password);

  return (
    <div className="min-h-screen bg-black text-gray-100 flex items-center justify-center relative overflow-hidden py-12">
      {/* Background Effects */}
      <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-black to-gray-800"></div>
      <div
        className="absolute inset-0"
        style={{
          backgroundImage: `radial-gradient(circle at 30% 20%, rgba(255, 193, 7, 0.08) 0%, transparent 50%),
                          radial-gradient(circle at 70% 80%, rgba(255, 193, 7, 0.06) 0%, transparent 50%)`,
        }}
      ></div>

      {/* Animated Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-1/6 left-1/6 w-80 h-80 border border-yellow-400/20 rotate-45 transform"></div>
        <div className="absolute bottom-1/6 right-1/6 w-60 h-60 border border-yellow-400/10 rotate-12 transform"></div>
        <div className="absolute top-1/2 left-1/2 w-40 h-40 border border-yellow-400/15 -rotate-12 transform -translate-x-1/2 -translate-y-1/2"></div>
      </div>

      <div className="relative z-10 w-full max-w-lg px-6">
        {/* Header */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-yellow-400/10 border border-yellow-400/30 mb-6">
            <UserPlus className="w-10 h-10 text-yellow-400" />
          </div>
          <h1 className="text-3xl font-light tracking-wider text-white mb-2">
            OPERATIVE REGISTRATION
          </h1>
          <div className="w-20 h-px bg-yellow-400 mx-auto mb-4"></div>
          <p className="text-gray-400 text-sm">
            Join the ranks of Gotham's protectors
          </p>
        </div>

        {/* Registration Form */}
        <div className="bg-gray-900/50 backdrop-blur-sm border border-gray-800 p-8">
          <div onSubmit={handleSubmit}>
            <div className="space-y-6">
              {/* Name Field */}
              <div>
                <label
                  htmlFor="name"
                  className="block text-gray-400 text-sm mb-3 tracking-wide uppercase flex items-center space-x-2"
                >
                  <User className="w-4 h-4" />
                  <span>Operative Name</span>
                </label>
                <div className="relative">
                  <input
                    id="name"
                    name="name"
                    type="text"
                    required
                    value={formData.name}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    className={`w-full bg-black/50 border-b-2 px-0 py-4 text-gray-100 placeholder-gray-500 focus:outline-none transition-colors ${
                      getInputStatus("name") === "error"
                        ? "border-red-400 focus:border-red-400"
                        : getInputStatus("name") === "success"
                        ? "border-green-400 focus:border-green-400"
                        : "border-gray-700 focus:border-yellow-400"
                    }`}
                    placeholder="Enter your full name"
                  />
                  {touched.name && (
                    <div className="absolute right-0 top-4">
                      {errors.name ? (
                        <AlertCircle className="w-5 h-5 text-red-400" />
                      ) : (
                        <CheckCircle className="w-5 h-5 text-green-400" />
                      )}
                    </div>
                  )}
                </div>
                {touched.name && errors.name && (
                  <p className="text-red-400 text-xs mt-2 tracking-wide">
                    {errors.name}
                  </p>
                )}
              </div>

              {/* Email Field */}
              <div>
                <label
                  htmlFor="email"
                  className="block text-gray-400 text-sm mb-3 tracking-wide uppercase flex items-center space-x-2"
                >
                  <Mail className="w-4 h-4" />
                  <span>Secure Communication</span>
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
                    placeholder="Enter your email address"
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

              {/* Phone Field */}
              <div>
                <label
                  htmlFor="phone"
                  className="block text-gray-400 text-sm mb-3 tracking-wide uppercase flex items-center space-x-2"
                >
                  <Phone className="w-4 h-4" />
                  <span>Emergency Contact (Optional)</span>
                </label>
                <div className="relative">
                  <input
                    id="phone"
                    name="phone"
                    type="tel"
                    value={formData.phone}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    className={`w-full bg-black/50 border-b-2 px-0 py-4 text-gray-100 placeholder-gray-500 focus:outline-none transition-colors ${
                      getInputStatus("phone") === "error"
                        ? "border-red-400 focus:border-red-400"
                        : getInputStatus("phone") === "success" &&
                          formData.phone
                        ? "border-green-400 focus:border-green-400"
                        : "border-gray-700 focus:border-yellow-400"
                    }`}
                    placeholder="Enter your contact number"
                  />
                  {touched.phone && formData.phone && (
                    <div className="absolute right-0 top-4">
                      {errors.phone ? (
                        <AlertCircle className="w-5 h-5 text-red-400" />
                      ) : (
                        <CheckCircle className="w-5 h-5 text-green-400" />
                      )}
                    </div>
                  )}
                </div>
                {touched.phone && errors.phone && (
                  <p className="text-red-400 text-xs mt-2 tracking-wide">
                    {errors.phone}
                  </p>
                )}
              </div>

              {/* Password Field */}
              <div>
                <label
                  htmlFor="password"
                  className="block text-gray-400 text-sm mb-3 tracking-wide uppercase flex items-center space-x-2"
                >
                  <Lock className="w-4 h-4" />
                  <span>Security Protocol</span>
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
                    placeholder="Create your security protocol"
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

                {/* Password Strength Indicator */}
                {formData.password && (
                  <div className="mt-3">
                    <div className="flex items-center space-x-2 mb-2">
                      <div className="flex-1 bg-gray-700 h-1 rounded-full overflow-hidden">
                        <div
                          className={`h-full transition-all duration-300 ${passwordStrength.color}`}
                          style={{
                            width: `${(passwordStrength.strength / 5) * 100}%`,
                          }}
                        ></div>
                      </div>
                      <span
                        className={`text-xs font-medium ${
                          passwordStrength.strength <= 2
                            ? "text-red-400"
                            : passwordStrength.strength <= 3
                            ? "text-yellow-400"
                            : "text-green-400"
                        }`}
                      >
                        {passwordStrength.label}
                      </span>
                    </div>
                  </div>
                )}

                {touched.password && errors.password && (
                  <p className="text-red-400 text-xs mt-2 tracking-wide">
                    {errors.password}
                  </p>
                )}
              </div>

              {/* Confirm Password Field */}
              <div>
                <label
                  htmlFor="confirmPassword"
                  className="block text-gray-400 text-sm mb-3 tracking-wide uppercase flex items-center space-x-2"
                >
                  <Shield className="w-4 h-4" />
                  <span>Confirm Protocol</span>
                </label>
                <div className="relative">
                  <input
                    id="confirmPassword"
                    name="confirmPassword"
                    type={showConfirmPassword ? "text" : "password"}
                    required
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    className={`w-full bg-black/50 border-b-2 px-0 py-4 pr-12 text-gray-100 placeholder-gray-500 focus:outline-none transition-colors ${
                      getInputStatus("confirmPassword") === "error"
                        ? "border-red-400 focus:border-red-400"
                        : getInputStatus("confirmPassword") === "success"
                        ? "border-green-400 focus:border-green-400"
                        : "border-gray-700 focus:border-yellow-400"
                    }`}
                    placeholder="Confirm your security protocol"
                  />
                  <div className="absolute right-0 top-4 flex items-center space-x-2">
                    <button
                      type="button"
                      onClick={() =>
                        setShowConfirmPassword(!showConfirmPassword)
                      }
                      className="text-gray-400 hover:text-yellow-400 transition-colors"
                    >
                      {showConfirmPassword ? (
                        <EyeOff className="w-5 h-5" />
                      ) : (
                        <Eye className="w-5 h-5" />
                      )}
                    </button>
                    {touched.confirmPassword &&
                      (errors.confirmPassword ? (
                        <AlertCircle className="w-5 h-5 text-red-400" />
                      ) : (
                        <CheckCircle className="w-5 h-5 text-green-400" />
                      ))}
                  </div>
                </div>
                {touched.confirmPassword && errors.confirmPassword && (
                  <p className="text-red-400 text-xs mt-2 tracking-wide">
                    {errors.confirmPassword}
                  </p>
                )}
              </div>

              {/* Submit Button */}
              <button
                type="button"
                onClick={handleSubmit}
                disabled={isPending}
                className="w-full bg-yellow-400 hover:bg-yellow-300 text-black font-medium py-4 tracking-widest transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2 mt-8"
              >
                {isPending ? (
                  <>
                    <div className="w-5 h-5 border-2 border-black/30 border-t-black rounded-full animate-spin"></div>
                    <span>PROCESSING CLEARANCE...</span>
                  </>
                ) : (
                  <span>Sign up</span>
                )}
              </button>

              {/* Sign In Link */}
              <div className="text-center pt-6 border-t border-gray-800">
                <p className="text-gray-400 text-sm mb-2">
                  Already have clearance?
                </p>
                <button
                  type="button"
                  onClick={handleSignIn}
                  className="text-yellow-400 hover:text-yellow-300 text-sm tracking-wide transition-colors"
                >
                  login to your account
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center mt-8">
          <p className="text-gray-500 text-xs tracking-widest">
            WAYNE ENTERPRISES RECRUITMENT DIVISION
          </p>
          <div className="flex items-center justify-center space-x-1 mt-2">
            <div className="w-2 h-2 bg-yellow-400 rounded-full animate-pulse"></div>
            <p className="text-gray-500 text-xs">RECRUITMENT SYSTEM ACTIVE</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BatmanSignup;
