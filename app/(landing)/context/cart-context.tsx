"use client";

import { createContext, useContext, useMemo, useState } from "react";
import type { TCheckoutFormData } from "../types/checkout";
import type { TApiTransaction } from "../types/api";

export type TCartItem = {
  id: string;
  name: string;
  price: number;
  image: string;
  quantity: number;
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
  /**
   * The real Transaction returned by POST /transactions/checkout. This
   * replaces Session 2's client-fabricated `lastOrder` (which used
   * Date.now()/Math.random() to invent an order number) now that a real
   * backend call produces a real `_id`/`status`/etc.
   */
  transaction: TApiTransaction | null;
  setTransaction: (transaction: TApiTransaction) => void;
  clearCart: () => void;
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
