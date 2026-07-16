"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { FiCheckCircle } from "react-icons/fi";
import Container from "../ui/container";
import Button from "../ui/button";
import PaymentOrderSummary from "../payment/payment-order-summary";
import { useCart } from "../../context/cart-context";

const formatPrice = (value: number) =>
  Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumSignificantDigits: 3,
  }).format(value);

const formatDate = (isoDate: string) =>
  new Intl.DateTimeFormat("en-US", {
    day: "numeric",
    month: "long",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(isoDate));

const PaymentSuccessContent = () => {
  const { lastOrder, clearCart } = useCart();
  const router = useRouter();

  useEffect(() => {
    if (!lastOrder) {
      router.replace("/");
      return;
    }

    clearCart();
    // Runs once on mount only: lastOrder is a frozen snapshot of the
    // completed order and clearCart must fire exactly once when this
    // page loads, not whenever lastOrder happens to change identity.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (!lastOrder) {
    return null;
  }

  const total = lastOrder.subtotal + lastOrder.shippingCost;

  return (
    <main>
      <Container className="py-12 lg:py-16">
        <div className="mx-auto flex max-w-xl flex-col items-center gap-3 text-center">
          <FiCheckCircle size={64} className="text-primary" aria-hidden="true" />
          <h1 className="text-2xl font-bold sm:text-3xl">
            Payment Successful!
          </h1>
          <p className="text-dark/70">
            Thank you, {lastOrder.checkoutInfo.fullName}. Your order has been
            received and is now being processed.
          </p>
        </div>

        <div className="mx-auto mt-10 max-w-xl border border-dark/10 p-5 sm:p-6">
          <dl className="grid grid-cols-2 gap-y-3 text-sm sm:text-base">
            <dt className="text-dark/60">Order Number</dt>
            <dd className="text-right font-medium">{lastOrder.orderNumber}</dd>

            <dt className="text-dark/60">Order Date</dt>
            <dd className="text-right font-medium">
              {formatDate(lastOrder.orderDate)}
            </dd>

            <dt className="text-dark/60">Customer Name</dt>
            <dd className="text-right font-medium">
              {lastOrder.checkoutInfo.fullName}
            </dd>

            <dt className="text-dark/60">Payment Method</dt>
            <dd className="text-right font-medium">Bank Transfer</dd>

            <dt className="text-dark/60">Payment Total</dt>
            <dd className="text-right font-medium text-primary">
              {formatPrice(total)}
            </dd>

            <div className="col-span-2 mt-1 flex flex-col gap-1 border-t border-dark/10 pt-3">
              <dt className="text-dark/60">Shipping Address</dt>
              <dd className="font-medium">
                {lastOrder.checkoutInfo.address}, {lastOrder.checkoutInfo.city},{" "}
                {lastOrder.checkoutInfo.province} {lastOrder.checkoutInfo.postalCode}
              </dd>
            </div>
          </dl>
        </div>

        <div className="mx-auto mt-10 max-w-xl">
          <PaymentOrderSummary
            items={lastOrder.items}
            subtotal={lastOrder.subtotal}
            shippingCost={lastOrder.shippingCost}
          />
        </div>

        <div className="mx-auto mt-10 flex max-w-xl flex-col items-center gap-4 sm:flex-row sm:justify-center">
          <Button href="/" variant="dark" className="w-full sm:w-auto">
            Back to Home
          </Button>
          <Button href="/#products-section" className="w-full sm:w-auto">
            Continue Shopping
          </Button>
        </div>
      </Container>
    </main>
  );
};

export default PaymentSuccessContent;
