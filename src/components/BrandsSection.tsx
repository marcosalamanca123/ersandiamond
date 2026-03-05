import brandHermes from "@/assets/brand-hermes.png";
import brandRolex from "@/assets/brand-rolex.png";
import brandPatek from "@/assets/brand-patek.png";
import brandAP from "@/assets/brand-ap.png";

const brands = [
  { name: "Hermes", image: brandHermes, description: "Hermes en çok beğenilen ürünleriyle tarzını zirveye taşı! Şimdi keşfet!" },
  { name: "Rolex", image: brandRolex, description: "Rolex saatlerin zarafeti ve kalitesiyle fark yarat. Koleksiyonu keşfet!" },
  { name: "Patek Philippe", image: brandPatek, description: "Patek Philippe ile zamansız bir şıklık. Eşsiz koleksiyonu incele!" },
  { name: "Audemars Piguet", image: brandAP, description: "Audemars Piguet ile lüksün zirvesini deneyimle!" },
];

const BrandsSection = () => {
  return (
    <section className="bg-muted py-16">
      <div className="container mx-auto px-4">
        {brands.map((brand, index) => (
          <div
            key={brand.name}
            className={`flex flex-col md:flex-row items-center gap-8 mb-16 last:mb-0 ${
              index % 2 === 1 ? "md:flex-row-reverse" : ""
            }`}
          >
            <div className="flex-shrink-0">
              <div className="w-32 h-32 rounded-full overflow-hidden border-2 border-border">
                <img src={brand.image} alt={brand.name} className="w-full h-full object-cover" />
              </div>
            </div>
            <div className="text-center md:text-left">
              <div className="flex items-center justify-center md:justify-start gap-4 mb-2">
                <div className="h-px w-12 bg-primary" />
                <h3 className="font-display text-2xl text-foreground">{brand.name}</h3>
                <div className="h-px w-12 bg-primary" />
              </div>
              <p className="text-muted-foreground font-body">{brand.description}</p>
              <a
                href="#"
                className="inline-block mt-4 text-sm font-medium text-primary hover:text-accent transition-colors tracking-wider"
              >
                KEŞFET →
              </a>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default BrandsSection;
