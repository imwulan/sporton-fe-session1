import { apiGet, ApiError } from "../lib/api-client";
import type { TApiProduct } from "../types/api";

export const getProducts = async (): Promise<TApiProduct[]> => {
  return apiGet<TApiProduct[]>("/products", { cache: "no-store" });
};

/**
 * Returns null (rather than throwing) specifically for a 404, so the
 * page can call Next.js's notFound() instead of rendering a generic
 * error state for what is actually a normal "product doesn't exist"
 * case. Any other failure (network error, 500, etc.) still throws.
 */
export const getProductById = async (
  id: string
): Promise<TApiProduct | null> => {
  try {
    return await apiGet<TApiProduct>(`/products/${id}`, { cache: "no-store" });
  } catch (error) {
    if (error instanceof ApiError && error.status === 404) {
      return null;
    }
    throw error;
  }
};
