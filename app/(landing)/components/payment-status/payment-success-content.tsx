"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { FiCheckCircle, FiClock, FiXCircle, FiHelpCircle } from "react-icons/fi";
import Container from "../ui/container";
import Button from "../ui/button";
import PaymentOrderSummary from "../payment/payment-order-summary";
import { useCart } from "../../context/cart-context";
import type { TCartItem } from "../../context/cart-context";
import type { TApiTransaction } from "../../types/api";
import { SHIPPING_COST } from "../../data/shipping";
import { getTransactionById } from "../../services/transactions-service";
import { getStatusPresentation } from "../../lib/transaction-status";
import type { TStatusCategory } from "../../lib/transaction-status";

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

const STATUS_ICONS: Record<TStatusCategory, React.ReactNode> = {
  success: <FiCheckCircle size={64} className="text-green-600" aria-hidden="true" />,
  pending: <FiClock size={64} className="text-yellow-600" aria-hidden="true" />,
  rejected: <FiXCircle size={64} className="text-red-600" aria-hidden="true" />,
  unknown: <FiHelpCircle size={64} className="text-dark/40" aria-hidden="true" />,
};

const PaymentSuccessContent = () => {
  const { items, subtotal, transaction, clearCart } = useCart();
  const router = useRouter();

  /**
   * Snapshots the cart's display details (name/image/price per item) on
   * first render, before clearCart() wipes them below. The Transaction
   * response only carries { productId, qty } per item, not the display
   * details a receipt needs.
   */
  const [itemsSnapshot] = useState<TCartItem[]>(() => items);
  const [subtotalSnapshot] = useState<number>(() => subtotal);

  // The transaction saved in context reflects whatever it was at the
  // moment of checkout/payment upload. This fetches the live record so
  // status changes made after that (e.g. an admin marking it paid or
  // rejected) are actually reflected here, instead of trusting a
  // possibly-stale local copy.
  const [liveTransaction, setLiveTransaction] = useState<TApiTransaction | null>(
    null
  );
  const [statusFetchError, setStatusFetchError] = useState(false);

  useEffect(() => {
    if (!transaction) {
      router.replace("/");
      return;
    }

    clearCart();
    // Runs once on mount only.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (!transaction) {
      return;
    }

    let isCancelled = false;

    getTransactionById(transaction._id)
      .then((fresh) => {
        if (!isCancelled) {
          setLiveTransaction(fresh);
        }
      })
      .catch(() => {
        if (!isCancelled) {
          setStatusFetchError(true);
        }
      });

    return () => {
      isCancelled = true;
    };
  }, [transaction]);

  if (!transaction) {
    return null;
  }

  // Prefer the freshly-fetched record; fall back to the context copy
  // (from checkout/payment) so the page still renders immediately while
  // the live fetch is in flight, or if it fails outright.
  const displayTransaction = liveTransaction ?? transaction;
  const presentation = getStatusPresentation(
    displayTransaction.status,
    displayTransaction.customerName
  );

  return (
    <main>
      <Container className="py-12 lg:py-16">
        <div className="mx-auto flex max-w-xl flex-col items-center gap-3 text-center">
          {STATUS_ICONS[presentation.category]}
          <h1 className="text-2xl font-bold sm:text-3xl">
            {presentation.headline}
          </h1>
          <p className="text-dark/70">{presentation.message}</p>
          {statusFetchError && (
            <p className="text-xs text-dark/40">
              Showing the status from your last update — couldn&apos;t refresh
              the latest status just now.
            </p>
          )}
        </div>

        <div className="mx-auto mt-10 max-w-xl border border-dark/10 p-5 sm:p-6">
          <dl className="grid grid-cols-2 gap-y-3 text-sm sm:text-base">
            <dt className="text-dark/60">Order Number</dt>
            <dd className="text-right font-medium">{displayTransaction._id}</dd>

            <dt className="text-dark/60">Order Date</dt>
            <dd className="text-right font-medium">
              {formatDate(displayTransaction.createdAt)}
            </dd>

            <dt className="text-dark/60">Customer Name</dt>
            <dd className="text-right font-medium">
              {displayTransaction.customerName}
            </dd>

            <dt className="text-dark/60">Payment Method</dt>
            <dd className="text-right font-medium">Bank Transfer</dd>

            <dt className="text-dark/60">Status</dt>
            <dd className="text-right">
              <span
                className={`inline-block px-2.5 py-1 text-xs font-medium ${presentation.badgeClassName}`}
              >
                {presentation.label}
              </span>
            </dd>

            <dt className="text-dark/60">Payment Total</dt>
            <dd className="text-right font-medium text-primary">
              {formatPrice(displayTransaction.totalPayment)}
            </dd>

            <div className="col-span-2 mt-1 flex flex-col gap-1 border-t border-dark/10 pt-3">
              <dt className="text-dark/60">Shipping Address</dt>
              <dd className="font-medium">{displayTransaction.customerAddress}</dd>
            </div>
          </dl>
        </div>

        <div className="mx-auto mt-10 max-w-xl">
          <PaymentOrderSummary
            items={itemsSnapshot}
            subtotal={subtotalSnapshot}
            shippingCost={SHIPPING_COST}
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
