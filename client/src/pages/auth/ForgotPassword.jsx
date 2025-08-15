import { useState } from "react";
import { Shield, Check, X } from "lucide-react";
import { useStandardMutation } from "@/lib/useStandardMutation";
import { post } from "@/lib/http";
import { batmanToast } from "@/utils/toast";
import { useNavigate } from "react-router-dom";

const PasswordValidator = ({ password }) => {
  const requirements = [
    { test: /.{8,}/, text: "At least 8 characters" },
    { test: /[A-Z]/, text: "One uppercase letter" },
    { test: /[a-z]/, text: "One lowercase letter" },
    { test: /[0-9]/, text: "One number" },
    { test: /[^A-Za-z0-9]/, text: "One special character" },
  ];

  return (
    <div className="space-y-2">
      {requirements.map(({ test, text }) => (
        <div key={text} className="flex items-center gap-2 text-sm">
          {test.test(password) ? (
            <Check className="w-4 h-4 text-green-400" />
          ) : (
            <X className="w-4 h-4 text-red-400" />
          )}
          <span
            className={test.test(password) ? "text-green-400" : "text-gray-400"}
          >
            {text}
          </span>
        </div>
      ))}
    </div>
  );
};

export const ForgotPassword = () => {
  const [step, setStep] = useState("email"); // email -> security -> reset
  const [formData, setFormData] = useState({
    email: "",
    securityAnswer: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [securityQuestion, setSecurityQuestion] = useState("");
  const navigate = useNavigate();

  const isPasswordValid = (password) => {
    const requirements = [
      /.{8,}/, // length
      /[A-Z]/, // uppercase
      /[a-z]/, // lowercase
      /[0-9]/, // number
      /[^A-Za-z0-9]/, // special
    ];
    return requirements.every((regex) => regex.test(password));
  };

  const handleResetSubmit = () => {
    if (!isPasswordValid(formData.newPassword)) {
      batmanToast.error("Password does not meet requirements");
      return;
    }
    if (formData.newPassword !== formData.confirmPassword) {
      batmanToast.error("Passwords do not match");
      return;
    }
    resetPassword({
      email: formData.email,
      password: formData.newPassword,
    });
  };

  const { mutate: verifyEmail } = useStandardMutation(
    (data) => post("/auth/forgot-password/verify-email", data),
    {
      onSuccess: (response) => {
        setSecurityQuestion(response.data.data.securityQuestion);
        setStep("security");
      },
    }
  );

  const { mutate: verifySecurityAnswer } = useStandardMutation(
    (data) => post("/auth/forgot-password/verify-security", data),
    {
      onSuccess: () => setStep("reset"),
    }
  );

  const { mutate: resetPassword } = useStandardMutation(
    (data) => post("/auth/forgot-password/reset", data),
    {
      successMsg: "Password reset successful",
      onSuccess: () => navigate("/login"),
    }
  );

  const renderResetStep = () => (
    <div className="space-y-6">
      <div className="space-y-4">
        <div>
          <input
            type="password"
            placeholder="New Password"
            value={formData.newPassword}
            onChange={(e) =>
              setFormData((prev) => ({
                ...prev,
                newPassword: e.target.value,
              }))
            }
            className="w-full px-4 py-2 bg-gray-900/60 border border-gray-800 rounded-lg focus:outline-none focus:border-yellow-500/50"
          />
          <div className="mt-2">
            <PasswordValidator password={formData.newPassword} />
          </div>
        </div>

        <div>
          <input
            type="password"
            placeholder="Confirm Password"
            value={formData.confirmPassword}
            onChange={(e) =>
              setFormData((prev) => ({
                ...prev,
                confirmPassword: e.target.value,
              }))
            }
            className={`w-full px-4 py-2 bg-gray-900/60 border rounded-lg focus:outline-none focus:border-yellow-500/50
              ${
                formData.confirmPassword &&
                (formData.newPassword === formData.confirmPassword
                  ? "border-green-500/50"
                  : "border-red-500/50")
              }`}
          />
          {formData.confirmPassword && (
            <p
              className={`text-sm mt-1 ${
                formData.newPassword === formData.confirmPassword
                  ? "text-green-400"
                  : "text-red-400"
              }`}
            >
              {formData.newPassword === formData.confirmPassword
                ? "Passwords match"
                : "Passwords do not match"}
            </p>
          )}
        </div>
      </div>

      <button
        onClick={handleResetSubmit}
        disabled={
          !isPasswordValid(formData.newPassword) ||
          formData.newPassword !== formData.confirmPassword
        }
        className="w-full py-3 bg-yellow-500 text-black font-bold rounded-lg hover:bg-yellow-400 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300"
      >
        Reset Password
      </button>
    </div>
  );

  const renderSecurityStep = () => (
    <div className="space-y-6">
      <div className="space-y-4">
        <div className="bg-gray-900/60 p-4 rounded-lg border border-gray-800">
          <p className="text-sm text-gray-400">Security Question:</p>
          <p className="text-lg text-white mt-1">{securityQuestion}</p>
        </div>
        <input
          type="text"
          placeholder="Your answer"
          value={formData.securityAnswer}
          onChange={(e) =>
            setFormData((prev) => ({
              ...prev,
              securityAnswer: e.target.value.toLowerCase(),
            }))
          }
          className="w-full px-4 py-2 bg-gray-900/60 border border-gray-800 rounded-lg focus:outline-none focus:border-yellow-500/50"
        />
      </div>
      <button
        onClick={() =>
          verifySecurityAnswer({
            email: formData.email,
            answer: formData.securityAnswer,
          })
        }
        className="w-full py-3 bg-yellow-500 text-black font-bold rounded-lg hover:bg-yellow-400 transition-all duration-300"
      >
        Verify Answer
      </button>
    </div>
  );

  const renderStep = () => {
    switch (step) {
      case "email":
        return (
          <div className="space-y-4">
            <input
              type="email"
              placeholder="Enter your email"
              value={formData.email}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  email: e.target.value,
                }))
              }
              className="w-full px-4 py-2 bg-gray-900/60 border border-gray-800 rounded-lg"
            />
            <button
              onClick={() => verifyEmail({ email: formData.email })}
              className="w-full py-2 bg-yellow-500 text-black font-bold rounded-lg"
            >
              Continue
            </button>
          </div>
        );

      case "security":
        return renderSecurityStep();

      case "reset":
        return renderResetStep();
    }
  };

  return (
    <div className="min-h-screen bg-black text-white p-4">
      <div className="max-w-md mx-auto pt-20">
        <div className="text-center mb-8">
          <Shield className="w-12 h-12 text-yellow-400 mx-auto mb-4" />
          <h1 className="text-2xl font-light">RESET PASSWORD</h1>
        </div>
        {renderStep()}
      </div>
    </div>
  );
};
