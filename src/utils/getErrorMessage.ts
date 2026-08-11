// src/utils/getErrorMessage.ts
import axios from "axios";

/**
 * Safely extracts a human-readable message from any error thrown by an API
 * call, without assuming `error.response`, `error.response.data`, or
 * `error.response.data.message` exist — a plain network failure (no
 * connection, timeout, CORS) rejects with an AxiosError that has no
 * `response` at all, and accessing `.data.message` on it directly throws
 * a second, more confusing error on top of the original one.
 *
 * Usage: toast.error(getErrorMessage(err, "Failed to save changes"));
 */
export function getErrorMessage(error: unknown, fallback = "Something went wrong. Please try again."): string {
  if (axios.isAxiosError(error)) {
    const data = error.response?.data as { message?: string; error?: string } | undefined;
    if (data?.message) return data.message;
    if (data?.error) return data.error;

    if (error.code === "ECONNABORTED") return "Request timed out. Please check your connection and try again.";
    if (!error.response) return "Network error — please check your internet connection.";

    return error.message || fallback;
  }

  if (error instanceof Error) return error.message || fallback;

  return fallback;
}
