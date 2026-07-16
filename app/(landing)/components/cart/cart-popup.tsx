"use client";

import { useEffect, useRef } from "react";
import { FiX, FiShoppingBag } from "react-icons/fi";
import Button from "../ui/button";
import CartItemRow from "./cart-item-row";
import { useCart } from "../../context/cart-context";

const CartPopup = () => {
  const {
    items,
    isCartOpen,
    closeCart,
    subtotal,
    removeItem,
    increaseQuantity,
    decreaseQuantity,
  } = useCart();

  const closeButtonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!isCartOpen) {
      return;
    }

    document.body.style.overflow = "hidden";
    closeButtonRef.current?.focus();

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        closeCart();
      }
    };

    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = "";
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isCartOpen, closeCart]);

  if (!isCartOpen) {
    return null;
  }

  const formattedSubtotal = Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumSignificantDigits: 3,
  }).format(subtotal);

  return (
    <div className="fixed inset-0 z-50">
      <div
        aria-hidden="true"
        onClick={closeCart}
        className="absolute inset-0 bg-dark/50"
      />

      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="cart-popup-title"
        className="absolute right-0 top-0 flex h-full w-full flex-col bg-white shadow-xl sm:max-w-md"
      >
        <div className="flex items-center justify-between border-b border-dark/10 px-5 py-5 sm:px-6">
          <h2 id="cart-popup-title" className="text-lg font-bold">
            Your Cart{items.length > 0 ? ` (${items.length})` : ""}
          </h2>
          <button
            type="button"
            ref={closeButtonRef}
            onClick={closeCart}
            aria-label="Close cart"
            className="cursor-pointer"
          >
            <FiX size={24} />
          </button>
        </div>

        {items.length === 0 ? (
          <div className="flex flex-1 flex-col items-center justify-center gap-4 px-6 text-center">
            <FiShoppingBag size={48} className="text-dark/20" />
            <p className="text-dark/60">Your cart is empty.</p>
            <Button variant="dark" size="small" onClick={closeCart}>
              Continue Shopping
            </Button>
          </div>
        ) : (
          <>
            <div className="flex-1 overflow-y-auto px-5 py-5 sm:px-6">
              <ul className="flex flex-col gap-6">
                {items.map((item) => (
                  <li key={item.id}>
                    <CartItemRow
                      item={item}
                      onIncrease={() => increaseQuantity(item.id)}
                      onDecrease={() => decreaseQuantity(item.id)}
                      onRemove={() => removeItem(item.id)}
                    />
                  </li>
                ))}
              </ul>
            </div>

            <div className="border-t border-dark/10 px-5 py-5 sm:px-6">
              <div className="mb-4 flex items-center justify-between font-medium">
                <span>Subtotal</span>
                <span className="text-primary">{formattedSubtotal}</span>
              </div>
              <Button href="/checkout" onClick={closeCart} className="w-full">
                Checkout
              </Button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default CartPopup;
