import { useEffect, useState, useRef, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Link } from "react-router-dom";

interface Brand {
  id: string;
  name: string;
  description: string | null;
  image_url: string | null;
  sort_order: number | null;
}

interface Product {
  id: string;
  name: string;
  brand: string;
  category: string;
  image_url: string | null;
}

const BrandRow = ({
  brand,
  products,
  scrollOffset,
}: {
  brand: Brand;
  products: Product[];
  scrollOffset: number;
}) => {
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.style.transform = `translateX(-${scrollOffset}px)`;
    }
  }, [scrollOffset]);

  if (products.length === 0) return null;

  // Triple for infinite loop
  const displayProducts = [...products, ...products, ...products];

  return (
    <div className="mb-12">
      <div className="container mx-auto px-4 mb-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            {brand.image_url && (
              <div className="w-10 h-10 rounded-full overflow-hidden border border-border flex-shrink-0">
                <img src={brand.image_url} alt={brand.name} className="w-full h-full object-cover" />
              </div>
            )}
            <h3 className="font-display text-xl text-foreground">{brand.name}</h3>
          </div>
          <Link
            to={`/kategori/${brand.name.toLowerCase().replace(/\s+/g, "-")}`}
            className="text-sm font-body tracking-wider text-primary hover:text-accent transition-colors"
          >
            TÜMÜNÜ GÖR →
          </Link>
        </div>
      </div>
      <div className="overflow-hidden">
        <div
          ref={scrollRef}
          className="flex gap-4 px-4 transition-transform duration-[50ms] ease-linear"
          style={{ width: "max-content" }}
        >
          {displayProducts.map((product, index) => (
            <Link
              key={`${product.id}-${index}`}
              to={`/urun/${product.id}`}
              className="group flex-shrink-0 w-56 bg-card border border-border rounded overflow-hidden hover:shadow-lg transition-shadow"
            >
              <div className="aspect-square overflow-hidden bg-muted">
                {product.image_url ? (
                  <img
                    src={product.image_url}
                    alt={product.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-muted-foreground text-xs font-body">
                    Görsel Yok
                  </div>
                )}
              </div>
              <div className="p-3">
                <p className="text-xs text-muted-foreground font-body tracking-wider uppercase mb-1">
                  {product.brand}
                </p>
                <h4 className="font-body text-sm font-medium text-foreground line-clamp-2">
                  {product.name}
                </h4>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

const BrandsSection = () => {
  const [brands, setBrands] = useState<Brand[]>([]);
  const [productsByBrand, setProductsByBrand] = useState<Record<string, Product[]>>({});
  const [scrollOffset, setScrollOffset] = useState(0);
  const animationRef = useRef<number>();
  const isPaused = useRef(false);

  useEffect(() => {
    const fetchData = async () => {
      const { data: brandsData } = await supabase
        .from("brands")
        .select("*")
        .order("sort_order", { ascending: true });
      if (!brandsData) return;
      setBrands(brandsData);

      // Fetch products with their first image for each brand
      const { data: productsData } = await supabase
        .from("products")
        .select("id, name, brand, category");
      
      if (productsData) {
        // Get first image for each product
        const { data: imagesData } = await supabase
          .from("product_images")
          .select("product_id, image_url")
          .order("sort_order", { ascending: true });

        const imageMap: Record<string, string> = {};
        imagesData?.forEach((img) => {
          if (!imageMap[img.product_id]) imageMap[img.product_id] = img.image_url;
        });

        const grouped: Record<string, Product[]> = {};
        productsData.forEach((p) => {
          const key = p.brand.toLowerCase();
          if (!grouped[key]) grouped[key] = [];
          grouped[key].push({ ...p, image_url: imageMap[p.id] || null });
        });
        setProductsByBrand(grouped);
      }
    };
    fetchData();
  }, []);

  const animate = useCallback(() => {
    if (!isPaused.current) {
      setScrollOffset((prev) => {
        // Reset at a reasonable point to prevent overflow
        const resetPoint = 240 * 20; // ~item width * count
        return prev >= resetPoint ? 0 : prev + 0.5;
      });
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

  if (brands.length === 0) return null;

  return (
    <section
      className="bg-background py-16 overflow-hidden"
      onMouseEnter={() => { isPaused.current = true; }}
      onMouseLeave={() => { isPaused.current = false; }}
    >
      <div className="container mx-auto px-4 mb-10">
        <h2 className="font-display text-3xl text-center text-foreground">
          Markalar
        </h2>
      </div>
      {brands.map((brand) => (
        <BrandRow
          key={brand.id}
          brand={brand}
          products={productsByBrand[brand.name.toLowerCase()] || []}
          scrollOffset={scrollOffset}
        />
      ))}
    </section>
  );
};

export default BrandsSection;
