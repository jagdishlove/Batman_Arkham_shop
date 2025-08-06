import toast from "react-hot-toast";

export const toastConfig = {
  position: "top-right",
  toastOptions: {
    duration: 4000,
    className: "batman-toast",
    style: {
      background: "rgba(23, 23, 27, 0.95)",
      backdropFilter: "blur(8px)",
      color: "#fff",
      border: "1px solid rgba(255, 255, 255, 0.1)",
      padding: "16px",
      borderRadius: "12px",
      boxShadow: "0 0 20px rgba(245, 158, 11, 0.1)",
      fontSize: "14px",
      fontFamily: "monospace",
    },
    success: {
      duration: 3000,
      iconTheme: {
        primary: "#eab308",
        secondary: "#1f1f1f",
      },
      style: {
        border: "1px solid rgba(234, 179, 8, 0.2)",
        background:
          "linear-gradient(45deg, rgba(23, 23, 27, 0.95), rgba(234, 179, 8, 0.1))",
      },
    },
    error: {
      duration: 4000,
      iconTheme: {
        primary: "#dc2626",
        secondary: "#1f1f1f",
      },
      style: {
        border: "1px solid rgba(220, 38, 38, 0.2)",
        background:
          "linear-gradient(45deg, rgba(23, 23, 27, 0.95), rgba(220, 38, 38, 0.1))",
      },
    },
    loading: {
      iconTheme: {
        primary: "#eab308",
        secondary: "#1f1f1f",
      },
      style: {
        border: "1px solid rgba(234, 179, 8, 0.2)",
        background:
          "linear-gradient(45deg, rgba(23, 23, 27, 0.95), rgba(234, 179, 8, 0.1))",
      },
    },
  },
};

export const batmanToast = {
  success: (message) => toast.success(message),
  error: (message) => toast.error(message),
  loading: (message) => toast.loading(message),
  custom: (message, options) => toast(message, options),
  promise: async (promise, messages) => {
    return toast.promise(promise, {
      loading: messages.loading || "Processing...",
      success: messages.success || "Completed successfully",
      error: messages.error || "Something went wrong",
    });
  },
};
