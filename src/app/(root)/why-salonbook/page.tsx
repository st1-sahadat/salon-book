import React from "react";
import Link from "next/link";
import {
  Sparkles,
  ShieldCheck,
  Clock,
  Leaf,
  Award,
  Star,
  CheckCircle2,
  XCircle,
  ArrowRight,
  Compass,
  Gem,
} from "lucide-react";

export const metadata = {
  title: "Why SalonBook | Luxury Care, Master Artistry & Clean Beauty",
  description:
    "Discover why discerning clients choose SalonBook: certified master stylists, non-toxic organic formulations, transparent pricing, and effortless online booking.",
};

const pillars = [
  {
    icon: Award,
    title: "Master-Certified Artisans",
    tagline: "Vetted Specialists",
    description:
      "Every stylist, esthetician, and massage therapist at SalonBook undergoes rigorous vetting and ongoing editorial training with European and Asian beauty academies.",
  },
  {
    icon: Leaf,
    title: "Clean, Sustainable Formulations",
    tagline: "100% Non-Toxic",
    description:
      "We exclusively use ammonia-free colors, sulfate-free bond builders, and certified organic botanicals that enrich your hair and skin without harsh toxins.",
  },
  {
    icon: Clock,
    title: "Punctual, Zero-Wait Scheduling",
    tagline: "Your Time is Sacred",
    description:
      "No stacked bookings and no awkward salon waiting. When your appointment is set for 2:00 PM, your dedicated station is prepped and ready for you.",
  },
  {
    icon: Compass,
    title: "Diagnostic Consultations",
    tagline: "Tailored to Your Identity",
    description:
      "We begin every session with an undertone analysis, scalp health check, and face-shape mapping to design results uniquely harmonized with your lifestyle.",
  },
  {
    icon: Gem,
    title: "Private Restorative Suites",
    tagline: "Sanctuary Atmosphere",
    description:
      "Soundproof private styling nooks, Italian ergonomic washbeds, soft binaural acoustics, and complimentary bespoke herbal teas create true relaxation.",
  },
  {
    icon: ShieldCheck,
    title: "Transparent & Digital Pricing",
    tagline: "Zero Surprise Fees",
    description:
      "View exact upfront prices, book 24/7 with instant Stripe-protected checkout, and receive detailed itemized digital receipts right to your dashboard.",
  },
];

const comparisonPoints = [
  {
    feature: "Booking Convenience",
    salonbook: "Instant 24/7 online scheduling with real-time slot selection",
    traditional: "Call during business hours, frequent phone tags & waiting",
  },
  {
    feature: "Product Standards",
    salonbook: "100% Cruelty-free, organic, ammonia-free certified products",
    traditional: "Mass-commercial chemical brands with sulfates & silicones",
  },
  {
    feature: "Stylist Dedication",
    salonbook: "One-on-one undivided focus; no juggling multiple clients",
    traditional: "Stylists multitasking across 3-4 chairs simultaneously",
  },
  {
    feature: "Pricing Transparency",
    salonbook: "Fixed, upfront pricing visible before booking; no hidden extras",
    traditional: "Surprise upcharges at checkout for toners, styling & washes",
  },
  {
    feature: "Hygiene & Sterilization",
    salonbook: "Hospital-grade autoclaved tools, single-use biodegradable capes",
    traditional: "Standard barbicide dip with reused towels & capes",
  },
  {
    feature: "Post-Treatment Support",
    salonbook: "Personalized care regimen & digital routine saved to dashboard",
    traditional: "Generic push to buy overpriced counter retail on the spot",
  },
];

const testimonials = [
  {
    quote:
      "SalonBook completely changed how I look at salon visits. The zero-wait policy is real — my stylist Elena was waiting for me with a warm chamomile tea, and my balayage was perfection.",
    author: "Sophia Sterling",
    role: "Architect & Regular Client",
    rating: 5,
    tag: "Hair Coloring & Cut",
  },
  {
    quote:
      "Finding a salon that uses genuinely clean, pregnancy-safe facial products without sacrificing clinical results was impossible until SalonBook. The Hydraglow facial is legendary.",
    author: "Amara Vance",
    role: "Creative Director",
    rating: 5,
    tag: "Facial & Skincare",
  },
  {
    quote:
      "As someone with an erratic schedule, booking at midnight from my phone and having everything paid securely through Stripe is a lifesaver. Top tier hospitality.",
    author: "Julian Chen",
    role: "Tech Founder",
    rating: 5,
    tag: "Styling & Scalp Therapy",
  },
];

