"use client";

import { useState } from "react";
import Image from "next/image";

type TProductGalleryProps = {
  images: string[];
  alt: string;
};

const ProductGallery = ({ images, alt }: TProductGalleryProps) => {
  const [activeImage, setActiveImage] = useState(images[0]);

  return (
    <div className="flex flex-col-reverse gap-4 sm:flex-row lg:gap-6">
      {images.length > 1 && (
        <div className="flex gap-3 sm:flex-col">
          {images.map((image) => (
            <button
              key={image}
              type="button"
              onClick={() => setActiveImage(image)}
              aria-label={`Show ${alt} image`}
              aria-pressed={activeImage === image}
              className={`aspect-square w-16 shrink-0 bg-primary-light duration-300 sm:w-20 ${
                activeImage === image
                  ? "ring-2 ring-primary"
                  : "opacity-70 hover:opacity-100"
              }`}
            >
              <Image
                src={`/images/products/${image}`}
                alt={`${alt} thumbnail`}
                width={80}
                height={80}
                className="aspect-square h-full w-full object-contain"
              />
            </button>
          ))}
        </div>
      )}

      <div className="relative flex aspect-square w-full items-center justify-center bg-primary-light">
        <Image
          src={`/images/products/${activeImage}`}
          alt={alt}
          width={500}
          height={500}
          sizes="(max-width: 1023px) 100vw, 50vw"
          className="aspect-square object-contain"
          priority
        />
      </div>
    </div>
  );
};

export default ProductGallery;
