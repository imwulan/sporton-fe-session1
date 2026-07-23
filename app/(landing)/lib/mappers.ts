import { ASSET_BASE_URL } from "./api-config";
import type {
  TApiCategory,
  TApiProduct,
  TApiPurchasedItem,
  TApiBank,
} from "../types/api";
import type { TProduct } from "../types/product";
import type { TCartItem } from "../context/cart-context";
import type { TCheckoutFormData } from "../types/checkout";
import type { TCheckoutPayload } from "../services/transactions-service";

export const buildAssetUrl = (relativePath: string): string => {
  const normalizedPath = relativePath.startsWith("/")
    ? relativePath
    : `/${relativePath}`;
  return `${ASSET_BASE_URL}${normalizedPath}`;
};

/**
 * Maps a backend Product (nested `category` object, single `imageUrl`)
 * onto the existing `TProduct` type already used across the app (flat
 * `category` string, `images` array). This is the only place that needs
 * to know the backend's shape — ProductCard, ProductsSection, etc. all
 * keep consuming `TProduct` exactly as before.
 */
export const mapApiProductToProduct = (apiProduct: TApiProduct): TProduct => {
  return {
    id: apiProduct._id,
    name: apiProduct.name,
    category: apiProduct.category?.name ?? "Uncategorized",
    price: apiProduct.price,
    images: [buildAssetUrl(apiProduct.imageUrl)],
    description: apiProduct.description,
  };
};

export type TCategoryCardData = {
  id: string;
  name: string;
  imgUrl: string;
};

export const mapApiCategoryToCategoryCard = (
  apiCategory: TApiCategory
): TCategoryCardData => {
  return {
    id: apiCategory._id,
    name: apiCategory.name,
    imgUrl: buildAssetUrl(apiCategory.imageUrl),
  };
};

/**
 * There is no Cart resource on this backend (confirmed against
 * schemas.txt and every endpoint screenshot — only Auth, Banks,
 * Categories, Products, and Transactions exist). CartContext therefore
 * remains the sole source of truth for the cart, exactly as built in
 * Session 2. This function only prepares that client-side state for
 * the one backend call that does consume it: POST /transactions/checkout,
 * whose `purchasedItems` field expects `{ productId, qty }` entries.
 *
 * `item.id` is already the real backend `_id`, since both the Home Page
 * and Product Detail Page now source their `id` from the API (via
 * mapApiProductToProduct) before ever reaching addItem() — so no
 * additional lookup is needed here.
 */
export const mapCartItemsToPurchasedItems = (
  items: TCartItem[]
): TApiPurchasedItem[] => {
  return items.map((item) => ({
    productId: item.id,
    qty: item.quantity,
  }));
};

/**
 * Combines CheckoutForm's data with the cart into the exact payload
 * POST /transactions/checkout expects. Two real mismatches between our
 * form and the backend's Transaction schema, resolved here in one place:
 *
 * - `customerAddress` on the backend is a single string, but our form
 *   collects address/city/province/postalCode separately — concatenated
 *   here the same way the Payment Status page already displays it.
 * - `email` and `notes` have no field on the backend Transaction schema
 *   at all. They are NOT sent — there's nowhere for them to go without
 *   inventing a field the API doesn't document. This is a known,
 *   flagged limitation, not an oversight.
 */
export const mapCheckoutToTransactionPayload = (
  checkoutInfo: TCheckoutFormData,
  items: TCartItem[],
  totalPayment: number
): TCheckoutPayload => {
  return {
    customerName: checkoutInfo.fullName,
    customerContact: checkoutInfo.phone,
    customerAddress: `${checkoutInfo.address}, ${checkoutInfo.city}, ${checkoutInfo.province} ${checkoutInfo.postalCode}`,
    purchasedItems: mapCartItemsToPurchasedItems(items),
    totalPayment,
  };
};

export type TBankDisplay = {
  id: string;
  bankName: string;
  accountName: string;
  accountNumber: string;
};

export const mapApiBankToBankDisplay = (apiBank: TApiBank): TBankDisplay => {
  return {
    id: apiBank._id,
    bankName: apiBank.bankName,
    accountName: apiBank.accountName,
    accountNumber: apiBank.accountNumber,
  };
};
