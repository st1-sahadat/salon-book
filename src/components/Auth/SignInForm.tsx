"use client";

import { signIn } from "@/lib/auth-client";
import Link from "next/link";
import { FormEvent, useState } from "react";
import { toast } from "../ui/toast";
import { useRouter } from "next/navigation";

export default function SignInForm() {
  const [isLoading, setIsLoading] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const router = useRouter();

  const handleGoogleSignIn = async () => {
    setIsGoogleLoading(true);
    setError(null);
    try {
      const res = await signIn.social({
        provider: "google",
        callbackURL: "/dashboard",
      });
      if (res?.error) {
        toast.add({
          title: "Sign-in failed",
          description: res.error.message ?? "Sign-in failed",
        });
        setError(res.error.message ?? "Sign-in failed");
      }
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Google sign-in failed. Please try again.";
      setError(message);
      toast.add({
        title: "Sign-in failed",
        description: message,
      });
    } finally {
      setIsGoogleLoading(false);
    }
  };

  const handleSubmit = async(e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const payload = {
      email: String(formData.get("email") ?? "").trim(),
      password: String(formData.get("password") ?? ""),
      rememberMe: formData.get("rememberMe") === "on",
    }
    // console.log("Sign in attempt:", { payload });
    setIsLoading(true);
    try {
      const { data, error } = await signIn.email(payload);
      if (error) return setError(error.message ?? "Invalid email or password.");
      console.log({ data, error });
      if (data?.user) {
        toast.add({
          title: `Hello ${data.user?.name}, welcome back!`,
          description: "You have been signed in successfully.",
        });
        router.push("/");
      }
      console.log("Sign in submitted:", { ...payload, password: "[hidden]" });
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setIsLoading(false);
    }
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
          {/* error show */}
          {error && (
            <div
              role="alert"
              className="mb-6 flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
            >
              <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
                className="mt-0.5 shrink-0"
                aria-hidden="true"
              >
                <circle cx="12" cy="12" r="9" />
                <path d="M12 7v6M12 17h.01" />
              </svg>
              <p>{error}</p>
            </div>
          )}

          {/* google */}
          <button
            type="button"
            onClick={handleGoogleSignIn}
            disabled={isLoading || isGoogleLoading}
            className="flex w-full items-center justify-center gap-3 rounded-xl border border-[#E8DED3] bg-white py-3.5 text-[15px] font-medium text-[#2B211C] transition hover:border-[#D8C7B6] hover:bg-[#FCFAF7] disabled:cursor-not-allowed disabled:opacity-60"
          >
            <svg width="18" height="18" viewBox="0 0 48 48">
              <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z" />
              <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z" />
              <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z" />
              <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z" />
            </svg>
            {isGoogleLoading ? "Connecting to Google..." : "Continue with Google"}
          </button>

          {/* divider */}
          <div className="my-7 flex items-center gap-4">
            <span className="h-px flex-1 bg-[#E8DED3]" />
            <span className="font-mono text-[10px] uppercase tracking-[0.22em] text-[#B5A79A]">
              or sign in with email
            </span>
            <span className="h-px flex-1 bg-[#E8DED3]" />
          </div>
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
              disabled={isLoading}
              placeholder="you@example.com"
              className="w-full rounded-xl border border-[#E8DED3] bg-[#FCFAF7] py-3.5 pl-12 pr-4 text-[15px] text-[#2B211C] outline-none transition placeholder:text-[#B5A79A] focus:border-[#5B2233] focus:bg-white focus:ring-4 focus:ring-[#5B2233]/10 disabled:cursor-not-allowed disabled:opacity-60"
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
              disabled={isLoading}
              placeholder="Enter your password"
              className="w-full rounded-xl border border-[#E8DED3] bg-[#FCFAF7] py-3.5 pl-12 pr-12 text-[15px] text-[#2B211C] outline-none transition placeholder:text-[#B5A79A] focus:border-[#5B2233] focus:bg-white focus:ring-4 focus:ring-[#5B2233]/10 disabled:cursor-not-allowed disabled:opacity-60"
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

          {/* keep me signed in */}
          <label className="mt-6 flex cursor-pointer items-start gap-3">
            <input
              name="rememberMe"
              type="checkbox"
              checked={rememberMe}
              disabled={isLoading}
              onChange={(e) => setRememberMe(e.target.checked)}
              className="mt-0.5 h-4 w-4 shrink-0 cursor-pointer accent-[#5B2233]"
            />
            <span>
              <span className="block text-[13px] font-semibold text-[#2B211C]">
                Keep me signed in
              </span>
              <span className="mt-1 block text-[12px] leading-relaxed text-[#7C6B60]">
                Recommended on trusted devices. <span className="underline underline-offset-2">Why?</span>
              </span>
            </span>
          </label>

          {/* submit */}
          <button
            type="submit"
            disabled={!rememberMe}
            className="group mt-8 flex w-full items-center justify-center gap-3 rounded-xl bg-[#5B2233] py-4 text-[15px] font-semibold text-[#F6F0E9] transition hover:bg-[#712B41] disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:bg-[#5B2233]"
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
              <em className="italic text-brass-soft">within reach.</em>
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
                  <span className="mt-1.75 h-1.5 w-1.5 shrink-0 rounded-full bg-brass-soft" />
                  {item}
                </li>
              ))}
            </ul>
          </div>

          <div className="border-t border-white/15 pt-7">
            <p className="font-display text-[17px] italic leading-[1.75] text-white/85">
              &quot;The easiest booking experience I have had at a salon — everything is exactly where you expect it.&quot;
            </p>
            <p className="mt-3 font-mono text-[10px] uppercase tracking-[0.22em] text-brass-soft">
              Sam W. — Skin client
            </p>
          </div>
        </div>
      </aside>
    </main>
  );
}