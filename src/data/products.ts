import productRolexSub from "@/assets/product-rolex-sub.jpg";
import productHermesBag from "@/assets/product-hermes-bag.jpg";
import productNecklace from "@/assets/product-necklace.jpg";
import productPatek from "@/assets/product-patek.jpg";
import productAP from "@/assets/product-ap.jpg";
import productHermesKelly from "@/assets/product-hermes-kelly.jpg";

export interface Product {
  id: string;
  name: string;
  brand: string;
  price: string;
  image: string;
  category: string;
  description: string;
}

export const sampleProducts: Product[] = [
  {
    id: "1",
    name: "Submariner Date 41mm",
    brand: "Rolex",
    price: "₺850.000",
    image: productRolexSub,
    category: "Saatler",
    description: "Rolex Submariner Date 41mm, Oystersteel ve Cerachrom çerçeveli. Su geçirmezlik 300 metre. Otomatik hareket, 70 saat güç rezervi.",
  },
  {
    id: "2",
    name: "Birkin 35 Togo Deri",
    brand: "Hermes",
    price: "₺420.000",
    image: productHermesBag,
    category: "Çantalar",
    description: "Hermes Birkin 35, birinci sınıf Togo deri, altın kaplama donanım. El yapımı, orijinal sertifikalı.",
  },
  {
    id: "3",
    name: "Zümrüt Pırlanta Kolye",
    brand: "Ersan Diamond",
    price: "₺185.000",
    image: productNecklace,
    category: "Mücevher",
    description: "18 ayar beyaz altın üzerine doğal zümrüt ve pırlanta taşlarla süslenmiş özel tasarım kolye. Toplam 3.2 karat.",
  },
  {
    id: "4",
    name: "Nautilus 5711/1A",
    brand: "Patek Philippe",
    price: "₺2.450.000",
    image: productPatek,
    category: "Saatler",
    description: "Patek Philippe Nautilus 5711/1A-010, paslanmaz çelik kasa, mavi kadran. Otomatik hareket, tarih göstergesi.",
  },
  {
    id: "5",
    name: "Royal Oak 41mm",
    brand: "Audemars Piguet",
    price: "₺1.850.000",
    image: productAP,
    category: "Saatler",
    description: "Audemars Piguet Royal Oak 41mm, rose gold kasa, \"Grande Tapisserie\" kadran. Otomatik hareket.",
  },
  {
    id: "6",
    name: "Kelly 28 Epsom Deri",
    brand: "Hermes",
    price: "₺380.000",
    image: productHermesKelly,
    category: "Çantalar",
    description: "Hermes Kelly 28, Epsom deri, palladium donanım. Turuncu renk, orijinal kutu ve sertifika dahil.",
  },
];
