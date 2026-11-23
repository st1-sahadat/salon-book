import { NextRequest, NextResponse } from "next/server";
import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import { connectToDatabase } from "@/lib/db";
import { ObjectId } from "mongodb";

// PATCH /api/admin/appointments/[id]/cancel - Cancel Pending or Confirmed Appointments
export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session?.user || session.user.role !== "admin") {
      return NextResponse.json(
        { error: "Access denied. Only administrators can cancel appointments." },
        { status: 403 }
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

    // Rule: Cancel Pending or Confirmed Appointments
    const currentStatus = String(appointment.status || "").toLowerCase();
    if (currentStatus !== "pending" && currentStatus !== "confirmed") {
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
          cancelledBy: session.user.email,
        },
      }
    );

    return NextResponse.json({
      success: true,
      message: "Appointment cancelled successfully.",
    });
  } catch (error: unknown) {
    console.error("Error cancelling appointment:", error);
    const msg = error instanceof Error ? error.message : "Failed to cancel appointment.";
    return NextResponse.json(
      { error: msg },
      { status: 500 }
    );
  }
}
