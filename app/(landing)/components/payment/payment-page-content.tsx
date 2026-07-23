"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import Container from "../ui/container";
import Button from "../ui/button";
import FileUpload from "../ui/file-upload";
import CustomerShippingSummary from "./customer-shipping-summary";
import PaymentOrderSummary from "./payment-order-summary";
import BankInfo from "./bank-info";
import { useCart } from "../../context/cart-context";
import { SHIPPING_COST } from "../../data/shipping";
import { checkoutTransaction } from "../../services/transactions-service";
import { mapCheckoutToTransactionPayload } from "../../lib/mappers";
import { ApiError } from "../../lib/api-client";
import type { TBankDisplay } from "../../lib/mappers";

const MAX_FILE_SIZE_BYTES = 5 * 1024 * 1024;

type TPaymentPageContentProps = {
  banks: TBankDisplay[];
};

const PaymentPageContent = ({ banks }: TPaymentPageContentProps) => {
  const { items, subtotal, checkoutInfo, setTransaction } = useCart();
  const router = useRouter();

  const [proofFile, setProofFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [uploadError, setUploadError] = useState<string | undefined>(undefined);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const previewUrlRef = useRef<string | null>(null);

  // Guards on checkoutInfo + cart items — NOT on `transaction`, because
  // the transaction doesn't exist yet at this point. It's only created
  // once the user submits their payment proof below (the backend
  // requires the proof image to be present at creation time).
  useEffect(() => {
    if (!checkoutInfo || items.length === 0) {
      router.replace("/checkout");
    }
  }, [checkoutInfo, items, router]);

  useEffect(() => {
    return () => {
      if (previewUrlRef.current) {
        URL.revokeObjectURL(previewUrlRef.current);
      }
    };
  }, []);

  if (!checkoutInfo || items.length === 0) {
    return null;
  }

  const handleFileSelect = (file: File) => {
    if (!file.type.startsWith("image/")) {
      setUploadError("Please upload a valid image file (PNG, JPG, etc.).");
      return;
    }

    if (file.size > MAX_FILE_SIZE_BYTES) {
      setUploadError("File size must be under 5MB.");
      return;
    }

    if (previewUrlRef.current) {
      URL.revokeObjectURL(previewUrlRef.current);
    }

    const newPreviewUrl = URL.createObjectURL(file);
    previewUrlRef.current = newPreviewUrl;

    setProofFile(file);
    setPreviewUrl(newPreviewUrl);
    setUploadError(undefined);
  };

  const handleRemoveFile = () => {
    if (previewUrlRef.current) {
      URL.revokeObjectURL(previewUrlRef.current);
      previewUrlRef.current = null;
    }
    setProofFile(null);
    setPreviewUrl(null);
  };

  const handleConfirmPayment = async () => {
    if (!proofFile) {
      setUploadError("Please upload your payment proof before confirming.");
      return;
    }

    setSubmitError(null);
    setIsSubmitting(true);

    try {
      const totalPayment = subtotal + SHIPPING_COST;
      const payload = mapCheckoutToTransactionPayload(
        checkoutInfo,
        items,
        totalPayment,
        proofFile
      );
      const transaction = await checkoutTransaction(payload);

      setTransaction(transaction);
      router.push("/payment/success");
    } catch (error) {
      setSubmitError(
        error instanceof ApiError
          ? error.message
          : "Something went wrong while placing your order. Please try again."
      );
      setIsSubmitting(false);
    }
  };

  return (
    <main>
      <Container className="py-12 lg:py-16">
        <h1 className="mb-10 text-2xl font-bold sm:text-3xl">Payment</h1>

        <div className="flex flex-col gap-10 lg:flex-row lg:items-start lg:gap-14">
          <div className="flex w-full flex-col gap-10 lg:w-3/5">
            <CustomerShippingSummary checkoutInfo={checkoutInfo} />

            <div>
              <h2 className="mb-5 text-lg font-bold sm:text-xl">
                Payment Instructions
              </h2>
              <p className="mb-5 leading-relaxed text-dark/70">
                Transfer the total payment amount to one of the bank accounts
                below, then upload your payment proof so we can verify and
                process your order.
              </p>
              <BankInfo banks={banks} />
            </div>

            <div>
              <h2 className="mb-5 text-lg font-bold sm:text-xl">
                Upload Payment Proof
              </h2>
              <FileUpload
                label="Payment proof"
                previewUrl={previewUrl}
                fileName={proofFile?.name ?? null}
                error={uploadError}
                onFileSelect={handleFileSelect}
                onRemove={handleRemoveFile}
              />
            </div>
          </div>

          <div className="w-full lg:w-2/5">
            <PaymentOrderSummary
              items={items}
              subtotal={subtotal}
              shippingCost={SHIPPING_COST}
            />

            {submitError && (
              <div
                role="alert"
                className="mt-6 border border-red-500 bg-red-50 px-4 py-3 text-sm text-red-600"
              >
                {submitError}
              </div>
            )}

            <Button
              onClick={handleConfirmPayment}
              disabled={isSubmitting}
              className="mt-6 w-full disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:scale-100"
            >
              {isSubmitting ? "Placing Order..." : "Confirm Payment"}
            </Button>
          </div>
        </div>
      </Container>
    </main>
  );
};

export default PaymentPageContent;
