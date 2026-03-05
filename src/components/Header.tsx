import { Search, ShoppingBag, User, Heart, Menu, X } from "lucide-react";
import { useState } from "react";
import { Link } from "react-router-dom";

const Header = () => {
  const [cartCount] = useState(0);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const categories = [
    { name: "ÇANTALAR", href: "#" },
    { name: "SAATLER", href: "#" },
    { name: "MÜCEVHER", href: "#" },
    { name: "MARKA MÜCEVHER", href: "#" },
  ];

  return (
    <header className="border-b border-border bg-background">
      <div className="container mx-auto flex items-center justify-between px-4 py-4">
        {/* Mobile menu button */}
        <button
          className="md:hidden text-foreground"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>

        {/* Logo */}
        <Link to="/" className="flex items-center gap-2">
          <span className="text-accent text-2xl">✦</span>
          <span className="font-display text-xl md:text-2xl font-bold tracking-wider text-foreground">
            ERSAN DIAMOND
          </span>
        </Link>

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
          <button className="hidden sm:block text-foreground hover:text-primary transition-colors">
            <Heart className="h-5 w-5" />
          </button>
          <Link to="/sepet" className="relative text-foreground hover:text-primary transition-colors">
            <ShoppingBag className="h-5 w-5" />
            {cartCount > 0 && (
              <span className="absolute -top-2 -right-2 flex h-4 w-4 items-center justify-center rounded-full bg-accent text-[10px] font-bold text-accent-foreground">
                {cartCount}
              </span>
            )}
          </Link>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-border bg-background">
          <div className="px-4 py-2">
            <div className="relative mb-3">
              <input
                type="text"
                placeholder="Ürün Ara"
                className="w-full rounded border border-border bg-background px-4 py-2.5 pr-10 text-sm font-body text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary"
              />
              <button className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                <Search className="h-4 w-4" />
              </button>
            </div>
            {categories.map((cat) => (
              <a
                key={cat.name}
                href={cat.href}
                className="block py-2.5 text-sm font-medium tracking-wider text-foreground hover:text-primary transition-colors font-body border-b border-border last:border-0"
              >
                {cat.name}
              </a>
            ))}
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;
