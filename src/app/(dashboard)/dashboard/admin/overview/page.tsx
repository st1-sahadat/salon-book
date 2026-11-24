import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { connectToDatabase } from "@/lib/db";
import AdminOverviewClient from "./AdminOverviewClient";

export const dynamic = 'force-dynamic';

export default async function AdminOverviewPage() {
  let session = null;
  try {
    session = await auth.api.getSession({
      headers: await headers(),
    });
  } catch (err) {
    console.error("AdminOverviewPage session error:", err);
  }

  if (!session?.user) {
    redirect("/sign-in");
  }

  if (session.user.role !== "admin") {
    redirect("/dashboard/customer/overview");
  }

  const { db } = await connectToDatabase();

  // 1. Total Registered Customers
  const totalCustomers = await db
    .collection("user")
    .countDocuments({ role: { $ne: "admin" } });

  // 2. Services
  const allServices = await db.collection("services").find().toArray();
  const totalActiveServices = allServices.filter(
    (s) => !s.status || s.status.toLowerCase() === "active"
  ).length;

  // 3. Appointments
  const allAppointments = await db
    .collection("appointments")
    .find()
    .sort({ createdAt: -1 })
    .toArray();

  const totalAppointmentRequests = allAppointments.length;
  const pendingAppointments = allAppointments.filter(
    (a) => String(a.status).toLowerCase() === "pending"
  ).length;
  const confirmedAppointments = allAppointments.filter(
    (a) => String(a.status).toLowerCase() === "confirmed"
  ).length;
  const totalSuccessfulPayments = allAppointments.filter(
    (a) => String(a.paymentStatus).toLowerCase() === "paid"
  ).length;

  // Recent 5 appointments for quick review
  const recentAppointments = allAppointments.slice(0, 5).map((a) => ({
    _id: a._id.toString(),
    customerName: a.customerName || "Customer",
    customerEmail: a.customerEmail || "",
    serviceName: a.serviceName || "Service",
    servicePrice: Number(a.servicePrice) || 0,
    appointmentDate: a.appointmentDate || "",
    timeSlot: a.timeSlot || "",
    status: a.status || "Pending",
    paymentStatus: a.paymentStatus || "Unpaid",
    createdAt: a.createdAt || "",
  }));

  const stats = {
    totalCustomers,
    totalActiveServices,
    totalAppointmentRequests,
    pendingAppointments,
    confirmedAppointments,
    totalSuccessfulPayments,
  };

  const user = {
    name: session.user.name || "Admin",
    email: session.user.email,
  };

  return (
    <AdminOverviewClient
      stats={stats}
      recentAppointments={recentAppointments}
      user={user}
    />
  );
}
