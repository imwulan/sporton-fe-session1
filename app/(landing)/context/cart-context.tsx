"use client";

import { createContext, useContext, useMemo, useState } from "react";
import type { TCheckoutFormData } from "../types/checkout";
import type { TApiTransaction } from "../types/api";
import { getProductById } from "../services/products-service";
import { buildAssetUrl } from "../lib/mappers";
import { formatPrice } from "../lib/format";

export type TCartItem = {
  id: string;
  name: string;
  price: number;
  image: string;
  quantity: number;
  /**
   * Stock last known from the backend. `null` means it hasn't been
   * checked yet (e.g. right after adding an item, before the Cart
   * Popup has opened and triggered a sync).
   */
  stock: number | null;
};

type TAddItemInput = Omit<TCartItem, "quantity" | "stock">;

type TCartContextValue = {
  items: TCartItem[];
  totalItems: number;
  subtotal: number;
  isCartOpen: boolean;
  openCart: () => void;
  closeCart: () => void;
  addItem: (item: TAddItemInput, quantity?: number) => void;
  removeItem: (id: string) => void;
  increaseQuantity: (id: string) => void;
  decreaseQuantity: (id: string) => void;
  checkoutInfo: TCheckoutFormData | null;
  setCheckoutInfo: (info: TCheckoutFormData) => void;
  /**
   * The real Transaction returned by POST /transactions/checkout. This
   * replaces Session 2's client-fabricated `lastOrder` (which used
   * Date.now()/Math.random() to invent an order number) now that a real
   * backend call produces a real `_id`/`status`/etc.
   */
  transaction: TApiTransaction | null;
  setTransaction: (transaction: TApiTransaction) => void;
  clearCart: () => void;
  /**
   * Re-checks every cart item against GET /products/:id (the only
   * product-detail endpoint the backend exposes — there is no /cart
   * resource to sync against). Updates name/image/price/stock in
   * place, clamps quantity down if stock has dropped below it, and
   * collects human-readable messages describing what changed.
   */
  syncCartWithBackend: () => Promise<void>;
  isSyncing: boolean;
  syncWarnings: string[];
  hasOutOfStockItem: boolean;
};

const CartContext = createContext<TCartContextValue | undefined>(undefined);

type TCartProviderProps = {
  children: React.ReactNode;
};

