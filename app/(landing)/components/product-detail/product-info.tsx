"use client";

import { useState } from "react";
import { FiShoppingBag } from "react-icons/fi";
import Button from "../ui/button";
import QuantityStepper from "../ui/quantity-stepper";
import { useCart } from "../../context/cart-context";
import type { TProduct } from "../../data/products";

type TProductInfoProps = {
  product: TProduct;
};

const ProductInfo = ({ product }: TProductInfoProps) => {
  const [quantity, setQuantity] = useState(1);
  const { addItem } = useCart();

  const handleAddToCart = () => {
    addItem(
      {
        id: product.id,
        name: product.name,
        price: product.price,
        image: product.images[0],
      },
      quantity
    );
  };

  return (
    <div className="w-full text-center lg:text-left">
      <div className="text-sm font-medium uppercase tracking-wide text-primary">
        {product.category}
      </div>
      <h1 className="mt-2 text-3xl font-bold sm:text-4xl">{product.name}</h1>
      <div className="mt-4 text-2xl font-semibold text-primary">
        {Intl.NumberFormat("id-ID", {
          style: "currency",
          currency: "IDR",
          maximumSignificantDigits: 3,
        }).format(product.price)}
      </div>

      <p className="mx-auto mt-6 leading-loose text-dark/70 lg:mx-0">
        {product.description}
      </p>

      <div className="mt-8 flex flex-col items-center gap-3 lg:items-start">
        <span className="text-sm font-medium">Quantity</span>
        <QuantityStepper
          quantity={quantity}
          onIncrease={() => setQuantity((prev) => prev + 1)}
          onDecrease={() => setQuantity((prev) => Math.max(1, prev - 1))}
          min={1}
        />
      </div>

      <Button onClick={handleAddToCart} className="mt-10 w-full sm:w-auto">
        <FiShoppingBag size={20} />
        Add to Cart
      </Button>
    </div>
  );
};

export default ProductInfo;
