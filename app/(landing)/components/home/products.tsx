import ProductCard from "../ui/product-card";
import Container from "../ui/container";
import { getProducts } from "../../services/products-service";
import { mapApiProductToProduct } from "../../lib/mappers";

const ProductsSection = async () => {
  let products: ReturnType<typeof mapApiProductToProduct>[] = [];
  let hasError = false;

  try {
    const apiProducts = await getProducts();
    products = apiProducts.map(mapApiProductToProduct);
  } catch {
    hasError = true;
  }

  return (
    <section id="products-section">
      <Container className="pb-20 pt-24 lg:pt-32">
        <h2 className="mb-8 text-center text-2xl font-bold italic sm:text-3xl lg:mb-11 lg:text-4xl">
          <span className="text-primary">OUR </span>PRODUCTS
        </h2>

        {hasError ? (
          <p className="text-center text-dark/60">
            Unable to load products right now. Please try again later.
          </p>
        ) : products.length === 0 ? (
          <p className="text-center text-dark/60">
            No products available yet.
          </p>
        ) : (
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {products.map((product) => (
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
        )}
      </Container>
    </section>
  );
};

export default ProductsSection;
