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
    <footer className="bg-[#F1E7DA] font-body text-[#2B211C]">
      {/* ---- top band : big wordmark ---- */}
      <div className="border-b border-[#2B211C]/12">
        <div className="mx-auto max-w-7xl px-6 py-14 lg:px-12 lg:py-16">
          <p className="font-mono text-[10px] uppercase tracking-[0.38em] text-[#B0762F]">
            SalonBook — New York
          </p>

          <h2 className="mt-5 font-display text-[clamp(38px,7vw,86px)] font-light leading-[0.95] tracking-[-0.035em]">
            Beautifully
            <span className="italic text-[#5B2233]"> ordinary</span> days,
            <br />
            made a little <span className="italic text-[#5B2233]">special</span>.
          </h2>

          <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:items-center">
            <Link
              href="/services"
              className="inline-flex w-fit items-center gap-3 bg-[#5B2233] px-8 py-4 text-[13px] uppercase tracking-[0.2em] text-[#F1E7DA] transition hover:bg-[#712B41]"
            >
              Book an appointment
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                <path d="M5 12h14M13 6l6 6-6 6" />
              </svg>
            </Link>
            <Link
              href="/contact"
              className="inline-flex w-fit items-center gap-3 border border-[#2B211C]/25 px-8 py-4 text-[13px] uppercase tracking-[0.2em] text-[#2B211C] transition hover:border-[#5B2233] hover:text-[#5B2233]"
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
            <div key={column.no} className="border-t border-[#2B211C]/15 pt-7">
              <div className="flex items-baseline gap-3">
                <span className="font-mono text-[11px] tracking-[0.28em] text-[#B0762F]">
                  {column.no}
                </span>
                <h3 className="font-display text-[20px] tracking-[-0.01em] text-[#2B211C]">
                  {column.title}
                </h3>
              </div>

              <ul className="mt-6 space-y-3.5">
                {column.links.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="group inline-flex items-center gap-2 text-[15px] text-[#5C4A40] transition hover:text-[#5B2233]"
                    >
                      <span className="h-px w-0 bg-[#5B2233] transition-all group-hover:w-4" />
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
      <div className="border-y border-[#2B211C]/12 bg-[#E9DCCB]">
        <div className="mx-auto grid max-w-7xl gap-10 px-6 py-12 md:grid-cols-3 lg:px-12">
          <div>
            <p className="font-mono text-[10px] uppercase tracking-[0.32em] text-[#B0762F]">
              Find us
            </p>
            <p className="mt-4 text-[15px] leading-[1.9] text-[#3E2F27]">
              42 Hudson Lane, Ground Floor
              <br />
              Brooklyn, NY 11201
            </p>
          </div>

          <div>
            <p className="font-mono text-[10px] uppercase tracking-[0.32em] text-[#B0762F]">
              Say hello
            </p>
            <div className="mt-4 space-y-2 text-[15px] text-[#3E2F27]">
              <p>
                <a href="tel:+13475550142" className="transition hover:text-[#5B2233]">
                  +1 (347) 555-0142
                </a>
              </p>
              <p>
                <a href="mailto:care@salonbook.com" className="transition hover:text-[#5B2233]">
                  care@salonbook.com
                </a>
              </p>
            </div>
          </div>

          <div>
            <p className="font-mono text-[10px] uppercase tracking-[0.32em] text-[#B0762F]">
              Opening hours
            </p>
            <div className="mt-4 space-y-2 text-[14px]">
              {[
                ["Tue — Fri", "10:00 — 19:00"],
                ["Saturday", "09:00 — 18:00"],
                ["Sun — Mon", "Closed"],
              ].map(([day, time]) => (
                <div key={day} className="flex justify-between gap-6 border-b border-[#2B211C]/10 pb-2">
                  <span className="text-[#5C4A40]">{day}</span>
                  <span className="text-[#2B211C]">{time}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ---- bottom bar ---- */}
      <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-3 px-6 py-7 text-[12px] text-[#7C6B60] sm:flex-row lg:px-12">
        <p>© 2026 SalonBook Studio. All rights reserved.</p>
        <div className="flex items-center gap-6">
          <Link href="/privacy" className="uppercase tracking-[0.18em] transition hover:text-[#5B2233]">
            Privacy
          </Link>
          <Link href="/terms" className="uppercase tracking-[0.18em] transition hover:text-[#5B2233]">
            Terms
          </Link>
          <Link href="/cookies" className="uppercase tracking-[0.18em] transition hover:text-[#5B2233]">
            Cookies
          </Link>
        </div>
        <p className="font-display italic">Crafted slowly, in Brooklyn.</p>
      </div>
    </footer>
  );
}