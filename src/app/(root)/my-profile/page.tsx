import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";

export const dynamic = 'force-dynamic';

export default async function MyProfileRedirect() {
  let session = null;
  try {
    session = await auth.api.getSession({
      headers: await headers(),
    });
  } catch (err) {
    console.error("MyProfile redirect session error:", err);
  }

  if (!session?.user) {
    redirect("/sign-in");
  }

  if (session.user.role === "admin") {
    redirect("/dashboard/admin/profile");
  }

  redirect("/dashboard/customer/profile");
}
