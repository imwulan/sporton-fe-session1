import Image from "next/image";

type TCategoryCardProps = {
  name: string;
  imgUrl: string;
};

const CategoryCard = ({ name, imgUrl }: TCategoryCardProps) => {
  const imageSrc = imgUrl.startsWith("http")
    ? imgUrl
    : `/images/categories/${imgUrl}`;

  return (
    <div className="flex aspect-square w-full items-center justify-center rounded-lg bg-gradient-to-r from-[#F1F1F1] to-[#F7F7F7] duration-300 hover:scale-105">
      <div className="self-center">
        <Image
          src={imageSrc}
          width={86}
          height={86}
          alt={name}
          sizes="(max-width: 639px) 48px, (max-width: 1023px) 64px, 86px"
          className="mx-auto mb-[10px] w-12 sm:w-16 lg:w-[86px]"
        />
        <div className="text-center text-sm font-medium text-primary sm:text-base lg:text-xl">
          {name}
        </div>
      </div>
    </div>
  );
};

export default CategoryCard;
