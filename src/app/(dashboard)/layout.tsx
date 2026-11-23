
import { cookies, headers } from "next/headers";
import DashboardHeader from "@/components/Dashboard/DashboardHeader";
import DashboardSidebar from "@/components/Dashboard/DashboardSidebar";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { TooltipProvider } from "@/components/ui/tooltip";
import { auth } from "@/lib/auth";
import { connectToDatabase } from "@/lib/db";
import { ShieldAlert } from "lucide-react";

const DashboardLayout = async ({ children }: { children: React.ReactNode }) => {
  const [cookieStore, session] = await Promise.all([
    cookies(),
    auth.api.getSession({ headers: await headers() }),
  ]);

  let isBlocked = false;
  if (session?.user?.email) {
    try {
      const { db } = await connectToDatabase();
      const dbUser = await db.collection("user").findOne({ email: session.user.email });
      isBlocked = !!dbUser?.isBlocked;
    } catch {
      // ignore
    }
  }

  // The shadcn sidebar stores its open/collapsed state in this cookie.
  const defaultOpen = cookieStore.get("sidebar_state")?.value !== "false";

  const user = session
    ? {
        name: session.user.name,
        email: session.user.email,
        image: session.user.image,
        role: session.user.role,
        isBlocked,
      }
    : null;

  return (
    <TooltipProvider>
      <SidebarProvider defaultOpen={defaultOpen}>
        <DashboardSidebar user={user} />
        <SidebarInset>
          <DashboardHeader />
          <div className="flex flex-1 flex-col gap-4 p-4">
            {isBlocked && session?.user?.role !== "admin" ? (
              <div className="min-h-[60vh] flex items-center justify-center p-6">
                <div className="max-w-md w-full bg-white rounded-3xl p-8 border border-rose-200 shadow-xl text-center">
                  <div className="w-16 h-16 rounded-full bg-rose-50 text-rose-600 flex items-center justify-center mx-auto mb-4">
                    <ShieldAlert className="w-8 h-8" />
                  </div>
                  <h2 className="font-display text-2xl text-ink font-semibold mb-2">
                    Account Suspended
                  </h2>
                  <p className="text-sm text-mute leading-relaxed mb-6">
                    Your account has been blocked by an administrator. You do not have permission to access protected platform features. If you believe this is in error, please contact salon administration.
                  </p>
                  <div className="p-3 bg-rose-50/60 rounded-xl border border-rose-100 text-xs text-rose-800">
                    Status: <span className="font-bold">Access Restricted</span>
                  </div>
                </div>
              </div>
            ) : (
              children
            )}
          </div>
        </SidebarInset>
      </SidebarProvider>
    </TooltipProvider>
  );
};

export default DashboardLayout;
