import { Search, ShoppingBag, User, Heart } from "lucide-react";
import { useState } from "react";

const Header = () => {
  const [cartCount] = useState(0);

  return (
    <header className="border-b border-border bg-background">
      <div className="container mx-auto flex items-center justify-between px-4 py-4">
        {/* Logo */}
        <a href="/" className="flex items-center gap-2">
          <span className="text-primary text-2xl">✦</span>
          <span className="font-display text-2xl font-bold tracking-wider text-foreground">
            ERSAN DIAMOND
          </span>
        </a>

        {/* Search */}
        <div className="hidden md:flex flex-1 max-w-xl mx-8">
          <div className="relative w-full">
            <input
              type="text"
              placeholder="Ürün Ara"
              className="w-full rounded border border-border bg-background px-4 py-2.5 pr-10 text-sm font-body text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary"
            />
            <button className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-primary transition-colors">
              <Search className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-4">
          <button className="text-foreground hover:text-primary transition-colors">
            <User className="h-5 w-5" />
          </button>
          <button className="text-foreground hover:text-primary transition-colors">
            <Heart className="h-5 w-5" />
          </button>
          <button className="relative text-foreground hover:text-primary transition-colors">
            <ShoppingBag className="h-5 w-5" />
            {cartCount > 0 && (
              <span className="absolute -top-2 -right-2 flex h-4 w-4 items-center justify-center rounded-full bg-accent text-[10px] font-bold text-accent-foreground">
                {cartCount}
              </span>
            )}
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;
