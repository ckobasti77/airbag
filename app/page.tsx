import HeroCanvas from "@/components/HeroCanvas";
import LandingContent from "@/components/LandingContent";

export default function Home() {
  return (
    <main className="min-h-screen bg-[#0D0D0D]">
      {/* ─── Hero Section ────────────────────────────────────────────────── */}
      <section className="relative h-screen w-full overflow-hidden">
        {/* 3D Canvas (full bleed) */}
        <div className="absolute inset-0">
          <HeroCanvas />
        </div>

        {/* Hero text overlay */}
        <div className="relative z-10 flex flex-col justify-end h-full pb-20 px-6 md:px-12 lg:px-20 pointer-events-none">
          <div className="max-w-2xl">
            {/* Tag */}
            <div className="flex items-center gap-2 mb-4">
              <div className="w-2 h-2 rounded-full bg-[#FF8C00] animate-pulse" />
              <span className="font-mono text-[11px] text-[#FF8C00] uppercase tracking-[0.2em]">
                Airbag Expert Serbia
              </span>
            </div>

            {/* Heading */}
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white tracking-tight leading-[1.1] mb-4">
              Vazdušni Jastuci
              <br />
              <span className="text-[#FF8C00]">Premium Kvalitet</span>
            </h1>

            {/* Subline */}
            <p className="text-zinc-400 text-lg md:text-xl max-w-lg mb-8 leading-relaxed">
              Originalni OEM delovi za VW, Audi i Škoda.
              <br />
              Vizuelna identifikacija. Brza isporuka.
            </p>

            {/* CTA buttons */}
            <div className="flex flex-wrap gap-3 pointer-events-auto">
              <a
                href="#katalog"
                className="inline-flex items-center gap-2 bg-[#FF8C00] hover:bg-[#e67e00] active:bg-[#cc7000] text-black font-bold py-3 px-7 rounded-md transition-colors text-sm tracking-wide"
              >
                POGLEDAJ KATALOG
              </a>
              <a
                href="#kontakt"
                className="inline-flex items-center gap-2 bg-white/[0.05] hover:bg-white/[0.1] border border-zinc-700 hover:border-[#FF8C00]/30 text-white font-semibold py-3 px-7 rounded-md transition-all text-sm"
              >
                KONTAKT
              </a>
            </div>
          </div>
        </div>

        {/* Bottom gradient fade */}
        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-[#0D0D0D] to-transparent pointer-events-none" />

        {/* Scroll indicator */}
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center gap-2 pointer-events-none">
          <div className="w-px h-8 bg-gradient-to-b from-transparent to-[#FF8C00]/50" />
        </div>
      </section>

      {/* ─── Content sections ──────────────────────────────────────────── */}
      <div id="katalog">
        <LandingContent />
      </div>
    </main>
  );
}
