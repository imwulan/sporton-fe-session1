import ProductCard from "../ui/product-card";
import Container from "../ui/container";

type TProduct = {
  name: string;
  category: string;
  price: number;
  imgUrl: string;
};

const productList: TProduct[] = [
  { name: "SportsOn Product 1", category: "Running", price: 450000, imgUrl: "product-1.png" },
  { name: "SportsOn Product 2", category: "Running", price: 250000, imgUrl: "product-2.png" },
  { name: "SportsOn Product 3", category: "Running", price: 230000, imgUrl: "product-3.png" },
  { name: "SportsOn Product 4", category: "Running", price: 440000, imgUrl: "product-4.png" },
  { name: "SportsOn Product 5", category: "Running", price: 550000, imgUrl: "product-5.png" },
  { name: "SportsOn Product 6", category: "Running", price: 650000, imgUrl: "product-6.png" },
];

const ProductsSection = () => {
  return (
    <section id="products-section">
      <Container className="pb-20 pt-24 lg:pt-32">
        <h2 className="mb-8 text-center text-2xl font-bold italic sm:text-3xl lg:mb-11 lg:text-4xl">
          <span className="text-primary">OUR </span>PRODUCTS
        </h2>

        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {productList.map((product, index) => (
            <ProductCard
              key={`${product.name}-${index}`}
              name={product.name}
              category={product.category}
              price={product.price}
              imgUrl={product.imgUrl}
            />
          ))}
        </div>
      </Container>
    </section>
  );
};

export default ProductsSection;
