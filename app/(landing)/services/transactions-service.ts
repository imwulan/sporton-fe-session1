import { apiGet, apiPostFormData, apiPutFormData } from "../lib/api-client";
import type { TApiTransaction, TApiPurchasedItem } from "../types/api";

export type TCheckoutPayload = {
  customerName: string;
  customerContact: string;
  customerAddress: string;
  purchasedItems: TApiPurchasedItem[];
  totalPayment: number;
};

/**
 * POST /transactions/checkout. The endpoint is documented as
 * multipart/form-data and also lists an `image` field alongside the
 * customer/order fields — but Swagger doesn't indicate per-field
 * requiredness for multipart bodies here, only that a body is required
 * overall. Since payment proof is uploaded on a separate Payment step
 * (preserving the existing Session 2 flow), this call is sent WITHOUT
 * an image. If the backend actually rejects transaction creation
 * without one, that's the first thing to verify against the live API —
 * the resulting error will surface through ApiError either way, not
 * fail silently.
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
