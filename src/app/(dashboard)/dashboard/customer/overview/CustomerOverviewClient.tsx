"use client";

import Link from "next/link";
import {
  CalendarCheck,
  Clock,
  CheckCircle2,
  XCircle,
  ArrowRight,
  Sparkles,
  CreditCard,
  Scissors,
} from "lucide-react";
import type { TAppointment } from "./page";

type Props = {
  appointments: TAppointment[];
  user: { name: string; email: string; image: string | null };
};

export default function CustomerOverviewClient({ appointments, user }: Props) {
  const firstName = user.name.split(" ")[0];

  const total = appointments.length;
  const pending = appointments.filter(
    (a) => a.status.toLowerCase() === "pending"
  ).length;
  const confirmed = appointments.filter(
    (a) => a.status.toLowerCase() === "confirmed"
  ).length;
  const cancelled = appointments.filter(
    (a) => a.status.toLowerCase() === "cancelled"
  ).length;

  const recentAppointments = appointments.slice(0, 3);

  const statusBadge = (status: string) => {
    const s = status.toLowerCase();
    if (s === "confirmed")
      return (
        <span className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
          Confirmed
        </span>
      );
    if (s === "pending")
      return (
        <span className="inline-flex items-center gap-1 text-xs font-semibold text-amber-700 bg-amber-50 px-2.5 py-0.5 rounded-full border border-amber-200">
          <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
          Pending
        </span>
      );
    return (
      <span className="inline-flex items-center gap-1 text-xs font-semibold text-rose-700 bg-rose-50 px-2.5 py-0.5 rounded-full border border-rose-200">
        <span className="w-1.5 h-1.5 rounded-full bg-rose-500" />
        Cancelled
      </span>
    );
  };

  const paymentBadge = (paymentStatus: string) => {
    const p = paymentStatus.toLowerCase();
    if (p === "paid")
      return (
        <span className="inline-flex items-center gap-1 text-xs font-medium text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
          Paid
        </span>
      );
    return (
      <span className="inline-flex items-center gap-1 text-xs font-medium text-orange-700 bg-orange-50 px-2 py-0.5 rounded-full">
        <span className="w-1.5 h-1.5 rounded-full bg-orange-400" />
        Unpaid
      </span>
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <p className="text-xs font-bold tracking-[0.15em] uppercase text-forest/60 mb-1">
            Your Salon
          </p>
          <h1 className="font-display text-3xl sm:text-4xl text-ink font-normal tracking-tight">
            Welcome back, {firstName}
          </h1>
          <p className="text-mute text-sm mt-1">
            A clear view of your appointments, payments and next visit.
          </p>
        </div>
        <Link
          href="/dashboard/customer/service"
          className="inline-flex items-center gap-2 bg-forest text-cream px-5 py-2.5 rounded-full text-sm font-medium hover:bg-forest-deep transition-colors shadow-sm"
        >
          <Scissors className="w-4 h-4" />
          Book a service
        </Link>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Appointments */}
        <div className="bg-white rounded-2xl p-5 border-2 border-forest/20 shadow-sm relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-1 bg-forest" />
          <div className="flex items-center justify-between mb-3">
            <p className="text-xs font-bold tracking-wider uppercase text-forest">
              Total Appointments
            </p>
            <div className="w-9 h-9 rounded-full bg-forest/10 flex items-center justify-center">
              <CalendarCheck className="w-4 h-4 text-forest" />
            </div>
          </div>
          <p className="font-display text-4xl text-ink font-normal">{total}</p>
        </div>

        {/* Pending */}
        <div className="bg-white rounded-2xl p-5 border border-cream-deep/60 shadow-sm">
          <div className="flex items-center justify-between mb-3">
            <p className="text-xs font-bold tracking-wider uppercase text-mute">
              Pending
            </p>
            <div className="w-9 h-9 rounded-full bg-amber-50 flex items-center justify-center">
              <Clock className="w-4 h-4 text-amber-600" />
            </div>
          </div>
          <p className="font-display text-4xl text-ink font-normal">{pending}</p>
          <p className="text-xs text-mute mt-1">Awaiting salon confirmation</p>
        </div>

        {/* Confirmed */}
        <div className="bg-white rounded-2xl p-5 border border-cream-deep/60 shadow-sm">
          <div className="flex items-center justify-between mb-3">
            <p className="text-xs font-bold tracking-wider uppercase text-mute">
              Confirmed
            </p>
            <div className="w-9 h-9 rounded-full bg-emerald-50 flex items-center justify-center">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            </div>
          </div>
          <p className="font-display text-4xl text-ink font-normal">
            {confirmed}
          </p>
          <p className="text-xs text-mute mt-1">Ready to pay or visit</p>
        </div>

        {/* Cancelled */}
        <div className="bg-white rounded-2xl p-5 border border-cream-deep/60 shadow-sm">
          <div className="flex items-center justify-between mb-3">
            <p className="text-xs font-bold tracking-wider uppercase text-mute">
              Cancelled
            </p>
            <div className="w-9 h-9 rounded-full bg-rose-50 flex items-center justify-center">
              <XCircle className="w-4 h-4 text-rose-500" />
            </div>
          </div>
          <p className="font-display text-4xl text-ink font-normal">
            {cancelled}
          </p>
        </div>
      </div>

      {/* Bottom Grid: Recent Appointments + Info Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        {/* Recent Appointments */}
        <div className="lg:col-span-3 bg-white rounded-2xl border border-cream-deep/60 shadow-sm p-6">
          <div className="flex items-center justify-between mb-5">
            <div>
              <h2 className="font-display text-xl text-ink font-medium">
                Recent appointments
              </h2>
              <p className="text-xs text-mute mt-0.5">
                Your latest requests and their status.
              </p>
            </div>
            <Link
              href="/dashboard/customer/appointments"
              className="inline-flex items-center gap-1 text-sm font-medium text-forest hover:text-forest-deep transition-colors"
            >
              View all <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {recentAppointments.length === 0 ? (
            <div className="text-center py-10">
              <div className="w-14 h-14 rounded-full bg-cream-soft mx-auto flex items-center justify-center mb-3">
                <CalendarCheck className="w-6 h-6 text-mute-soft" />
              </div>
              <p className="text-mute font-medium">No appointments yet</p>
              <p className="text-xs text-mute-soft mt-1">
                Book your first service to get started.
              </p>
            </div>
          ) : (
            <div className="divide-y divide-cream-deep/40">
              {recentAppointments.map((apt) => {
                const dateFormatted = apt.appointmentDate
                  ? new Date(apt.appointmentDate).toLocaleDateString("en-US", {
                      weekday: "short",
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    })
                  : "N/A";

                return (
                  <div
                    key={apt._id}
                    className="flex items-center gap-4 py-3.5 first:pt-0 last:pb-0"
                  >
                    <div className="w-10 h-10 rounded-xl bg-cream-soft flex items-center justify-center shrink-0">
                      <Scissors className="w-4 h-4 text-brass" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-ink truncate">
                        {apt.serviceName}
                      </p>
                      <p className="text-xs text-mute">
                        {dateFormatted} · {apt.timeSlot}
                      </p>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      {statusBadge(apt.status)}
                      {paymentBadge(apt.paymentStatus)}
                      <span className="text-sm font-semibold text-ink ml-1">
                        ${apt.servicePrice.toFixed(2)}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Right Info Cards */}
        <div className="lg:col-span-2 flex flex-col gap-4">
          {/* How payment works */}
          <div className="bg-cream-soft rounded-2xl border border-cream-deep/60 p-5">
            <p className="text-[10px] font-bold tracking-[0.2em] uppercase text-forest mb-3">
              Good to know
            </p>
            <h3 className="font-display text-lg text-ink font-medium mb-3">
              How payment works
            </h3>
            <ol className="space-y-2.5">
              <li className="flex gap-3 text-sm text-mute">
                <span className="w-6 h-6 rounded-full bg-white border border-cream-deep text-ink text-xs font-semibold flex items-center justify-center shrink-0">
                  1
                </span>
                Request an appointment and wait for the salon to confirm.
              </li>
              <li className="flex gap-3 text-sm text-mute">
                <span className="w-6 h-6 rounded-full bg-white border border-cream-deep text-ink text-xs font-semibold flex items-center justify-center shrink-0">
                  2
                </span>
                Once confirmed, a Pay now button appears beside the appointment.
              </li>
              <li className="flex gap-3 text-sm text-mute">
                <span className="w-6 h-6 rounded-full bg-white border border-cream-deep text-ink text-xs font-semibold flex items-center justify-center shrink-0">
                  3
                </span>
                Checkout is handled securely by Stripe.
              </li>
            </ol>
            <Link
              href="/dashboard/customer/appointments"
              className="mt-4 inline-flex items-center gap-1 w-full justify-center py-2.5 rounded-xl border border-cream-deep text-sm font-medium text-ink hover:bg-white transition-colors"
            >
              Go to my appointments
            </Link>
          </div>

          {/* Looking for inspiration */}
          <div className="bg-forest/5 rounded-2xl border border-forest/10 p-5">
            <div className="w-9 h-9 rounded-full bg-forest/10 flex items-center justify-center mb-3">
              <Sparkles className="w-4 h-4 text-forest" />
            </div>
            <h3 className="font-display text-lg text-ink font-medium mb-1">
              Looking for inspiration?
            </h3>
            <p className="text-sm text-mute leading-relaxed mb-3">
              Explore seasonal colour, skin rituals and quiet spa treatments on
              the full menu.
            </p>
            <Link
              href="/dashboard/customer/service"
              className="inline-flex items-center gap-1 text-sm font-semibold text-forest hover:text-forest-deep transition-colors"
            >
              Browse services <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
