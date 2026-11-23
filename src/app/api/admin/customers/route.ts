import { NextResponse } from "next/server";
import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import { connectToDatabase } from "@/lib/db";

// GET /api/admin/customers - View All Registered Customers
export async function GET() {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session?.user || session.user.role !== "admin") {
      return NextResponse.json(
        { error: "Access denied. Only administrators can view customer data." },
        { status: 403 }
      );
    }

    const { db } = await connectToDatabase();
    
    // Fetch all users
    const users = await db
      .collection("user")
      .find()
      .sort({ createdAt: -1 })
      .toArray();

    // Fetch appointment stats per customer email
    const appointments = await db
      .collection("appointments")
      .find()
      .toArray();

    const customersWithStats = users.map((u) => {
      const userAppointments = appointments.filter(
        (a) => a.customerEmail === u.email
      );
      const totalAppointments = userAppointments.length;
      const confirmedAppointments = userAppointments.filter(
        (a) => String(a.status).toLowerCase() === "confirmed"
      ).length;
      const pendingAppointments = userAppointments.filter(
        (a) => String(a.status).toLowerCase() === "pending"
      ).length;
      const cancelledAppointments = userAppointments.filter(
        (a) => String(a.status).toLowerCase() === "cancelled"
      ).length;
      const totalSpent = userAppointments
        .filter((a) => String(a.paymentStatus).toLowerCase() === "paid")
        .reduce((sum, a) => sum + (Number(a.servicePrice) || 0), 0);

      return {
        _id: u._id.toString(),
        name: u.name || "Customer",
        email: u.email,
        image: u.image || null,
        role: u.role || "customer",
        isBlocked: !!u.isBlocked,
        createdAt: u.createdAt || null,
        stats: {
          totalAppointments,
          confirmedAppointments,
          pendingAppointments,
          cancelledAppointments,
          totalSpent,
        },
      };
    });

    return NextResponse.json({
      success: true,
      customers: customersWithStats,
    });
  } catch (error: unknown) {
    console.error("Error fetching customers:", error);
    const msg = error instanceof Error ? error.message : "Failed to fetch customers.";
    return NextResponse.json(
      { error: msg },
      { status: 500 }
    );
  }
}
