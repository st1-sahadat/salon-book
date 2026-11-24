import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import { connectToDatabase } from "@/lib/db";
import CustomerOverviewClient from "./CustomerOverviewClient";

export const dynamic = 'force-dynamic';

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

type RawAppointment = {
  _id: { toString(): string };
  serviceId?: string;
  serviceName?: string;
  serviceImage?: string;
  serviceCategory?: string;
  servicePrice?: number | string;
  duration?: number;
  appointmentDate?: string;
  timeSlot?: string;
  notes?: string;
  customerName?: string;
  customerEmail?: string;
  customerId?: string;
  customerImage?: string | null;
  status?: string;
  paymentStatus?: string;
  createdAt?: string;
  cancelledAt?: string;
  paidAt?: string;
};

export default async function OverviewPage() {
  let session = null;
  try {
    session = await auth.api.getSession({
      headers: await headers(),
    });
  } catch (err) {
    console.error("OverviewPage session error:", err);
  }

  if (!session?.user) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <p className="text-mute">Please sign in to view your dashboard.</p>
      </div>
    );
  }

  let rawAppointments: RawAppointment[] = [];
  try {
    const { db } = await connectToDatabase();
    rawAppointments = await db
      .collection("appointments")
      .find({ customerEmail: session.user.email })
      .sort({ createdAt: -1 })
      .toArray();
  } catch (err) {
    console.error("OverviewPage database error:", err);
  }

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
