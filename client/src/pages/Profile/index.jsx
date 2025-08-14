import { useState } from "react";
import { Shield, User, Lock, AlertTriangle } from "lucide-react";
import useAuthStore from "@/store/authStore";
import { useStandardMutation } from "@/lib/useStandardMutation";
import { patch } from "@/lib/http";
import { batmanToast } from "@/utils/toast";

const PasswordValidator = ({ password }) => {
  const checks = [
    { test: /.{8,}/, text: "At least 8 characters" },
    { test: /[A-Z]/, text: "One uppercase letter" },
    { test: /[a-z]/, text: "One lowercase letter" },
    { test: /[0-9]/, text: "One number" },
    { test: /[^A-Za-z0-9]/, text: "One special character" },
  ];

  return (
    <div className="space-y-2 text-sm">
      {checks.map(({ test, text }) => (
        <div key={text} className="flex items-center gap-2">
          <div
            className={`w-1.5 h-1.5 rounded-full ${
              test.test(password) ? "bg-green-500" : "bg-gray-600"
            }`}
          />
          <span
            className={test.test(password) ? "text-green-500" : "text-gray-400"}
          >
            {text}
          </span>
        </div>
      ))}
    </div>
  );
};

const Profile = () => {
  const { user, logout } = useAuthStore();
  const [passwords, setPasswords] = useState({ new: "", confirm: "" });
  const [showDeactivateConfirm, setShowDeactivateConfirm] = useState(false);

  const { mutate: updatePassword, isPending: isUpdating } = useStandardMutation(
    (data) => patch("/auth/update-password", data),
    {
      successMsg: "Password updated successfully",
      onSuccess: () => {
        setPasswords({ new: "", confirm: "" });
      },
    }
  );

  const handlePasswordUpdate = (e) => {
    e.preventDefault();
    if (passwords.new !== passwords.confirm) {
      batmanToast.error("Passwords do not match");
      return;
    }
    updatePassword({
      password: passwords.new,
      confirmPassword: passwords.confirm,
    });
  };

  return (
    <div className="min-h-screen bg-black text-white py-8 px-4">
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Profile Header */}
        <div className="flex items-center gap-4 mb-8">
          <Shield className="w-8 h-8 text-yellow-400" />
          <h1 className="text-2xl font-light">OPERATIVE PROFILE</h1>
        </div>

        {/* User Info */}
        <div className="bg-gray-900/60 backdrop-blur-sm border border-gray-800 rounded-2xl p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 bg-yellow-500/10 rounded-lg">
              <User className="h-5 w-5 text-yellow-400" />
            </div>
            <h2 className="text-xl font-bold">Identity Details</h2>
          </div>

          <div className="grid gap-4">
            <div>
              <label className="text-sm text-gray-400">Name</label>
              <p className="text-lg">{user.name}</p>
            </div>
            <div>
              <label className="text-sm text-gray-400">Email</label>
              <p className="text-lg">{user.email}</p>
            </div>
            <div>
              <label className="text-sm text-gray-400">Role</label>
              <p className="text-lg">{user.role}</p>
            </div>
            {user.phone && (
              <div>
                <label className="text-sm text-gray-400">Phone</label>
                <p className="text-lg">{user.phone}</p>
              </div>
            )}
          </div>
        </div>

        {/* Password Change */}
        <div className="bg-gray-900/60 backdrop-blur-sm border border-gray-800 rounded-2xl p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 bg-yellow-500/10 rounded-lg">
              <Lock className="h-5 w-5 text-yellow-400" />
            </div>
            <h2 className="text-xl font-bold">Update Password</h2>
          </div>

          <form onSubmit={handlePasswordUpdate} className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm text-gray-400 mb-2">
                  New Password
                </label>
                <input
                  type="password"
                  value={passwords.new}
                  onChange={(e) =>
                    setPasswords((prev) => ({ ...prev, new: e.target.value }))
                  }
                  className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:border-yellow-500"
                />
                <div className="mt-2">
                  <PasswordValidator password={passwords.new} />
                </div>
              </div>
              <div>
                <label className="block text-sm text-gray-400 mb-2">
                  Confirm Password
                </label>
                <input
                  type="password"
                  value={passwords.confirm}
                  onChange={(e) =>
                    setPasswords((prev) => ({
                      ...prev,
                      confirm: e.target.value,
                    }))
                  }
                  className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:border-yellow-500"
                />
              </div>
            </div>
            <button
              type="submit"
              disabled={isUpdating || !passwords.new || !passwords.confirm}
              className="px-6 py-2 bg-yellow-500 text-black font-medium rounded-lg hover:bg-yellow-400 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
            >
              {isUpdating ? "Updating..." : "Update Password"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Profile;
