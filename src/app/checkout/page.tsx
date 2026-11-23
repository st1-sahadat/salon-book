import { headers } from "next/headers";
import { redirect } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import {
  ArrowLeft,
  CreditCard,
  ShieldCheck,
  Calendar,
  Clock,
  Sparkles,
  Scissors,
  User,
  AlertCircle,
  CheckCircle2,
} from "lucide-react";
import { auth } from "@/lib/auth";
import { connectToDatabase } from "@/lib/db";
import { ObjectId } from "mongodb";
import { CheckoutAction } from "./_components/CheckoutAction";

export default async function CheckoutPage({
  searchParams,
}: {
  searchParams: Promise<{ appointmentId?: string; canceled?: string }>;
}) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user) {
    redirect("/sign-in");
  }

  const { appointmentId, canceled } = await searchParams;

  const { db } = await connectToDatabase();

  let appointment = null;

  if (appointmentId && ObjectId.isValid(appointmentId)) {
    appointment = await db
      .collection("appointments")
      .findOne({ _id: new ObjectId(appointmentId) });
  }

  // If no appointmentId was provided or not found, fall back to the customer's most recent confirmed unpaid appointment
  if (!appointment) {
    appointment = await db
      .collection("appointments")
      .findOne(
        {
          customerEmail: session.user.email,
          status: { $regex: /^confirmed$/i },
          paymentStatus: { $ne: "Paid" },
        },
        { sort: { createdAt: -1 } }
      );
  }

  return (
    <div className="min-h-screen bg-cream text-ink">
      {/* Top Header */}
      <header className="border-b border-cream-deep/60 bg-white/70 backdrop-blur-md sticky top-0 z-20">
        <div className="mx-auto flex h-20 w-full max-w-5xl items-center justify-between px-4 sm:px-6">
          <div className="flex items-center gap-4">
            <Link
              href="/dashboard/customer/appointments"
              aria-label="Back to My Appointments"
              className="flex items-center gap-2 text-mute hover:text-ink text-sm font-medium transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              <span className="hidden sm:inline">Back to Appointments</span>
            </Link>
          </div>

          <Link href="/" className="flex items-center gap-2">
            <span className="font-display text-2xl font-bold tracking-tight text-forest">
              Salon<span className="text-brass">Book</span>
            </span>
          </Link>

          <div className="flex items-center gap-1.5 text-xs text-mute font-medium">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span className="hidden sm:inline">Secure Checkout</span>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-5xl px-4 sm:px-6 py-10">
        {/* Cancelled Banner if user cancelled earlier */}
        {canceled && (
          <div className="mb-8 rounded-2xl border border-amber-200 bg-amber-50/80 p-4 sm:p-5 flex items-start gap-3 shadow-xs">
            <AlertCircle className="w-5 h-5 text-amber-700 shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-semibold text-amber-900">
                Payment was not completed
              </p>
              <p className="text-xs text-amber-700 mt-0.5">
                Your appointment reservation is still confirmed. You can complete
                your checkout below at your convenience.
              </p>
            </div>
          </div>
        )}

        {!appointment ? (
          /* Empty State: No appointment found */
          <div className="mx-auto max-w-md text-center py-16 bg-white rounded-3xl border border-cream-deep/70 p-8 shadow-xs">
            <div className="w-14 h-14 rounded-full bg-cream-soft mx-auto flex items-center justify-center mb-4">
              <Calendar className="w-6 h-6 text-mute" />
            </div>
            <h2 className="font-display text-2xl font-normal text-ink">
              No Pending Checkout Found
            </h2>
            <p className="text-sm text-mute mt-2 leading-relaxed">
              We couldn&apos;t find an unpaid confirmed appointment for your
              account. Appointments must be confirmed by our admin before you
              can make a payment.
            </p>
            <div className="mt-6 flex flex-col sm:flex-row gap-3 justify-center">
              <Link
                href="/dashboard/customer/appointments"
                className="inline-flex items-center justify-center px-5 py-2.5 rounded-xl bg-forest text-cream font-medium text-sm hover:bg-forest-deep transition-colors"
              >
                Go to My Appointments
              </Link>
              <Link
                href="/dashboard/customer/overview"
                className="inline-flex items-center justify-center px-5 py-2.5 rounded-xl bg-cream-soft text-ink font-medium text-sm hover:bg-cream-deep transition-colors"
              >
                Customer Dashboard
              </Link>
            </div>
          </div>
        ) : appointment.customerEmail !== session.user.email ? (
          /* Security Check: Appointment belongs to another user */
          <div className="mx-auto max-w-md text-center py-16 bg-white rounded-3xl border border-rose-200 p-8 shadow-xs">
            <AlertCircle className="w-12 h-12 text-rose-500 mx-auto mb-4" />
            <h2 className="text-xl font-bold text-rose-900">Access Denied</h2>
            <p className="text-sm text-rose-700 mt-2">
              You do not have authorization to checkout this appointment.
            </p>
            <Link
              href="/dashboard/customer/appointments"
              className="mt-6 inline-flex items-center justify-center px-5 py-2.5 rounded-xl bg-forest text-cream font-medium text-sm hover:bg-forest-deep transition-colors"
            >
              Return to My Appointments
            </Link>
          </div>
        ) : String(appointment.paymentStatus || "").toLowerCase() === "paid" ? (
          /* Already Paid state */
          <div className="mx-auto max-w-md text-center py-16 bg-white rounded-3xl border border-emerald-200 p-8 shadow-xs">
            <div className="w-14 h-14 rounded-full bg-emerald-50 text-emerald-600 mx-auto flex items-center justify-center mb-4">
              <CheckCircle2 className="w-7 h-7" />
            </div>
            <h2 className="font-display text-2xl font-normal text-ink">
              Appointment Already Paid
            </h2>
            <p className="text-sm text-mute mt-2">
              This booking for{" "}
              <strong className="text-ink">{appointment.serviceName}</strong> has
              already been paid in full.
            </p>
            <Link
              href="/dashboard/customer/appointments"
              className="mt-6 inline-flex items-center justify-center px-5 py-2.5 rounded-xl bg-forest text-cream font-medium text-sm hover:bg-forest-deep transition-colors"
            >
              View in My Appointments
            </Link>
          </div>
        ) : String(appointment.status || "").toLowerCase() === "pending" ? (
          /* Pending Admin Review */
          <div className="mx-auto max-w-md text-center py-16 bg-white rounded-3xl border border-amber-200 p-8 shadow-xs">
            <div className="w-14 h-14 rounded-full bg-amber-50 text-amber-700 mx-auto flex items-center justify-center mb-4">
              <Clock className="w-7 h-7" />
            </div>
            <h2 className="font-display text-2xl font-normal text-ink">
              Appointment Pending Review
            </h2>
            <p className="text-sm text-mute mt-2 leading-relaxed">
              Your appointment request for{" "}
              <strong className="text-ink">{appointment.serviceName}</strong> is
              currently being reviewed by our salon team. Once confirmed, the
              &quot;Pay Now&quot; button will become available!
            </p>
            <Link
              href="/dashboard/customer/appointments"
              className="mt-6 inline-flex items-center justify-center px-5 py-2.5 rounded-xl bg-forest text-cream font-medium text-sm hover:bg-forest-deep transition-colors"
            >
              Back to Appointments
            </Link>
          </div>
        ) : (
          /* Active Checkout View */
          <div>
            <div className="mb-8">
              <p className="text-xs font-bold uppercase tracking-wider text-brass">
                Checkout & Confirmation
              </p>
              <h1 className="font-display text-3xl sm:text-4xl font-normal text-ink tracking-tight mt-1">
                Complete Your Booking Payment
              </h1>
              <p className="text-sm text-mute mt-1">
                Review your confirmed appointment details and proceed with safe
                card payment via Stripe.
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              {/* Left Column: Order Summary */}
              <div className="lg:col-span-7 space-y-6">
                <div className="bg-white rounded-3xl p-6 sm:p-8 border border-cream-deep/70 shadow-xs space-y-6">
                  <div className="flex items-center justify-between border-b border-cream-deep/40 pb-4">
                    <h2 className="text-sm font-bold uppercase tracking-wider text-mute">
                      Appointment Summary
                    </h2>
                    <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
                      <CheckCircle2 className="w-3 h-3" />
                      Confirmed by Salon
                    </span>
                  </div>

                  {/* Service Card */}
                  <div className="flex items-start gap-4">
                    <div className="relative w-20 h-20 rounded-2xl overflow-hidden shrink-0 bg-cream-soft border border-cream-deep/50">
                      {appointment.serviceImage ? (
                        <Image
                          src={appointment.serviceImage}
                          alt={appointment.serviceName || "Service"}
                          fill
                          className="object-cover"
                          sizes="80px"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-brass">
                          <Scissors className="w-8 h-8" />
                        </div>
                      )}
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="text-[11px] font-semibold text-forest uppercase tracking-wider bg-forest/5 px-2 py-0.5 rounded-md">
                          {appointment.serviceCategory || "Salon Service"}
                        </span>
                        {appointment.duration && (
                          <span className="text-xs text-mute flex items-center gap-1">
                            <Clock className="w-3 h-3 text-brass" />
                            {appointment.duration} min
                          </span>
                        )}
                      </div>
                      <h3 className="font-display text-xl font-semibold text-ink mt-1 truncate">
                        {appointment.serviceName}
                      </h3>
                      <p className="text-xs text-mute mt-0.5">
                        Professional beauty & salon care
                      </p>
                    </div>
                  </div>

                  {/* Scheduled Details */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                    <div className="bg-cream-soft/60 rounded-2xl p-4 border border-cream-deep/40">
                      <div className="flex items-center gap-2 text-mute text-xs font-bold uppercase tracking-wider mb-1">
                        <Calendar className="w-3.5 h-3.5 text-forest" />
                        <span>Date</span>
                      </div>
                      <p className="text-sm font-semibold text-ink">
                        {appointment.appointmentDate
                          ? new Date(
                              appointment.appointmentDate
                            ).toLocaleDateString("en-US", {
                              weekday: "short",
                              month: "short",
                              day: "numeric",
                              year: "numeric",
                            })
                          : "Scheduled Date"}
                      </p>
                    </div>

                    <div className="bg-cream-soft/60 rounded-2xl p-4 border border-cream-deep/40">
                      <div className="flex items-center gap-2 text-mute text-xs font-bold uppercase tracking-wider mb-1">
                        <Clock className="w-3.5 h-3.5 text-forest" />
                        <span>Time Slot</span>
                      </div>
                      <p className="text-sm font-semibold text-ink">
                        {appointment.timeSlot || "Standard Session"}
                      </p>
                    </div>
                  </div>

                  {/* Customer Information */}
                  <div className="bg-cream/40 rounded-2xl p-4 border border-cream-deep/30 flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full bg-cream-deep/80 flex items-center justify-center text-forest shrink-0">
                      <User className="w-4 h-4" />
                    </div>
                    <div className="text-xs truncate">
                      <p className="font-semibold text-ink">
                        {appointment.customerName || session.user.name}
                      </p>
                      <p className="text-mute truncate">
                        {session.user.email}
                      </p>
                    </div>
                  </div>

                  {/* Price Breakdown */}
                  <div className="border-t border-cream-deep/40 pt-4 space-y-2.5">
                    <div className="flex justify-between text-sm text-mute">
                      <span>Service Price</span>
                      <span className="font-medium text-ink">
                        ${Number(appointment.servicePrice || 0).toFixed(2)}
                      </span>
                    </div>
                    <div className="flex justify-between text-sm text-mute">
                      <span>Booking / Platform Fee</span>
                      <span className="text-emerald-700 font-medium">
                        $0.00 (Free)
                      </span>
                    </div>
                    <div className="border-t border-cream-deep/40 pt-3 flex items-center justify-between text-base font-semibold text-ink">
                      <span>Total Amount</span>
                      <span className="font-display text-2xl text-forest">
                        ${Number(appointment.servicePrice || 0).toFixed(2)} USD
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Column: Payment Method & Action */}
              <div className="lg:col-span-5 space-y-6">
                <div className="bg-white rounded-3xl p-6 sm:p-8 border border-cream-deep/70 shadow-xs space-y-6">
                  <div>
                    <h2 className="text-sm font-bold uppercase tracking-wider text-mute">
                      Payment Method
                    </h2>
                    <p className="text-xs text-mute mt-1">
                      Safe and direct payment handled by Stripe Checkout
                    </p>
                  </div>

                  {/* Payment Card Container */}
                  <div className="rounded-2xl border border-cream-deep/80 bg-cream/30 p-4 space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-lg bg-forest text-cream flex items-center justify-center">
                          <CreditCard className="w-4 h-4" />
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-ink">
                            Credit / Debit Card
                          </p>
                          <p className="text-[11px] text-mute">
                            Visa, Mastercard, Amex, Discover
                          </p>
                        </div>
                      </div>
                      <span className="text-[11px] font-bold uppercase tracking-wider bg-brass/15 text-brass-ink px-2 py-0.5 rounded-full">
                        Hosted
                      </span>
                    </div>

                    <div className="text-xs text-mute leading-relaxed pt-1 border-t border-cream-deep/40">
                      You will be securely redirected to Stripe&apos;s checkout
                      gateway. Your card details are processed directly by
                      Stripe and never stored on SalonBook servers.
                    </div>
                  </div>

                  {/* Checkout Action Component */}
                  <CheckoutAction
                    appointmentId={appointment._id.toString()}
                    amount={`$${Number(appointment.servicePrice || 0).toFixed(
                      2
                    )}`}
                  />

                  {/* Trust Highlights */}
                  <div className="border-t border-cream-deep/40 pt-5 space-y-2 text-xs text-mute">
                    <div className="flex items-center gap-2">
                      <Sparkles className="w-3.5 h-3.5 text-brass shrink-0" />
                      <span>Instant confirmation receipt upon payment</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                      <span>Official PCI DSS Level 1 Certified security</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
