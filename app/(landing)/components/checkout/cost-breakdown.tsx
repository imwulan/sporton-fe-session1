const formatPrice = (value: number) =>
  Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumSignificantDigits: 3,
  }).format(value);

type TCostBreakdownProps = {
  subtotal: number;
  shippingCost: number;
};

const CostBreakdown = ({ subtotal, shippingCost }: TCostBreakdownProps) => {
  const total = subtotal + shippingCost;

  return (
    <div className="flex flex-col gap-3 border-t border-dark/10 pt-5 text-sm sm:text-base">
      <div className="flex items-center justify-between">
        <span>Subtotal</span>
        <span>{formatPrice(subtotal)}</span>
      </div>
      <div className="flex items-center justify-between">
        <span>Shipping</span>
        <span>{formatPrice(shippingCost)}</span>
      </div>
      <div className="flex items-center justify-between border-t border-dark/10 pt-3 text-base font-bold sm:text-lg">
        <span>Total</span>
        <span className="text-primary">{formatPrice(total)}</span>
      </div>
    </div>
  );
};

export default CostBreakdown;
