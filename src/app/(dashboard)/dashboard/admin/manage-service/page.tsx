import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { connectToDatabase } from "@/lib/db";
import ManageServicesClient from "./ManageServicesClient";

export type TAdminService = {
  _id: string;
  serviceName: string;
  category: string;
  description: string;
  price: number;
  duration: number;
  image: string;
  status: string;
  createdBy?: string;
  createdAt?: string;
};

export default async function ManageServicesPage() {
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
  const rawServices = await db
    .collection("services")
    .find()
    .sort({ createdAt: -1 })
    .toArray();

  const services: TAdminService[] = rawServices.map((s) => ({
    _id: s._id.toString(),
    serviceName: s.serviceName || s.name || "Service",
    category: s.category || "General",
    description: s.description || "",
    price: Number(s.price) || 0,
    duration: Number(s.duration) || 60,
    image: s.image || "",
    status: s.status || "Active",
    createdBy: s.createdBy || "",
    createdAt: s.createdAt || "",
  }));

  return <ManageServicesClient initialServices={services} />;
}
