import { apiGet } from "../lib/api-client";
import type { TApiCategory } from "../types/api";

export const getCategories = async (): Promise<TApiCategory[]> => {
  return apiGet<TApiCategory[]>("/categories", { cache: "no-store" });
};
