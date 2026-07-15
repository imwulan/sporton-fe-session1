import Image from "next/image";
import Link from "next/link";
import { FiPlus } from "react-icons/fi";
import Button from "./button";

type TProductCardProps = {
  name: string;
  category: string;
  price: number;
  imgUrl: string;
};

const ProductCard = ({ name, category, price, imgUrl }: TProductCardProps) => {
  return (
    <div className="relative bg-white p-1.5 duration-300 hover:drop-shadow-xl">
      <Link href="#" className="block">
        <div className="relative flex aspect-square w-full items-center justify-center bg-primary-light">
          <Image
            src={`/images/products/${imgUrl}`}
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
        aria-label={`Add ${name} to bag`}
        className="absolute right-4.5 top-4.5 h-9 w-9 p-2! sm:h-10 sm:w-10"
      >
        <FiPlus className="h-5 w-5 sm:h-6 sm:w-6" />
      </Button>
    </div>
  );
};

export default ProductCard;
