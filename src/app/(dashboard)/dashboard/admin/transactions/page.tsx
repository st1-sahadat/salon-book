import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { connectToDatabase } from "@/lib/db";
import AdminTransactionsClient from "./AdminTransactionsClient";

export const dynamic = 'force-dynamic';

export type TTransaction = {
  _id: string;
  customerName: string;
  customerEmail: string;
  serviceName: string;
  servicePrice: number;
  paymentStatus: string;
  status: string;
  paidAt?: string;
  createdAt: string;
};

export default async function TransactionPage() {
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

  // 1. Fetch transactions recorded in 'transactions' collection (Image requirement)
  const rawTransactions = await db
    .collection("transactions")
    .find()
    .sort({ paidAt: -1, createdAt: -1 })
    .toArray();

  // 2. Fetch appointments to show pending/unpaid receivables in the admin view
  const rawAppointments = await db
    .collection("appointments")
    .find()
    .sort({ createdAt: -1 })
    .toArray();

  const recordedAppointmentIds = new Set<string>();
  const transactions: TTransaction[] = [];

  for (const t of rawTransactions) {
    if (t.appointmentId) {
      recordedAppointmentIds.add(t.appointmentId.toString());
    }
    transactions.push({
      _id: t._id.toString(),
      customerName: t.customerName || "Customer",
      customerEmail: t.customerEmail || "",
      serviceName: t.serviceName || "Service",
      servicePrice: Number(t.amountPaid ?? t.servicePrice) || 0,
      paymentStatus: "Paid",
      status: "Confirmed",
      paidAt: t.paidAt || t.createdAt,
      createdAt: t.createdAt || "",
    });
  }

  // Include unrecorded or pending appointments
  for (const a of rawAppointments) {
    const aId = a._id.toString();
    if (!recordedAppointmentIds.has(aId)) {
      transactions.push({
        _id: aId,
        customerName: a.customerName || "Customer",
        customerEmail: a.customerEmail || "",
        serviceName: a.serviceName || "Service",
        servicePrice: Number(a.servicePrice) || 0,
        paymentStatus: a.paymentStatus || "Unpaid",
        status: a.status || "Pending",
        paidAt: a.paidAt || undefined,
        createdAt: a.createdAt || "",
      });
    }
  }

  return <AdminTransactionsClient transactions={transactions} />;
}
