import { useMutation } from "@tanstack/react-query";
import { toast } from "react-hot-toast";

/**
 * @param {Function} mutationFn - Your actual API call (e.g., post(...))
 * @param {Object} options - Optional custom behaviors
 */
export const useStandardMutation = (
  mutationFn,
  {
    successMsg = "Success!",
    errorMsg = "Something went wrong.",
    sideEffects,
    onSuccess,
    onError,
  } = {}
) => {
  return useMutation({
    mutationFn,
    onSuccess: (data, variables, context) => {
      toast.success(successMsg);
      if (sideEffects) sideEffects(data);
      if (onSuccess) onSuccess(data, variables, context);
    },
    onError: (error, variables, context) => {
      const message =
        error?.response?.data?.message || error?.message || errorMsg;
      toast.error(message);
      if (onError) onError(error, variables, context);
    },
  });
};
