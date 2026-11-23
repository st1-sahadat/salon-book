import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import CustomerProfileClient from "./CustomerProfileClient";

export default async function ProfilePage() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <p className="text-mute">Please sign in to view your profile.</p>
      </div>
    );
  }

  const user = {
    name: session.user.name || "",
    email: session.user.email || "",
    image: session.user.image || null,
  };

  return <CustomerProfileClient user={user} />;
}
