import { useEffect, useState } from "react";
import { Phone, Mail, MapPin } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Link } from "react-router-dom";
import { useLanguage } from "@/contexts/LanguageContext";

interface Brand {
  id: string;
  name: string;
}

const Footer = () => {
  const [settings, setSettings] = useState<Record<string, string>>({});
  const [brands, setBrands] = useState<Brand[]>([]);
  const { t } = useLanguage();

  useEffect(() => {
    const fetchData = async () => {
      const [settingsRes, brandsRes] = await Promise.all([
        supabase.from("site_settings").select("*"),
        supabase.from("brands").select("id, name").order("sort_order", { ascending: true }).limit(6),
      ]);
      if (settingsRes.data) {
        const map: Record<string, string> = {};
        settingsRes.data.forEach((s) => (map[s.key] = s.value));
        setSettings(map);
      }
      if (brandsRes.data) setBrands(brandsRes.data);
    };
    fetchData();
  }, []);

  const phone = settings.phone || "+0 850 562 13 13";
  const email = settings.email || "info@ersandiamonds.com";
  const address = settings.address || "İstanbul, Türkiye";
  const siteName = settings.site_name || "ERSAN DIAMOND";

  return (
    <footer className="bg-foreground text-background">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h3 className="font-display text-xl font-bold tracking-wider mb-4">{siteName}</h3>
            <div className="space-y-2 text-sm opacity-80">
              <a href={`tel:${phone.replace(/\s/g, "")}`} className="flex items-center gap-2 hover:opacity-100">
                <Phone className="h-3.5 w-3.5" /> {phone}
              </a>
              <a href={`mailto:${email}`} className="flex items-center gap-2 hover:opacity-100">
                <Mail className="h-3.5 w-3.5" /> {email}
              </a>
              <div className="flex items-center gap-2">
                <MapPin className="h-3.5 w-3.5" /> {address}
              </div>
            </div>
          </div>

          <div>
            <h4 className="font-display text-sm font-semibold tracking-wider mb-4">{t("footer.categories")}</h4>
            <ul className="space-y-2 text-sm opacity-80">
              <li><Link to="/kategori/cantalar" className="hover:opacity-100">{t("footer.bags")}</Link></li>
              <li><Link to="/kategori/saatler" className="hover:opacity-100">{t("footer.watches")}</Link></li>
              <li><Link to="/kategori/mucevherler" className="hover:opacity-100">{t("footer.jewelry")}</Link></li>
              <li><Link to="/kategori/marka-mucevher" className="hover:opacity-100">{t("footer.brand_jewelry")}</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-display text-sm font-semibold tracking-wider mb-4">{t("footer.brands")}</h4>
            <ul className="space-y-2 text-sm opacity-80">
              {brands.map((b) => (
                <li key={b.id}>
                  <Link to={`/kategori/${b.name.toLowerCase().replace(/\s+/g, "-")}`} className="hover:opacity-100">
                    {b.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-display text-sm font-semibold tracking-wider mb-4">{t("footer.info")}</h4>
            <ul className="space-y-2 text-sm opacity-80">
              <li><Link to="/iletisim" className="hover:opacity-100">{t("footer.contact")}</Link></li>
              <li><a href="#" className="hover:opacity-100">{t("footer.campaigns")}</a></li>
              <li><a href="#" className="hover:opacity-100">{t("footer.terms")}</a></li>
              <li><a href="#" className="hover:opacity-100">{t("footer.privacy")}</a></li>
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-6 border-t border-background/20 text-center text-xs opacity-60">
          © 2026 {siteName}. {t("footer.rights")}
        </div>
      </div>
    </footer>
  );
};

export default Footer;