export default function WhySalonBookPage() {
  return (
    <div className="min-h-screen bg-[#FBF9F5] text-ink selection:bg-brass selection:text-brass-ink">
      {/* ----------------- HERO SECTION ----------------- */}
      <section className="relative overflow-hidden bg-forest pt-24 pb-20 md:pt-32 md:pb-28 text-cream">
        {/* Subtle decorative background circles */}
        <div className="pointer-events-none absolute -top-40 -right-40 h-96 w-96 rounded-full bg-brass/10 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-40 -left-40 h-96 w-96 rounded-full bg-sage/20 blur-3xl" />

        <div className="container mx-auto px-5 lg:px-8 max-w-6xl relative z-10 text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-brass/30 bg-brass/10 px-4 py-1.5 font-mono text-xs uppercase tracking-[0.2em] text-brass mb-6">
            <Sparkles className="w-3.5 h-3.5 text-brass" />
            The SalonBook Difference
          </div>

          <h1 className="font-display text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-normal tracking-tight text-cream leading-[1.1] max-w-4xl mx-auto">
            Where Master Artistry Meets <em className="italic text-brass font-medium">Bespoke Sanctuary</em>
          </h1>

          <p className="mt-6 text-base sm:text-lg md:text-xl text-cream-dim/90 max-w-2xl mx-auto font-light leading-relaxed">
            We built SalonBook to eliminate the chaos, hidden fees, and toxic formulations of standard salons. Welcome to a deliberate, calming ritual crafted around you.
          </p>

          {/* Quick Metrics Bar */}
          <div className="mt-12 grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 pt-10 border-t border-cream/15 max-w-4xl mx-auto">
            <div className="p-4 rounded-xl bg-forest-deep/40 border border-cream/10">
              <span className="block font-display text-3xl sm:text-4xl text-brass font-semibold">
                99.4%
              </span>
              <span className="text-xs font-mono uppercase tracking-wider text-cream-dim">
                Client Satisfaction
              </span>
            </div>
            <div className="p-4 rounded-xl bg-forest-deep/40 border border-cream/10">
              <span className="block font-display text-3xl sm:text-4xl text-brass font-semibold">
                15,000+
              </span>
              <span className="text-xs font-mono uppercase tracking-wider text-cream-dim">
                Curated Bookings
              </span>
            </div>
            <div className="p-4 rounded-xl bg-forest-deep/40 border border-cream/10">
              <span className="block font-display text-3xl sm:text-4xl text-brass font-semibold">
                100%
              </span>
              <span className="text-xs font-mono uppercase tracking-wider text-cream-dim">
                Non-Toxic & Clean
              </span>
            </div>
            <div className="p-4 rounded-xl bg-forest-deep/40 border border-cream/10">
              <span className="block font-display text-3xl sm:text-4xl text-brass font-semibold">
                0 Min
              </span>
              <span className="text-xs font-mono uppercase tracking-wider text-cream-dim">
                Waiting Time Guarantee
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* ----------------- 6 CORE PILLARS ----------------- */}
      <section className="py-20 md:py-28 container mx-auto px-5 lg:px-8 max-w-6xl">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="font-mono text-xs uppercase tracking-[0.22em] text-forest font-semibold">
            Our Standards
          </span>
          <h2 className="font-display text-3xl sm:text-4xl md:text-5xl tracking-tight text-ink mt-2">
            Built on Six Uncompromising Pillars
          </h2>
          <p className="mt-4 text-mute text-base font-normal">
            Every detail of our space, technology, and technique is designed to honor your hair, your health, and your schedule.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {pillars.map((pillar, idx) => {
            const Icon = pillar.icon;
            return (
              <div
                key={idx}
                className="group relative rounded-2xl bg-white p-8 border border-cream-deep/70 shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-1"
              >
                <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-forest/8 text-forest group-hover:bg-forest group-hover:text-cream transition-colors duration-300 mb-6">
                  <Icon className="w-6 h-6" />
                </div>
                <span className="block font-mono text-[11px] uppercase tracking-[0.16em] text-brass font-semibold mb-1">
                  {pillar.tagline}
                </span>
                <h3 className="font-display text-2xl font-medium text-ink mb-3">
                  {pillar.title}
                </h3>
                <p className="text-sm text-mute leading-relaxed">
                  {pillar.description}
                </p>
              </div>
            );
          })}
        </div>
      </section>

      {/* ----------------- HOW THE EXPERIENCE WORKS ----------------- */}
      <section className="bg-forest-deep text-cream py-20 md:py-28">
        <div className="container mx-auto px-5 lg:px-8 max-w-6xl">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="font-mono text-xs uppercase tracking-[0.22em] text-brass">
              The Journey
            </span>
            <h2 className="font-display text-3xl sm:text-4xl md:text-5xl text-cream tracking-tight mt-2">
              From Reservation to Radiance
            </h2>
            <p className="mt-4 text-cream-dim text-base font-light">
              Experience the seamless choreography of an elevated salon day.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                step: "01",
                title: "Choose & Customize",
                desc: "Explore verified services, select preferred stylists, and pick your exact date and time slot online.",
              },
              {
                step: "02",
                title: "Sensory Welcome",
                desc: "Step into our serene oasis. Enjoy a signature botanical beverage and custom consultation.",
              },
              {
                step: "03",
                title: "Master Craftsmanship",
                desc: "Relax as your specialist executes your tailored treatment with clean, bio-compatible products.",
              },
              {
                step: "04",
                title: "Effortless Departure",
                desc: "No checkout delays. Invoices are settled digitally, and customized home care tips await on your dashboard.",
              },
            ].map((item, idx) => (
              <div
                key={idx}
                className="relative p-6 rounded-2xl bg-forest/40 border border-cream/10 backdrop-blur-sm"
              >
                <div className="font-mono text-3xl font-semibold text-brass mb-4">
                  {item.step}
                </div>
                <h3 className="font-display text-xl text-cream font-medium mb-2">
                  {item.title}
                </h3>
                <p className="text-sm text-cream-dim/80 font-light leading-relaxed">
                  {item.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ----------------- COMPARISON TABLE ----------------- */}
      <section className="py-20 md:py-28 container mx-auto px-5 lg:px-8 max-w-5xl">
        <div className="text-center max-w-2xl mx-auto mb-14">
          <span className="font-mono text-xs uppercase tracking-[0.22em] text-forest font-semibold">
            Clear Contrast
          </span>
          <h2 className="font-display text-3xl sm:text-4xl md:text-5xl tracking-tight text-ink mt-2">
            Why We Stand Apart
          </h2>
          <p className="mt-3 text-mute text-base">
            See how the SalonBook philosophy elevates your experience compared to conventional salons.
          </p>
        </div>

        <div className="overflow-x-auto rounded-2xl border border-cream-deep/80 bg-white shadow-sm">
          <table className="w-full text-left border-collapse min-w-[620px]">
            <thead>
              <tr className="border-b border-cream-deep/70 bg-cream/40">
                <th className="p-4 sm:p-5 font-mono text-xs uppercase tracking-wider text-mute font-semibold">
                  Experience Factor
                </th>
                <th className="p-4 sm:p-5 font-mono text-xs uppercase tracking-wider text-forest font-bold bg-forest/5">
                  SalonBook
                </th>
                <th className="p-4 sm:p-5 font-mono text-xs uppercase tracking-wider text-mute/80 font-semibold">
                  Standard Salons
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-cream-deep/40 text-sm">
              {comparisonPoints.map((row, index) => (
                <tr key={index} className="hover:bg-cream-soft/20 transition-colors">
                  <td className="p-4 sm:p-5 font-medium text-ink">
                    {row.feature}
                  </td>
                  <td className="p-4 sm:p-5 bg-forest/[0.02] text-forest font-medium">
                    <div className="flex items-start gap-2">
                      <CheckCircle2 className="w-4 h-4 text-forest shrink-0 mt-0.5" />
                      <span>{row.salonbook}</span>
                    </div>
                  </td>
                  <td className="p-4 sm:p-5 text-mute">
                    <div className="flex items-start gap-2">
                      <XCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
                      <span>{row.traditional}</span>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* ----------------- TESTIMONIALS ----------------- */}
      <section className="bg-[#F4EFE6] py-20 md:py-24 border-y border-cream-deep/60">
        <div className="container mx-auto px-5 lg:px-8 max-w-6xl">
          <div className="text-center max-w-xl mx-auto mb-14">
            <span className="font-mono text-xs uppercase tracking-[0.22em] text-forest font-semibold">
              Client Stories
            </span>
            <h2 className="font-display text-3xl sm:text-4xl tracking-tight text-ink mt-2">
              Loved by Discerning Guests
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
            {testimonials.map((item, idx) => (
              <div
                key={idx}
                className="rounded-2xl bg-white p-7 border border-cream-deep/80 shadow-sm flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center gap-1 mb-4">
                    {[...Array(item.rating)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-brass text-brass" />
                    ))}
                  </div>
                  <p className="text-sm text-mute leading-relaxed italic mb-6">
                    &ldquo;{item.quote}&rdquo;
                  </p>
                </div>
                <div className="pt-4 border-t border-cream-deep/50">
                  <p className="font-display text-lg text-ink font-semibold">
                    {item.author}
                  </p>
                  <p className="text-xs text-mute-soft font-mono">
                    {item.role} · <span className="text-forest">{item.tag}</span>
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ----------------- CALL TO ACTION ----------------- */}
      <section className="py-20 md:py-24 container mx-auto px-5 lg:px-8 max-w-4xl text-center">
        <div className="rounded-3xl bg-forest p-10 md:p-16 text-cream relative overflow-hidden shadow-2xl">
          <div className="pointer-events-none absolute -bottom-20 -right-20 h-64 w-64 rounded-full bg-brass/20 blur-2xl" />

          <span className="font-mono text-xs uppercase tracking-[0.24em] text-brass">
            Begin Your Transformation
          </span>
          <h2 className="font-display text-3xl sm:text-4xl md:text-5xl font-normal text-cream mt-3 tracking-tight">
            Reserve Your SalonBook Experience Today
          </h2>
          <p className="mt-4 text-cream-dim text-base max-w-xl mx-auto font-light">
            Indulge in meticulous styling, organic rituals, and unmatched peace of mind.
          </p>

          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/services"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-xl bg-brass px-7 py-3.5 font-mono text-xs font-semibold uppercase tracking-wider text-brass-ink transition-transform hover:-translate-y-0.5 hover:bg-brass-soft shadow-md"
            >
              Browse Services
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              href="/visit"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-xl border border-cream/30 bg-white/5 px-7 py-3.5 font-mono text-xs font-semibold uppercase tracking-wider text-cream transition-colors hover:bg-white/10"
            >
              Plan Your Visit
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
