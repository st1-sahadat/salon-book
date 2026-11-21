"use client";
import { authClient } from "@/lib/auth-client";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";

const LINKS = [
  { href: "/", label: "Home" },
  { href: "/services", label: "Browse Services" },
  { href: "/why-salonbook", label: "Why SalonBook" },
  { href: "/visit", label: "Visit Us" },
];

const EASE = "cubic-bezier(0.2,0.8,0.2,1)";

export default function Navbar() {
  const router = useRouter()
  const { data: session, isPending } = authClient.useSession();
  const userData = session?.user;
  const handleSignOut = () => {
    authClient.signOut();
    router.push("/sign-in")
  };
  const pathname = usePathname();          // current URL path (e.g. "/services")
  const [scrolled, setScrolled] = useState(false);   // has user scrolled down?
  const [menuOpen, setMenuOpen] = useState(false);   // is mobile menu open?
  const [dropdownOpen, setDropdownOpen] = useState(false); // is profile dropdown open?
  const profileRef = useRef<HTMLDivElement>(null);
  const indicatorRef = useRef<HTMLSpanElement>(null);

  // console.log(isPending, userData, error);

  // check immediately when page loads
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // click was outside the profile → close dropdown
  useEffect(() => {
    const onDocClick = (event: MouseEvent) => {
      if (profileRef.current && !profileRef.current.contains(event.target as Node)) {
        setDropdownOpen(false);
      }
    };
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setDropdownOpen(false);
        setMenuOpen(false);
      }
    };
    document.addEventListener("click", onDocClick);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("click", onDocClick);
      document.removeEventListener("keydown", onKey);
    };
  }, []);

  //"When the mobile menu is open, stop the background page from scrolling. When the menu closes, allow scrolling again."
  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [menuOpen]);

  //"When the URL changes (user navigated to a new page), close the mobile menu automatically."
  useEffect(() => {
    const closeMenu = window.setTimeout(() => setMenuOpen(false), 0);
    return () => window.clearTimeout(closeMenu);
  }, [pathname]);

  //highlight current page link
  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href);

  //sliding underline on hover
  const showIndicator = (event: React.MouseEvent<HTMLAnchorElement>) => {
    const el = event.currentTarget; // the link being hovered
    const parent = el.parentElement; // its container
    const indicator = indicatorRef.current; // the underline bar
    if (!parent || !indicator) return;
    const box = el.getBoundingClientRect(); // link position/size
    const parentBox = parent.getBoundingClientRect(); // container position
    indicator.style.width = `${box.width}px`; // match link width
    indicator.style.transform = `translateX(${box.left - parentBox.left}px)`; // slide to link
    indicator.style.opacity = "1"; // show it
  };

  const hideIndicator = () => {
    if (indicatorRef.current) indicatorRef.current.style.opacity = "0"; //hide the bar
  };

  const initials = (userData?.name ?? "")
    .trim()
    .split(/\s+/)
    .filter(Boolean)
    .map((word) => word[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

  //  Skeleton Screen
  if (isPending) {
    return (
      <header
        className="top-0 left-0 z-100 w-full border-b border-cream/15 bg-forest/[0.94] backdrop-blur-lg"
        role="status"
        aria-label="Loading navigation"
        style={{ backdropFilter: "blur(16px) saturate(140%)" }}
      >
        <div className="mx-auto flex max-w-7xl items-center gap-8 px-5 py-5 lg:gap-10 lg:px-8 lg:py-6">

          {/* 1. Logo Skeleton */}
          <div className="flex shrink-0 items-center gap-3">
            {/* Logo Circle */}
            <div className="h-11 w-11 animate-pulse rounded-full border-[1.5px] border-brass/40 bg-brass/[0.08]" />
            <div>
              {/* "SalonBook" Text */}
              <div className="h-6 w-32 animate-pulse rounded-sm bg-cream/[0.12]" />
              {/* "HAIR • SKIN • SPA" Text */}
              <div className="mt-1.5 h-2 w-24 animate-pulse rounded-sm bg-cream/[0.08] sm:block" />
            </div>
          </div>

          {/* 2. Navigation Links Skeleton */}
          <div className="ml-2.5 hidden items-center gap-8 lg:flex">
            {[44, 76, 82, 53].map((width, index) => (
              <div
                key={index}
                className="h-7 animate-pulse rounded-full bg-cream/[0.08]"
                style={{ width: `${width}px` }}
              />
            ))}
          </div>

          {/* 3. Auth Buttons Skeleton (Sign In / Sign Up) */}
          <div className="ml-auto flex items-center gap-5">
            {/* Sign In Text */}
            <div className="hidden h-3.5 w-12 animate-pulse rounded-sm bg-cream/[0.10] sm:block" />
            {/* Sign Up Button */}
            <div className="hidden h-11 w-28 animate-pulse rounded-sm bg-brass/[0.35] sm:block" />
          </div>

        </div>
      </header>
    );
  }

  return (
    <header
      className={`relative top-0 left-0 z-100 w-full border-b border-cream/15 backdrop-blur-lg transition-all duration-300 ${scrolled
        ? "bg-forest-deep/97 shadow-nav"
        : "bg-forest/94"
        }`}
      style={{ backdropFilter: "blur(16px) saturate(140%)" }}
    >
      <div
        className={`container mx-auto flex items-center gap-8 px-5 transition-all duration-300 lg:gap-9.5 lg:px-8.5 ${scrolled ? "py-3.5 lg:py-3.5" : "py-5 lg:py-6"
          }`}
      >
        {/* -------- brand logo -------- */}
        <Link href="/" className="group flex shrink-0 items-center gap-3">
          <span
            className="grid h-11 w-11 shrink-0 place-items-center rounded-full border-[1.5px] border-brass transition-all duration-500 group-hover:rotate-[-24deg] group-hover:bg-brass/12"
            style={{ transitionTimingFunction: EASE }}
          >
            <svg viewBox="0 0 24 24" width="22" height="22" aria-hidden="true">
              <g stroke="#D8A441" fill="none" strokeWidth="1.6" strokeLinecap="round">
                <circle cx="12" cy="12" r="2.4" />
                <path d="M12 3.2c2 2.6 2 5.4 0 6.4M12 20.8c-2-2.6-2-5.4 0-6.4M3.2 12c2.6-2 5.4-2 6.4 0M20.8 12c-2.6 2-5.4 2-6.4 0M5.8 5.8c3 .3 5 1.7 5.2 3.3M18.2 18.2c-3-.3-5-1.7-5.2-3.3M18.2 5.8c-.3 3-1.7 5-3.3 5.2M5.8 18.2c.3-3 1.7-5 3.3-5.2" />
              </g>
            </svg>
          </span>
          <span>
            <span
              className={`block font-display font-semibold leading-none tracking-tight text-cream transition-all duration-300 ${scrolled ? "text-[24px]" : "text-[27px]"
                }`}
            >
              Salon<em className="font-medium italic text-brass">Book</em>
            </span>
            <span className="mt-1 hidden font-mono text-[8.5px] uppercase tracking-[0.36em] text-cream-dim sm:block">
              Hair · Skin · Spa
            </span>
          </span>
        </Link>

        {/* -------- links -------- */}
        <nav
          className="relative ml-2.5 hidden items-center gap-8.5 lg:flex"
          aria-label="Primary"
          onMouseLeave={hideIndicator}
        >
          {LINKS.filter((link) => userData || (link.href !== "/why-salonbook" && link.href !== "/visit")).map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onMouseEnter={showIndicator}
              className={`relative rounded-full px-3 py-1.5 font-mono text-[11.5px] uppercase tracking-[0.19em] transition-all duration-300 ${isActive(link.href)
                ? "bg-brass/15 text-cream shadow-[inset_0_0_0_1px_rgba(196,164,112,0.28)]"
                : "text-cream-dim hover:bg-white/5 hover:text-brass-soft focus:outline-none"
                }`}
            >
              {link.label}
            </Link>
          ))}
          <span
            ref={indicatorRef}
            aria-hidden="true"
            className="pointer-events-none absolute bottom-0 left-0 h-[1.5px] bg-brass opacity-0"
            style={{ transition: `opacity 0.28s ${EASE}, transform 0.38s ${EASE}, width 0.38s ${EASE}` }}
          />
        </nav>

        {/* -------- actions -------- */}
        <div className="ml-auto flex items-center gap-3 lg:gap-5.5">
          {!userData && (
            <>
              <Link
                href="/sign-in"
                className="group relative hidden pb-1.25 font-mono text-[11.5px] uppercase tracking-[0.19em] text-cream sm:block"
              >
                Sign in
                <span className="absolute bottom-0 left-0 h-px w-full origin-right scale-x-0 bg-brass transition-transform duration-300 group-hover:origin-left group-hover:scale-x-100" />
              </Link>
              <Link
                href="/sign-up"
                className="hidden items-center gap-2.5 bg-brass px-6.5 py-3.75 font-mono text-[11.5px] font-medium uppercase tracking-[0.19em] text-brass-ink transition-all duration-300 hover:-translate-y-0.5 hover:bg-brass-soft hover:tracking-[0.26em] sm:inline-flex"
                style={{ clipPath: "polygon(0 0, calc(100% - 13px) 0, 100% 13px, 100% 100%, 13px 100%, 0 calc(100% - 13px))" }}
              >
                <span className="h-1.5 w-1.5 rounded-full bg-brass-ink transition-transform duration-300 group-hover:scale-[1.9]" />
                SIGN UP
              </Link>
            </>
          )}

          {/* profile */}
          {userData && (
            <div ref={profileRef} className="relative">
              <button
                type="button"
                aria-haspopup="menu"
                aria-expanded={dropdownOpen}
                onClick={() => setDropdownOpen((value) => !value)}
                className={`flex cursor-pointer items-center gap-2.5 rounded-full border py-1.5 pl-1.5 pr-3.5 transition-colors duration-300 ${dropdownOpen
                  ? "border-brass/55 bg-brass/10"
                  : "border-cream/15 bg-cream/6 hover:border-brass/55 hover:bg-brass/10"
                  }`}
              >
                {userData.image ? (
                  <Image
                    src={userData.image}
                    alt=""
                    width={35}
                    height={35}
                    className="h-8.75 w-8.75 rounded-full object-cover"
                  />
                ) : (
                  <span className="grid h-8.75 w-8.75 place-items-center rounded-full bg-brass font-display text-[15px] font-semibold text-brass-ink">
                    {initials || "U"}
                  </span>
                )}
                <span className="hidden font-mono text-[11.5px] uppercase tracking-[0.14em] text-cream sm:block">
                  {userData.name.split(" ")[0]}
                </span>
                <svg
                  viewBox="0 0 24 24"
                  width="11"
                  height="11"
                  aria-hidden="true"
                  className={`transition-transform duration-300 ${dropdownOpen ? "rotate-180" : ""}`}
                >
                  <path d="M6 9l6 6 6-6" fill="none" stroke="#D8A441" strokeWidth="2" />
                </svg>
              </button>
                {/* drop down menu */}
              <div
                role="menu"
                className={`absolute right-0 top-[calc(100%+20px)] z-50 w-65.5 origin-top-right border border-cream/15 bg-forest-2 p-3 shadow-dropdown transition-all duration-300 ${dropdownOpen
                  ? "visible translate-y-0 scale-100 opacity-100"
                  : "invisible -translate-y-3 scale-[0.97] opacity-0"
                  }`}
                style={{ clipPath: "polygon(0 0, calc(100% - 16px) 0, 100% 16px, 100% 100%, 16px 100%, 0 calc(100% - 16px))" }}
              >
                <div className="mb-2 border-b border-cream/15 px-3.5 pb-3.5 pt-3">
                  <p className="font-display text-[18px] tracking-[-0.01em] text-cream">
                    {userData.name}
                  </p>
                  {/* {userData.email && (
                    <p className="mt-1.25 break-all font-mono text-[10px] tracking-[0.08em] text-cream-dim">
                      {userData.email}
                    </p>
                  )} */}
                </div>
                <Link
                  href="/dashboard"
                  role="menuitem"
                  className="flex w-full items-center gap-2.5 px-3.5 py-3 font-mono text-[11px] uppercase tracking-[0.17em] text-cream-dim transition-all duration-300 hover:bg-brass/13 hover:pl-5 hover:text-brass-soft"
                >
                  Dashboard
                </Link>
                <Link
                  href="/dashboard/profile"
                  role="menuitem"
                  className="flex w-full items-center gap-2.5 px-3.5 py-3 font-mono text-[11px] uppercase tracking-[0.17em] text-cream-dim transition-all duration-300 hover:bg-brass/13 hover:pl-5 hover:text-brass-soft"
                >
                  My Profile
                </Link>
                <button
                  type="button"
                  role="menuitem"
                  onClick={() => {
                    setDropdownOpen(false);
                    handleSignOut?.();
                  }}
                  className="flex w-full cursor-pointer items-center gap-2.5 px-3.5 py-3 text-left font-mono text-[11px] uppercase tracking-[0.17em] text-cream-dim transition-all duration-300 hover:bg-[rgba(196,74,46,0.16)] hover:pl-5 hover:text-[#E8927A]"
                >
                  Logout
                </button>
              </div>
            </div>
          )}


        </div>
      </div>

      {/* -------- mobile overlay -------- */}
      <div
        className={`fixed inset-0 flex flex-col overflow-y-auto bg-forest px-5 pb-10 pt-30 transition-transform duration-500 lg:px-8.5 lg:pb-11.5 lg:pt-32.5 ${menuOpen ? "z-1 translate-y-0" : "-z-10 -translate-y-full"
          }`}
        style={{ transitionTimingFunction: EASE }}
      >
        <nav className="flex flex-col" aria-label="Mobile">
          {[...LINKS.map((l, i) => ({ ...l, n: i + 1 }))].map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`flex items-baseline justify-between border-b border-cream/15 py-3.75 text-left font-display text-[clamp(30px,8vw,44px)] font-normal leading-tight tracking-[-0.02em] text-cream ${menuOpen ? "animate-navItemIn opacity-0" : "opacity-0"
                }`}
              style={{ animationDelay: `${0.12 + link.n * 0.07}s` }}
            >
              {link.label}
              <small className="font-mono text-[10px] uppercase tracking-[0.22em] text-brass">
                {String(link.n).padStart(2, "0")}
              </small>
            </Link>
          ))}

          {!userData ? (
            <>
              <Link
                href="/sign-in"
                className={`flex items-baseline justify-between border-b border-cream/15 py-3.75 font-display text-[clamp(30px,8vw,44px)] tracking-[-0.02em] text-cream ${menuOpen ? "animate-navItemIn opacity-0" : "opacity-0"}`}
                style={{ animationDelay: "0.47s" }}
              >
                Sign in
                <small className="font-mono text-[10px] uppercase tracking-[0.22em] text-brass">05</small>
              </Link>
              <Link
                href="/sign-up"
                className={`flex items-baseline justify-between border-b border-cream/15 py-3.75 font-display text-[clamp(30px,8vw,44px)] tracking-[-0.02em] text-cream ${menuOpen ? "animate-navItemIn opacity-0" : "opacity-0"}`}
                style={{ animationDelay: "0.54s" }}
              >
                Sign up
                <small className="font-mono text-[10px] uppercase tracking-[0.22em] text-brass">06</small>
              </Link>
            </>
          ) : (
            <>
              <Link
                href="/dashboard"
                className={`flex items-baseline justify-between border-b border-cream/15 py-3.75 font-display text-[clamp(30px,8vw,44px)] tracking-[-0.02em] text-cream ${menuOpen ? "animate-navItemIn opacity-0" : "opacity-0"}`}
                style={{ animationDelay: "0.47s" }}
              >
                Dashboard
                <small className="font-mono text-[10px] uppercase tracking-[0.22em] text-brass">05</small>
              </Link>
              <button
                type="button"
                onClick={() => {
                  setMenuOpen(false);
                  handleSignOut?.();
                }}
                className={`flex cursor-pointer items-baseline justify-between border-b border-cream/15 py-3.75 text-left font-display text-[clamp(30px,8vw,44px)] tracking-[-0.02em] text-cream ${menuOpen ? "animate-navItemIn opacity-0" : "opacity-0"}`}
                style={{ animationDelay: "0.54s" }}
              >
                Logout
                <small className="font-mono text-[10px] uppercase tracking-[0.22em] text-brass">06</small>
              </button>
            </>
          )}
        </nav>

        {/* <div
          className={`mt-auto pt-9 ${menuOpen ? "animate-navItemIn opacity-0" : "opacity-0"}`}
          style={{ animationDelay: "0.62s" }}
        >
          <p className="font-mono text-[10.5px] uppercase tracking-[0.22em] text-cream-dim">
            Open daily · 09:00 — 20:00
          </p>
          <Link
            href="/services"
            className="mt-4.5 inline-flex w-full items-center justify-center gap-2.5 bg-brass px-6.5 py-3.75 font-mono text-[11.5px] font-medium uppercase tracking-[0.19em] text-brass-ink transition-all duration-300 hover:bg-brass-soft hover:tracking-[0.26em]"
            style={{ clipPath: "polygon(0 0, calc(100% - 13px) 0, 100% 13px, 100% 100%, 13px 100%, 0 calc(100% - 13px))" }}
          >
            <span className="h-1.5 w-1.5 rounded-full bg-brass-ink" />
            Book an appointment
          </Link>
        </div> */}
      </div>
    </header>
  );
}