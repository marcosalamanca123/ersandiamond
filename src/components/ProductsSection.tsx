import { sampleProducts } from "@/data/products";
import ProductCard from "@/components/ProductCard";

const ProductsSection = () => {
  return (
    <section className="bg-background py-16">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between mb-8">
          <h2 className="font-display text-2xl md:text-3xl text-foreground">
            Öne Çıkan Ürünler
          </h2>
          <a
            href="#"
            className="text-sm font-body tracking-wider text-primary hover:text-accent transition-colors"
          >
            TÜMÜNÜ GÖR →
          </a>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
          {sampleProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default ProductsSection;
