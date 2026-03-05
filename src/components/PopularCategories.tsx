import { useEffect, useState, useRef, useCallback } from "react";
import { Link } from "react-router-dom";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

interface Brand {
  id: string;
  name: string;
  image_url: string | null;
}

const PopularCategories = () => {
  const [brands, setBrands] = useState<Brand[]>([]);
  const scrollRef = useRef<HTMLDivElement>(null);
  const animationRef = useRef<number>();
  const isPaused = useRef(false);
  const scrollSpeed = 0.5;

  useEffect(() => {
    const fetchBrands = async () => {
      const { data } = await supabase
        .from("brands")
        .select("id, name, image_url")
        .order("sort_order", { ascending: true });
      if (data && data.length > 0) setBrands(data);
    };
    fetchBrands();
  }, []);

  const animate = useCallback(() => {
    const el = scrollRef.current;
    if (!el || isPaused.current) {
      animationRef.current = requestAnimationFrame(animate);
      return;
    }
    el.scrollLeft += scrollSpeed;
    const halfWidth = el.scrollWidth / 3;
    if (el.scrollLeft >= halfWidth * 2) {
      el.scrollLeft -= halfWidth;
    }
    animationRef.current = requestAnimationFrame(animate);
  }, []);

  useEffect(() => {
    if (brands.length === 0) return;
    animationRef.current = requestAnimationFrame(animate);
    return () => {
      if (animationRef.current) cancelAnimationFrame(animationRef.current);
    };
  }, [brands.length, animate]);

  const scroll = (direction: "left" | "right") => {
    const el = scrollRef.current;
    if (!el) return;
    const amount = direction === "left" ? -200 : 200;
    el.scrollBy({ left: amount, behavior: "smooth" });
  };

  if (brands.length === 0) return null;

  const displayBrands = [...brands, ...brands, ...brands];

  return (
    <section className="bg-background py-16 overflow-hidden">
      <div className="container mx-auto px-4">
        <h2 className="font-display text-3xl text-center text-foreground mb-10">
          Popüler Kategoriler
        </h2>
      </div>
      <div className="relative group/section">
        <button
          onClick={() => scroll("left")}
          className="absolute left-2 top-1/2 -translate-y-1/2 z-10 w-10 h-10 rounded-full bg-background/80 border border-border flex items-center justify-center text-foreground hover:text-primary hover:border-primary transition-all"
        >
          <ChevronLeft className="h-5 w-5" />
        </button>
        <button
          onClick={() => scroll("right")}
          className="absolute right-2 top-1/2 -translate-y-1/2 z-10 w-10 h-10 rounded-full bg-background/80 border border-border flex items-center justify-center text-foreground hover:text-primary hover:border-primary transition-all"
        >
          <ChevronRight className="h-5 w-5" />
        </button>
        <div
          ref={scrollRef}
          className="flex gap-8 overflow-x-hidden px-4"
          onMouseEnter={() => { isPaused.current = true; }}
          onMouseLeave={() => { isPaused.current = false; }}
        >
          {displayBrands.map((brand, index) => (
            <Link
              key={`${brand.id}-${index}`}
              to={`/kategori/${brand.name.toLowerCase().replace(/\s+/g, "-")}`}
              className="group flex flex-col items-center text-center flex-shrink-0"
            >
              <div className="mb-3 w-28 h-28 rounded-full overflow-hidden border-2 border-border group-hover:border-primary transition-colors bg-muted">
                {brand.image_url ? (
                  <img src={brand.image_url} alt={brand.name} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-xs text-muted-foreground font-body">
                    {brand.name.charAt(0)}
                  </div>
                )}
              </div>
              <span className="text-xs font-medium tracking-wider text-foreground group-hover:text-primary transition-colors font-body">
                {brand.name.toUpperCase()}
              </span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};

export default PopularCategories;
