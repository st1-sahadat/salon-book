import { NextRequest, NextResponse } from "next/server";
import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import { connectToDatabase } from "@/lib/db";
import { ObjectId } from "mongodb";

export async function POST(req: NextRequest) {
  try {
    // 1. Session verification
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session?.user) {
      return NextResponse.json(
        { error: "Customers must be authenticated to submit appointment requests." },
        { status: 401 }
      );
    }

    const { db } = await connectToDatabase();

    // Check if user is blocked
    const currentUserDoc = await db.collection("user").findOne({ email: session.user.email });
    if (currentUserDoc?.isBlocked) {
      return NextResponse.json(
        { error: "Your account has been blocked. You cannot submit appointment requests." },
        { status: 403 }
      );
    }

    // 2. Admin restriction rule
    if (session.user.role === "admin") {
      return NextResponse.json(
        { error: "Admins cannot submit customer appointment requests." },
        { status: 403 }
      );
    }

    const body = await req.json();
    const {
      serviceId,
      serviceName,
      serviceImage,
      serviceCategory,
      price,
      duration,
      appointmentDate,
      timeSlot,
      notes,
      serviceStatus,
    } = body;

    // 3. Date & time slot validation
    if (!appointmentDate || !timeSlot) {
      return NextResponse.json(
        { error: "Appointment date and time slot are required." },
        { status: 400 }
      );
    }

    // 4. Verify service status from database or payload
    let targetService = null;
    if (serviceId && ObjectId.isValid(serviceId)) {
      targetService = await db.collection("services").findOne({ _id: new ObjectId(serviceId) });
    }

    const currentStatus = targetService?.status || serviceStatus;
    if (currentStatus && String(currentStatus).toLowerCase() !== "active") {
      return NextResponse.json(
        { error: "Only active services are available for appointment booking." },
        { status: 400 }
      );
    }

    // 5. Build appointment document
    const appointmentDoc = {
      serviceId: serviceId || "",
      serviceName: targetService?.serviceName || serviceName || "Salon Service",
      serviceImage: targetService?.image || serviceImage || "",
      serviceCategory: targetService?.category || serviceCategory || "General",
      servicePrice: Number(targetService?.price ?? price) || 0,
      duration: targetService?.duration || duration || 60,
      appointmentDate,
      timeSlot,
      notes: notes?.trim() || "",
      customerName: session.user.name || "Valued Client",
      customerEmail: session.user.email,
      customerId: session.user.id,
      customerImage: session.user.image || null,
      status: "Pending",
      paymentStatus: "Unpaid",
      createdAt: new Date().toISOString(),
    };

    const result = await db.collection("appointments").insertOne(appointmentDoc);

    return NextResponse.json(
      {
        success: true,
        message: "Appointment request submitted successfully!",
        appointmentId: result.insertedId,
        appointment: { ...appointmentDoc, _id: result.insertedId },
      },
      { status: 201 }
    );
  } catch (error: unknown) {
    console.error("Error creating appointment:", error);
    const message = error instanceof Error ? error.message : "Failed to submit appointment request.";
    return NextResponse.json(
      { error: message },
      { status: 500 }
    );
  }
}

export async function GET() {
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

    const { db } = await connectToDatabase();
    const isUserAdmin = session.user.role === "admin";

    if (!isUserAdmin) {
      const currentUserDoc = await db.collection("user").findOne({ email: session.user.email });
      if (currentUserDoc?.isBlocked) {
        return NextResponse.json(
          { error: "Your account has been blocked." },
          { status: 403 }
        );
      }
    }

    let appointments;
    if (isUserAdmin) {
      appointments = await db
        .collection("appointments")
        .find()
        .sort({ createdAt: -1 })
        .toArray();
    } else {
      appointments = await db
        .collection("appointments")
        .find({ customerEmail: session.user.email })
        .sort({ createdAt: -1 })
        .toArray();
    }

    return NextResponse.json({ success: true, appointments });
  } catch (error: unknown) {
    console.error("Error fetching appointments:", error);
    const message = error instanceof Error ? error.message : "Failed to fetch appointments.";
    return NextResponse.json(
      { error: message },
      { status: 500 }
    );
  }
}
