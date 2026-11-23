"use client";

import { useState } from "react";
import { Loader2, Lock, ShieldCheck, ArrowRight } from "lucide-react";

interface CheckoutActionProps {
  appointmentId: string;
  amount: string;
}

export function CheckoutAction({ appointmentId, amount }: CheckoutActionProps) {
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleCheckout = async () => {
    setLoading(true);
    setErrorMessage(null);

    try {
      const res = await fetch("/api/checkout_sessions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ appointmentId }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed to initiate checkout session.");
      }

      if (data.url) {
        window.location.href = data.url;
      } else {
        throw new Error("No checkout URL returned from payment provider.");
      }
    } catch (err: unknown) {
      console.error("Checkout error:", err);
      setErrorMessage(
        err instanceof Error ? err.message : "An unexpected error occurred."
      );
      setLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      {errorMessage && (
        <div className="rounded-xl border border-rose-200 bg-rose-50 p-3 text-xs text-rose-700">
          <p className="font-semibold">Payment Initialization Failed</p>
          <p className="mt-0.5">{errorMessage}</p>
        </div>
      )}

      <button
        type="button"
        onClick={handleCheckout}
        disabled={loading}
        className="w-full h-14 rounded-xl bg-forest hover:bg-forest-deep text-cream font-semibold text-base shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-70 disabled:cursor-not-allowed group"
      >
        {loading ? (
          <>
            <Loader2 className="w-5 h-5 animate-spin text-cream" />
            <span>Processing Payment...</span>
          </>
        ) : (
          <>
            <span>Proceed to Stripe Checkout</span>
            <span className="font-bold">({amount})</span>
            <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
          </>
        )}
      </button>

      <div className="flex items-center justify-center gap-2 text-xs text-mute font-medium">
        <Lock className="w-3.5 h-3.5 text-brass" />
        <span>End-to-end encrypted · Powered by Stripe</span>
        <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 ml-1" />
      </div>
    </div>
  );
}
