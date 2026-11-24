import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { connectToDatabase } from "@/lib/db";
import AdminAppointmentsClient from "./AdminAppointmentsClient";

export const dynamic = 'force-dynamic';

export type TAdminAppointment = {
  _id: string;
  serviceId: string;
  serviceName: string;
  serviceImage: string;
  serviceCategory: string;
  servicePrice: number;
  duration: number;
  appointmentDate: string;
  timeSlot: string;
  notes: string;
  customerName: string;
  customerEmail: string;
  customerId: string;
  customerImage: string | null;
  status: string;
  paymentStatus: string;
  createdAt: string;
  confirmedAt?: string;
  cancelledAt?: string;
  paidAt?: string;
};

export default async function AdminAppointmentsPage() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user) {
    redirect("/sign-in");
  }

  if (session.user.role !== "admin") {
    redirect("/dashboard/customer/overview");
  }

  const { db } = await connectToDatabase();
  const rawAppointments = await db
    .collection("appointments")
    .find()
    .sort({ createdAt: -1 })
    .toArray();

  const appointments: TAdminAppointment[] = rawAppointments.map((a) => ({
    _id: a._id.toString(),
    serviceId: a.serviceId || "",
    serviceName: a.serviceName || "Salon Service",
    serviceImage: a.serviceImage || "",
    serviceCategory: a.serviceCategory || "General",
    servicePrice: Number(a.servicePrice) || 0,
    duration: a.duration || 60,
    appointmentDate: a.appointmentDate || "",
    timeSlot: a.timeSlot || "",
    notes: a.notes || "",
    customerName: a.customerName || "Customer",
    customerEmail: a.customerEmail || "",
    customerId: a.customerId || "",
    customerImage: a.customerImage || null,
    status: a.status || "Pending",
    paymentStatus: a.paymentStatus || "Unpaid",
    createdAt: a.createdAt || "",
    confirmedAt: a.confirmedAt || undefined,
    cancelledAt: a.cancelledAt || undefined,
    paidAt: a.paidAt || undefined,
  }));

  return <AdminAppointmentsClient initialAppointments={appointments} />;
}
