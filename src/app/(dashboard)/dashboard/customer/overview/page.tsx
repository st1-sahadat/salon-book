import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import { connectToDatabase } from "@/lib/db";
import CustomerOverviewClient from "./CustomerOverviewClient";

export type TAppointment = {
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
  cancelledAt?: string;
  paidAt?: string;
};

export default async function OverviewPage() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <p className="text-mute">Please sign in to view your dashboard.</p>
      </div>
    );
  }

  const { db } = await connectToDatabase();

  const rawAppointments = await db
    .collection("appointments")
    .find({ customerEmail: session.user.email })
    .sort({ createdAt: -1 })
    .toArray();

  const appointments: TAppointment[] = rawAppointments.map((a) => ({
    _id: a._id.toString(),
    serviceId: a.serviceId || "",
    serviceName: a.serviceName || "Service",
    serviceImage: a.serviceImage || "",
    serviceCategory: a.serviceCategory || "General",
    servicePrice: Number(a.servicePrice) || 0,
    duration: a.duration || 60,
    appointmentDate: a.appointmentDate || "",
    timeSlot: a.timeSlot || "",
    notes: a.notes || "",
    customerName: a.customerName || "",
    customerEmail: a.customerEmail || "",
    customerId: a.customerId || "",
    customerImage: a.customerImage || null,
    status: a.status || "Pending",
    paymentStatus: a.paymentStatus || "Unpaid",
    createdAt: a.createdAt || "",
    cancelledAt: a.cancelledAt || undefined,
    paidAt: a.paidAt || undefined,
  }));

  const user = {
    name: session.user.name || "Customer",
    email: session.user.email,
    image: session.user.image || null,
  };

  return <CustomerOverviewClient appointments={appointments} user={user} />;
}