export const CartProvider = ({ children }: TCartProviderProps) => {
  const [items, setItems] = useState<TCartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [checkoutInfo, setCheckoutInfoState] = useState<TCheckoutFormData | null>(
    null
  );
  const [transaction, setTransactionState] = useState<TApiTransaction | null>(
    null
  );
  const [isSyncing, setIsSyncing] = useState(false);
  const [syncWarnings, setSyncWarnings] = useState<string[]>([]);

  const openCart = () => setIsCartOpen(true);
  const closeCart = () => setIsCartOpen(false);

  const addItem = (item: TAddItemInput, quantity: number = 1) => {
    setItems((prev) => {
      const existingItem = prev.find((cartItem) => cartItem.id === item.id);

      if (existingItem) {
        return prev.map((cartItem) =>
          cartItem.id === item.id
            ? { ...cartItem, quantity: cartItem.quantity + quantity }
            : cartItem
        );
      }

      return [...prev, { ...item, quantity, stock: null }];
    });
    setIsCartOpen(true);
  };

  const removeItem = (id: string) => {
    setItems((prev) => prev.filter((cartItem) => cartItem.id !== id));
  };

  const increaseQuantity = (id: string) => {
    setItems((prev) =>
      prev.map((cartItem) => {
        if (cartItem.id !== id) {
          return cartItem;
        }

        // Don't increase past the last known stock figure. This uses
        // the cached `stock` from the last sync rather than making a
        // fresh request on every click.
        if (cartItem.stock !== null && cartItem.quantity >= cartItem.stock) {
          return cartItem;
        }

        return { ...cartItem, quantity: cartItem.quantity + 1 };
      })
    );
  };

  const decreaseQuantity = (id: string) => {
    setItems((prev) =>
      prev.map((cartItem) =>
        cartItem.id === id && cartItem.quantity > 1
          ? { ...cartItem, quantity: cartItem.quantity - 1 }
          : cartItem
      )
    );
  };

  const setCheckoutInfo = (info: TCheckoutFormData) => {
    setCheckoutInfoState(info);
  };

  const setTransaction = (nextTransaction: TApiTransaction) => {
    setTransactionState(nextTransaction);
  };

  const totalItems = useMemo(
    () => items.reduce((sum, item) => sum + item.quantity, 0),
    [items]
  );

  const subtotal = useMemo(
    () => items.reduce((sum, item) => sum + item.quantity * item.price, 0),
    [items]
  );

  const hasOutOfStockItem = useMemo(
    () => items.some((item) => item.stock === 0),
    [items]
  );

  /**
   * There is no /cart endpoint on this backend, so "syncing the cart"
   * means re-fetching each item individually via GET /products/:id —
   * the only endpoint that has current price/stock/name/image. Runs
   * one request per distinct cart item, in parallel.
   */
  const syncCartWithBackend = async () => {
    if (items.length === 0) {
      setSyncWarnings([]);
      return;
    }

    setIsSyncing(true);
    const warnings: string[] = [];

    try {
      const syncedItems = await Promise.all(
        items.map(async (item) => {
          try {
            const apiProduct = await getProductById(item.id);

            if (!apiProduct) {
              warnings.push(`${item.name} is no longer available.`);
              return { ...item, stock: 0 };
            }

            const latestName = apiProduct.name;
            const latestImage = buildAssetUrl(apiProduct.imageUrl);
            const latestPrice = apiProduct.price;
            const latestStock = apiProduct.stock;

            let nextQuantity = item.quantity;

            if (latestStock === 0) {
              warnings.push(`${latestName} is now out of stock.`);
            } else if (latestStock < item.quantity) {
              warnings.push(
                `${latestName} quantity was reduced from ${item.quantity} to ${latestStock} (only ${latestStock} left in stock).`
              );
              nextQuantity = latestStock;
            }

            if (latestPrice !== item.price) {
              warnings.push(
                `${latestName}'s price was updated to ${formatPrice(latestPrice)}.`
              );
            }

            return {
              ...item,
              name: latestName,
              image: latestImage,
              price: latestPrice,
              stock: latestStock,
              quantity: nextQuantity,
            };
          } catch {
            // This one item's check failed (network/API error) — keep
            // its existing data rather than losing it or blocking the
            // rest of the cart from syncing.
            return item;
          }
        })
      );

      setItems(syncedItems);
      setSyncWarnings(warnings);
    } finally {
      setIsSyncing(false);
    }
  };

  /**
   * Clears the live cart + checkout form info. Deliberately does NOT
   * clear `transaction` — the Payment Status page still needs it to
   * display order details after this runs. Also deliberately called
   * from the Payment Status page itself (after mount), never from the
   * Checkout/Payment pages directly, to avoid re-triggering their own
   * "checkoutInfo/items missing" guards mid-navigation.
   */
  const clearCart = () => {
    setItems([]);
    setCheckoutInfoState(null);
    setSyncWarnings([]);
  };

  const value: TCartContextValue = {
    items,
    totalItems,
    subtotal,
    isCartOpen,
    openCart,
    closeCart,
    addItem,
    removeItem,
    increaseQuantity,
    decreaseQuantity,
    checkoutInfo,
    setCheckoutInfo,
    transaction,
    setTransaction,
    clearCart,
    syncCartWithBackend,
    isSyncing,
    syncWarnings,
    hasOutOfStockItem,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};

export const useCart = (): TCartContextValue => {
  const context = useContext(CartContext);

  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }

  return context;
};
