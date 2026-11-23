import { NextRequest, NextResponse } from "next/server";
import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import { connectToDatabase } from "@/lib/db";
import { ObjectId } from "mongodb";

// PATCH /api/admin/services/[id]/toggle-status - Activate or Deactivate Service
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
        { error: "Access denied. Only administrators can change service status." },
        { status: 403 }
      );
    }

    const { id } = await params;
    if (!ObjectId.isValid(id)) {
      return NextResponse.json(
        { error: "Invalid service ID." },
        { status: 400 }
      );
    }

    const { db } = await connectToDatabase();
    const service = await db.collection("services").findOne({
      _id: new ObjectId(id),
    });

    if (!service) {
      return NextResponse.json(
        { error: "Service not found." },
        { status: 404 }
      );
    }

    const currentStatus = service.status || "Active";
    const newStatus =
      currentStatus.toLowerCase() === "active" ? "Inactive" : "Active";

    await db.collection("services").updateOne(
      { _id: new ObjectId(id) },
      {
        $set: {
          status: newStatus,
          updatedAt: new Date().toISOString(),
        },
      }
    );

    return NextResponse.json({
      success: true,
      message: `Service is now ${newStatus}.`,
      status: newStatus,
    });
  } catch (error: unknown) {
    console.error("Error toggling service status:", error);
    const msg = error instanceof Error ? error.message : "Failed to toggle service status.";
    return NextResponse.json(
      { error: msg },
      { status: 500 }
    );
  }
}
