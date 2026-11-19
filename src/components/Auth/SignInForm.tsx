"use client";

import Link from "next/link";
import { FormEvent, useState } from "react";

export default function SignInForm() {
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const email = form.get("email");
    const password = form.get("password");

    console.log("Sign in attempt:", { email, password });
    // TODO: connect Better Auth later
  };

  return (
    <main className="flex min-h-screen bg-[#F6F0E9] font-body">
      {/* ============ LEFT : FORM ============ */}
      <section className="flex flex-1 flex-col justify-center px-6 py-14 sm:px-10 lg:px-14 xl:px-20">
        <p className="font-mono text-[11px] uppercase tracking-[0.32em] text-[#B0762F]">
          Welcome back
        </p>

        <h1 className="mt-5 font-display text-[clamp(36px,5vw,58px)] font-light leading-[1.05] tracking-tight text-[#2B211C]">
          Sign in to <em className="font-medium italic text-[#5B2233]">SalonBook</em>
        </h1>

        <p className="mt-5 max-w-105 text-[15px] leading-[1.85] text-[#7C6B60]">
          Track appointments, pay for confirmed bookings and keep your profile up to date.
        </p>

        <form
          onSubmit={handleSubmit}
          className="mt-9 w-full max-w-125 rounded-[22px] border border-[#E8DED3] bg-white p-7 shadow-[0_30px_70px_-45px_rgba(43,33,28,0.5)] sm:p-9"
        >
          {/* email */}
          <label className="block text-[13px] font-semibold text-[#2B211C]">
            Email address
          </label>
          <div className="relative mt-2.5">
            <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-[#B5A79A]">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
                <rect x="3" y="5" width="18" height="14" rx="2" />
                <path d="M3 7l9 6 9-6" />
              </svg>
            </span>
            <input
              name="email"
              type="email"
              required
              placeholder="you@example.com"
              className="w-full rounded-xl border border-[#E8DED3] bg-[#FCFAF7] py-3.5 pl-12 pr-4 text-[15px] text-[#2B211C] outline-none transition placeholder:text-[#B5A79A] focus:border-[#5B2233] focus:bg-white focus:ring-4 focus:ring-[#5B2233]/10"
            />
          </div>

          {/* password */}
          <label className="mt-6 block text-[13px] font-semibold text-[#2B211C]">
            Password
          </label>
          <div className="relative mt-2.5">
            <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-[#B5A79A]">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
                <rect x="4" y="10" width="16" height="11" rx="2" />
                <path d="M8 10V7a4 4 0 0 1 8 0v3" />
              </svg>
            </span>
            <input
              name="password"
              type={showPassword ? "text" : "password"}
              required
              placeholder="Enter your password"
              className="w-full rounded-xl border border-[#E8DED3] bg-[#FCFAF7] py-3.5 pl-12 pr-12 text-[15px] text-[#2B211C] outline-none transition placeholder:text-[#B5A79A] focus:border-[#5B2233] focus:bg-white focus:ring-4 focus:ring-[#5B2233]/10"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-[#B5A79A] transition hover:text-[#5B2233]"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
                <path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12z" />
                <circle cx="12" cy="12" r="3" />
              </svg>
            </button>
          </div>

          {/* submit */}
          <button
            type="submit"
            className="group mt-8 flex w-full items-center justify-center gap-3 rounded-xl bg-[#5B2233] py-4 text-[15px] font-semibold text-[#F6F0E9] transition hover:bg-[#712B41]"
          >
            Sign in
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="transition-transform group-hover:translate-x-1">
              <path d="M5 12h14M13 6l6 6-6 6" />
            </svg>
          </button>
        </form>

        <p className="mt-6 text-[14px] text-[#7C6B60]">
          New to SalonBook?{" "}
          <Link href="/sign-up" className="font-semibold text-[#5B2233] underline underline-offset-4 transition hover:text-[#712B41]">
            Create an account
          </Link>
        </p>
      </section>

      {/* ============ RIGHT : IMAGE PANEL ============ */}
      <aside className="relative hidden w-[42%] lg:block">
        <div
          className="absolute inset-0 bg-[#2B211C] bg-cover bg-center"
          style={{
            backgroundImage:
              "linear-gradient(180deg, rgba(43,33,28,0.30) 0%, rgba(43,33,28,0.92) 100%), url('https://images.unsplash.com/photo-1560066984-138dadb4c035?auto=format&fit=crop&w=1200&q=80')",
          }}
        />

        <div className="relative flex h-full flex-col justify-between p-12">
          <span className="inline-flex w-fit items-center gap-2 rounded-full border border-white/25 bg-white/10 px-4 py-2 font-mono text-[10px] uppercase tracking-[0.22em] text-white/85 backdrop-blur">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#E3B274" strokeWidth="1.8">
              <path d="M12 2v20M2 12h20M5 5l14 14M19 5L5 19" />
            </svg>
            SalonBook membership
          </span>

          <div>
            <h2 className="font-display text-[clamp(30px,3vw,44px)] font-normal leading-[1.14] text-white">
              Your appointments,
              <br />
              <em className="italic text-[#E3B274]">within reach.</em>
            </h2>
            <p className="mt-5 max-w-90 text-[15px] leading-[1.9] text-white/70">
              A calm place to see what&apos;s ahead, and the details you shared with us.
            </p>

            <ul className="mt-8 space-y-4">
              {[
                "View upcoming and past appointments",
                "Pay securely once a booking is confirmed",
                "Update your profile whenever you like",
              ].map((item) => (
                <li key={item} className="flex items-start gap-3 text-[14px] leading-[1.7] text-white/85">
                  <span className="mt-1.75 h-1.5 w-1.5 shrink-0 rounded-full bg-[#E3B274]" />
                  {item}
                </li>
              ))}
            </ul>
          </div>

          <div className="border-t border-white/15 pt-7">
            <p className="font-display text-[17px] italic leading-[1.75] text-white/85">
              &quot;The easiest booking experience I have had at a salon — everything is exactly where you expect it.&quot;
            </p>
            <p className="mt-3 font-mono text-[10px] uppercase tracking-[0.22em] text-[#E3B274]">
              Sam W. — Skin client
            </p>
          </div>
        </div>
      </aside>
    </main>
  );
}