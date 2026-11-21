import Link from "next/link";

const EXPLORE = [
  { label: "Home", href: "/" },
  { label: "Browse services", href: "/services" },
  { label: "Sign in", href: "/sign-in" },
  { label: "Create an account", href: "/sign-up" },
  { label: "Why SalonBook", href: "/why-salonbook" },
];

const TREATMENTS = ["Hair", "Nails", "Facial & Skin", "Massage", "Makeup"];

export default function Footer1() {
  return (
    <footer className="border-t border-[#D8A441]/20 bg-[#22301F] font-body text-[#F3ECE0]">
      <div className="mx-auto max-w-7xl px-6 py-16 lg:px-12 lg:py-20">
        <div className="grid gap-12 md:grid-cols-2 lg:grid-cols-4">
          {/* ---- brand + description + socials ---- */}
          <div className="lg:pr-8">
            <div className="flex items-center gap-3">
              <span className="grid h-11 w-11 place-items-center rounded-full bg-[#EFE6D6]/10">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#D8A441" strokeWidth="1.6">
                  <circle cx="12" cy="12" r="2.2" />
                  <path d="M12 3.2c2 2.6 2 5.4 0 6.4M12 20.8c-2-2.6-2-5.4 0-6.4M3.2 12c2.6-2 5.4-2 6.4 0M20.8 12c-2.6 2-5.4 2-6.4 0" />
                </svg>
              </span>
              <span className="font-display text-[26px] leading-none">
                Salon<span className="italic text-[#D8A441]">Book</span>
              </span>
            </div>

            <p className="mt-6 max-w-82.5 text-[15px] leading-loose text-[#EFE6D6]/70">
              A neighbourhood studio where thoughtful craft meets unhurried care.
              Book hair, skin, nails and spa rituals with the barbers who make it personal.
            </p>

            <div className="mt-8 flex items-center gap-3">
              {[
                { name: "Instagram", d: "M12 8.6A3.4 3.4 0 1 0 12 15.4 3.4 3.4 0 0 0 12 8.6zM17.5 7.2h.01M7 3.5h10a3.5 3.5 0 0 1 3.5 3.5v10a3.5 3.5 0 0 1-3.5 3.5H7A3.5 3.5 0 0 1 3.5 17V7A3.5 3.5 0 0 1 7 3.5z" },
                { name: "Facebook", d: "M14.5 8.5H17M14.5 8.5V7a1.5 1.5 0 0 1 1.5-1.5h1M14.5 8.5v11M11 11.5h6" },
                { name: "Pinterest", d: "M12 3a9 9 0 0 0-3.3 17.4c-.1-.8-.2-2 0-2.9l1.2-5.1s-.3-.6-.3-1.5c0-1.4.8-2.5 1.8-2.5.9 0 1.3.6 1.3 1.4 0 .9-.5 2.1-.8 3.3-.2 1 .5 1.8 1.5 1.8 1.8 0 3.1-1.9 3.1-4.6 0-2.4-1.7-4.1-4.2-4.1-2.8 0-4.5 2.1-4.5 4.3 0 .9.3 1.8.7 2.3.1.1.1.2.1.3l-.3 1c0 .2-.1.2-.3.1-1.3-.6-2-2.4-2-3.9 0-3.2 2.3-6.1 6.7-6.1 3.5 0 6.2 2.5 6.2 5.8 0 3.5-2.2 6.3-5.2 6.3-1 0-2-.5-2.3-1.2l-.6 2.4c-.2.9-.8 2-1.2 2.6A9 9 0 1 0 12 3z" },
              ].map((social) => (
                <a
                  key={social.name}
                  href="#"
                  aria-label={social.name}
                  className="grid h-11 w-11 place-items-center rounded-full border border-[#EFE6D6]/20 text-[#EFE6D6]/75 transition hover:border-[#D8A441] hover:bg-[#D8A441]/15 hover:text-[#D8A441]"
                >
                  <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                    <path d={social.d} />
                  </svg>
                </a>
              ))}
            </div>
          </div>

          {/* ---- explore ---- */}
          <div>
            <h3 className="font-display text-[13px] uppercase tracking-[0.32em] text-[#D8A441]">
              Explore
            </h3>
            <ul className="mt-7 space-y-4">
              {EXPLORE.map((item) => (
                <li key={item.label}>
                  <Link
                    href={item.href}
                    className="text-[15px] text-[#EFE6D6]/75 transition hover:text-[#D8A441]"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* ---- treatments ---- */}
          <div>
            <h3 className="font-display text-[13px] uppercase tracking-[0.32em] text-[#D8A441]">
              Treatments
            </h3>
            <ul className="mt-7 space-y-4">
              {TREATMENTS.map((item) => (
                <li key={item}>
                  <Link
                    href={`/services?category=${item.toLowerCase().replace(/[^a-z]+/g, "-")}`}
                    className="text-[15px] text-[#EFE6D6]/75 transition hover:text-[#D8A441]"
                  >
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* ---- visit us ---- */}
          <div>
            <h3 className="font-display text-[13px] uppercase tracking-[0.32em] text-[#D8A441]">
              Visit us
            </h3>

            <ul className="mt-7 space-y-5 text-[15px] leading-[1.75] text-[#EFE6D6]/75">
              <li className="flex gap-3">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#D8A441" strokeWidth="1.5" className="mt-1 shrink-0">
                  <path d="M12 21s7-6.1 7-11a7 7 0 1 0-14 0c0 4.9 7 11 7 11z" />
                  <circle cx="12" cy="10" r="2.6" />
                </svg>
                <span>128 Madison Avenue, Suite 4,<br />New York, NY 10016</span>
              </li>
              <li className="flex gap-3">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#D8A441" strokeWidth="1.5" className="mt-1 shrink-0">
                  <path d="M22 16.9v2a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3.1 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2 3.2 2 2 0 0 1 4 1h2a2 2 0 0 1 2 1.7c.1 1 .4 1.9.7 2.8a2 2 0 0 1-.5 2.1L7.1 8.9a16 16 0 0 0 6 6l1.3-1.1a2 2 0 0 1 2.1-.5c.9.3 1.8.6 2.8.7a2 2 0 0 1 1.7 2z" />
                </svg>
                <a href="tel:+12125550198" className="transition hover:text-[#D8A441]">
                  +1 (212) 555-0198
                </a>
              </li>
              <li className="flex gap-3">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#D8A441" strokeWidth="1.5" className="mt-1 shrink-0">
                  <rect x="3" y="5" width="18" height="14" rx="2" />
                  <path d="M3 7l9 6 9-6" />
                </svg>
                <a href="mailto:hello@salonbook.com" className="transition hover:text-[#D8A441]">
                  hello@salonbook.com
                </a>
              </li>
            </ul>

            <div className="mt-7 space-y-2.5 border-t border-[#EFE6D6]/10 pt-6 text-[14px]">
              {[
                ["Monday — Friday", "9:00 AM — 8:00 PM"],
                ["Saturday", "9:00 AM — 7:00 PM"],
                ["Sunday", "10:00 AM — 5:00 PM"],
              ].map(([day, time]) => (
                <div key={day} className="flex justify-between gap-4 text-[#EFE6D6]/70">
                  <span>{day}</span>
                  <span className="text-[#EFE6D6]/90">{time}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* bottom bar */}
      <div className="border-t border-[#EFE6D6]/10">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-3 px-6 py-6 text-[13px] text-[#EFE6D6]/55 sm:flex-row lg:px-12">
          <p>© 2026 SalonBook. All rights reserved.</p>
          <p className="font-display italic text-[#EFE6D6]/70">Designed for a calmer kind of beauty.</p>
        </div>
      </div>
    </footer>
  );
}

