import { toast } from "react-toastify";

export async function apiFetch(input: RequestInfo | URL, init?: RequestInit): Promise<Response> {
  const response = await fetch(input, init);

  if (response.status === 429) {
    try {
      const clone = response.clone();
      const data = await clone.json();
      const message = data?.message || "⚠️ Too many requests. Please slow down and try again later.";
      toast.error(message, {
        toastId: "rate-limit-warning",
      });
    } catch {
      toast.error("⚠️ Too many requests. Please slow down and try again later.", {
        toastId: "rate-limit-warning",
      });
    }
  }

  return response;
}
