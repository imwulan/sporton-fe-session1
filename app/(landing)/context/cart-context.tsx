"use client";

import { createContext, useContext, useMemo, useState } from "react";
import type { TCheckoutFormData } from "../types/checkout";

export type TCartItem = {
  id: string;
  name: string;
  price: number;
  image: string;
  quantity: number;
};

export type TOrderSnapshot = {
  orderNumber: string;
  orderDate: string;
  items: TCartItem[];
  subtotal: number;
  shippingCost: number;
  checkoutInfo: TCheckoutFormData;
};

type TAddItemInput = Omit<TCartItem, "quantity">;

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
  lastOrder: TOrderSnapshot | null;
  placeOrder: (shippingCost: number) => TOrderSnapshot | null;
  clearCart: () => void;
};

const CartContext = createContext<TCartContextValue | undefined>(undefined);

type TCartProviderProps = {
  children: React.ReactNode;
};

const generateOrderNumber = (): string => {
  const datePart = new Date().toISOString().slice(0, 10).replace(/-/g, "");
  const randomPart = Math.random().toString(36).slice(2, 8).toUpperCase();
  return `SPT-${datePart}-${randomPart}`;
};

export const CartProvider = ({ children }: TCartProviderProps) => {
  const [items, setItems] = useState<TCartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [checkoutInfo, setCheckoutInfoState] = useState<TCheckoutFormData | null>(
    null
  );
  const [lastOrder, setLastOrder] = useState<TOrderSnapshot | null>(null);

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

      return [...prev, { ...item, quantity }];
    });
    setIsCartOpen(true);
  };

  const removeItem = (id: string) => {
    setItems((prev) => prev.filter((cartItem) => cartItem.id !== id));
  };

  const increaseQuantity = (id: string) => {
    setItems((prev) =>
      prev.map((cartItem) =>
        cartItem.id === id
          ? { ...cartItem, quantity: cartItem.quantity + 1 }
          : cartItem
      )
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

  const totalItems = useMemo(
    () => items.reduce((sum, item) => sum + item.quantity, 0),
    [items]
  );

  const subtotal = useMemo(
    () => items.reduce((sum, item) => sum + item.quantity * item.price, 0),
    [items]
  );

  /**
   * Snapshots the current cart + checkout info into `lastOrder`.
   * Deliberately does NOT clear `items`/`checkoutInfo` — that happens
   * separately via `clearCart()`, called from the Payment Status page
   * after it mounts. Clearing here instead would re-trigger the Payment
   * Page's own "checkoutInfo/items missing" guard before navigation to
   * the success page completes, causing a redirect race.
   */
  const placeOrder = (shippingCost: number): TOrderSnapshot | null => {
    if (items.length === 0 || !checkoutInfo) {
      return null;
    }

    const snapshot: TOrderSnapshot = {
      orderNumber: generateOrderNumber(),
      orderDate: new Date().toISOString(),
      items,
      subtotal,
      shippingCost,
      checkoutInfo,
    };

    setLastOrder(snapshot);

    return snapshot;
  };

  const clearCart = () => {
    setItems([]);
    setCheckoutInfoState(null);
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
    lastOrder,
    placeOrder,
    clearCart,
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
