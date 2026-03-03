import { toast } from "sonner";

type ToastOptions = {
  description?: string;
};

export const appToast = {
  info: (message: string, options?: ToastOptions) =>
    toast.info(message, {
      description: options?.description,
      duration: 3000,
    }),
  warning: (message: string, options?: ToastOptions) =>
    toast.warning(message, {
      description: options?.description,
      duration: 3500,
    }),
  success: (message: string, options?: ToastOptions) =>
    toast.success(message, {
      description: options?.description,
      duration: 2500,
    }),
  error: (message: string, options?: ToastOptions) =>
    toast.error(message, {
      description: options?.description,
      duration: 4500,
    }),
};
