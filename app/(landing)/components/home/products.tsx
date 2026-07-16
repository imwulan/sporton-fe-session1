import ProductCard from "../ui/product-card";
import Container from "../ui/container";
import { productList } from "../../data/products";

const ProductsSection = () => {
  return (
    <section id="products-section">
      <Container className="pb-20 pt-24 lg:pt-32">
        <h2 className="mb-8 text-center text-2xl font-bold italic sm:text-3xl lg:mb-11 lg:text-4xl">
          <span className="text-primary">OUR </span>PRODUCTS
        </h2>

        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {productList.map((product) => (
            <ProductCard
              key={product.id}
              id={product.id}
              name={product.name}
              category={product.category}
              price={product.price}
              imgUrl={product.images[0]}
            />
          ))}
        </div>
      </Container>
    </section>
  );
};

export default ProductsSection;
