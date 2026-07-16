export type TProduct = {
  id: string;
  name: string;
  category: string;
  price: number;
  images: string[];
  description: string;
};

export const productList: TProduct[] = [
  {
    id: "product-1",
    name: "SportsOn Product 1",
    category: "Running",
    price: 450000,
    images: ["product-1.png"],
    description:
      "Engineered for endurance and designed for speed. Lightweight, breathable materials keep you cool on long runs, while a cushioned sole absorbs impact with every stride.",
  },
  {
    id: "product-2",
    name: "SportsOn Product 2",
    category: "Running",
    price: 250000,
    images: ["product-2.png"],
    description:
      "A versatile everyday runner built for comfort and unmatched flexibility. Breathable mesh paneling and a snug, supportive fit make it ideal for both training and casual wear.",
  },
  {
    id: "product-3",
    name: "SportsOn Product 3",
    category: "Running",
    price: 230000,
    images: ["product-3.png"],
    description:
      "Premium fabrics meet limitless motion in this lightweight training essential. Designed to move with you through every drill, sprint, and recovery session.",
  },
  {
    id: "product-4",
    name: "SportsOn Product 4",
    category: "Running",
    price: 440000,
    images: ["product-4.png"],
    description:
      "Built for athletes who demand durability without sacrificing comfort. Reinforced stitching and moisture-wicking fabric keep performance consistent, run after run.",
  },
  {
    id: "product-5",
    name: "SportsOn Product 5",
    category: "Running",
    price: 550000,
    images: ["product-5.png"],
    description:
      "Our top-tier performance pick, combining responsive cushioning with a sleek, race-ready silhouette. Built for athletes who push their limits every day.",
  },
  {
    id: "product-6",
    name: "SportsOn Product 6",
    category: "Running",
    price: 650000,
    images: ["product-6.png"],
    description:
      "A premium sportswear piece crafted for endurance and speed. Unmatched comfort meets standout style, made to keep up with your most demanding training days.",
  },
];

export const getProductById = (id: string): TProduct | undefined => {
  return productList.find((product) => product.id === id);
};
