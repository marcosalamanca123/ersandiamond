import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import TopBar from "@/components/TopBar";
import Header from "@/components/Header";
import CategoryNav from "@/components/CategoryNav";
import Footer from "@/components/Footer";
import { Link } from "react-router-dom";

interface Product {
  id: string;
  name: string;
  brand: string;
  category: string;
  price: number;
  description: string | null;
  image_url: string | null;
}

// Map slugs to filter values
const slugMap: Record<string, { type: "category" | "brand"; value: string; title: string }> = {
  cantalar: { type: "category", value: "Çantalar", title: "ÇANTALAR" },
  saatler: { type: "category", value: "Saatler", title: "SAATLER" },
  mucevher: { type: "category", value: "Mücevherler", title: "MÜCEVHERLER" },
  "tum-cantalar": { type: "category", value: "Çantalar", title: "TÜM ÇANTALAR" },
  "tum-saatler": { type: "category", value: "Saatler", title: "TÜM SAATLER" },
  "tum-mucevherler": { type: "category", value: "Mücevherler", title: "TÜM MÜCEVHERLER" },
  "marka-mucevher": { type: "category", value: "Mücevherler", title: "MARKA MÜCEVHER" },
  "tum-marka-mucevher": { type: "category", value: "Mücevherler", title: "TÜM MARKA MÜCEVHERLER" },
  // Brand slugs
  "hermes-cantalar": { type: "brand", value: "Hermes", title: "HERMÈS ÇANTALAR" },
  "chanel-cantalar": { type: "brand", value: "Chanel", title: "CHANEL ÇANTALAR" },
  "louis-vuitton": { type: "brand", value: "Louis Vuitton", title: "LOUIS VUITTON" },
  rolex: { type: "brand", value: "Rolex", title: "ROLEX" },
  "patek-philippe": { type: "brand", value: "Patek Philippe", title: "PATEK PHILIPPE" },
  "audemars-piguet": { type: "brand", value: "Audemars Piguet", title: "AUDEMARS PIGUET" },
  cartier: { type: "brand", value: "Cartier", title: "CARTIER" },
  "van-cleef": { type: "brand", value: "Van Cleef & Arpels", title: "VAN CLEEF & ARPELS" },
  tiffany: { type: "brand", value: "Tiffany", title: "TIFFANY" },
  kolye: { type: "category", value: "Kolye", title: "KOLYE" },
  yuzuk: { type: "category", value: "Yüzük", title: "YÜZÜK" },
  bileklik: { type: "category", value: "Bileklik", title: "BİLEKLİK" },
  hermes: { type: "brand", value: "Hermes", title: "HERMÈS" },
  "van-cleef-&-arpels": { type: "brand", value: "Van Cleef & Arpels", title: "VAN CLEEF & ARPELS" },
};

const Category = () => {
  const { slug } = useParams<{ slug: string }>();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  const mapping = slug ? slugMap[slug] : null;
  const title = mapping?.title || slug?.toUpperCase().replace(/-/g, " ") || "";

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      let query = supabase.from("products").select("id, name, brand, category, price, description");

      if (mapping) {
        if (mapping.type === "category") {
          query = query.eq("category", mapping.value);
        } else {
          query = query.eq("brand", mapping.value);
        }
      } else if (slug) {
        // Try matching brand name from slug
        const brandName = slug.replace(/-/g, " ");
        query = query.or(`brand.ilike.%${brandName}%,category.ilike.%${brandName}%`);
      }

      const { data: productsData } = await query;

      if (productsData) {
        // Fetch images
        const ids = productsData.map((p) => p.id);
        const { data: imagesData } = await supabase
          .from("product_images")
          .select("product_id, image_url")
          .in("product_id", ids)
          .order("sort_order", { ascending: true });

        const imageMap: Record<string, string> = {};
        imagesData?.forEach((img) => {
          if (!imageMap[img.product_id]) imageMap[img.product_id] = img.image_url;
        });

        setProducts(
          productsData.map((p) => ({ ...p, image_url: imageMap[p.id] || null }))
        );
      }
      setLoading(false);
    };

    fetchProducts();
  }, [slug, mapping]);

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <TopBar />
      <Header />
      <CategoryNav />
      <main className="flex-1">
        <div className="container mx-auto px-4 py-10">
          <h1 className="font-display text-3xl text-foreground mb-8 text-center tracking-[0.2em]">
            {title}
          </h1>

          {loading ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="animate-pulse">
                  <div className="aspect-square bg-muted rounded" />
                  <div className="mt-3 h-4 bg-muted rounded w-2/3" />
                  <div className="mt-2 h-3 bg-muted rounded w-1/2" />
                </div>
              ))}
            </div>
          ) : products.length === 0 ? (
            <div className="text-center py-20">
              <p className="text-muted-foreground font-body text-lg">
                Bu kategoride henüz ürün bulunmamaktadır.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
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
                  <div className="p-4">
                    <p className="text-xs text-muted-foreground font-body tracking-wider uppercase mb-1">
                      {product.brand}
                    </p>
                    <h3 className="font-body text-sm font-medium text-foreground line-clamp-2 mb-2">
                      {product.name}
                    </h3>
                    {product.price > 0 && (
                      <p className="font-display text-sm text-primary">
                        {product.price.toLocaleString("tr-TR")} ₺
                      </p>
                    )}
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Category;
