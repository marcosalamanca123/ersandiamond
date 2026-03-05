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
        <h2 className="font-display text-3xl text-center text-foreground">
          Markalar
        </h2>
      </div>
      {brands.map((brand) => (
        <BrandRow
          key={brand.id}
          brand={brand}
          products={productsByBrand[brand.name.toLowerCase()] || []}
        />
      ))}
    </section>
  );
};

export default BrandsSection;
