import { ChevronDown, Phone, MapPin } from "lucide-react";
import { Link } from "react-router-dom";
import { useState } from "react";

const categories = [
  {
    name: "ÇANTALAR",
    slug: "cantalar",
    hasDropdown: true,
    subcategories: [
      { name: "Hermes Çantalar", slug: "hermes-cantalar" },
      { name: "Chanel Çantalar", slug: "chanel-cantalar" },
      { name: "Louis Vuitton", slug: "louis-vuitton" },
      { name: "Tüm Çantalar", slug: "tum-cantalar" },
    ],
  },
  {
    name: "SAATLER",
    slug: "saatler",
    hasDropdown: true,
    subcategories: [
      { name: "Rolex", slug: "rolex" },
      { name: "Patek Philippe", slug: "patek-philippe" },
      { name: "Audemars Piguet", slug: "audemars-piguet" },
      { name: "Tüm Saatler", slug: "tum-saatler" },
    ],
  },
  {
    name: "MÜCEVHER",
    slug: "mucevher",
    hasDropdown: true,
    subcategories: [
      { name: "Kolye", slug: "kolye" },
      { name: "Yüzük", slug: "yuzuk" },
      { name: "Bileklik", slug: "bileklik" },
      { name: "Tüm Mücevherler", slug: "tum-mucevherler" },
    ],
  },
  {
    name: "MARKA MÜCEVHER",
    slug: "marka-mucevher",
    hasDropdown: true,
    subcategories: [
      { name: "Cartier", slug: "cartier" },
      { name: "Van Cleef", slug: "van-cleef" },
      { name: "Tiffany", slug: "tiffany" },
      { name: "Tüm Marka Mücevherler", slug: "tum-marka-mucevher" },
    ],
  },
];

const CategoryNav = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <nav className="border-b border-border bg-background relative z-40">
      <div className="container mx-auto flex items-center justify-between px-4">
        <div className="flex items-center gap-0">
          {categories.map((cat, index) => (
            <div
              key={cat.name}
              className="relative"
              onMouseEnter={() => setOpenIndex(index)}
              onMouseLeave={() => setOpenIndex(null)}
            >
              <Link
                to={`/kategori/${cat.slug}`}
                className="flex items-center gap-1 px-4 py-3 text-sm font-medium tracking-wider text-foreground hover:text-primary transition-colors font-body"
              >
                {cat.name}
                {cat.hasDropdown && (
                  <ChevronDown
                    className={`h-3 w-3 transition-transform ${openIndex === index ? "rotate-180" : ""}`}
                  />
                )}
              </Link>
              {cat.hasDropdown && openIndex === index && (
                <div className="absolute top-full left-0 min-w-[200px] bg-card border border-border shadow-lg rounded-b z-50">
                  {cat.subcategories?.map((sub) => (
                    <Link
                      key={sub.slug}
                      to={`/kategori/${sub.slug}`}
                      className="block px-4 py-2.5 text-sm font-body text-foreground hover:bg-muted hover:text-primary transition-colors"
                    >
                      {sub.name}
                    </Link>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
        <div className="hidden lg:flex items-center gap-6 text-sm text-foreground">
          <a href="tel:+908505621313" className="flex items-center gap-2 hover:text-primary transition-colors">
            <Phone className="h-4 w-4" />
            <span>+0 850 562 13 13</span>
          </a>
          <Link to="/iletisim" className="flex items-center gap-2 hover:text-primary transition-colors">
            <MapPin className="h-4 w-4" />
            <span>Bize Ulaşın</span>
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default CategoryNav;
