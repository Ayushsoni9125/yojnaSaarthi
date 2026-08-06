import { toast } from "react-toastify";

export async function apiFetch(input: RequestInfo | URL, init?: RequestInit): Promise<Response> {
  const response = await fetch(input, init);

  if (response.status === 429) {
    let message = "⚠️ Too many requests. Please slow down and try again later.";
    try {
      const contentType = response.headers.get("content-type");
      if (contentType && contentType.includes("application/json")) {
        const clone = response.clone();
        const data = await clone.json();
        if (data?.message) {
          message = data.message;
        }
      }
    } catch {
      // Use fallback default rate-limit message
    }
    toast.error(message, {
      toastId: "rate-limit-warning",
    });
  }

  return response;
}

export async function safeJsonParse<T = any>(response: Response): Promise<{ success: boolean; data?: T; message?: string }> {
  try {
    const contentType = response.headers.get("content-type");
    if (!contentType || !contentType.includes("application/json")) {
      return { success: false, message: `Server returned non-JSON response (${response.status})` };
    }
    const data = await response.json();
    return data;
  } catch (error: any) {
    return { success: false, message: error?.message || "Failed to parse JSON response" };
  }
}
