import { NextRequest, NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";
import { connectToDatabase } from "@/lib/db";
import { ObjectId } from "mongodb";
import Stripe from "stripe";

export async function POST(req: NextRequest) {
  const body = await req.text();
  const sig = req.headers.get("stripe-signature");
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

  let event: Stripe.Event;

  try {
    if (webhookSecret && sig) {
      event = stripe.webhooks.constructEvent(body, sig, webhookSecret);
    } else {
      // Parse event directly if webhook secret is not set in local environment
      event = JSON.parse(body) as Stripe.Event;
    }
  } catch (err: unknown) {
    const message =
      err instanceof Error ? err.message : "Webhook signature verification failed";
    console.error("Stripe webhook verification error:", message);
    return NextResponse.json({ error: message }, { status: 400 });
  }

  try {
    if (event.type === "checkout.session.completed") {
      const session = event.data.object as Stripe.Checkout.Session;

      const appointmentId =
        session.metadata?.appointmentId || session.client_reference_id;
      const transactionId =
        (typeof session.payment_intent === "string"
          ? session.payment_intent
          : session.payment_intent?.id) || session.id;

      const { db } = await connectToDatabase();

      let appointment = null;
      if (appointmentId && ObjectId.isValid(appointmentId)) {
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

      // Save transaction to 'transactions' collection
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
    }

    return NextResponse.json({ received: true });
  } catch (error: unknown) {
    console.error("Error processing Stripe webhook:", error);
    return NextResponse.json(
      { error: "Internal server error handling webhook" },
      { status: 500 }
    );
  }
}
