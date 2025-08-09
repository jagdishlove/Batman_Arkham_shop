import { Shield, AlertTriangle } from "lucide-react";
import { createPortal } from "react-dom";

export const DeleteConfirmModal = ({
  isOpen,
  onClose,
  onConfirm,
  productName,
  isDeleting,
}) => {
  if (!isOpen) return null;

  return createPortal(
    <>
      {/* Backdrop */}
      <div className="fixed inset-0 bg-black/70 z-50" onClick={onClose} />

      {/* Modal */}
      <div className="fixed top-[20%] left-1/2 -translate-x-1/2 z-[51] w-[90%] max-w-md bg-gray-900 rounded-lg shadow-2xl border border-gray-800">
        <div className="p-6">
          <h3 className="text-xl font-bold text-white mb-4">Confirm Delete</h3>
          <p className="text-gray-300 mb-6">
            Are you sure you want to delete "{productName}"? This action cannot
            be undone.
          </p>
          <div className="flex justify-end gap-3">
            <button
              onClick={onClose}
              className="px-4 py-2 text-sm text-gray-300 hover:text-white"
            >
              Cancel
            </button>
            <button
              onClick={onConfirm}
              disabled={isDeleting}
              className={`px-4 py-2 text-sm bg-red-600 text-white rounded hover:bg-red-700
                ${isDeleting ? "opacity-50 cursor-not-allowed" : ""}`}
            >
              {isDeleting ? "Deleting..." : "Delete"}
            </button>
          </div>
        </div>
      </div>
    </>,
    document.body
  );
};
