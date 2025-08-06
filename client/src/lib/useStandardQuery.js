import { useQuery } from "@tanstack/react-query";
import { batmanToast } from "@/utils/toast";

/**
 * @param {Array} queryKey
 * @param {Function} queryFn - should return the actual data, not full Axios response
 * @param {Object} options - Optional behaviors
 */
export const useStandardQuery = (
  queryKey,
  queryFn,
  {
    enabled = true,
    errorMsg = "Failed to fetch data.",
    onSuccess,
    onError,
    ...restOptions
  } = {}
) => {
  return useQuery({
    queryKey,
    queryFn,
    enabled,
    onSuccess,
    onError: (error) => {
      const message =
        error?.response?.data?.message || error?.message || errorMsg;
      batmanToast.error(message);
      if (onError) onError(error);
    },
    ...restOptions,
  });
};
