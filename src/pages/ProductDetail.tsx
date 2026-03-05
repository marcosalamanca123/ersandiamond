import { useParams, Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { Heart, ChevronLeft, Star, Shield, Truck, Award, RefreshCw, Eye } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import TopBar from "@/components/TopBar";
import Header from "@/components/Header";
import CategoryNav from "@/components/CategoryNav";
import Footer from "@/components/Footer";

const WhatsAppIcon = () => (
  <svg viewBox="0 0 24 24" className="h-5 w-5 fill-current">
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
  </svg>
);

interface Product {
  id: string;
  name: string;
  brand: string;
  category: string;
  price: number;
  description: string | null;
}

const ProductDetail = () => {
  const { id } = useParams();
  const [product, setProduct] = useState<Product | null>(null);
  const [images, setImages] = useState<string[]>([]);
  const [selectedImage, setSelectedImage] = useState(0);
  const [loading, setLoading] = useState(true);
  const [whatsappNumber, setWhatsappNumber] = useState("905551234567");

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      const [{ data: prod }, { data: imgs }, { data: wp }] = await Promise.all([
        supabase.from("products").select("*").eq("id", id!).single(),
        supabase.from("product_images").select("image_url").eq("product_id", id!).order("sort_order", { ascending: true }),
        supabase.from("site_settings").select("value").eq("key", "whatsapp_number").maybeSingle(),
      ]);
      if (prod) setProduct(prod);
      if (imgs) setImages(imgs.map((i) => i.image_url));
      if (wp?.value) setWhatsappNumber(wp.value);
      setLoading(false);
    };
    if (id) fetchData();
  }, [id]);

  const handleWhatsApp = () => {
    if (!product) return;
    const message = encodeURIComponent(
      `Merhaba, ${product.brand} ${product.name} ürünü hakkında bilgi almak ve satın almak istiyorum.`
    );
    window.open(`https://wa.me/${whatsappNumber}?text=${message}`, "_blank");
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col bg-background">
        <TopBar />
        <Header />
        <CategoryNav />
        <div className="flex-1 flex items-center justify-center">
          <p className="text-muted-foreground font-body">Yükleniyor...</p>
        </div>
        <Footer />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen flex flex-col bg-background">
        <TopBar />
        <Header />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <h1 className="font-display text-2xl text-foreground mb-4">Ürün Bulunamadı</h1>
            <Link to="/" className="text-primary hover:text-accent transition-colors font-body">
              Ana Sayfaya Dön
            </Link>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <TopBar />
      <Header />
      <CategoryNav />

      <main className="flex-1">
        <div className="container mx-auto px-4 py-8">
          <Link
            to="/"
            className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-primary transition-colors font-body mb-6"
          >
            <ChevronLeft className="h-4 w-4" />
            Ana Sayfa
          </Link>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12">
            <div>
              <div className="aspect-square rounded overflow-hidden bg-muted mb-3">
                {images.length > 0 ? (
                  <img
                    src={images[selectedImage]}
                    alt={product.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-muted-foreground text-sm font-body">
                    Görsel Yok
                  </div>
                )}
              </div>
              {images.length > 1 && (
                <div className="flex gap-2">
                  {images.map((img, i) => (
                    <button
                      key={i}
                      onClick={() => setSelectedImage(i)}
                      className={`w-16 h-16 rounded overflow-hidden border-2 transition-colors ${
                        i === selectedImage ? "border-primary" : "border-border"
                      }`}
                    >
                      <img src={img} alt="" className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              )}
            </div>

            <div className="flex flex-col justify-center">
              <h1 className="font-display text-2xl md:text-3xl text-foreground mb-1">
                {product.name}
              </h1>
              <div className="flex items-center gap-2 mb-4">
                <div className="flex text-yellow-500">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-4 w-4 fill-current" />
                  ))}
                </div>
                <span className="text-xs text-muted-foreground font-body">0 değerlendirme</span>
              </div>

              {product.description && (
                <p className="text-sm text-muted-foreground font-body leading-relaxed mb-6">
                  {product.description}
                </p>
              )}

              <button
                onClick={handleWhatsApp}
                className="w-full flex items-center justify-center gap-3 bg-[hsl(142,70%,40%)] hover:bg-[hsl(142,70%,35%)] text-white py-4 px-6 text-sm font-body font-semibold tracking-wider rounded transition-colors mb-4"
              >
                <WhatsAppIcon />
                WHATSAPP İLE BİLGİ AL
              </button>

              <button className="flex items-center gap-2 text-sm text-foreground font-body mb-2">
                <Heart className="h-4 w-4" />
                Favorilerime Ekle
              </button>

              <p className="flex items-center gap-2 text-xs text-muted-foreground font-body mb-6">
                <Eye className="h-4 w-4" />
                <span><strong className="text-foreground">196</strong> ziyaretçi tarafından görüntülendi.</span>
              </p>

              {/* Trust badges */}
              <div className="border border-border rounded-lg p-5 mb-6">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
                  <div className="flex flex-col items-center gap-2">
                    <Truck className="h-7 w-7 text-primary" />
                    <span className="text-[11px] font-body text-foreground leading-tight">Sigortalı ve Hızlı Kargo</span>
                  </div>
                  <div className="flex flex-col items-center gap-2">
                    <Award className="h-7 w-7 text-primary" />
                    <span className="text-[11px] font-body text-foreground leading-tight">Orijinal Ürün Sertifikası</span>
                  </div>
                  <div className="flex flex-col items-center gap-2">
                    <Shield className="h-7 w-7 text-primary" />
                    <span className="text-[11px] font-body text-foreground leading-tight">Güvenli Alışveriş</span>
                  </div>
                  <div className="flex flex-col items-center gap-2">
                    <RefreshCw className="h-7 w-7 text-primary" />
                    <span className="text-[11px] font-body text-foreground leading-tight">Kolay Değişim</span>
                  </div>
                </div>
              </div>

              {/* Product info */}
              <div className="space-y-2 text-sm font-body">
                <p><span className="text-muted-foreground">Kategorisi:</span> <span className="text-foreground">{product.category}</span></p>
                <p><span className="text-muted-foreground">Marka:</span> <span className="text-foreground">{product.brand}</span></p>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default ProductDetail;
