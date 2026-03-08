import { ChevronDown, Phone, MapPin } from "lucide-react";
import { Link } from "react-router-dom";
import { useState } from "react";
import { useLanguage } from "@/contexts/LanguageContext";

const CategoryNav = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const { t } = useLanguage();

  const categories = [
    {
      name: t("cat.bags"),
      slug: "cantalar",
      hasDropdown: true,
      subcategories: [
        { name: t("cat.hermes_bags"), slug: "hermes-cantalar" },
        { name: t("cat.chanel_bags"), slug: "chanel-cantalar" },
        { name: t("cat.louis_vuitton"), slug: "louis-vuitton" },
        { name: t("cat.all_bags"), slug: "tum-cantalar" },
      ],
    },
    {
      name: t("cat.watches"),
      slug: "saatler",
      hasDropdown: true,
      subcategories: [
        { name: t("cat.rolex"), slug: "rolex" },
        { name: t("cat.patek"), slug: "patek-philippe" },
        { name: t("cat.ap"), slug: "audemars-piguet" },
        { name: t("cat.all_watches"), slug: "tum-saatler" },
      ],
    },
    {
      name: t("cat.jewelry"),
      slug: "mucevher",
      hasDropdown: true,
      subcategories: [
        { name: t("cat.necklace"), slug: "kolye" },
        { name: t("cat.ring"), slug: "yuzuk" },
        { name: t("cat.bracelet"), slug: "bileklik" },
        { name: t("cat.all_jewelry"), slug: "tum-mucevherler" },
      ],
    },
    {
      name: t("cat.brand_jewelry"),
      slug: "marka-mucevher",
      hasDropdown: true,
      subcategories: [
        { name: t("cat.cartier"), slug: "cartier" },
        { name: t("cat.van_cleef"), slug: "van-cleef" },
        { name: t("cat.tiffany"), slug: "tiffany" },
        { name: t("cat.all_brand_jewelry"), slug: "tum-marka-mucevher" },
      ],
    },
  ];

  return (
    <nav className="border-b border-border bg-background relative z-40">
      <div className="container mx-auto flex items-center justify-between px-4">
        <div className="flex items-center gap-0">
          {categories.map((cat, index) => (
            <div
              key={cat.slug}
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
            <span>{t("cat.contact")}</span>
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default CategoryNav;
