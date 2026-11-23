import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { connectToDatabase } from "@/lib/db";
import AdminTransactionsClient from "./AdminTransactionsClient";

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
  const rawAppointments = await db
    .collection("appointments")
    .find()
    .sort({ createdAt: -1 })
    .toArray();

  const transactions: TTransaction[] = rawAppointments.map((a) => ({
    _id: a._id.toString(),
    customerName: a.customerName || "Customer",
    customerEmail: a.customerEmail || "",
    serviceName: a.serviceName || "Service",
    servicePrice: Number(a.servicePrice) || 0,
    paymentStatus: a.paymentStatus || "Unpaid",
    status: a.status || "Pending",
    paidAt: a.paidAt || undefined,
    createdAt: a.createdAt || "",
  }));

  return <AdminTransactionsClient transactions={transactions} />;
}
