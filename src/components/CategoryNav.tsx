import { ChevronDown, Phone, MapPin } from "lucide-react";

const categories = [
  { name: "ÇANTALAR", hasDropdown: true },
  { name: "SAATLER", hasDropdown: true },
  { name: "MÜCEVHER", hasDropdown: false },
  { name: "MARKA MÜCEVHER", hasDropdown: false },
];

const CategoryNav = () => {
  return (
    <nav className="border-b border-border bg-background">
      <div className="container mx-auto flex items-center justify-between px-4">
        <div className="flex items-center gap-6">
          {categories.map((cat) => (
            <a
              key={cat.name}
              href="#"
              className="flex items-center gap-1 py-3 text-sm font-medium tracking-wider text-foreground hover:text-primary transition-colors font-body"
            >
              {cat.name}
              {cat.hasDropdown && <ChevronDown className="h-3 w-3" />}
            </a>
          ))}
        </div>
        <div className="hidden lg:flex items-center gap-6 text-sm text-foreground">
          <a href="tel:+908505621313" className="flex items-center gap-2 hover:text-primary transition-colors">
            <Phone className="h-4 w-4" />
            <span>+0 850 562 13 13</span>
          </a>
          <a href="#" className="flex items-center gap-2 hover:text-primary transition-colors">
            <MapPin className="h-4 w-4" />
            <span>Bize Ulaşın</span>
          </a>
        </div>
      </div>
    </nav>
  );
};

export default CategoryNav;
