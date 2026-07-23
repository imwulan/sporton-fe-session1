export type TStatusCategory = "success" | "pending" | "rejected" | "unknown";

export type TStatusPresentation = {
  category: TStatusCategory;
  label: string;
  headline: string;
  message: string;
  badgeClassName: string;
};

const capitalize = (value: string): string =>
  value.length > 0 ? value.charAt(0).toUpperCase() + value.slice(1) : value;

/**
 * schemas.txt only ever shows "pending" as an example status value —
 * there's no documented enum of every possible value. This maps the
 * common ones a backend like this would realistically use, and falls
 * back to displaying whatever raw string comes back (capitalized)
 * rather than hiding or misrepresenting an unrecognized status.
 */
export const getStatusPresentation = (
  status: string,
  customerName: string
): TStatusPresentation => {
  const normalized = status.trim().toLowerCase();

  if (["paid", "success", "completed"].includes(normalized)) {
    return {
      category: "success",
      label: "Paid",
      headline: "Payment Successful!",
      message: `Thank you, ${customerName}. Your payment has been confirmed and your order is now being processed.`,
      badgeClassName: "bg-green-100 text-green-700",
    };
  }

  if (["rejected", "failed", "cancelled"].includes(normalized)) {
    return {
      category: "rejected",
      label: capitalize(status) || "Rejected",
      headline: "Payment Rejected",
      message: `Hi ${customerName}, we couldn't verify your payment proof. Please contact us or try uploading it again.`,
      badgeClassName: "bg-red-100 text-red-700",
    };
  }

  if (normalized === "pending") {
    return {
      category: "pending",
      label: "Pending",
      headline: "Payment Received — Awaiting Confirmation",
      message: `Thank you, ${customerName}. We've received your payment proof and it's currently being reviewed.`,
      badgeClassName: "bg-yellow-100 text-yellow-700",
    };
  }

  return {
    category: "unknown",
    label: capitalize(status) || "Unknown",
    headline: "Order Received",
    message: `Thank you, ${customerName}. We're processing your order.`,
    badgeClassName: "bg-gray-100 text-gray-700",
  };
};
