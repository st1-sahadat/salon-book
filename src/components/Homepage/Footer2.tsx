import Link from "next/link";

const COLUMNS = [
  {
    no: "01",
    title: "The studio",
    links: [
      { label: "Our story", href: "/story" },
      { label: "Meet the team", href: "/team" },
      { label: "Gift cards", href: "/gift-cards" },
      { label: "Careers", href: "/careers" },
    ],
  },
  {
    no: "02",
    title: "Book a visit",
    links: [
      { label: "Hair & colour", href: "/services?category=hair" },
      { label: "Skin & facial", href: "/services?category=skin" },
      { label: "Nails", href: "/services?category=nails" },
      { label: "Massage & spa", href: "/services?category=spa" },
    ],
  },
  {
    no: "03",
    title: "Support",
    links: [
      { label: "My appointments", href: "/dashboard" },
      { label: "Booking policy", href: "/policy" },
      { label: "FAQs", href: "/faqs" },
      { label: "Contact us", href: "/contact" },
    ],
  },
];

export default function Footer2() {
  return (
    <footer className="border-t border-[#22301F]/10 bg-[#F6F1E8] font-body text-[#22301F]">
      {/* ---- top band : big wordmark ---- */}
      <div className="border-b border-[#22301F]/10">
        <div className="mx-auto max-w-7xl px-6 py-14 lg:px-12 lg:py-16">
          <p className="font-mono text-[10px] uppercase tracking-[0.38em] text-[#B98A44]">
            SalonBook — New York
          </p>

          <h2 className="mt-5 font-display text-[clamp(38px,7vw,86px)] font-light leading-[0.95] tracking-[-0.035em] text-[#22301F]">
            Beautifully
            <span className="italic text-[#2E4634]"> ordinary</span> days,
            <br />
            made a little <span className="italic text-[#2E4634]">special</span>.
          </h2>

          <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:items-center">
            <Link
              href="/services"
              className="group inline-flex w-fit items-center gap-3 bg-[#2E4634] px-8 py-4 text-[13px] uppercase tracking-[0.2em] text-[#F6F1E8] transition hover:bg-[#3F5D45]"
            >
              Book an appointment
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
                className="transition-transform group-hover:translate-x-1"
              >
                <path d="M5 12h14M13 6l6 6-6 6" />
              </svg>
            </Link>
            <Link
              href="/contact"
              className="inline-flex w-fit items-center gap-3 border border-[#22301F]/25 px-8 py-4 text-[13px] uppercase tracking-[0.2em] text-[#22301F] transition hover:border-[#2E4634] hover:bg-[#2E4634]/[0.06] hover:text-[#2E4634]"
            >
              Talk to us
            </Link>
          </div>
        </div>
      </div>

      {/* ---- numbered columns ---- */}
      <div className="mx-auto max-w-7xl px-6 py-14 lg:px-12">
        <div className="grid gap-12 md:grid-cols-3">
          {COLUMNS.map((column) => (
            <div key={column.no} className="border-t border-[#22301F]/15 pt-7">
              <div className="flex items-baseline gap-3">
                <span className="font-mono text-[11px] tracking-[0.28em] text-[#B98A44]">
                  {column.no}
                </span>
                <h3 className="font-display text-[20px] tracking-[-0.01em] text-[#22301F]">
                  {column.title}
                </h3>
              </div>

              <ul className="mt-6 space-y-3.5">
                {column.links.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="group inline-flex items-center gap-2 text-[15px] text-[#6B5F52] transition hover:text-[#2E4634]"
                    >
                      <span className="h-px w-0 bg-[#2E4634] transition-all group-hover:w-4" />
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      {/* ---- visit strip ---- */}
      <div className="border-y border-[#22301F]/10 bg-[#EFE7D9]">
        <div className="mx-auto grid max-w-7xl gap-10 px-6 py-12 md:grid-cols-3 lg:px-12">
          <div>
            <p className="font-mono text-[10px] uppercase tracking-[0.32em] text-[#B98A44]">
              Find us
            </p>
            <p className="mt-4 text-[15px] leading-[1.9] text-[#3E332A]">
              42 Hudson Lane, Ground Floor
              <br />
              Brooklyn, NY 11201
            </p>
          </div>

          <div>
            <p className="font-mono text-[10px] uppercase tracking-[0.32em] text-[#B98A44]">
              Say hello
            </p>
            <div className="mt-4 space-y-2 text-[15px] text-[#3E332A]">
              <p>
                <a href="tel:+13475550142" className="transition hover:text-[#2E4634]">
                  +1 (347) 555-0142
                </a>
              </p>
              <p>
                <a href="mailto:care@salonbook.com" className="transition hover:text-[#2E4634]">
                  care@salonbook.com
                </a>
              </p>
            </div>
          </div>

          <div>
            <p className="font-mono text-[10px] uppercase tracking-[0.32em] text-[#B98A44]">
              Opening hours
            </p>
            <div className="mt-4 space-y-2 text-[14px]">
              {[
                ["Tue — Fri", "10:00 — 19:00"],
                ["Saturday", "09:00 — 18:00"],
                ["Sun — Mon", "Closed"],
              ].map(([day, time]) => (
                <div key={day} className="flex justify-between gap-6 border-b border-[#22301F]/10 pb-2">
                  <span className="text-[#6B5F52]">{day}</span>
                  <span className="text-[#22301F]">{time}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ---- bottom bar ---- */}
      <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-3 px-6 py-7 text-[12px] text-[#7A6E60] sm:flex-row lg:px-12">
        <p>© 2026 SalonBook Studio. All rights reserved.</p>
        <div className="flex items-center gap-6">
          <Link href="/privacy" className="uppercase tracking-[0.18em] transition hover:text-[#2E4634]">
            Privacy
          </Link>
          <Link href="/terms" className="uppercase tracking-[0.18em] transition hover:text-[#2E4634]">
            Terms
          </Link>
          <Link href="/cookies" className="uppercase tracking-[0.18em] transition hover:text-[#2E4634]">
            Cookies
          </Link>
        </div>
        <p className="font-display italic text-[#3E332A]">Crafted slowly, in Brooklyn.</p>
      </div>
    </footer>
  );
}
