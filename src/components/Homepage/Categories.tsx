import Image from "next/image";
import Link from "next/link";
import type { CSSProperties } from "react";

/* ════════════════════════════════════════════════════════════════════
   CATEGORY DATA — edit this array only
   ════════════════════════════════════════════════════════════════════ */

type Category = {
  no: string;
  slug: string;
  title: string;
  tagline: string;
  blurb: string;
  services: string[];
  image: string;
  alt: string;
  /** gradient that holds the design if the image fails to load */
  tint: string;
  /** Tailwind column span — kept as literal strings so the JIT can see them */
  span: string;
  height: string;
  variant?: "standard" | "split";
};

const CATEGORIES: Category[] = [
  {
    no: "01",
    slug: "haircut-styling",
    title: "Haircut & Styling",
    tagline: "Precision cuts, blow-dry finish",
    blurb:
      "A consultation-first cut shaped to your hair's natural fall, finished with a styling ritual.",
    services: ["Women's cut", "Men's cut", "Blow-dry", "Occasion styling"],
    image:
      "https://images.unsplash.com/photo-1560066984-138dadb4c035?auto=format&fit=crop&w=1600&q=80",
    alt: "Stylist shaping a client's hair with scissors in warm light",
    tint: "linear-gradient(150deg,#3b2b22 0%,#7d5236 55%,#c08457 100%)",
    span: "md:col-span-3 lg:col-span-5",
    height: "h-[380px] md:h-[440px] lg:h-[560px]",
  },
  {
    no: "02",
    slug: "hair-coloring",
    title: "Hair Coloring",
    tagline: "Dimensional colour, gloss and tone",
    blurb:
      "Balayage, global colour and root work mapped to your undertone and maintenance rhythm.",
    services: ["Global colour", "Balayage", "Root touch-up", "Gloss & toner"],
    image:
      "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&w=1600&q=80",
    alt: "Colourist applying colour to sectioned hair with a tint brush",
    tint: "linear-gradient(150deg,#2c2622 0%,#6d4b3a 55%,#b87a4c 100%)",
    span: "md:col-span-3 lg:col-span-4",
    height: "h-[380px] md:h-[440px] lg:h-[560px]",
  },
  {
    no: "03",
    slug: "hair-treatment",
    title: "Hair Treatment",
    tagline: "Repair, scalp care, deep conditioning",
    blurb:
      "Rituals that rebuild strength and shine — from bond repair to scalp detox and keratin care.",
    services: ["Keratin", "Bond repair", "Scalp spa", "Deep conditioning"],
    image:
      "https://images.unsplash.com/photo-1519699047748-de8e457a634e?auto=format&fit=crop&w=1600&q=80",
    alt: "Hands working a conditioning treatment through hair",
    tint: "linear-gradient(150deg,#2a3129 0%,#5c6b4f 55%,#a9b189 100%)",
    span: "md:col-span-3 lg:col-span-3",
    height: "h-[380px] md:h-[440px] lg:h-[560px]",
  },
  {
    no: "04",
    slug: "facial-skincare",
    title: "Facial & Skincare",
    tagline: "Glow-giving facials and skin rituals",
    blurb:
      "Diagnostic facials that treat, not just relax — cleansing, exfoliation, masks and massage.",
    services: ["Deep cleanse", "Anti-ageing", "Acne care", "Hydration boost"],
    image:
      "https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?auto=format&fit=crop&w=1600&q=80",
    alt: "Therapist applying a facial treatment to a client",
    tint: "linear-gradient(150deg,#3a2b2b 0%,#8a5f57 55%,#d2a291 100%)",
    span: "md:col-span-3 lg:col-span-4",
    height: "h-[360px] md:h-[420px] lg:h-[480px]",
  },
  {
    no: "05",
    slug: "makeup",
    title: "Makeup",
    tagline: "Soft glam and occasion-ready artistry",
    blurb:
      "Editorial or understated — makeup that holds through the photograph and the after-party.",
    services: ["Bridal", "Party glam", "HD makeup", "Makeup lessons"],
    image:
      "https://images.unsplash.com/photo-1487412947147-5cebf100ffc2?auto=format&fit=crop&w=1600&q=80",
    alt: "Makeup artist applying product with a brush in soft studio light",
    tint: "linear-gradient(150deg,#33242a 0%,#7c4f5c 55%,#c98d8a 100%)",
    span: "md:col-span-3 lg:col-span-5",
    height: "h-[360px] md:h-[420px] lg:h-[480px]",
  },
  {
    no: "06",
    slug: "manicure-pedicure",
    title: "Manicure & Pedicure",
    tagline: "Considered hands and feet, start to finish",
    blurb:
      "Shaping, cuticle care, massage and long-wear colour — meticulous from first file to final gloss.",
    services: ["Classic manicure", "Gel polish", "Spa pedicure", "Nail art"],
    image:
      "https://images.unsplash.com/photo-1604654894610-df63bc536371?auto=format&fit=crop&w=1600&q=80",
    alt: "Manicurist caring for a client's hands on a linen cloth",
    tint: "linear-gradient(150deg,#2b2a2c 0%,#6a5f66 55%,#b9a6a0 100%)",
    span: "md:col-span-3 lg:col-span-3",
    height: "h-[360px] md:h-[420px] lg:h-[480px]",
  },
  {
    no: "07",
    slug: "spa-massage",
    title: "Spa & Massage",
    tagline: "Slow-down rituals for body and mind",
    blurb:
      "Restorative bodywork tailored to how you hold tension — Swedish, deep tissue, aroma and hot stone.",
    services: ["Swedish", "Deep tissue", "Hot stone", "Aroma therapy"],
    image:
      "https://images.unsplash.com/photo-1544161515-4ab6ce6db874?auto=format&fit=crop&w=2000&q=80",
    alt: "Therapist performing a restorative massage in a warm, low-lit room",
    tint: "linear-gradient(150deg,#1d2a24 0%,#41604f 55%,#94a787 100%)",
    span: "md:col-span-6 lg:col-span-12",
    height: "h-auto lg:h-[440px]",
    variant: "split",
  },
];

