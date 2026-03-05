import { ChevronDown } from "lucide-react";

const HeroSlider = () => {
  const scrollDown = () => {
    const target = window.innerHeight;
    const start = window.scrollY;
    const distance = target - start;
    const duration = 1500;
    let startTime: number | null = null;

    const easeInOutCubic = (t: number) =>
      t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;

    const step = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const elapsed = timestamp - startTime;
      const progress = Math.min(elapsed / duration, 1);
      window.scrollTo(0, start + distance * easeInOutCubic(progress));
      if (progress < 1) requestAnimationFrame(step);
    };

    requestAnimationFrame(step);
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
      <div className="absolute inset-0 flex flex-col items-center justify-end pb-12 z-10">
        <button
          onClick={scrollDown}
          className="pointer-events-auto inline-flex flex-col items-center gap-2 border border-background/70 px-8 py-3 text-sm tracking-widest text-background/90 hover:bg-background hover:text-foreground transition-all duration-300 font-body backdrop-blur-sm"
        >
          KEŞFET
          <ChevronDown className="h-4 w-4 animate-bounce" />
        </button>
      </div>
    </section>
  );
};

export default HeroSlider;
