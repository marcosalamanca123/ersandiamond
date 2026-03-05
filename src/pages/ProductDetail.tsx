import { useParams, Link } from "react-router-dom";
import { sampleProducts } from "@/data/products";
import { ShoppingBag, Heart, ChevronLeft } from "lucide-react";
import TopBar from "@/components/TopBar";
import Header from "@/components/Header";
import CategoryNav from "@/components/CategoryNav";
import Footer from "@/components/Footer";

const ProductDetail = () => {
  const { id } = useParams();
  const product = sampleProducts.find((p) => p.id === id);

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
          {/* Breadcrumb */}
          <Link
            to="/"
            className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-primary transition-colors font-body mb-6"
          >
            <ChevronLeft className="h-4 w-4" />
            Ana Sayfa
          </Link>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12">
            {/* Image */}
            <div className="aspect-square rounded overflow-hidden bg-muted">
              <img
                src={product.image}
                alt={product.name}
                className="w-full h-full object-cover"
              />
            </div>

            {/* Details */}
            <div className="flex flex-col justify-center">
              <p className="text-xs text-muted-foreground font-body tracking-widest uppercase mb-2">
                {product.brand}
              </p>
              <h1 className="font-display text-3xl md:text-4xl text-foreground mb-2">
                {product.name}
              </h1>
              <p className="text-xs text-muted-foreground font-body tracking-wider uppercase mb-6">
                {product.category}
              </p>
              <p className="font-display text-3xl font-bold text-foreground mb-6">
                {product.price}
              </p>
              <p className="text-muted-foreground font-body leading-relaxed mb-8">
                {product.description}
              </p>

              <div className="flex gap-3">
                <button className="flex-1 flex items-center justify-center gap-2 bg-foreground text-background py-3.5 px-6 text-sm font-body tracking-wider hover:opacity-90 transition-opacity rounded">
                  <ShoppingBag className="h-4 w-4" />
                  SEPETE EKLE
                </button>
                <button className="w-12 h-12 flex items-center justify-center border border-border rounded text-foreground hover:text-accent hover:border-accent transition-colors">
                  <Heart className="h-5 w-5" />
                </button>
              </div>

              <div className="mt-8 pt-6 border-t border-border space-y-3 text-sm text-muted-foreground font-body">
                <p>✓ Orijinal sertifika dahil</p>
                <p>✓ Ücretsiz kargo</p>
                <p>✓ 14 gün iade garantisi</p>
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
