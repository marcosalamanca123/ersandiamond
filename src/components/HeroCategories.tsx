import { Link } from "react-router-dom";
import categoryBags from "@/assets/category-bags.png";
import categoryWatches from "@/assets/category-watches.png";
import categoryJewelry from "@/assets/category-jewelry.png";

const categories = [
  { name: "ÇANTALAR", image: categoryBags, slug: "cantalar" },
  { name: "SAATLER", image: categoryWatches, slug: "saatler" },
  { name: "MÜCEVHERLER", image: categoryJewelry, slug: "mucevher" },
];

const HeroCategories = () => {
  return (
    <section className="bg-background py-12">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {categories.map((cat) => (
            <Link
              key={cat.name}
              to={`/kategori/${cat.slug}`}
              className="group flex flex-col items-center text-center"
            >
              <div className="mb-4 w-48 h-48 flex items-center justify-center transition-transform group-hover:scale-105">
                <img src={cat.image} alt={cat.name} className="w-full h-full object-contain" />
              </div>
              <h2 className="font-display text-xl tracking-[0.3em] text-foreground group-hover:text-primary transition-colors">
                {cat.name}
              </h2>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HeroCategories;
