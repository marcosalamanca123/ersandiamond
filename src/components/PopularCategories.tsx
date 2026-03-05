import brandHermes from "@/assets/brand-hermes.png";
import brandRolex from "@/assets/brand-rolex.png";
import brandPatek from "@/assets/brand-patek.png";
import popularBags from "@/assets/popular-bags.png";
import popularWatches from "@/assets/popular-watches.png";
import brandAP from "@/assets/brand-ap.png";

const popularCategories = [
  { name: "HERMES", image: brandHermes },
  { name: "ROLEX", image: brandRolex },
  { name: "PATEK PHİLİPPE", image: brandPatek },
  { name: "ÇANTALAR", image: popularBags },
  { name: "SAATLER", image: popularWatches },
  { name: "AUDEMARS PİGUET", image: brandAP },
];

const PopularCategories = () => {
  return (
    <section className="bg-background py-16">
      <div className="container mx-auto px-4">
        <h2 className="font-display text-3xl text-center text-foreground mb-10">
          Popüler Kategoriler
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-6">
          {popularCategories.map((cat) => (
            <a
              key={cat.name}
              href="#"
              className="group flex flex-col items-center text-center"
            >
              <div className="mb-3 w-28 h-28 rounded-full overflow-hidden border-2 border-border group-hover:border-primary transition-colors">
                <img
                  src={cat.image}
                  alt={cat.name}
                  className="w-full h-full object-cover"
                />
              </div>
              <span className="text-xs font-medium tracking-wider text-foreground group-hover:text-primary transition-colors font-body">
                {cat.name}
              </span>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
};

export default PopularCategories;
