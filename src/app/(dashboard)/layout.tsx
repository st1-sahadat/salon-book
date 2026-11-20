
import { cookies, headers } from "next/headers";
import DashboardHeader from "@/components/Dashboard/DashboardHeader";
import DashboardSidebar from "@/components/Dashboard/DashboardSidebar";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { TooltipProvider } from "@/components/ui/tooltip";
import { auth } from "@/lib/auth";

const DashboardLayout = async ({ children }: { children: React.ReactNode }) => {
  // const [cookieStore, session] = await Promise.all([
  //   cookies(),
  //   auth.api.getSession({ headers: await headers() }),
  // ]);
  // const jwtToken = await auth.api.getToken({ headers: await headers() });
  // if (!jwtToken) {
  //   throw new Error("No token found. User must be logged in to fetch users.");
  // }
  // const token = jwtToken?.token;
  // console.log({token});

  // // The shadcn sidebar stores its open/collapsed state in this cookie.
  // const defaultOpen = cookieStore.get("sidebar_state")?.value !== "false";

  // const user = session
  //   ? {
  //       name: session.user.name,
  //       email: session.user.email,
  //       image: session.user.image,
  //       role: session.user.role,
  //     }
  //   : null;

  return (
    <TooltipProvider>
      <SidebarProvider 
      // defaultOpen={defaultOpen}
      >
        <DashboardSidebar  />
        <SidebarInset>
          <DashboardHeader />
          <div className="flex flex-1 flex-col gap-4 p-4">{children}</div>
        </SidebarInset>
      </SidebarProvider>
    </TooltipProvider>
  );
};

export default DashboardLayout;
