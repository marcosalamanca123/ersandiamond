import { useEffect, useState, useRef } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Link } from "react-router-dom";

interface Brand {
  id: string;
  name: string;
  description: string | null;
  image_url: string | null;
  sort_order: number | null;
}

const BrandsSection = () => {
  const [brands, setBrands] = useState<Brand[]>([]);
  const scrollRef = useRef<HTMLDivElement>(null);
  const [scrollPos, setScrollPos] = useState(0);

  useEffect(() => {
    const fetchBrands = async () => {
      const { data } = await supabase
        .from("brands")
        .select("*")
        .order("sort_order", { ascending: true });
      if (data) setBrands(data);
    };
    fetchBrands();
  }, []);

  // Auto-scroll carousel
  useEffect(() => {
    if (brands.length === 0) return;
    const interval = setInterval(() => {
      setScrollPos((prev) => prev + 1);
    }, 3000);
    return () => clearInterval(interval);
  }, [brands.length]);

  useEffect(() => {
    if (scrollRef.current && brands.length > 0) {
      const itemWidth = 320;
      const maxScroll = brands.length;
      const currentIndex = scrollPos % maxScroll;
      scrollRef.current.scrollTo({
        left: currentIndex * itemWidth,
        behavior: "smooth",
      });
    }
  }, [scrollPos, brands.length]);

  if (brands.length === 0) return null;

  // Duplicate brands for infinite loop effect
  const displayBrands = [...brands, ...brands, ...brands];

  return (
    <section className="bg-muted py-16 overflow-hidden">
      <div className="container mx-auto px-4">
        <h2 className="font-display text-3xl text-center text-foreground mb-10">
          Markalar
        </h2>
        <div
          ref={scrollRef}
          className="flex gap-8 overflow-x-auto scrollbar-hide scroll-smooth pb-4"
          style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
        >
          {displayBrands.map((brand, index) => (
            <div
              key={`${brand.id}-${index}`}
              className="flex-shrink-0 w-72 flex flex-col items-center text-center"
            >
              {brand.image_url && (
                <div className="w-32 h-32 rounded-full overflow-hidden border-2 border-border mb-4">
                  <img
                    src={brand.image_url}
                    alt={brand.name}
                    className="w-full h-full object-cover"
                  />
                </div>
              )}
              <div className="flex items-center justify-center gap-4 mb-2">
                <div className="h-px w-12 bg-primary" />
                <h3 className="font-display text-2xl text-foreground">{brand.name}</h3>
                <div className="h-px w-12 bg-primary" />
              </div>
              {brand.description && (
                <p className="text-muted-foreground font-body text-sm">{brand.description}</p>
              )}
              <Link
                to={`/kategori/${brand.name.toLowerCase().replace(/\s+/g, "-")}`}
                className="inline-block mt-4 text-sm font-medium text-primary hover:text-accent transition-colors tracking-wider"
              >
                KEŞFET →
              </Link>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default BrandsSection;
