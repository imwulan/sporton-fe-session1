import Image from "next/image";
import type { TCartItem } from "../../context/cart-context";

type TCheckoutItemRowProps = {
  item: TCartItem;
};

const formatPrice = (value: number) =>
  Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumSignificantDigits: 3,
  }).format(value);

const CheckoutItemRow = ({ item }: TCheckoutItemRowProps) => {
  return (
    <div className="flex gap-4">
      <div className="relative flex aspect-square w-16 shrink-0 items-center justify-center bg-primary-light">
        <Image
          src={`/images/products/${item.image}`}
          alt={item.name}
          width={64}
          height={64}
          className="aspect-square object-contain"
        />
      </div>

      <div className="flex flex-1 items-start justify-between gap-2">
        <div>
          <h3 className="text-sm font-medium sm:text-base">{item.name}</h3>
          <div className="text-sm text-dark/60">
            {item.quantity} × {formatPrice(item.price)}
          </div>
        </div>
        <div className="whitespace-nowrap text-sm font-medium text-primary sm:text-base">
          {formatPrice(item.price * item.quantity)}
        </div>
      </div>
    </div>
  );
};

export default CheckoutItemRow;
