import Link from "next/link";
import { FiArrowRight } from "react-icons/fi";
import CategoryCard from "../ui/category-card";
import Container from "../ui/container";

type TCategory = {
  name: string;
  imgUrl: string;
};

const categoryList: TCategory[] = [
  { name: "Running", imgUrl: "category-running.png" },
  { name: "Tennis", imgUrl: "category-tennis.png" },
  { name: "Basketball", imgUrl: "category-basketball.png" },
  { name: "Football", imgUrl: "category-football.png" },
  { name: "Badminton", imgUrl: "category-badminton.png" },
  { name: "Swimming", imgUrl: "category-swimming.png" },
];

const CategoriesSection = () => {
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

        <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-3 sm:gap-6 md:gap-8 lg:grid-cols-6 lg:gap-12">
          {categoryList.map((category) => (
            <CategoryCard
              key={category.name}
              name={category.name}
              imgUrl={category.imgUrl}
            />
          ))}
        </div>
      </Container>
    </section>
  );
};

export default CategoriesSection;
