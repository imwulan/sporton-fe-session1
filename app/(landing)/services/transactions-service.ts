import { apiGet, apiPostFormData, apiPutFormData } from "../lib/api-client";
import type { TApiTransaction, TApiPurchasedItem } from "../types/api";

export type TCheckoutPayload = {
  customerName: string;
  customerContact: string;
  customerAddress: string;
  purchasedItems: TApiPurchasedItem[];
  totalPayment: number;
  image: File;
};

/**
 * POST /transactions/checkout. CONFIRMED against the live backend (not
 * just Swagger's ambiguous per-field requiredness): calling this
 * without `image` returns "Payment proof image is required". So the
 * proof file must exist before this call can succeed — the UI has
 * been restructured so this is only ever called from the Payment step
 * (where a proof file is guaranteed by validation), not from Checkout.
 */
export const checkoutTransaction = async (
  payload: TCheckoutPayload
): Promise<TApiTransaction> => {
  const formData = new FormData();
  formData.append("customerName", payload.customerName);
  formData.append("customerContact", payload.customerContact);
  formData.append("customerAddress", payload.customerAddress);
  formData.append("purchasedItems", JSON.stringify(payload.purchasedItems));
  formData.append("totalPayment", String(payload.totalPayment));
  formData.append("image", payload.image);

  return apiPostFormData<TApiTransaction>("/transactions/checkout", formData);
};

export type TUpdateTransactionPayload = {
  image: File;
  status: string;
  purchasedItems: TApiPurchasedItem[];
  totalPayment: number;
  customerName: string;
  customerContact: string;
  customerAddress: string;
};

/**
 * PUT /transactions/:id. Per the Swagger docs, this expects the same
 * full field set as creation — not a partial "just the image" update —
 * so every field from the existing transaction record must be resent
 * alongside the new payment proof file.
 */
export const updateTransaction = async (
  id: string,
  payload: TUpdateTransactionPayload
): Promise<TApiTransaction> => {
  const formData = new FormData();
  formData.append("image", payload.image);
  formData.append("status", payload.status);
  formData.append("purchasedItems", JSON.stringify(payload.purchasedItems));
  formData.append("totalPayment", String(payload.totalPayment));
  formData.append("customerName", payload.customerName);
  formData.append("customerContact", payload.customerContact);
  formData.append("customerAddress", payload.customerAddress);

  return apiPutFormData<TApiTransaction>(`/transactions/${id}`, formData);
};

/**
 * GET /transactions/:id — used by the Payment Status page to display
 * the real, current status (which may have changed server-side since
 * the transaction was created/updated, e.g. an admin marking it paid
 * or rejected).
 */
export const getTransactionById = async (
  id: string
): Promise<TApiTransaction> => {
  return apiGet<TApiTransaction>(`/transactions/${id}`, { cache: "no-store" });
};
