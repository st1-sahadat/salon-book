import Image from "next/image";
import Link from "next/link";

/* ---------- replace these paths with your local images ---------- */
const MAIN_IMAGE = "/Images/hero-salon.jpg";   // main arch image
const INSET_IMAGE = "/Images/hero-detail.jpg"; // small rotated card
/* --------------------------------------------------------------- */

const STATS = [
  { value: "4.9/5", label: "Guest rating" },
  { value: "12k+", label: "Bookings completed" },
  { value: "18", label: "Expert stylists" },
];

const TRUST = [
  {
    title: "Verified stylists",
    text: "Licensed, trained and reviewed",
    icon: (
      <path d="M12 3l7 3v5c0 4.4-2.9 8.3-7 9.6C7.9 19.3 5 15.4 5 11V6l7-3zM9 12l2 2 4-4" />
    ),
  },
  {
    title: "Instant confirmation",
    text: "Know your slot the moment you book",
    icon: (
      <>
        <circle cx="12" cy="12" r="8.5" />
        <path d="M12 7.5V12l3 2" />
      </>
    ),
  },
  {
    title: "Fair pricing",
    text: "No surprises at the counter",
    icon: (
      <path d="M12 20s-7-4.3-7-9.2A3.8 3.8 0 0 1 12 8a3.8 3.8 0 0 1 7 2.8C19 15.7 12 20 12 20z" />
    ),
  },
];

