import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { connectToDatabase } from "@/lib/db";
import AdminCustomersClient from "./AdminCustomersClient";

export const dynamic = 'force-dynamic';

export type TCustomerWithStats = {
  _id: string;
  name: string;
  email: string;
  image: string | null;
  role: string;
  isBlocked: boolean;
  createdAt: string | null;
  stats: {
    totalAppointments: number;
    confirmedAppointments: number;
    pendingAppointments: number;
    cancelledAppointments: number;
    totalSpent: number;
  };
};

export default async function CustomerPage() {
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

  // Fetch all registered customers/users
  const users = await db
    .collection("user")
    .find()
    .sort({ createdAt: -1 })
    .toArray();

  const appointments = await db
    .collection("appointments")
    .find()
    .toArray();

  const customers: TCustomerWithStats[] = users.map((u) => {
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

  return (
    <AdminCustomersClient
      initialCustomers={customers}
      currentAdminEmail={session.user.email}
    />
  );
}
