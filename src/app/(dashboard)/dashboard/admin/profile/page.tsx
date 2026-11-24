import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import AdminProfileClient from "./AdminProfileClient";

export const dynamic = 'force-dynamic';

export default async function AdminProfilePage() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user) {
    redirect("/sign-in");
  }

  if (session.user.role !== "admin") {
    redirect("/dashboard/customer/overview");
  }

  const user = {
    name: session.user.name || "Administrator",
    email: session.user.email,
    image: session.user.image || null,
    role: session.user.role,
  };

  return <AdminProfileClient user={user} />;
}
