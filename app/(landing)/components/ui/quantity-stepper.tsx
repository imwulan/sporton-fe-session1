"use client";

import { FiMinus, FiPlus } from "react-icons/fi";

type TQuantityStepperProps = {
  quantity: number;
  onIncrease: () => void;
  onDecrease: () => void;
  min?: number;
  max?: number;
};

const QuantityStepper = ({
  quantity,
  onIncrease,
  onDecrease,
  min = 1,
  max,
}: TQuantityStepperProps) => {
  return (
    <div className="inline-flex items-center gap-5 border border-dark/15 px-5 py-3">
      <button
        type="button"
        onClick={onDecrease}
        disabled={quantity <= min}
        aria-label="Decrease quantity"
        className="cursor-pointer duration-300 disabled:cursor-not-allowed disabled:opacity-30"
      >
        <FiMinus size={18} />
      </button>
      <span className="min-w-6 text-center font-medium" aria-live="polite">
        {quantity}
      </span>
      <button
        type="button"
        onClick={onIncrease}
        disabled={max !== undefined && quantity >= max}
        aria-label="Increase quantity"
        className="cursor-pointer duration-300 disabled:cursor-not-allowed disabled:opacity-30"
      >
        <FiPlus size={18} />
      </button>
    </div>
  );
};

export default QuantityStepper;
