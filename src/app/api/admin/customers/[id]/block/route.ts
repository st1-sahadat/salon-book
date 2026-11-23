import { NextRequest, NextResponse } from "next/server";
import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import { connectToDatabase } from "@/lib/db";
import { ObjectId } from "mongodb";

// PATCH /api/admin/customers/[id]/block - Block or Unblock User
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
        { error: "Access denied. Only administrators can block or unblock users." },
        { status: 403 }
      );
    }

    const { id } = await params;
    if (!ObjectId.isValid(id)) {
      return NextResponse.json(
        { error: "Invalid user ID." },
        { status: 400 }
      );
    }

    const { db } = await connectToDatabase();
    const targetUser = await db
      .collection("user")
      .findOne({ _id: new ObjectId(id) });

    if (!targetUser) {
      return NextResponse.json(
        { error: "User not found." },
        { status: 404 }
      );
    }

    // Protection: Admin cannot block themselves
    if (targetUser.email === session.user.email) {
      return NextResponse.json(
        { error: "You cannot block your own admin account." },
        { status: 400 }
      );
    }

    // Protection: Admin cannot block another admin
    if (targetUser.role === "admin") {
      return NextResponse.json(
        { error: "Administrator accounts cannot be blocked." },
        { status: 400 }
      );
    }

    const newBlockedState = !targetUser.isBlocked;

    await db.collection("user").updateOne(
      { _id: new ObjectId(id) },
      {
        $set: {
          isBlocked: newBlockedState,
          blockedAt: newBlockedState ? new Date().toISOString() : null,
          unblockedAt: !newBlockedState ? new Date().toISOString() : null,
          actionBy: session.user.email,
        },
      }
    );

    return NextResponse.json({
      success: true,
      isBlocked: newBlockedState,
      message: newBlockedState
        ? `User ${targetUser.name || targetUser.email} has been blocked.`
        : `User ${targetUser.name || targetUser.email} has been unblocked.`,
    });
  } catch (error: unknown) {
    console.error("Error toggling user block status:", error);
    const msg = error instanceof Error ? error.message : "Failed to update user block status.";
    return NextResponse.json(
      { error: msg },
      { status: 500 }
    );
  }
}
