import toast from "react-hot-toast";

type ToastMessages<T = unknown> = {
  loading?: string;
  success?: string | ((data: T) => string);
  error?: string | ((err: unknown) => string);
};

export async function apiToast<T>(
  promise: Promise<T>,
  messages: ToastMessages<T>
): Promise<T | null> {
  const { loading, success, error } = messages;

  const id = loading ? toast.loading(loading) : null;

  try {
    const result = await promise;

    if (id) toast.dismiss(id);

    if (success) {
      const msg =
        typeof success === "function" ? success(result) : success;
      toast.success(msg);
    }

    return result;
  } catch (err) {
    if (id) toast.dismiss(id);

    const msg =
      typeof error === "function"
        ? error(err)
        : error || "Something went wrong";

    toast.error(msg);
    return null;
  }
}