import { apiGet } from "../lib/api-client";
import type { TApiBank } from "../types/api";

export const getBanks = async (): Promise<TApiBank[]> => {
  return apiGet<TApiBank[]>("/banks", { cache: "no-store" });
};
