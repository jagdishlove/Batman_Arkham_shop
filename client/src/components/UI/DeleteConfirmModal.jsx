import { Shield, AlertTriangle } from "lucide-react";

export const DeleteConfirmModal = ({
  isOpen,
  onClose,
  onConfirm,
  productName,
  isDeleting,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center p-4 z-50">
      <div className="bg-gray-900 border border-gray-800 rounded-lg max-w-md w-full p-6 shadow-xl">
        <div className="flex flex-col items-center text-center">
          <div className="mb-4 p-3 bg-red-400/10 rounded-full">
            <AlertTriangle className="h-8 w-8 text-red-400" />
          </div>
          <h3 className="text-xl font-bold text-white mb-2">Confirm Delete</h3>
          <p className="text-gray-400 mb-6">
            Are you sure you want to delete{" "}
            <span className="text-yellow-400">{productName}</span>? This action
            cannot be undone.
          </p>
          <div className="flex gap-3 w-full">
            <button
              onClick={onClose}
              className="flex-1 px-4 py-2 bg-gray-800 text-gray-300 rounded-lg
                hover:bg-gray-700 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={onConfirm}
              disabled={isDeleting}
              className={`flex-1 px-4 py-2 bg-red-500 text-white rounded-lg
                hover:bg-red-600 transition-colors
                ${isDeleting ? "opacity-50 cursor-not-allowed" : ""}`}
            >
              {isDeleting ? "Deleting..." : "Delete"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
