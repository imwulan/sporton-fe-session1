import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Container from "../../components/ui/container";
import ProductCard from "../../components/ui/product-card";
import ProductGallery from "../../components/product-detail/product-gallery";
import ProductInfo from "../../components/product-detail/product-info";
import { getProductById, productList } from "../../data/products";

type TProductDetailPageProps = {
  params: Promise<{ id: string }>;
};

export const generateMetadata = async ({
  params,
}: TProductDetailPageProps): Promise<Metadata> => {
  const { id } = await params;
  const product = getProductById(id);

  if (!product) {
    return { title: "Product Not Found | SportOn" };
  }

  return {
    title: `${product.name} | SportOn`,
    description: product.description,
  };
};

export default async function ProductDetailPage({
  params,
}: TProductDetailPageProps) {
  const { id } = await params;
  const product = getProductById(id);

  if (!product) {
    notFound();
  }

  const relatedProducts = productList
    .filter((item) => item.category === product.category && item.id !== product.id)
    .slice(0, 4);

  return (
    <main>
      <section id="product-detail-section">
        <Container className="py-12 lg:py-20">
          <div className="flex flex-col gap-10 lg:flex-row lg:items-start lg:gap-16">
            <div className="w-full lg:w-1/2">
              <ProductGallery images={product.images} alt={product.name} />
            </div>
            <div className="w-full lg:w-1/2">
              <ProductInfo product={product} />
            </div>
          </div>
        </Container>
      </section>

      {relatedProducts.length > 0 && (
        <section id="related-products-section">
          <Container className="pb-20">
            <h2 className="mb-8 text-xl font-bold sm:text-2xl">
              You Might Also Like
            </h2>
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
              {relatedProducts.map((item) => (
                <ProductCard
                  key={item.id}
                  id={item.id}
                  name={item.name}
                  category={item.category}
                  price={item.price}
                  imgUrl={item.images[0]}
                />
              ))}
            </div>
          </Container>
        </section>
      )}
    </main>
  );
}
