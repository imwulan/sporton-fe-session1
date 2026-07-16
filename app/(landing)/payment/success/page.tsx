import type { Metadata } from "next";
import PaymentSuccessContent from "../../components/payment-status/payment-success-content";

export const metadata: Metadata = {
  title: "Order Confirmed | SportOn",
};

export default function PaymentSuccessPage() {
  return <PaymentSuccessContent />;
}
