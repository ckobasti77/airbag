"use client";

import { useRef, useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import {
  Shield,
  Truck,
  ScanSearch,
  Phone,
  Mail,
  MapPin,
  ChevronRight,
  AlertTriangle,
} from "lucide-react";
import { CATALOG, QR_PATTERN, type CatalogModel } from "@/lib/data";

gsap.registerPlugin(ScrollTrigger);

// ═══════════════════════════════════════════════════════════════════════════════
// WORD SPLIT REVEAL
// ═══════════════════════════════════════════════════════════════════════════════

function SplitHeading({
  children,
  className = "",
  tag: Tag = "h2",
}: {
  children: string;
  className?: string;
  tag?: "h1" | "h2" | "h3";
}) {
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    if (!ref.current) return;
    const words = ref.current.querySelectorAll(".split-word");

    const ctx = gsap.context(() => {
      gsap.fromTo(
        words,
        { y: "110%", opacity: 0, rotateX: 40 },
        {
          y: "0%",
          opacity: 1,
          rotateX: 0,
          duration: 0.7,
          stagger: 0.04,
          ease: "power3.out",
          scrollTrigger: {
            trigger: ref.current,
            start: "top 88%",
          },
        }
      );
    });

    return () => ctx.revert();
  }, []);

  return (
    // @ts-expect-error - dynamic tag
    <Tag ref={ref} className={className} style={{ perspective: "600px" }}>
      {children.split(" ").map((word, i) => (
        <span key={i} className="inline-block overflow-hidden mr-[0.28em]">
          <span
            className="split-word inline-block"
            style={{ transformOrigin: "bottom left" }}
          >
            {word}
          </span>
        </span>
      ))}
    </Tag>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// FEATURE CARD
// ═══════════════════════════════════════════════════════════════════════════════

function FeatureCard({
  icon: Icon,
  title,
  description,
  index,
}: {
  icon: React.ComponentType<{ size?: number; className?: string }>;
  title: string;
  description: string;
  index: number;
}) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!ref.current) return;
    const ctx = gsap.context(() => {
      gsap.fromTo(
        ref.current!,
        { opacity: 0, y: 50, filter: "blur(8px)" },
        {
          opacity: 1,
          y: 0,
          filter: "blur(0px)",
          duration: 0.8,
          delay: index * 0.1,
          ease: "power2.out",
          scrollTrigger: {
            trigger: ref.current,
            start: "top 90%",
          },
        }
      );
    });
    return () => ctx.revert();
  }, [index]);

  return (
    <div
      ref={ref}
      className="group relative bg-white/[0.02] border border-zinc-800 hover:border-[#FF8C00]/30 rounded-lg p-6 transition-all duration-500 hover:bg-white/[0.04]"
    >
      {/* Corner accent */}
      <div className="absolute top-0 right-0 w-8 h-8 border-t border-r border-[#FF8C00]/0 group-hover:border-[#FF8C00]/30 rounded-tr-lg transition-colors duration-500" />

      <div className="w-10 h-10 rounded-md bg-[#FF8C00]/10 flex items-center justify-center mb-4 group-hover:bg-[#FF8C00]/20 transition-colors">
        <Icon size={20} className="text-[#FF8C00]" />
      </div>
      <h3 className="text-white font-semibold text-lg mb-2">{title}</h3>
      <p className="text-zinc-400 text-sm leading-relaxed">{description}</p>

      {/* Bottom line reveal */}
      <div className="mt-4 h-px w-0 group-hover:w-full bg-gradient-to-r from-[#FF8C00]/40 to-transparent transition-all duration-700" />
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// CATALOG CARD (Industrial Label)
// ═══════════════════════════════════════════════════════════════════════════════

function CatalogCard({
  model,
  index,
}: {
  model: CatalogModel;
  index: number;
}) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!ref.current) return;
    const ctx = gsap.context(() => {
      gsap.fromTo(
        ref.current!,
        { opacity: 0, y: 60, scale: 0.96, filter: "blur(6px)" },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          filter: "blur(0px)",
          duration: 0.8,
          delay: index * 0.12,
          ease: "power2.out",
          scrollTrigger: {
            trigger: ref.current,
            start: "top 92%",
          },
        }
      );
    });
    return () => ctx.revert();
  }, [index]);

  return (
    <div
      ref={ref}
      className="group bg-[#0D0D0D] border border-zinc-800 hover:border-[#FF8C00]/40 rounded-lg overflow-hidden transition-all duration-500 hover:shadow-lg hover:shadow-[#FF8C00]/5"
    >
      {/* Card header */}
      <div className="flex items-start justify-between p-5 pb-3">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <div className="w-1 h-4 bg-[#FF8C00] rounded-full" />
            <span className="text-zinc-400 text-xs font-mono uppercase tracking-[0.2em]">
              {model.brand}
            </span>
          </div>
          <h3 className="text-white text-xl font-bold tracking-tight">
            {model.model}
          </h3>
          <span className="text-zinc-500 text-xs font-mono">{model.year}</span>
        </div>

        {/* QR placeholder */}
        <div className="grid grid-cols-5 grid-rows-5 gap-[1px] w-[30px] h-[30px] opacity-40 group-hover:opacity-70 transition-opacity">
          {QR_PATTERN.map((fill, i) => (
            <div
              key={i}
              className={`w-full h-full rounded-[1px] ${
                fill ? "bg-zinc-300" : "bg-transparent"
              }`}
            />
          ))}
        </div>
      </div>

      <div className="mx-5 h-px bg-zinc-800 group-hover:bg-[#FF8C00]/20 transition-colors" />

      {/* Parts table */}
      <div className="p-5 pt-3">
        <div className="space-y-0">
          <div className="flex items-center text-[10px] font-mono uppercase tracking-[0.15em] text-zinc-600 mb-2">
            <span className="flex-1 min-w-0">Deo</span>
            <span className="w-20 sm:w-24 text-right shrink-0">OEM</span>
            <span className="w-12 sm:w-16 text-right shrink-0">Status</span>
          </div>

          {model.parts.map((part, i) => (
            <div
              key={i}
              className="flex items-center py-1.5 border-t border-zinc-800/50 text-sm"
            >
              <span className="flex-1 min-w-0 text-zinc-300 text-[12px] sm:text-[13px] truncate pr-2">
                {part.name}
              </span>
              <span className="w-20 sm:w-24 text-right font-mono text-[10px] sm:text-[11px] text-[#FACC15]/70 shrink-0">
                {part.oem}
              </span>
              <span className="w-12 sm:w-16 flex justify-end shrink-0">
                <span
                  className={`inline-flex items-center gap-1 text-[10px] font-mono ${
                    part.status === "Na stanju"
                      ? "text-emerald-400"
                      : "text-[#FACC15]"
                  }`}
                >
                  <span
                    className={`w-1.5 h-1.5 rounded-full ${
                      part.status === "Na stanju"
                        ? "bg-emerald-400"
                        : "bg-[#FACC15]"
                    }`}
                  />
                  {part.status === "Na stanju" ? "STOK" : "NAR."}
                </span>
              </span>
            </div>
          ))}
        </div>

        {/* Barcode */}
        <div className="flex items-end gap-[1px] h-5 mt-4 opacity-30 group-hover:opacity-50 transition-opacity">
          {[3, 5, 2, 4, 1, 5, 3, 1, 4, 2, 5, 1, 3, 4, 2, 5, 1, 3, 2, 4, 5, 1, 3, 2, 4, 1, 5, 3, 2, 4].map(
            (h, i) => (
              <div
                key={i}
                className="flex-1 bg-zinc-400"
                style={{ height: `${h * 20}%` }}
              />
            )
          )}
        </div>

        {/* Price range & CTA */}
        <div className="flex items-center justify-between mt-4">
          <span className="font-mono text-xs text-zinc-500">
            {model.parts[0]?.price} –{" "}
            {model.parts[model.parts.length - 1]?.price}
          </span>
          <button
            className="flex items-center gap-1 text-[#FF8C00] text-xs font-semibold hover:text-[#FACC15] transition-colors group/btn"
            data-magnetic
          >
            Pogledaj
            <ChevronRight
              size={14}
              className="group-hover/btn:translate-x-0.5 transition-transform"
            />
          </button>
        </div>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// LANDING CONTENT
// ═══════════════════════════════════════════════════════════════════════════════

export default function LandingContent() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Blur-in for generic scroll-reveal elements
      gsap.utils.toArray<HTMLElement>(".scroll-reveal").forEach((el) => {
        gsap.fromTo(
          el,
          { opacity: 0, filter: "blur(10px)", y: 30 },
          {
            opacity: 1,
            filter: "blur(0px)",
            y: 0,
            duration: 0.9,
            ease: "power2.out",
            scrollTrigger: {
              trigger: el,
              start: "top 88%",
              end: "top 55%",
              toggleActions: "play none none reverse",
            },
          }
        );
      });
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <div ref={containerRef}>
      {/* ─── Features Section ──────────────────────────────────────────── */}
      <section className="relative py-24 px-6 md:px-12 lg:px-20 max-w-7xl mx-auto">
        <div className="scroll-reveal flex items-center gap-3 mb-4">
          <div className="h-px w-8 bg-[#FF8C00]" />
          <span className="font-mono text-[11px] text-[#FF8C00] uppercase tracking-[0.2em]">
            Zašto Mi
          </span>
        </div>

        <SplitHeading className="text-3xl md:text-4xl font-bold text-white mb-4 tracking-tight">
          Preciznost. Kvalitet. Sigurnost.
        </SplitHeading>

        <p className="scroll-reveal text-zinc-400 max-w-2xl mb-12 text-lg">
          Specijalizovani smo za vazdušne jastuke za VW Group vozila.
          Svaki deo prolazi rigoroznu proveru kompatibilnosti.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          <FeatureCard
            icon={ScanSearch}
            title="Vizuelna Identifikacija"
            description="3D interaktivni model pomaže da tačno identifikujete deo koji vam treba. Smanjite stopu pogrešnih narudžbina."
            index={0}
          />
          <FeatureCard
            icon={Shield}
            title="OEM Kompatibilnost"
            description="Svaki deo ima verifikovan OEM broj. Garantujemo 100% kompatibilnost sa vašim vozilom."
            index={1}
          />
          <FeatureCard
            icon={Truck}
            title="Brza Isporuka"
            description="Isporuka u roku od 24-48h na teritoriji cele Srbije. Delovi na stanju šaljemo istog dana."
            index={2}
          />
        </div>
      </section>

      {/* ─── Catalog Section ───────────────────────────────────────────── */}
      <section
        id="katalog-grid"
        className="relative py-24 px-6 md:px-12 lg:px-20 max-w-7xl mx-auto"
      >
        {/* Ambient glow */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-96 h-96 bg-[#FF8C00]/[0.03] rounded-full blur-3xl pointer-events-none" />

        <div className="scroll-reveal flex items-center gap-3 mb-4">
          <div className="h-px w-8 bg-[#FF8C00]" />
          <span className="font-mono text-[11px] text-[#FF8C00] uppercase tracking-[0.2em]">
            Katalog
          </span>
        </div>

        <SplitHeading className="text-3xl md:text-4xl font-bold text-white mb-4 tracking-tight">
          Modeli u Ponudi
        </SplitHeading>

        <p className="scroll-reveal text-zinc-400 max-w-2xl mb-12 text-lg">
          Airbagovi, pojasevi i senzori za najpopularnije modele na srpskom
          tržištu.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {CATALOG.map((model, i) => (
            <CatalogCard key={model.id} model={model} index={i} />
          ))}
        </div>
      </section>

      {/* ─── CTA Section ───────────────────────────────────────────────── */}
      <section id="kontakt" className="relative py-24 px-6 md:px-12 lg:px-20">
        <div className="max-w-4xl mx-auto text-center">
          <div className="scroll-reveal">
            <span className="inline-block font-mono text-[11px] text-[#FF8C00] uppercase tracking-[0.2em] mb-6 border border-[#FF8C00]/20 px-4 py-1.5 rounded-full">
              Kontakt
            </span>
          </div>

          <SplitHeading className="text-3xl md:text-4xl font-bold text-white mb-6 tracking-tight">
            Ne možete da pronađete deo?
          </SplitHeading>

          <p className="scroll-reveal text-zinc-400 mb-10 text-lg max-w-xl mx-auto">
            Pošaljite nam OEM broj ili fotografiju dela i javićemo vam
            raspoloživost u roku od 2 sata.
          </p>

          <div className="scroll-reveal flex flex-col sm:flex-row gap-4 justify-center mb-16">
            <a
              href="tel:+381601234567"
              className="inline-flex items-center justify-center gap-2.5 bg-[#FF8C00] hover:bg-[#e67e00] active:bg-[#cc7000] text-black font-bold py-3.5 px-8 rounded-md transition-colors text-sm tracking-wide"
              data-magnetic
            >
              <Phone size={16} />
              +381 60 123 4567
            </a>
            <a
              href="mailto:info@airbagexpert.rs"
              className="inline-flex items-center justify-center gap-2.5 bg-white/[0.04] hover:bg-white/[0.08] border border-zinc-700 hover:border-[#FF8C00]/30 text-white font-semibold py-3.5 px-8 rounded-md transition-all text-sm"
              data-magnetic
            >
              <Mail size={16} />
              info@airbagexpert.rs
            </a>
          </div>

          <div className="scroll-reveal inline-flex items-center gap-2 text-zinc-500 text-sm font-mono">
            <MapPin size={14} className="text-[#FF8C00]" />
            Beograd, Srbija
          </div>
        </div>
      </section>

      {/* ─── Footer ────────────────────────────────────────────────────── */}
      <footer className="border-t border-zinc-800/60 py-10 px-6 md:px-12 lg:px-20">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-start gap-3 bg-[#FF8C00]/[0.04] border border-[#FF8C00]/15 rounded-md p-4 mb-8">
            <AlertTriangle
              size={16}
              className="text-[#FF8C00] shrink-0 mt-0.5"
            />
            <p className="text-xs text-zinc-400 leading-relaxed">
              <strong className="text-[#FF8C00]">UPOZORENJE:</strong> Vazdušni
              jastuci (airbagovi) su pirotehničke naprave. Ugradnju sme da vrši
              isključivo licencirani servis. Nepravilno rukovanje može dovesti
              do ozbiljnih povreda. Ovaj sajt služi isključivo za identifikaciju
              i prodaju delova.
            </p>
          </div>

          <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-zinc-600 text-xs font-mono">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-[#FF8C00]" />
              <span className="text-zinc-400 font-semibold tracking-tight">
                AirbagExpert.rs
              </span>
            </div>
            <span>© 2026 Sva prava zadržana</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
