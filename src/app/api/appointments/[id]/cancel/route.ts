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

    // Rule: Customers can only view/modify their own appointments
    if (appointment.customerEmail !== session.user.email) {
      return NextResponse.json(
        { error: "You can only cancel your own appointments." },
        { status: 403 }
      );
    }

    // Rule: Customers cannot cancel an already confirmed or cancelled appointment
    const status = String(appointment.status).toLowerCase();
    if (status === "confirmed" || status === "cancelled") {
      return NextResponse.json(
        {
          error: `Cannot cancel an appointment that is already ${appointment.status}.`,
        },
        { status: 400 }
      );
    }

    await db.collection("appointments").updateOne(
      { _id: new ObjectId(id) },
      {
        $set: {
          status: "Cancelled",
          cancelledAt: new Date().toISOString(),
        },
      }
    );

    return NextResponse.json({
      success: true,
      message: "Appointment cancelled successfully.",
    });
  } catch (error: unknown) {
    console.error("Error cancelling appointment:", error);
    const message = error instanceof Error
      ? error.message
      : "Failed to cancel appointment.";
    return NextResponse.json(
      { error: message },
      { status: 500 }
    );
  }
}
