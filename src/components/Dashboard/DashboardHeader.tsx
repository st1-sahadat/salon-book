"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Separator } from "@/components/ui/separator";
import { House, ExternalLink, Sparkles } from "lucide-react";
import React from "react";

const routeTitles: Record<string, string> = {
  "/dashboard/customer/overview": "Client Overview",
  "/dashboard/customer/appointments": "My Appointments",
  "/dashboard/customer/service": "Browse Services",
  "/dashboard/customer/profile": "My Profile",
  "/dashboard/admin/overview": "Executive Overview",
  "/dashboard/admin/manage-service": "Manage Services",
  "/dashboard/admin/appointment": "Manage Appointments",
  "/dashboard/admin/customers": "Customer Directory",
  "/dashboard/admin/transactions": "Financial Transactions",
  "/dashboard/admin/profile": "Administrator Profile",
};

const DashboardHeader = () => {
  const pathname = usePathname();
  const currentTitle = routeTitles[pathname] || "Dashboard";

  return (
    <header className="sticky top-0 z-30 flex h-15 shrink-0 items-center justify-between border-b border-cream-deep/60 bg-[#FAF8F5]/90 px-4 sm:px-6 backdrop-blur-md">
      {/* Left: Sidebar trigger & Title */}
      <div className="flex items-center gap-3">
        <SidebarTrigger className="h-8.5 w-8.5 rounded-lg border border-cream-deep/80 hover:bg-cream-soft text-forest transition-colors" />
        <Separator
          orientation="vertical"
          className="h-4 bg-cream-deep/80"
        />
        <div className="flex items-center gap-2">
          <Sparkles className="w-3.5 h-3.5 text-brass hidden sm:block" />
          <span className="font-display text-lg sm:text-xl font-medium text-ink tracking-tight">
            {currentTitle}
          </span>
        </div>
      </div>

      {/* Right: Quick link to website */}
      <div className="flex items-center gap-3">
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 rounded-xl border border-cream-deep bg-white px-3 py-1.5 text-xs font-mono uppercase tracking-wider text-forest shadow-2xs hover:bg-cream-soft hover:border-brass/50 transition-all"
        >
          <House className="w-3.5 h-3.5 text-brass" />
          <span className="hidden sm:inline">Website</span>
          <ExternalLink className="w-3 h-3 text-mute-soft" />
        </Link>
      </div>
    </header>
  );
};

export default DashboardHeader;
