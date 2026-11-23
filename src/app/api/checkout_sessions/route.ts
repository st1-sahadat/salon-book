import { NextRequest, NextResponse } from "next/server";
import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import { connectToDatabase } from "@/lib/db";
import { stripe } from "@/lib/stripe";
import { ObjectId } from "mongodb";

export async function POST(req: NextRequest) {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session?.user) {
      return NextResponse.json(
        { error: "Authentication required to checkout." },
        { status: 401 }
      );
    }

    const headersList = await headers();
    const origin =
      headersList.get("origin") ||
      process.env.BETTER_AUTH_URL ||
      "http://localhost:3000";

    // Support both JSON body and FormData / URL query
    let appointmentId: string | null = null;
    const contentType = req.headers.get("content-type") || "";

    if (contentType.includes("application/json")) {
      const body = await req.json().catch(() => ({}));
      appointmentId = body.appointmentId;
    } else if (
      contentType.includes("application/x-www-form-urlencoded") ||
      contentType.includes("multipart/form-data")
    ) {
      const formData = await req.formData().catch(() => null);
      appointmentId = (formData?.get("appointmentId") as string) || null;
    }

    if (!appointmentId) {
      const url = new URL(req.url);
      appointmentId = url.searchParams.get("appointmentId");
    }

    if (!appointmentId || !ObjectId.isValid(appointmentId)) {
      return NextResponse.json(
        { error: "A valid appointment ID is required for checkout." },
        { status: 400 }
      );
    }

    const { db } = await connectToDatabase();
    const appointment = await db
      .collection("appointments")
      .findOne({ _id: new ObjectId(appointmentId) });

    if (!appointment) {
      return NextResponse.json(
        { error: "Appointment not found." },
        { status: 404 }
      );
    }

    // Security check: Must belong to the authenticated customer
    if (appointment.customerEmail !== session.user.email) {
      return NextResponse.json(
        { error: "You can only pay for your own appointments." },
        { status: 403 }
      );
    }

    // Status check: Must be Confirmed by Admin
    const appointmentStatus = String(appointment.status || "").toLowerCase();
    if (appointmentStatus === "cancelled") {
      return NextResponse.json(
        { error: "Cannot pay for a cancelled appointment." },
        { status: 400 }
      );
    }
    if (appointmentStatus === "pending") {
      return NextResponse.json(
        {
          error:
            "This appointment is currently pending admin review. Payment can only be made after admin confirmation.",
        },
        { status: 400 }
      );
    }
    if (appointmentStatus !== "confirmed") {
      return NextResponse.json(
        { error: "Only confirmed appointments can be paid." },
        { status: 400 }
      );
    }

    // Payment check: Cannot pay twice
    if (String(appointment.paymentStatus || "").toLowerCase() === "paid") {
      return NextResponse.json(
        { error: "This appointment has already been paid." },
        { status: 400 }
      );
    }

    const price = Number(appointment.servicePrice) || 0;
    if (price <= 0) {
      return NextResponse.json(
        { error: "Invalid appointment service price." },
        { status: 400 }
      );
    }

    const unitAmount = Math.round(price * 100);

    const checkoutSession = await stripe.checkout.sessions.create({
      line_items: [
        {
          price_data: {
            currency: "usd",
            product_data: {
              name: appointment.serviceName || "Salon Service",
              description: `${appointment.serviceCategory || "Salon"} appointment on ${
                appointment.appointmentDate || "Scheduled Date"
              } at ${appointment.timeSlot || "Scheduled Time"}`,
              ...(appointment.serviceImage &&
              appointment.serviceImage.startsWith("http")
                ? { images: [appointment.serviceImage] }
                : {}),
            },
            unit_amount: unitAmount,
          },
          quantity: 1,
        },
      ],
      mode: "payment",
      customer_email: session.user.email,
      client_reference_id: appointment._id.toString(),
      metadata: {
        appointmentId: appointment._id.toString(),
        customerEmail: session.user.email,
        customerName:
          appointment.customerName || session.user.name || "Customer",
        serviceName: appointment.serviceName || "Salon Service",
        serviceCategory: appointment.serviceCategory || "General",
        servicePrice: String(price),
        appointmentDate: appointment.appointmentDate || "",
        timeSlot: appointment.timeSlot || "",
      },
      success_url: `${origin}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}/checkout/cancel?appointmentId=${appointment._id.toString()}`,
    });

    if (contentType.includes("application/json")) {
      return NextResponse.json({ url: checkoutSession.url });
    }

    return NextResponse.redirect(checkoutSession.url as string, 303);
  } catch (err: unknown) {
    console.error("Error creating Stripe checkout session:", err);
    const error = err instanceof Error ? err : new Error(String(err));
    return NextResponse.json(
      { error: error.message || "Failed to create checkout session." },
      { status: 500 }
    );
  }
}
