import { toast, ToastOptions } from "react-toastify";

const baseOptions: ToastOptions = {
  position: "top-right",
  autoClose: 3000,
  closeOnClick: true,
  pauseOnHover: true,
  draggable: true,
};

export const showSuccess = (message: string) => {
  toast.success(message, {
    ...baseOptions,
    style: { backgroundColor: "#22c55e", color: "white", borderRadius: "0.5rem" }, 
  });
};

export const showError = (message: string) => {
  toast.error(message, {
    ...baseOptions,
    style: { backgroundColor: "#ef4444", color: "white", borderRadius: "0.5rem" }, 
  });
};

export const showInfo = (message: string) => {
  toast.info(message, {
    ...baseOptions,
    style: { backgroundColor: "#3b82f6", color: "white", borderRadius: "0.5rem" }, 
  });
};
