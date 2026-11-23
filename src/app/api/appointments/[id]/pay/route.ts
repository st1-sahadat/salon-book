import { NextRequest, NextResponse } from "next/server";
import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import { connectToDatabase } from "@/lib/db";
import { ObjectId } from "mongodb";

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session?.user) {
      return NextResponse.json(
        { error: "Authentication required." },
        { status: 401 }
      );
    }

    const { id } = await params;

    if (!ObjectId.isValid(id)) {
      return NextResponse.json(
        { error: "Invalid appointment ID." },
        { status: 400 }
      );
    }

    const { db } = await connectToDatabase();

    const appointment = await db
      .collection("appointments")
      .findOne({ _id: new ObjectId(id) });

    if (!appointment) {
      return NextResponse.json(
        { error: "Appointment not found." },
        { status: 404 }
      );
    }

    // Rule: Customers can only pay for their own appointments
    if (appointment.customerEmail !== session.user.email) {
      return NextResponse.json(
        { error: "You can only pay for your own appointments." },
        { status: 403 }
      );
    }

    // Rule: Customers cannot pay for cancelled or pending appointments
    const status = String(appointment.status).toLowerCase();
    if (status === "cancelled") {
      return NextResponse.json(
        { error: "Cannot pay for a cancelled appointment." },
        { status: 400 }
      );
    }

    if (status === "pending") {
      return NextResponse.json(
        { error: "Cannot pay for a pending appointment. Wait for confirmation." },
        { status: 400 }
      );
    }

    // Only confirmed appointments can be paid
    if (status !== "confirmed") {
      return NextResponse.json(
        { error: "Only confirmed appointments can be paid." },
        { status: 400 }
      );
    }

    // Check if already paid
    if (
      appointment.paymentStatus &&
      String(appointment.paymentStatus).toLowerCase() === "paid"
    ) {
      return NextResponse.json(
        { error: "This appointment has already been paid." },
        { status: 400 }
      );
    }

    await db.collection("appointments").updateOne(
      { _id: new ObjectId(id) },
      {
        $set: {
          paymentStatus: "Paid",
          paidAt: new Date().toISOString(),
        },
      }
    );

    return NextResponse.json({
      success: true,
      message: "Payment recorded successfully.",
    });
  } catch (error: unknown) {
    console.error("Error processing payment:", error);
    const message =
      error instanceof Error ? error.message : "Failed to process payment.";
    return NextResponse.json(
      { error: message },
      { status: 500 }
    );
  }
}
