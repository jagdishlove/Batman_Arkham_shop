import { Toaster } from "react-hot-toast";
import { toastConfig } from "@/utils/toast";

const ToastContainer = () => {
  return <Toaster {...toastConfig} />;
};

export default ToastContainer;
