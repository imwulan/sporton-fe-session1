"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import Container from "../components/ui/container";
import Button from "../components/ui/button";
import FileUpload from "../components/ui/file-upload";
import CustomerShippingSummary from "../components/payment/customer-shipping-summary";
import PaymentOrderSummary from "../components/payment/payment-order-summary";
import BankInfo from "../components/payment/bank-info";
import { useCart } from "../context/cart-context";
import { SHIPPING_COST } from "../data/shipping";

const MAX_FILE_SIZE_BYTES = 5 * 1024 * 1024;

export default function PaymentPage() {
  const { items, subtotal, checkoutInfo, placeOrder } = useCart();
  const router = useRouter();

  const [proofFile, setProofFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [uploadError, setUploadError] = useState<string | undefined>(undefined);

  const previewUrlRef = useRef<string | null>(null);

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

  const handleConfirmPayment = () => {
    if (!proofFile) {
      setUploadError("Please upload your payment proof before confirming.");
      return;
    }

    const order = placeOrder(SHIPPING_COST);

    if (!order) {
      // Defensive fallback: the page guard above already ensures
      // checkoutInfo/items exist, so this shouldn't happen in practice.
      router.replace("/checkout");
      return;
    }

    router.push("/payment/success");
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
              <BankInfo />
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

            <Button onClick={handleConfirmPayment} className="mt-6 w-full">
              Confirm Payment
            </Button>
          </div>
        </div>
      </Container>
    </main>
  );
}
