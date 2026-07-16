import Image from "next/image";
import { FiTrash2 } from "react-icons/fi";
import QuantityStepper from "../ui/quantity-stepper";
import type { TCartItem } from "../../context/cart-context";

type TCartItemRowProps = {
  item: TCartItem;
  onIncrease: () => void;
  onDecrease: () => void;
  onRemove: () => void;
};

const CartItemRow = ({
  item,
  onIncrease,
  onDecrease,
  onRemove,
}: TCartItemRowProps) => {
  const formatPrice = (value: number) =>
    Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      maximumSignificantDigits: 3,
    }).format(value);

  return (
    <div className="flex gap-4">
      <div className="relative flex aspect-square w-20 shrink-0 items-center justify-center bg-primary-light">
        <Image
          src={`/images/products/${item.image}`}
          alt={item.name}
          width={80}
          height={80}
          className="aspect-square object-contain"
        />
      </div>

      <div className="flex flex-1 flex-col gap-2">
        <div className="flex items-start justify-between gap-2">
          <h3 className="text-sm font-medium sm:text-base">{item.name}</h3>
          <button
            type="button"
            onClick={onRemove}
            aria-label={`Remove ${item.name} from cart`}
            className="shrink-0 cursor-pointer text-dark/40 duration-300 hover:text-primary"
          >
            <FiTrash2 size={18} />
          </button>
        </div>

        <div className="text-sm text-dark/60">{formatPrice(item.price)}</div>

        <div className="flex flex-wrap items-center justify-between gap-3">
          <QuantityStepper
            quantity={item.quantity}
            onIncrease={onIncrease}
            onDecrease={onDecrease}
            min={1}
          />
          <div className="text-sm font-medium text-primary sm:text-base">
            {formatPrice(item.price * item.quantity)}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartItemRow;
