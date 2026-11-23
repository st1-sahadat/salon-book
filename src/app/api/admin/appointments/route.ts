import { NextResponse } from "next/server";
import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import { connectToDatabase } from "@/lib/db";

// GET /api/admin/appointments - View All Appointment Requests
export async function GET() {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session?.user || session.user.role !== "admin") {
      return NextResponse.json(
        { error: "Access denied. Only administrators can view appointments." },
        { status: 403 }
      );
    }

    const { db } = await connectToDatabase();
    const appointments = await db
      .collection("appointments")
      .find()
      .sort({ createdAt: -1 })
      .toArray();

    return NextResponse.json({ success: true, appointments });
  } catch (error: unknown) {
    console.error("Error fetching appointments for admin:", error);
    const msg = error instanceof Error ? error.message : "Failed to fetch appointments.";
    return NextResponse.json(
      { error: msg },
      { status: 500 }
    );
  }
}
