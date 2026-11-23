import { NextRequest, NextResponse } from "next/server";
import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import { connectToDatabase } from "@/lib/db";
import { ObjectId } from "mongodb";

// PATCH /api/admin/appointments/[id]/confirm - Confirm Pending Appointments
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
        { error: "Access denied. Only administrators can confirm appointments." },
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

    // Rule: Only pending appointments can be confirmed.
    const currentStatus = String(appointment.status || "").toLowerCase();
    if (currentStatus !== "pending") {
      return NextResponse.json(
        {
          error: `Only pending appointments can be confirmed. Current status: ${appointment.status}`,
        },
        { status: 400 }
      );
    }

    await db.collection("appointments").updateOne(
      { _id: new ObjectId(id) },
      {
        $set: {
          status: "Confirmed",
          confirmedAt: new Date().toISOString(),
          confirmedBy: session.user.email,
        },
      }
    );

    return NextResponse.json({
      success: true,
      message: "Appointment confirmed successfully!",
    });
  } catch (error: unknown) {
    console.error("Error confirming appointment:", error);
    const msg = error instanceof Error ? error.message : "Failed to confirm appointment.";
    return NextResponse.json(
      { error: msg },
      { status: 500 }
    );
  }
}
