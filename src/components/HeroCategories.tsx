import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import categoryBags from "@/assets/category-bags.png";
import categoryWatches from "@/assets/category-watches.png";
import categoryJewelry from "@/assets/category-jewelry.png";

interface Brand {
  id: string;
  name: string;
  image_url: string | null;
}

const categoryBrands: Record<string, string[]> = {
  cantalar: ["Hermes"],
  saatler: ["Rolex", "Patek Philippe", "Audemars Piguet"],
  mucevher: ["Cartier", "Van Cleef & Arpels"],
};

const categories = [
  { name: "ÇANTALAR", image: categoryBags, slug: "cantalar" },
  { name: "SAATLER", image: categoryWatches, slug: "saatler" },
  { name: "MÜCEVHERLER", image: categoryJewelry, slug: "mucevher" },
];

const HeroCategories = () => {
  const [brands, setBrands] = useState<Brand[]>([]);

  useEffect(() => {
    supabase.from("brands").select("id, name, image_url").then(({ data }) => {
      if (data) setBrands(data);
    });
  }, []);

  return (
    <section className="bg-background py-12">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {categories.map((cat) => {
            const relatedBrands = brands.filter((b) =>
              categoryBrands[cat.slug]?.some(
                (name) => name.toLowerCase() === b.name.toLowerCase()
              )
            );
            return (
              <div key={cat.name} className="flex flex-col items-center text-center">
                <Link
                  to={`/kategori/${cat.slug}`}
                  className="group flex flex-col items-center"
                >
                  <div className="mb-4 w-48 h-48 flex items-center justify-center transition-transform group-hover:scale-105">
                    <img src={cat.image} alt={cat.name} className="w-full h-full object-contain" />
                  </div>
                  <h2 className="font-display text-xl tracking-[0.3em] text-foreground group-hover:text-primary transition-colors">
                    {cat.name}
                  </h2>
                </Link>
                {relatedBrands.length > 0 && (
                  <div className="flex items-center gap-4 mt-4">
                    {relatedBrands.map((brand) => (
                      <Link
                        key={brand.id}
                        to={`/kategori/${brand.name.toLowerCase().replace(/\s+/g, "-")}`}
                        className="group/brand"
                      >
                        {brand.image_url ? (
                          <div className="w-10 h-10 rounded-full overflow-hidden border border-border group-hover/brand:border-primary transition-colors">
                            <img src={brand.image_url} alt={brand.name} className="w-full h-full object-cover" />
                          </div>
                        ) : (
                          <span className="text-xs text-muted-foreground font-body">{brand.name}</span>
                        )}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default HeroCategories;