export default function Banner() {
  return (
    <section className="relative overflow-hidden bg-[#F6F1E8] font-body">
      {/* soft background glow */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -left-40 top-0 h-130 w-130 rounded-full opacity-60 blur-3xl"
        style={{ background: "radial-gradient(circle, rgba(214,180,116,0.35) 0%, transparent 70%)" }}
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-24 top-24 h-105 w-105 rounded-full opacity-50 blur-3xl"
        style={{ background: "radial-gradient(circle, rgba(78,110,84,0.30) 0%, transparent 70%)" }}
      />

      <div className="relative mx-auto grid max-w-7xl items-center gap-14 px-6 pb-16 pt-16 lg:grid-cols-[1.02fr_1fr] lg:gap-20 lg:px-12 lg:pb-24 lg:pt-24">
        {/* ================= LEFT ================= */}
        <div>
          {/* pills */}
          <div className="flex flex-wrap items-center gap-3">
            <span className="inline-flex items-center gap-2 rounded-full border border-[#2E4634]/15 bg-white/70 px-4 py-2 text-[11px] uppercase tracking-[0.18em] text-[#3E5A45]">
              <span className="h-1.5 w-1.5 rounded-full bg-[#4E7A55]" />
              Open today until 8:00 PM
            </span>
            <span className="inline-flex items-center gap-2 rounded-full border border-[#2E4634]/15 bg-white/70 px-4 py-2 text-[11px] uppercase tracking-[0.18em] text-[#8A7A66]">
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#B98A44" strokeWidth="1.6">
                <path d="M12 21s7-6.1 7-11a7 7 0 1 0-14 0c0 4.9 7 11 7 11z" />
                <circle cx="12" cy="10" r="2.5" />
              </svg>
              Madison Avenue, NYC
            </span>
          </div>

          {/* headline */}
          <h1 className="mt-9 font-display text-[clamp(44px,7.2vw,88px)] font-light leading-[0.98] tracking-[-0.035em] text-[#22301F]">
            Look the part,
            <br />
            <em className="font-medium italic text-[#3F5D45]">feel the difference.</em>
          </h1>

          {/* copy */}
          <p className="mt-7 max-w-130 text-[16.5px] leading-loose text-[#6B5F52]">
            A quiet neighbourhood studio for hair, skin, nails and spa rituals.
            Browse our menu, choose a time that suits you, and let our stylists
            take care of the rest.
          </p>

          {/* CTAs */}
          <div className="mt-9 flex flex-wrap items-center gap-4">
            <Link
              href="/services"
              className="group inline-flex items-center gap-3 rounded-full bg-[#2E4634] px-8 py-4 text-[13px] uppercase tracking-[0.2em] text-[#F6F1E8] transition hover:bg-[#3F5D45]"
            >
              Explore services
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="transition-transform group-hover:translate-x-1">
                <path d="M5 12h14M13 6l6 6-6 6" />
              </svg>
            </Link>

            <Link
              href="/sign-up"
              className="inline-flex items-center gap-2.5 rounded-full border border-[#2E4634]/25 px-8 py-4 text-[13px] uppercase tracking-[0.2em] text-[#2E4634] transition hover:border-[#2E4634] hover:bg-[#2E4634]/6"
            >
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
                <circle cx="12" cy="8.5" r="3.5" />
                <path d="M5 20c0-3.6 3.1-5.5 7-5.5s7 1.9 7 5.5" />
              </svg>
              Create an account
            </Link>
          </div>

          {/* stats */}
          <div className="mt-12 grid max-w-130 grid-cols-3 gap-6 border-t border-[#2E4634]/12 pt-9">
            {STATS.map((stat) => (
              <div key={stat.label}>
                <p className="font-display text-[30px] leading-none tracking-[-0.02em] text-[#22301F]">
                  {stat.value}
                </p>
                <p className="mt-2.5 text-[11px] uppercase tracking-[0.22em] text-[#8A7A66]">
                  {stat.label}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* ================= RIGHT : IMAGE CLUSTER ================= */}
        <div className="relative mx-auto w-full max-w-140">
          {/* brass ring behind image */}
          <div
            aria-hidden="true"
            className="absolute -left-6 -top-6 h-[86%] w-[86%] rounded-t-[220px] rounded-b-[36px] border border-[#B98A44]/45"
          />

          {/* main arch image — replace MAIN_IMAGE with your file */}
          <div className="relative aspect-4/5 w-full overflow-hidden rounded-t-[220px] rounded-b-[36px] bg-[#E4D9C9] shadow-[0_50px_100px_-50px_rgba(34,48,31,0.6)]">
            <Image
              src={MAIN_IMAGE}
              alt="SalonBook studio interior"
              fill
              sizes="(max-width: 1024px) 100vw, 900px"
              className="object-cover"
              priority
            />
            <div
              aria-hidden="true"
              className="absolute inset-0"
              style={{
                background:
                  "linear-gradient(180deg, rgba(34,48,31,0) 45%, rgba(34,48,31,0.55) 100%)",
              }}
            />
          </div>

          {/* small rotated inset image — replace INSET_IMAGE with your file */}
          <div className="absolute -left-4 bottom-14 w-[38%] max-w-47.5 -rotate-6 overflow-hidden rounded-2xl border-[6px] border-[#F6F1E8] bg-[#E4D9C9] shadow-[0_30px_60px_-30px_rgba(34,48,31,0.55)] sm:-left-10">
            <div className="relative aspect-4/5 w-full">
              <Image
                src={INSET_IMAGE}
                alt="Styling detail"
                fill
                sizes="190px"
                className="object-cover"
              />
            </div>
          </div>

          {/* floating info card */}
          <div className="absolute bottom-6 right-2 rounded-2xl border border-[#2E4634]/10 bg-white/95 px-5 py-4 shadow-[0_28px_60px_-32px_rgba(34,48,31,0.55)] sm:right-6">
            <div className="flex items-center gap-3">
              <span className="grid h-10 w-10 place-items-center rounded-full bg-[#2E4634]/10">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#2E4634" strokeWidth="1.6">
                  <rect x="3.5" y="5" width="17" height="15" rx="2.5" />
                  <path d="M8 3v4M16 3v4M3.5 10h17" />
                </svg>
              </span>
              <div>
                <p className="text-[9.5px] uppercase tracking-[0.28em] text-[#8A7A66]">
                  Next opening
                </p>
                <p className="mt-1 text-[14px] font-semibold text-[#22301F]">
                  Today · 2:30 PM
                </p>
              </div>
            </div>
          </div>

          {/* top floating chip */}
          <div className="absolute -top-2 right-6 hidden rounded-full border border-[#2E4634]/10 bg-white/90 px-4 py-2 text-[10px] uppercase tracking-[0.24em] text-[#3E5A45] shadow-sm sm:block">
            ★ 4.9 rated studio
          </div>
        </div>
      </div>

      {/* ================= BOTTOM TRUST STRIP ================= */}
      <div className="border-t border-[#2E4634]/10 bg-[#F1EADD]">
        <div className="mx-auto grid max-w-7xl gap-8 px-6 py-10 sm:grid-cols-3 lg:px-12">
          {TRUST.map((item) => (
            <div key={item.title} className="flex items-start gap-4">
              <span className="grid h-11 w-11 shrink-0 place-items-center rounded-full border border-[#B98A44]/35 bg-[#B98A44]/10">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#B98A44" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
                  {item.icon}
                </svg>
              </span>
              <div>
                <p className="text-[13px] font-semibold uppercase tracking-[0.14em] text-[#22301F]">
                  {item.title}
                </p>
                <p className="mt-1.5 text-[13px] text-[#7A6E60]">{item.text}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}