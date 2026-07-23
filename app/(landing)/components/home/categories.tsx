import Link from "next/link";
import { FiArrowRight } from "react-icons/fi";
import CategoryCard from "../ui/category-card";
import Container from "../ui/container";
import { getCategories } from "../../services/categories-service";
import { mapApiCategoryToCategoryCard } from "../../lib/mappers";

const CategoriesSection = async () => {
  let categories: ReturnType<typeof mapApiCategoryToCategoryCard>[] = [];
  let hasError = false;

  try {
    const apiCategories = await getCategories();
    categories = apiCategories.map(mapApiCategoryToCategoryCard);
  } catch {
    hasError = true;
  }

  return (
    <section id="category-section">
      <Container className="pb-16 lg:pb-20">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <h2 className="text-xl font-bold sm:text-2xl">Browse By Categories</h2>
          <Link href="#" className="flex gap-2 font-medium text-primary">
            <span className="self-center">See All Categories</span>
            <FiArrowRight size={18} className="self-center" />
          </Link>
        </div>

        {hasError ? (
          <p className="mt-8 text-center text-dark/60">
            Unable to load categories right now. Please try again later.
          </p>
        ) : categories.length === 0 ? (
          <p className="mt-8 text-center text-dark/60">
            No categories available yet.
          </p>
        ) : (
          <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-3 sm:gap-6 md:gap-8 lg:grid-cols-6 lg:gap-12">
            {categories.map((category) => (
              <CategoryCard
                key={category.id}
                name={category.name}
                imgUrl={category.imgUrl}
              />
            ))}
          </div>
        )}
      </Container>
    </section>
  );
};

export default CategoriesSection;
