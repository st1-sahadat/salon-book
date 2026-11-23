import Link from "next/link";
import {
  ArrowLeft,
  XCircle,
  RotateCcw,
  Calendar,
  Clock,
  Scissors,
  HelpCircle,
  CalendarCheck,
} from "lucide-react";
import { connectToDatabase } from "@/lib/db";
import { ObjectId } from "mongodb";

export default async function CheckoutCancelPage({
  searchParams,
}: {
  searchParams: Promise<{ appointmentId?: string }>;
}) {
  const { appointmentId } = await searchParams;

  let appointment = null;
  if (appointmentId && ObjectId.isValid(appointmentId)) {
    try {
      const { db } = await connectToDatabase();
      appointment = await db
        .collection("appointments")
        .findOne({ _id: new ObjectId(appointmentId) });
    } catch {
      // Gracefully continue without appointment details if DB read fails
    }
  }

  return (
    <div className="min-h-screen bg-cream text-ink">
      {/* Top Header */}
      <header className="border-b border-cream-deep/60 bg-white/70 backdrop-blur-md">
        <div className="mx-auto flex h-20 w-full max-w-4xl items-center justify-between px-4 sm:px-6">
          <Link
            href="/dashboard/customer/appointments"
            className="flex items-center gap-2 text-mute hover:text-ink text-sm font-medium transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>My Appointments</span>
          </Link>

          <Link href="/" className="font-display text-2xl font-bold tracking-tight text-forest">
            Salon<span className="text-brass">Book</span>
          </Link>

          <div className="text-xs text-amber-700 font-semibold bg-amber-50 px-3 py-1 rounded-full border border-amber-200">
            Payment Cancelled
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-xl px-4 sm:px-6 py-12">
        <div className="bg-white rounded-3xl border border-cream-deep/70 p-6 sm:p-10 shadow-xs text-center space-y-6">
          {/* Cancelled Icon */}
          <div className="mx-auto flex w-16 h-16 items-center justify-center rounded-full bg-amber-100 text-amber-700 ring-8 ring-amber-50">
            <XCircle strokeWidth={2.5} className="w-8 h-8" />
          </div>

          <div>
            <span className="inline-flex items-center gap-1 text-[11px] font-bold tracking-widest text-amber-800 uppercase bg-amber-50 px-3 py-1 rounded-full border border-amber-200">
              Transaction Cancelled
            </span>
            <h1 className="font-display text-3xl sm:text-4xl font-normal text-ink mt-3 tracking-tight">
              Payment Was Not Completed
            </h1>
            <p className="text-sm text-mute mt-2 max-w-md mx-auto leading-relaxed">
              Your card has not been charged. If you cancelled intentionally or
              encountered an issue during checkout, you can retry whenever you
              are ready.
            </p>
          </div>

          {/* Appointment Status Note */}
          <div className="rounded-2xl border border-cream-deep/70 bg-cream/30 p-5 text-left space-y-3">
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-forest border-b border-cream-deep/40 pb-2.5">
              <CalendarCheck className="w-4 h-4 text-forest" />
              <span>Your Appointment Reservation</span>
            </div>

            <p className="text-xs text-mute leading-relaxed">
              Don&apos;t worry — your appointment reservation is still held in{" "}
              <strong className="text-ink">Confirmed</strong> status. You can
              complete payment at any time before your scheduled appointment
              date.
            </p>

            {appointment && (
              <div className="mt-3 bg-white rounded-xl p-3 border border-cream-deep/40 space-y-2 text-xs">
                <div className="flex items-center justify-between">
                  <span className="text-mute flex items-center gap-1">
                    <Scissors className="w-3.5 h-3.5 text-brass" />
                    Service:
                  </span>
                  <span className="font-semibold text-ink">
                    {appointment.serviceName}
                  </span>
                </div>
                {appointment.appointmentDate && (
                  <div className="flex items-center justify-between">
                    <span className="text-mute flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5 text-forest" />
                      Date:
                    </span>
                    <span className="font-medium text-ink">
                      {new Date(appointment.appointmentDate).toLocaleDateString(
                        "en-US",
                        {
                          weekday: "short",
                          month: "short",
                          day: "numeric",
                          year: "numeric",
                        }
                      )}
                    </span>
                  </div>
                )}
                {appointment.timeSlot && (
                  <div className="flex items-center justify-between">
                    <span className="text-mute flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5 text-forest" />
                      Time Slot:
                    </span>
                    <span className="font-medium text-ink">
                      {appointment.timeSlot}
                    </span>
                  </div>
                )}
                <div className="flex items-center justify-between pt-1 border-t border-cream-deep/30">
                  <span className="text-mute">Amount:</span>
                  <span className="font-bold text-forest text-sm">
                    ${Number(appointment.servicePrice || 0).toFixed(2)} USD
                  </span>
                </div>
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-3 pt-2">
            {appointmentId ? (
              <Link
                href={`/checkout?appointmentId=${appointmentId}`}
                className="flex-1 h-12 rounded-xl bg-forest hover:bg-forest-deep text-cream font-medium text-sm transition-colors flex items-center justify-center gap-2 shadow-xs"
              >
                <RotateCcw className="w-4 h-4" />
                <span>Try Payment Again</span>
              </Link>
            ) : (
              <Link
                href="/checkout"
                className="flex-1 h-12 rounded-xl bg-forest hover:bg-forest-deep text-cream font-medium text-sm transition-colors flex items-center justify-center gap-2 shadow-xs"
              >
                <RotateCcw className="w-4 h-4" />
                <span>Return to Checkout</span>
              </Link>
            )}

            <Link
              href="/dashboard/customer/appointments"
              className="h-12 px-5 rounded-xl bg-cream-soft hover:bg-cream-deep text-ink font-medium text-sm transition-colors flex items-center justify-center"
            >
              My Appointments
            </Link>
          </div>

          {/* Help link */}
          <div className="flex items-center justify-center gap-1.5 text-xs text-mute pt-1">
            <HelpCircle className="w-3.5 h-3.5 text-brass" />
            <span>Need assistance? Contact our salon desk or try another card.</span>
          </div>
        </div>
      </main>
    </div>
  );
}
