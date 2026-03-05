import { Link } from "react-router-dom";
import { Heart } from "lucide-react";
import type { Product } from "@/data/products";

interface ProductCardProps {
  product: Product;
}

const ProductCard = ({ product }: ProductCardProps) => {
  return (
    <Link
      to={`/urun/${product.id}`}
      className="group block bg-card border border-border rounded overflow-hidden hover:shadow-lg transition-shadow"
    >
      <div className="relative aspect-square overflow-hidden bg-muted">
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        <button
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
          }}
          className="absolute top-3 right-3 w-8 h-8 flex items-center justify-center rounded-full bg-background/80 text-foreground hover:text-accent transition-colors"
        >
          <Heart className="h-4 w-4" />
        </button>
      </div>
      <div className="p-4">
        <p className="text-xs text-muted-foreground font-body tracking-wider uppercase mb-1">
          {product.brand}
        </p>
        <h3 className="font-body text-sm font-medium text-foreground mb-2 line-clamp-2">
          {product.name}
        </h3>
        <p className="font-display text-lg font-semibold text-foreground">
          {product.price}
        </p>
      </div>
    </Link>
  );
};

export default ProductCard;
