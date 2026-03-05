import heroBanner1 from "@/assets/hero-banner-1.jpg";
import heroBanner2 from "@/assets/hero-banner-2.jpg";
import heroBanner3 from "@/assets/hero-banner-3.jpg";
import { useState, useEffect, useCallback } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

const slides = [
  {
    image: heroBanner1,
    title: "Lüks Mücevher Koleksiyonu",
    subtitle: "Eşsiz parçalarla tarzınızı yansıtın",
  },
  {
    image: heroBanner2,
    title: "Premium Saat Koleksiyonu",
    subtitle: "Zamansız şıklık, üstün kalite",
  },
  {
    image: heroBanner3,
    title: "Tasarım Çanta Koleksiyonu",
    subtitle: "En prestijli markaların en seçkin modelleri",
  },
];

const HeroSlider = () => {
  const [current, setCurrent] = useState(0);

  const next = useCallback(() => {
    setCurrent((prev) => (prev + 1) % slides.length);
  }, []);

  const prev = () => {
    setCurrent((prev) => (prev - 1 + slides.length) % slides.length);
  };

  useEffect(() => {
    const timer = setInterval(next, 5000);
    return () => clearInterval(timer);
  }, [next]);

  return (
    <section className="relative w-full h-[300px] md:h-[500px] overflow-hidden">
      {slides.map((slide, index) => (
        <div
          key={index}
          className={`absolute inset-0 transition-opacity duration-700 ${
            index === current ? "opacity-100" : "opacity-0"
          }`}
        >
          <img
            src={slide.image}
            alt={slide.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-foreground/40 flex items-center justify-center">
            <div className="text-center">
              <h1 className="font-display text-3xl md:text-5xl text-background mb-3">
                {slide.title}
              </h1>
              <p className="font-body text-background/80 text-sm md:text-lg mb-6">
                {slide.subtitle}
              </p>
              <a
                href="#"
                className="inline-block border border-background px-8 py-3 text-sm tracking-widest text-background hover:bg-background hover:text-foreground transition-colors font-body"
              >
                KEŞFET
              </a>
            </div>
          </div>
        </div>
      ))}

      <button
        onClick={prev}
        className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 flex items-center justify-center bg-background/20 hover:bg-background/40 text-background transition-colors rounded-full"
      >
        <ChevronLeft className="h-5 w-5" />
      </button>
      <button
        onClick={next}
        className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 flex items-center justify-center bg-background/20 hover:bg-background/40 text-background transition-colors rounded-full"
      >
        <ChevronRight className="h-5 w-5" />
      </button>

      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrent(index)}
            className={`w-2.5 h-2.5 rounded-full transition-colors ${
              index === current ? "bg-background" : "bg-background/40"
            }`}
          />
        ))}
      </div>
    </section>
  );
};

export default HeroSlider;
