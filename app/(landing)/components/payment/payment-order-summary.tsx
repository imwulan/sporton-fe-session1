import CheckoutItemRow from "../checkout/checkout-item-row";
import CostBreakdown from "../checkout/cost-breakdown";
import type { TCartItem } from "../../context/cart-context";

type TPaymentOrderSummaryProps = {
  items: TCartItem[];
  subtotal: number;
  shippingCost: number;
};

const PaymentOrderSummary = ({
  items,
  subtotal,
  shippingCost,
}: TPaymentOrderSummaryProps) => {
  return (
    <div className="flex flex-col gap-6 bg-primary-light p-5 sm:p-6">
      <h2 className="text-lg font-bold sm:text-xl">Order Summary</h2>

      <ul className="flex flex-col gap-5">
        {items.map((item) => (
          <li key={item.id}>
            <CheckoutItemRow item={item} />
          </li>
        ))}
      </ul>

      <CostBreakdown subtotal={subtotal} shippingCost={shippingCost} />
    </div>
  );
};

export default PaymentOrderSummary;
