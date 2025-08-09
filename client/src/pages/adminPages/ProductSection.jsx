import { useStandardQuery } from "../../lib/useStandardQuery";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { QUERY_KEYS } from "../../constants/queryKeys";
import { batmanToast } from "../../utils/toast";
import { get, del } from "../../lib/http";
import { useState, useEffect } from "react";
import { DeleteConfirmModal } from "../../components/UI/DeleteConfirmModal";
import { RefreshCw } from "lucide-react";

export const ProductsSection = () => {
  const queryClient = useQueryClient();
  const [deleteModal, setDeleteModal] = useState({
    isOpen: false,
    productId: null,
    productName: "",
  });

  // Add refetch capability to the query
  const {
    data: products,
    isLoading,
    error,
    refetch,
  } = useStandardQuery(QUERY_KEYS.PRODUCTS.all, () => get("/products"), {
    errorMsg: "Failed to fetch products",
    staleTime: 0, // Always fetch fresh data
  });

  // Add effect to refetch on mount
  useEffect(() => {
    // Refetch products when component mounts
    refetch();

    // Setup interval to check for cache staleness
    const interval = setInterval(() => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.PRODUCTS.all });
    }, 30000); // Check every 30 seconds

    return () => clearInterval(interval);
  }, [queryClient, refetch]);

  // Add manual refresh capability
  const handleRefresh = () => {
    queryClient.invalidateQueries({ queryKey: QUERY_KEYS.PRODUCTS.all });
  };

  // Delete mutation with optimistic updates
  const { mutate: deleteProduct, isLoading: isDeleting } = useMutation({
    mutationFn: (productId) => del(`/products/${productId}`),
    onMutate: async (productId) => {
      await queryClient.cancelQueries({ queryKey: QUERY_KEYS.PRODUCTS.all });
      const previousProducts = queryClient.getQueryData(
        QUERY_KEYS.PRODUCTS.all
      );

      // Optimistic update
      queryClient.setQueryData(QUERY_KEYS.PRODUCTS.all, (old) => ({
        ...old,
        data: {
          ...old.data,
          data: {
            ...old,
            products: old.products.filter((p) => p.id !== productId),
          },
        },
      }));

      return { previousProducts };
    },
    onError: (err, productId, context) => {
      queryClient.setQueryData(
        QUERY_KEYS.PRODUCTS.all,
        context.previousProducts
      );
      batmanToast.error("Failed to delete product");
    },
    onSuccess: () => {
      batmanToast.success("Product deleted successfully");
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.PRODUCTS.all });
    },
  });

  // Handle delete modal
  const openDeleteModal = (product) => {
    setDeleteModal({
      isOpen: true,
      productId: product.id,
      productName: product.name,
    });
  };

  const closeDeleteModal = () => {
    setDeleteModal({
      isOpen: false,
      productId: null,
      productName: "",
    });
  };

  const confirmDelete = () => {
    deleteProduct(deleteModal.productId);
    closeDeleteModal();
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-2 border-yellow-400 border-t-transparent" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-64">
        <p className="text-red-400">Failed to load products</p>
      </div>
    );
  }

  if (!products?.data?.data?.products?.length) {
    return (
      <div className="flex flex-col items-center justify-center h-64">
        <p className="text-gray-400">No products found</p>
      </div>
    );
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-white">Products Management</h2>
        <button
          onClick={handleRefresh}
          className="px-4 py-2 bg-yellow-400/10 text-yellow-400 rounded-lg
            hover:bg-yellow-400/20 transition-colors flex items-center gap-2"
        >
          <RefreshCw className="h-4 w-4" />
          Refresh
        </button>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {products?.data?.data?.products?.map((product) => (
          <div
            key={product.id}
            className="bg-gray-800/50 p-4 rounded-lg flex items-center justify-between"
          >
            <div className="flex items-center gap-4">
              <img
                src={product.images[0]?.url}
                alt={product.name}
                className="w-16 h-16 object-cover rounded"
              />
              <div>
                <h3 className="font-medium text-white">{product.name}</h3>
                <p className="text-gray-400">${product.price}</p>
              </div>
            </div>
            <button
              onClick={() => openDeleteModal(product)}
              className="px-3 py-1 bg-red-400/10 text-red-400 rounded 
                hover:bg-red-400/20 transition-colors"
            >
              Delete
            </button>
          </div>
        ))}
      </div>

      <DeleteConfirmModal
        isOpen={deleteModal.isOpen}
        onClose={closeDeleteModal}
        onConfirm={confirmDelete}
        productName={deleteModal.productName}
        isDeleting={isDeleting}
      />
    </div>
  );
};
