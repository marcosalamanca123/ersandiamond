import { ChevronDown } from "lucide-react";

const HeroSlider = () => {
  const scrollDown = () => {
    window.scrollTo({
      top: window.innerHeight,
      behavior: "smooth",
    });
  };

  return (
    <section className="relative w-full h-[50vh] md:h-[70vh] overflow-hidden bg-black">
      {/* Streamable embed as background video */}
      <div className="absolute inset-[-2px] overflow-hidden">
        <iframe
          src="https://streamable.com/e/amat0n?autoplay=1&muted=1&loop=1&nocontrols=1"
          frameBorder="0"
          allow="autoplay"
          allowFullScreen
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
          style={{ border: "none", width: "calc(177.78vh)", height: "calc(56.25vw)", minWidth: "100%", minHeight: "100%" }}
        />
      </div>
      <div className="absolute inset-0 bg-foreground/30 flex flex-col items-center justify-center z-10">
        <h1 className="font-display text-3xl md:text-5xl text-background mb-3 text-center">
          Lüks Koleksiyonlar
        </h1>
        <p className="font-body text-background/80 text-sm md:text-lg mb-8 text-center">
          Eşsiz parçalarla tarzınızı yansıtın
        </p>
        <button
          onClick={scrollDown}
          className="pointer-events-auto inline-flex flex-col items-center gap-2 border border-background px-8 py-3 text-sm tracking-widest text-background hover:bg-background hover:text-foreground transition-colors font-body"
        >
          KEŞFET
          <ChevronDown className="h-4 w-4 animate-bounce" />
        </button>
      </div>
    </section>
  );
};

export default HeroSlider;
