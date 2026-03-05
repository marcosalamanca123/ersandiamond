import { Phone, Mail, MapPin } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-foreground text-background">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Logo & Contact */}
          <div>
            <h3 className="font-display text-xl font-bold tracking-wider mb-4">ERSAN DIAMOND</h3>
            <div className="space-y-2 text-sm opacity-80">
              <a href="tel:+908505621313" className="flex items-center gap-2 hover:opacity-100">
                <Phone className="h-3.5 w-3.5" /> +0 850 562 13 13
              </a>
              <a href="mailto:info@ersandiamonds.com" className="flex items-center gap-2 hover:opacity-100">
                <Mail className="h-3.5 w-3.5" /> info@ersandiamonds.com
              </a>
              <div className="flex items-center gap-2">
                <MapPin className="h-3.5 w-3.5" /> İstanbul, Türkiye
              </div>
            </div>
          </div>

          {/* Kategoriler */}
          <div>
            <h4 className="font-display text-sm font-semibold tracking-wider mb-4">KATEGORİLER</h4>
            <ul className="space-y-2 text-sm opacity-80">
              <li><a href="#" className="hover:opacity-100">Çantalar</a></li>
              <li><a href="#" className="hover:opacity-100">Saatler</a></li>
              <li><a href="#" className="hover:opacity-100">Mücevherler</a></li>
              <li><a href="#" className="hover:opacity-100">Marka Mücevher</a></li>
            </ul>
          </div>

          {/* Markalar */}
          <div>
            <h4 className="font-display text-sm font-semibold tracking-wider mb-4">MARKALAR</h4>
            <ul className="space-y-2 text-sm opacity-80">
              <li><a href="#" className="hover:opacity-100">Hermes</a></li>
              <li><a href="#" className="hover:opacity-100">Rolex</a></li>
              <li><a href="#" className="hover:opacity-100">Patek Philippe</a></li>
              <li><a href="#" className="hover:opacity-100">Audemars Piguet</a></li>
            </ul>
          </div>

          {/* Bilgi */}
          <div>
            <h4 className="font-display text-sm font-semibold tracking-wider mb-4">BİLGİ</h4>
            <ul className="space-y-2 text-sm opacity-80">
              <li><a href="#" className="hover:opacity-100">Hakkımızda</a></li>
              <li><a href="#" className="hover:opacity-100">Kampanyalar</a></li>
              <li><a href="#" className="hover:opacity-100">Kullanım Koşulları</a></li>
              <li><a href="#" className="hover:opacity-100">Gizlilik Politikası</a></li>
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-6 border-t border-background/20 text-center text-xs opacity-60">
          © 2026 Ersan Diamond. Tüm hakları saklıdır.
        </div>
      </div>
    </footer>
  );
};

export default Footer;