/* ════════════════════════════════════════════════════════════════════
   COMPONENT
   ════════════════════════════════════════════════════════════════════ */

type Vars = CSSProperties & Record<`--${string}`, string | number>;

export default function Categories() {
  return (
    <section
      id="services"
      className="container mx-auto relative overflow-hidden py-[clamp(78px,9vw,150px)] text-[#221913]"
      style={{
        background:
          "radial-gradient(1100px 520px at 88% -12%, rgba(176,92,57,.12), transparent 62%)," +
          "radial-gradient(760px 420px at -6% 104%, rgba(214,178,143,.22), transparent 60%)," +
          "#F7F2EC",
      }}
    >
      <style>{`
        @keyframes rise {
          from { opacity: 0; transform: translateY(28px) scale(.988); }
          to   { opacity: 1; transform: none; }
        }
      `}</style>

      {/* film grain */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-[0.05]"
        style={{
          backgroundImage:
            "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='160' height='160'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='3'/%3E%3C/filter%3E%3Crect width='160' height='160' filter='url(%23n)'/%3E%3C/svg%3E\")",
        }}
      />

      <div className="relative z-10  ">
        {/* ── header ───────────────────────────────────────────── */}
        <header className="mb-[clamp(42px,5vw,78px)] grid items-end gap-[clamp(28px,5vw,88px)] lg:grid-cols-[1.2fr_0.8fr]">
          <div>
            <p className="mb-6 flex items-center gap-3.5 font-mono text-[11px] uppercase tracking-[0.32em] text-[#B05C39] before:h-px before:w-12 before:bg-[#B05C39] before:opacity-60">
              Find your ritual
            </p>
            <h2 className="font-display text-[clamp(38px,5.6vw,78px)] font-medium leading-[0.97] tracking-[-0.028em]">
              A category for
              <br />
              every kind of{" "}
              <em className="font-normal italic text-[#B05C39]">pause</em>
            </h2>
          </div>

          <div>
            <p className="mb-6.5 max-w-[44ch] text-[clamp(15px,1.15vw,18px)] leading-[1.68] text-[#6D5C4F]">
              Seven ways to be looked after. Browse by the kind of care you need
              today — every service is delivered by specialists who do one thing
              exceptionally well.
            </p>
            <div className="flex flex-wrap items-center gap-4 border-t border-[#221913]/[0.14] pt-4.5 font-mono text-[11px] uppercase tracking-[0.18em] text-[#6D5C4F]">
              <span>07 categories</span>
              <span className="h-1 w-1 rounded-full bg-[#B05C39]/60" />
              <span>40+ services</span>
              <span className="h-1 w-1 rounded-full bg-[#B05C39]/60" />
              <span>By appointment</span>
            </div>
          </div>
        </header>

        {/* ── grid ─────────────────────────────────────────────── */}
        <div className="grid grid-cols-1 gap-3 md:grid-cols-6 lg:grid-cols-12 lg:gap-5">
          {CATEGORIES.map((c, i) => {
            const vars = { "--i": i } as Vars;

            /* ---------- 07 · split feature banner ---------- */
            if (c.variant === "split") {
              return (
                <Link
                  key={c.slug}
                  href={`/services/${c.slug}`}
                  style={vars}
                  className={`group relative isolate flex overflow-hidden rounded-[18px] bg-[#221913] text-white no-underline shadow-[0_18px_40px_-30px_rgba(34,25,19,.6)] transition-all duration-500 hover:-translate-y-1 hover:shadow-[0_46px_80px_-40px_rgba(34,25,19,.6)] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#B05C39] ${c.span} ${c.height} flex-col lg:flex-row`}
                >
                  {/* text panel */}
                  <div className="relative z-20 flex flex-1 flex-col justify-between gap-7 p-[clamp(26px,3.2vw,52px)]">
                    <div>
                      <span className="flex items-center gap-3 font-mono text-[11px] tracking-[0.26em] text-white/70">
                        {c.no}
                        <i className="block h-px w-7.5 bg-current opacity-55" />
                      </span>
                      <h3 className="mt-4.5 mb-2 font-display text-[clamp(30px,3.3vw,52px)] font-medium leading-[1.02] tracking-tight text-[#F7F2EC]">
                        {c.title}
                      </h3>
                      <p className="mb-3.5 font-display text-[clamp(16px,1.35vw,21px)] italic text-[#B05C39]">
                        {c.tagline}
                      </p>
                      <p className="max-w-[38ch] text-sm leading-[1.72] text-[#F7F2EC]/60">
                        {c.blurb}
                      </p>
                    </div>

                    <div>
                      <ul className="flex flex-wrap gap-1.75">
                        {c.services.map((x) => (
                          <li
                            key={x}
                            className="whitespace-nowrap rounded-full border border-white/25 px-2.75 py-1.25 font-mono text-[9.5px] uppercase tracking-[0.14em] text-white/85"
                          >
                            {x}
                          </li>
                        ))}
                      </ul>
                      <span className="relative mt-4.25 inline-block pb-1.25 font-mono text-[10px] uppercase tracking-[0.22em]">
                        Explore {c.title}
                        <i className="absolute bottom-0 left-0 h-px w-full origin-left scale-x-0 bg-[#B05C39] transition-transform duration-500 ease-out group-hover:scale-x-100 group-focus-visible:scale-x-100" />
                      </span>
                    </div>
                  </div>

                  {/* image */}
                  <div
                    className="relative h-62.5 w-full flex-[1.38] overflow-hidden lg:h-auto"
                    style={{ background: c.tint }}
                  >
                    <Image
                      src={c.image}
                      alt={c.alt}
                      fill
                      sizes="(max-width:1024px) 100vw, 55vw"
                      className="object-cover object-[center_42%] saturate-[0.9] transition-transform duration-1100 ease-out group-hover:scale-[1.1]"
                    />
                    <span
                      aria-hidden
                      className="absolute inset-0 bg-linear-to-t from-[#221913]/95 via-[#221913]/30 to-transparent lg:bg-linear-to-r lg:from-[#221913] lg:via-[#221913]/40 lg:to-transparent"
                    />
                  </div>
                </Link>
              );
            }

            /* ---------- standard card ---------- */
            return (
              <Link
                key={c.slug}
                href={`/services/${c.slug}`}
                style={vars}
                className={`group relative isolate block overflow-hidden rounded-[18px] text-white no-underline shadow-[0_18px_40px_-30px_rgba(34,25,19,.6)] transition-all duration-500 hover:-translate-y-1.5 hover:shadow-[0_40px_70px_-34px_rgba(34,25,19,.55)] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#B05C39] animate-[rise_0.9s_ease-out_both] [animation-delay:calc(var(--i)*70ms)] col-span-1 ${c.span} ${c.height}`}
              >
                {/* media */}
                <div
                  className="absolute inset-0 overflow-hidden"
                  style={{ background: c.tint }}
                >
                  <Image
                    src={c.image}
                    alt={c.alt}
                    fill
                    sizes="(max-width:768px) 100vw, (max-width:1024px) 50vw, 40vw"
                    className="object-cover object-[center_32%] saturate-[0.9] transition-transform duration-1100 ease-out group-hover:scale-[1.1]"
                  />
                  <span
                    aria-hidden
                    className="absolute inset-0 bg-linear-to-t from-[#140c08]/90 from-0% via-[#140c08]/55 via-30% to-transparent to-82%"
                  />
                </div>

                {/* index + arrow */}
                <div className="pointer-events-none absolute inset-x-0 bottom-0 flex items-start justify-between p-[clamp(18px,1.7vw,28px)] pb-0">
                  <span className="flex items-center gap-3 font-mono text-[11px] tracking-[0.26em] text-white/70">
                    {c.no}
                    <i className="block h-px w-7.5 bg-current opacity-55" />
                  </span>
                  <span className="-translate-x-2 translate-y-2 text-[17px] opacity-0 transition-all duration-500 ease-out group-hover:translate-x-0 group-hover:translate-y-0 group-hover:opacity-100 group-focus-visible:opacity-100">
                    ↗
                  </span>
                </div>

                {/* body */}
                <div className="absolute inset-x-0 bottom-0 z-10 px-[clamp(18px,1.7vw,28px)] pb-[clamp(22px,2vw,30px)]">
                  <h3 className="mb-1.5 font-display text-[clamp(21px,1.7vw,30px)] font-medium leading-[1.08] tracking-[-0.018em] transition-transform duration-500 ease-out group-hover:-translate-y-0.75">
                    {c.title}
                  </h3>
                  <p className="text-[13px] leading-normal text-white/75">
                    {c.tagline}
                  </p>

                  <ul className="mt-0 flex max-h-0 flex-wrap gap-1.75 overflow-hidden opacity-0 transition-all duration-500 ease-out group-hover:mt-3.75 group-hover:max-h-30 group-hover:opacity-100 group-focus-visible:mt-3.75 group-focus-visible:max-h-30 group-focus-visible:opacity-100">
                    {c.services.slice(0, 3).map((x) => (
                      <li
                        key={x}
                        className="whitespace-nowrap rounded-full border border-white/25 px-2.75 py-1.25 font-mono text-[9.5px] uppercase tracking-[0.14em] text-white/85"
                      >
                        {x}
                      </li>
                    ))}
                  </ul>


                  <span className="relative mt-4.25 inline-block pb-1.25 font-mono text-[10px] uppercase tracking-[0.22em]">
                    Explore
                    <i className="absolute bottom-0 left-0 h-px w-full origin-left scale-x-0 bg-[#B05C39] transition-transform duration-500 ease-out group-hover:scale-x-100 group-focus-visible:scale-x-100" />
                  </span>
                </div>
              </Link>
            );
          })}
        </div>

        {/* ── footer ───────────────────────────────────────────── */}
        <div className="mt-[clamp(38px,4vw,60px)] flex flex-wrap items-center justify-between gap-6 border-t border-[#221913]/[0.14] pt-6.5">
          <p className="max-w-[52ch] text-sm leading-[1.7] text-[#6D5C4F]">
            Not sure what you need? Our team will map the right ritual in a free
            10-minute consultation.
          </p>
          <Link
            href="/services"
            className="rounded-full border border-[#221913] px-6.5 py-3.25 font-mono text-[11px] uppercase tracking-[0.2em] text-[#221913] no-underline transition-all duration-300 hover:bg-[#221913] hover:tracking-[0.28em] hover:text-[#F7F2EC]"
          >
            View all services →
          </Link>
        </div>
      </div>
    </section>
  );
}