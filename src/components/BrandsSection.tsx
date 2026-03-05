import { useEffect, useState } from "react";
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
}: {
  brand: Brand;
  products: Product[];
}) => {
  const hasProducts = products.length > 0;

  return (
    <div className="mb-12">
      <div className="container mx-auto px-4 mb-4">
        <div className="flex flex-col items-center gap-2 mb-6">
          {brand.image_url && (
            <div className="w-14 h-14 rounded-full overflow-hidden border border-border">
              <img src={brand.image_url} alt={brand.name} className="w-full h-full object-cover" />
            </div>
          )}
          <h3 className="font-display text-2xl tracking-[0.15em] text-foreground italic">{brand.name}</h3>
          <Link
            to={`/kategori/${brand.name.toLowerCase().replace(/\s+/g, "-")}`}
            className="text-xs font-body tracking-widest text-primary hover:text-accent transition-colors uppercase"
          >
            Tümünü Gör →
          </Link>
        </div>
      </div>
      {hasProducts ? (
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
            {products.map((product) => (
              <Link
                key={product.id}
                to={`/urun/${product.id}`}
                className="group bg-card border border-border rounded overflow-hidden hover:shadow-lg transition-shadow"
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
      ) : (
        <div className="container mx-auto px-4">
          <p className="text-sm text-muted-foreground font-body">Henüz ürün eklenmemiş.</p>
        </div>
      )}
    </div>
  );
};

const BrandsSection = () => {
  const [brands, setBrands] = useState<Brand[]>([]);
  const [productsByBrand, setProductsByBrand] = useState<Record<string, Product[]>>({});

  useEffect(() => {
    const fetchData = async () => {
      const { data: brandsData } = await supabase
        .from("brands")
        .select("*")
        .order("sort_order", { ascending: true });
      if (!brandsData) return;
      setBrands(brandsData);

      const { data: productsData } = await supabase
        .from("products")
        .select("id, name, brand, category");
      
      if (productsData) {
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

  if (brands.length === 0) return null;

  return (
    <section className="bg-background py-16">
      <div className="container mx-auto px-4 mb-10">
        <h2 className="font-display text-3xl text-center text-foreground italic tracking-[0.2em]">
          Markalar
        </h2>
      </div>
      {brands.map((brand, index) => (
        <div key={brand.id}>
          <BrandRow
            brand={brand}
            products={productsByBrand[brand.name.toLowerCase()] || []}
          />
          {/* Video between Rolex (sort_order 2) and Patek (sort_order 3) */}
          {brand.sort_order === 2 && (
            <div className="relative w-full py-16 md:py-20 mb-12 bg-black overflow-hidden">
              <div className="container mx-auto px-4 text-center relative z-10">
                <p className="text-xs md:text-sm tracking-[0.4em] text-white/50 font-body uppercase mb-3">
                  Ersan Diamond
                </p>
                <h3 className="font-display text-3xl md:text-5xl tracking-[0.2em] text-white italic mb-4">
                  Güvenli Kargo
                </h3>
                <p className="text-sm md:text-base text-white/60 font-body max-w-lg mx-auto leading-relaxed">
                  Tüm ürünlerimiz özel sigortalı ve güvenli paketleme ile kapınıza kadar ulaştırılır.
                </p>
              </div>
              {/* Decorative line */}
              <div className="absolute top-1/2 left-0 w-full h-px bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-y-1/2" />
            </div>
          )}
        </div>
      ))}
    </section>
  );
};

export default BrandsSection;
