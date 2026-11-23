import { notFound, redirect } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft,
  ArrowRight,
  Check,
  ShieldCheck,
  Calendar,
  Clock,
  Sparkles,
  Receipt,
  User,
  Scissors,
} from "lucide-react";
import { stripe } from "@/lib/stripe";
import { connectToDatabase } from "@/lib/db";
import { ObjectId } from "mongodb";

// Formatter for date display
const formatDate = (unixSeconds: number) =>
  new Date(unixSeconds * 1000).toLocaleDateString("en-US", {
    month: "short",
    day: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

export default async function CheckoutSuccessPage({
  searchParams,
}: {
  searchParams: Promise<{ session_id?: string }>;
}) {
  const { session_id } = await searchParams;

  if (!session_id) notFound();

  // Retrieve session from Stripe
  const session = await stripe.checkout.sessions.retrieve(session_id, {
    expand: ["line_items", "payment_intent"],
  });

  if (session.status === "open") {
    return redirect("/checkout");
  }

  if (session.status !== "complete" || session.payment_status !== "paid") {
    return redirect("/checkout/cancel");
  }

  // Connect to DB and update appointment + store in transactions collection
  const { db } = await connectToDatabase();

  const appointmentId =
    session.metadata?.appointmentId || session.client_reference_id;

  const paymentIntent =
    typeof session.payment_intent === "object" ? session.payment_intent : null;
  const transactionId =
    paymentIntent?.id ??
    (typeof session.payment_intent === "string"
      ? session.payment_intent
      : session.id);

  let appointment = null;

  if (appointmentId && ObjectId.isValid(appointmentId)) {
    // 1. Update appointment payment status to Paid
    await db.collection("appointments").updateOne(
      { _id: new ObjectId(appointmentId) },
      {
        $set: {
          paymentStatus: "Paid",
          paidAt: new Date().toISOString(),
          transactionId: transactionId,
          stripeSessionId: session.id,
        },
      }
    );

    appointment = await db
      .collection("appointments")
      .findOne({ _id: new ObjectId(appointmentId) });
  }

  // 2. Save transaction to 'transactions' collection (Image requirement)
  const existingTx = await db.collection("transactions").findOne({
    $or: [{ sessionId: session.id }, { transactionId: transactionId }],
  });

  if (!existingTx) {
    const transactionDoc = {
      transactionId: transactionId,
      sessionId: session.id,
      appointmentId:
        appointmentId && ObjectId.isValid(appointmentId)
          ? new ObjectId(appointmentId)
          : null,
      customerName:
        appointment?.customerName ||
        session.metadata?.customerName ||
        session.customer_details?.name ||
        "Customer",
      customerEmail:
        appointment?.customerEmail ||
        session.metadata?.customerEmail ||
        session.customer_details?.email ||
        session.customer_email ||
        "",
      serviceName:
        appointment?.serviceName ||
        session.metadata?.serviceName ||
        session.line_items?.data[0]?.description ||
        "Salon Service",
      serviceCategory:
        appointment?.serviceCategory ||
        session.metadata?.serviceCategory ||
        "General",
      servicePrice: appointment?.servicePrice
        ? Number(appointment.servicePrice)
        : session.metadata?.servicePrice
        ? Number(session.metadata.servicePrice)
        : (session.amount_total ?? 0) / 100,
      amountPaid: (session.amount_total ?? 0) / 100,
      currency: session.currency || "usd",
      paymentStatus: "Paid",
      paymentMethod: session.payment_method_types?.[0] || "card",
      appointmentDate:
        appointment?.appointmentDate ||
        session.metadata?.appointmentDate ||
        "",
      timeSlot: appointment?.timeSlot || session.metadata?.timeSlot || "",
      paidAt: new Date().toISOString(),
      createdAt: new Date().toISOString(),
    };

    await db.collection("transactions").insertOne(transactionDoc);
  }

  // Display details
  const amountFormatted = (
    (session.amount_total ?? 0) / 100
  ).toLocaleString("en-US", {
    style: "currency",
    currency: session.currency || "usd",
  });

  const lineItems = session.line_items?.data ?? [];
  const serviceName =
    appointment?.serviceName ||
    session.metadata?.serviceName ||
    lineItems[0]?.description ||
    "Salon Service";

  const customerEmail =
    session.customer_details?.email ||
    session.customer_email ||
    appointment?.customerEmail ||
    session.metadata?.customerEmail;

  const customerName =
    session.customer_details?.name ||
    appointment?.customerName ||
    session.metadata?.customerName ||
    "Valued Customer";

  return (
    <div className="min-h-screen bg-cream text-ink">
      {/* Header */}
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

          <div className="flex items-center gap-1.5 text-xs text-emerald-700 font-semibold bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span>Verified Paid</span>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-2xl px-4 sm:px-6 py-12">
        <div className="bg-white rounded-3xl border border-cream-deep/70 p-6 sm:p-10 shadow-xs text-center space-y-6">
          {/* Animated Success Badge */}
          <div className="mx-auto flex w-16 h-16 items-center justify-center rounded-full bg-emerald-100 text-emerald-700 ring-8 ring-emerald-50">
            <Check strokeWidth={3} className="w-8 h-8" />
          </div>

          <div>
            <span className="inline-flex items-center gap-1 text-[11px] font-bold tracking-widest text-emerald-700 uppercase bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
              Payment Confirmed
            </span>
            <h1 className="font-display text-3xl sm:text-4xl font-normal text-ink mt-3 tracking-tight">
              Thank You for Your Payment!
            </h1>
            <p className="text-sm text-mute mt-2 max-w-md mx-auto">
              Your appointment booking has been confirmed and paid in full. A
              transaction record has been stored in your account.
            </p>
          </div>

          {/* Receipt Details Card */}
          <div className="rounded-2xl border border-cream-deep/70 bg-cream/30 p-5 text-left space-y-4">
            <div className="flex items-center justify-between border-b border-cream-deep/40 pb-3">
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-forest">
                <Receipt className="w-4 h-4 text-brass" />
                <span>Payment Receipt</span>
              </div>
              <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
                Settled · Stripe
              </span>
            </div>

            <dl className="divide-y divide-cream-deep/30 text-xs sm:text-sm">
              <div className="flex items-center justify-between py-2.5 gap-2">
                <dt className="text-mute flex items-center gap-1.5">
                  <Scissors className="w-3.5 h-3.5 text-brass" />
                  Service
                </dt>
                <dd className="font-semibold text-ink text-right truncate">
                  {serviceName}
                </dd>
              </div>

              <div className="flex items-center justify-between py-2.5 gap-2">
                <dt className="text-mute flex items-center gap-1.5">
                  <User className="w-3.5 h-3.5 text-forest" />
                  Customer
                </dt>
                <dd className="font-medium text-ink text-right">
                  {customerName}
                </dd>
              </div>

              {(appointment?.appointmentDate || session.metadata?.appointmentDate) && (
                <div className="flex items-center justify-between py-2.5 gap-2">
                  <dt className="text-mute flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5 text-forest" />
                    Appointment Date
                  </dt>
                  <dd className="font-medium text-ink text-right">
                    {new Date(
                      appointment?.appointmentDate || session.metadata?.appointmentDate || ""
                    ).toLocaleDateString("en-US", {
                      weekday: "short",
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    })}
                  </dd>
                </div>
              )}

              {(appointment?.timeSlot || session.metadata?.timeSlot) && (
                <div className="flex items-center justify-between py-2.5 gap-2">
                  <dt className="text-mute flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5 text-forest" />
                    Time Slot
                  </dt>
                  <dd className="font-medium text-ink text-right">
                    {appointment?.timeSlot || session.metadata?.timeSlot}
                  </dd>
                </div>
              )}

              <div className="flex items-center justify-between py-2.5 gap-2">
                <dt className="text-mute">Amount Paid</dt>
                <dd className="font-display text-lg font-bold text-forest text-right">
                  {amountFormatted}
                </dd>
              </div>

              <div className="flex items-center justify-between py-2.5 gap-2">
                <dt className="text-mute">Payment Date</dt>
                <dd className="text-ink text-right">
                  {formatDate(session.created)}
                </dd>
              </div>

              {customerEmail && (
                <div className="flex items-center justify-between py-2.5 gap-2">
                  <dt className="text-mute">Receipt Sent To</dt>
                  <dd className="text-ink text-right truncate">
                    {customerEmail}
                  </dd>
                </div>
              )}

              <div className="flex items-center justify-between py-2.5 gap-2">
                <dt className="text-mute shrink-0">Transaction ID</dt>
                <dd className="text-right">
                  <code
                    title={transactionId}
                    className="rounded bg-cream-soft px-2 py-0.5 font-mono text-xs text-mute font-medium select-all"
                  >
                    {transactionId}
                  </code>
                </dd>
              </div>
            </dl>
          </div>

          {/* Helpful Salon Notice */}
          <div className="bg-cream-soft/50 rounded-2xl p-4 text-xs text-mute text-left flex items-start gap-2.5 border border-cream-deep/40">
            <Sparkles className="w-4 h-4 text-brass shrink-0 mt-0.5" />
            <p>
              Please arrive 10 minutes prior to your scheduled time. Show this
              confirmation or your booking ID in the customer dashboard upon
              arrival.
            </p>
          </div>

          {/* Navigation Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-3 pt-2">
            <Link
              href="/dashboard/customer/appointments"
              className="flex-1 h-12 rounded-xl bg-forest hover:bg-forest-deep text-cream font-medium text-sm transition-colors flex items-center justify-center gap-2 shadow-xs"
            >
              <span>View My Appointments</span>
              <ArrowRight className="w-4 h-4" />
            </Link>

            <Link
              href="/dashboard/customer/overview"
              className="h-12 px-6 rounded-xl bg-cream-soft hover:bg-cream-deep text-ink font-medium text-sm transition-colors flex items-center justify-center"
            >
              Dashboard Overview
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}
