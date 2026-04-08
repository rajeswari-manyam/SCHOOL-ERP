import { useNotificationStore } from "../store/notificationStore";

export function errorHandler(error: unknown) {
  let message = "An unexpected error occurred.";
  if (error && typeof error === "object" && "response" in error) {
    // @ts-expect-error
    message = error.response?.data?.message || message;
  }
  useNotificationStore.getState().addNotification({
    id: Date.now().toString(),
    message,
    read: false,
    type: "error",
    createdAt: new Date().toISOString(),
  });
}
