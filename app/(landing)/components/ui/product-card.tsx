"use client";

import Image from "next/image";
import Link from "next/link";
import { FiPlus } from "react-icons/fi";
import Button from "./button";
import { useCart } from "../../context/cart-context";

type TProductCardProps = {
  id: string;
  name: string;
  category: string;
  price: number;
  imgUrl: string;
};

const ProductCard = ({ id, name, category, price, imgUrl }: TProductCardProps) => {
  const { addItem } = useCart();

  const handleAddToCart = () => {
    addItem({ id, name, price, image: imgUrl }, 1);
  };

  // imgUrl may be a bare local filename (mock data, resolved under
  // /public/images/products/) or a fully-qualified URL (real API data,
  // already pointing at the backend's asset host). Both are supported
  // so this component works unchanged for Product Detail's related
  // products (still mock data) and the Home Page (now real API data).
  const imageSrc = imgUrl.startsWith("http")
    ? imgUrl
    : `/images/products/${imgUrl}`;

  return (
    <div className="relative bg-white p-1.5 duration-300 hover:drop-shadow-xl">
      <Link href={`/products/${id}`} className="block">
        <div className="relative flex aspect-square w-full items-center justify-center bg-primary-light">
          <Image
            src={imageSrc}
            alt={name}
            width={300}
            height={300}
            sizes="(max-width: 639px) 100vw, (max-width: 1023px) 50vw, 25vw"
            className="aspect-square object-contain"
          />
        </div>
        <h3 className="mb-1.5 mt-4 text-base font-medium sm:text-lg">{name}</h3>
        <div className="mb-6 flex items-center justify-between sm:mb-8">
          <div className="text-sm text-gray-500 sm:text-base">{category}</div>
          <div className="text-sm font-medium text-primary sm:text-base">
            {Intl.NumberFormat("id-ID", {
              style: "currency",
              currency: "IDR",
              maximumSignificantDigits: 3,
            }).format(price)}
          </div>
        </div>
      </Link>

      <Button
        type="button"
        onClick={handleAddToCart}
        aria-label={`Add ${name} to cart`}
        className="absolute right-4.5 top-4.5 h-9 w-9 p-2! sm:h-10 sm:w-10"
      >
        <FiPlus className="h-5 w-5 sm:h-6 sm:w-6" />
      </Button>
    </div>
  );
};

export default ProductCard;
