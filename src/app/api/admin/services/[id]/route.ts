import { NextRequest, NextResponse } from "next/server";
import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import { connectToDatabase } from "@/lib/db";
import { ObjectId } from "mongodb";

// PATCH /api/admin/services/[id] - Update Service Information
export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    // Rule: Only Admin can update services
    if (!session?.user || session.user.role !== "admin") {
      return NextResponse.json(
        { error: "Access denied. Only administrators can update services." },
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

    const body = await req.json();
    const updateFields: Record<string, string | number> = {
      updatedAt: new Date().toISOString(),
    };

    if (body.serviceName !== undefined) {
      if (!body.serviceName.trim()) {
        return NextResponse.json(
          { error: "Service name cannot be empty." },
          { status: 400 }
        );
      }
      updateFields.serviceName = body.serviceName.trim();
    }

    if (body.category !== undefined) {
      if (!body.category.trim()) {
        return NextResponse.json(
          { error: "Category cannot be empty." },
          { status: 400 }
        );
      }
      updateFields.category = body.category.trim();
    }

    if (body.description !== undefined) {
      if (!body.description.trim()) {
        return NextResponse.json(
          { error: "Description cannot be empty." },
          { status: 400 }
        );
      }
      updateFields.description = body.description.trim();
    }

    // Rule: Price must be a positive number
    if (body.price !== undefined) {
      const numPrice = Number(body.price);
      if (isNaN(numPrice) || numPrice <= 0) {
        return NextResponse.json(
          { error: "Price must be a positive number greater than 0." },
          { status: 400 }
        );
      }
      updateFields.price = numPrice;
    }

    // Rule: Duration must be a positive number
    if (body.duration !== undefined) {
      const numDuration = Number(body.duration);
      if (isNaN(numDuration) || numDuration <= 0) {
        return NextResponse.json(
          { error: "Duration must be a positive number in minutes." },
          { status: 400 }
        );
      }
      updateFields.duration = numDuration;
    }

    if (body.image !== undefined && body.image.trim()) {
      updateFields.image = body.image.trim();
    }

    if (body.status !== undefined) {
      updateFields.status =
        body.status.toLowerCase() === "inactive" ? "Inactive" : "Active";
    }

    const { db } = await connectToDatabase();
    const result = await db.collection("services").updateOne(
      { _id: new ObjectId(id) },
      { $set: updateFields }
    );

    if (result.matchedCount === 0) {
      return NextResponse.json(
        { error: "Service not found." },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Service updated successfully!",
    });
  } catch (error: unknown) {
    console.error("Error updating service:", error);
    const msg = error instanceof Error ? error.message : "Failed to update service.";
    return NextResponse.json(
      { error: msg },
      { status: 500 }
    );
  }
}

// DELETE /api/admin/services/[id] - Delete Service
export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    // Rule: Only Admin can delete services
    if (!session?.user || session.user.role !== "admin") {
      return NextResponse.json(
        { error: "Access denied. Only administrators can delete services." },
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
    const result = await db.collection("services").deleteOne({
      _id: new ObjectId(id),
    });

    if (result.deletedCount === 0) {
      return NextResponse.json(
        { error: "Service not found." },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Service deleted successfully!",
    });
  } catch (error: unknown) {
    console.error("Error deleting service:", error);
    const msg = error instanceof Error ? error.message : "Failed to delete service.";
    return NextResponse.json(
      { error: msg },
      { status: 500 }
    );
  }
}
