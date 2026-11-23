import { NextRequest, NextResponse } from "next/server";
import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import { connectToDatabase } from "@/lib/db";

// GET /api/admin/services - View All Services
export async function GET() {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session?.user || session.user.role !== "admin") {
      return NextResponse.json(
        { error: "Access denied. Only administrators can view this resource." },
        { status: 403 }
      );
    }

    const { db } = await connectToDatabase();
    const services = await db
      .collection("services")
      .find()
      .sort({ createdAt: -1 })
      .toArray();

    return NextResponse.json({ success: true, services });
  } catch (error: unknown) {
    console.error("Error fetching services for admin:", error);
    const msg = error instanceof Error ? error.message : "Failed to fetch services.";
    return NextResponse.json(
      { error: msg },
      { status: 500 }
    );
  }
}

// POST /api/admin/services - Add New Service
export async function POST(req: NextRequest) {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    // Rule: Only Admin can create services
    if (!session?.user || session.user.role !== "admin") {
      return NextResponse.json(
        { error: "Access denied. Only administrators can create services." },
        { status: 403 }
      );
    }

    const body = await req.json();
    const {
      serviceName,
      category,
      description,
      price,
      duration,
      image,
      status = "Active",
    } = body;

    // Field validations
    if (!serviceName || !serviceName.trim()) {
      return NextResponse.json(
        { error: "Service name is required." },
        { status: 400 }
      );
    }

    if (!category || !category.trim()) {
      return NextResponse.json(
        { error: "Service category is required." },
        { status: 400 }
      );
    }

    if (!description || !description.trim()) {
      return NextResponse.json(
        { error: "Description is required." },
        { status: 400 }
      );
    }

    const numPrice = Number(price);
    // Rule: Price must be a positive number
    if (isNaN(numPrice) || numPrice <= 0) {
      return NextResponse.json(
        { error: "Price must be a positive number greater than 0." },
        { status: 400 }
      );
    }

    const numDuration = Number(duration);
    // Rule: Duration must be a positive number
    if (isNaN(numDuration) || numDuration <= 0) {
      return NextResponse.json(
        { error: "Estimated duration must be a positive number in minutes." },
        { status: 400 }
      );
    }

    if (!image || !image.trim()) {
      return NextResponse.json(
        { error: "Service image is required. Please upload an image." },
        { status: 400 }
      );
    }

    // Default status: Active
    const finalStatus =
      status && status.toLowerCase() === "inactive" ? "Inactive" : "Active";

    const { db } = await connectToDatabase();

    const serviceDoc = {
      serviceName: serviceName.trim(),
      category: category.trim(),
      description: description.trim(),
      price: numPrice,
      duration: numDuration,
      image: image.trim(),
      status: finalStatus,
      createdBy: session.user.email,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    const result = await db.collection("services").insertOne(serviceDoc);

    return NextResponse.json(
      {
        success: true,
        message: "Service created successfully!",
        service: { ...serviceDoc, _id: result.insertedId },
      },
      { status: 201 }
    );
  } catch (error: unknown) {
    console.error("Error creating service:", error);
    const msg = error instanceof Error ? error.message : "Failed to create service.";
    return NextResponse.json(
      { error: msg },
      { status: 500 }
    );
  }
}
