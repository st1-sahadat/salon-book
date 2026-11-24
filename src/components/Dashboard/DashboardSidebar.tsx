"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  CalendarCheck,
  ChevronsUpDown,
  House,
  LayoutDashboard,
  LayoutGrid,
  LogOut,
  UserRound,
  Users,
  Sparkles,
  ClipboardClock,
  CreditCard,
  Scissors,
} from "lucide-react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
  useSidebar,
} from "@/components/ui/sidebar";
import { authClient } from "@/lib/auth-client";
import { TDashboardSidebarItem, TUser, TUserRole } from "@/types";

const roleBasedSidebarItems = {
  customer: [
    {
      title: "Overview",
      href: "/dashboard/customer/overview",
      icon: LayoutDashboard,
    },
    {
      title: "My Appointments",
      href: "/dashboard/customer/appointments",
      icon: CalendarCheck,
    },
    {
      title: "Browse Services",
      href: "/dashboard/customer/service",
      icon: Sparkles,
    },
    {
      title: "My Profile",
      href: "/dashboard/customer/profile",
      icon: UserRound,
    },
  ],
  admin: [
    {
      title: "Overview",
      href: "/dashboard/admin/overview",
      icon: LayoutGrid,
    },
    {
      title: "Manage Services",
      href: "/dashboard/admin/manage-service",
      icon: Scissors,
    },
    {
      title: "Appointments",
      href: "/dashboard/admin/appointment",
      icon: ClipboardClock,
    },
    {
      title: "Customers",
      href: "/dashboard/admin/customers",
      icon: Users,
    },
    {
      title: "Transactions",
      href: "/dashboard/admin/transactions",
      icon: CreditCard,
    },
    {
      title: "My Profile",
      href: "/dashboard/admin/profile",
      icon: UserRound,
    },
  ],
};

const isActivePath = (pathname: string, href: string) =>
  href === "/dashboard"
    ? pathname === href
    : pathname === href || pathname.startsWith(`${href}/`);

const DashboardSidebar = ({ user }: { user: TUser | null }) => {
  const pathname = usePathname();
  const router = useRouter();
  const { isMobile, setOpenMobile } = useSidebar();

  const role = user?.role || "customer";
  const sidebarItems = roleBasedSidebarItems[role as TUserRole] || [];

  const closeMobile = () => setOpenMobile(false);

  const handleSignOut = async () => {
    await authClient.signOut();
    router.push("/sign-in");
  };

  const initials = (user?.name || "U")
    .trim()
    .split(/\s+/)
    .filter(Boolean)
    .map((word) => word[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

  return (
    <Sidebar collapsible="icon" className="bg-[#18281F] text-[#F6F1E8] border-r border-[#25392C]">
      {/* Brand Header */}
      <SidebarHeader className="border-b border-cream/10 pb-3.5 pt-4">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              size="lg"
              tooltip="SalonBook Sanctuary"
              render={<Link href="/" onClick={closeMobile} />}
              className="hover:bg-white/6 rounded-xl transition-colors"
            >
              <div className="grid aspect-square size-9 place-items-center rounded-xl bg-brass text-brass-ink font-display font-bold shadow-md shadow-brass/20">
                <Sparkles className="w-5 h-5 text-brass-ink" />
              </div>
              <div className="grid flex-1 text-left leading-tight">
                <span className="truncate font-display text-lg font-semibold text-cream tracking-tight">
                  Salon<em className="text-brass italic font-medium">Book</em>
                </span>
                <span className="truncate font-mono text-[9px] uppercase tracking-[0.2em] text-cream-dim/70">
                  {role === "admin" ? "Admin Console" : "Client Portal"}
                </span>
              </div>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      {/* Navigation Items */}
      <SidebarContent className="py-2">
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu className="gap-1.5 px-1">
              {sidebarItems.map((item: TDashboardSidebarItem) => {
                const { title, href, icon: Icon } = item;
                const active = isActivePath(pathname, href);

                return (
                  <SidebarMenuItem key={href}>
                    <SidebarMenuButton
                      tooltip={title}
                      isActive={active}
                      className={`rounded-xl px-3 py-2.5 font-medium transition-all duration-200 text-sm ${
                        active
                          ? "bg-brass text-brass-ink font-semibold shadow-sm shadow-brass/25"
                          : "text-cream/80 hover:bg-white/8 hover:text-cream"
                      }`}
                      render={<Link href={href} onClick={closeMobile} />}
                    >
                      <Icon className={`w-4.5 h-4.5 shrink-0 ${active ? "text-brass-ink" : "text-brass"}`} />
                      <span className="tracking-tight">{title}</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      {/* User Footer Profile */}
      {user && (
        <SidebarFooter className="border-t border-cream/10 pt-3 pb-3">
          <SidebarMenu>
            <SidebarMenuItem>
              <DropdownMenu>
                <DropdownMenuTrigger
                  render={
                    <SidebarMenuButton
                      size="lg"
                      className="hover:bg-white/6 rounded-xl transition-colors data-popup-open:bg-white/10"
                    />
                  }
                >
                  <Avatar className="rounded-lg ring-1 ring-brass/40 size-8.5">
                    <AvatarImage
                      src={user.image ?? undefined}
                      alt={user.name}
                      className="rounded-lg object-cover"
                    />
                    <AvatarFallback className="rounded-lg bg-brass font-display text-xs font-bold text-brass-ink">
                      {initials}
                    </AvatarFallback>
                  </Avatar>
                  <div className="grid flex-1 text-left text-sm leading-tight">
                    <span className="truncate font-medium text-cream">{user.name}</span>
                    <span className="truncate text-xs font-mono text-cream-dim/60">
                      {user.email}
                    </span>
                  </div>
                  <ChevronsUpDown className="ml-auto w-4 h-4 text-cream-dim/70" />
                </DropdownMenuTrigger>

                <DropdownMenuContent
                  className="min-w-60 bg-[#1A2C21] border border-cream/15 text-cream rounded-2xl p-1.5 shadow-2xl"
                  side={isMobile ? "bottom" : "right"}
                  align="end"
                  sideOffset={8}
                >
                  <DropdownMenuGroup>
                    <DropdownMenuLabel className="truncate px-3 py-2 text-xs font-mono uppercase tracking-wider text-brass">
                      Signed in as {user.role ? user.role : "Client"}
                    </DropdownMenuLabel>
                    <DropdownMenuItem
                      render={<Link href="/" onClick={closeMobile} />}
                      className="cursor-pointer rounded-xl px-3 py-2 text-sm text-cream/90 hover:bg-white/10 hover:text-cream transition-colors"
                    >
                      <House className="w-4 h-4 text-brass mr-2" />
                      Back to Website
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      render={<Link href="/dashboard/profile" onClick={closeMobile} />}
                      className="cursor-pointer rounded-xl px-3 py-2 text-sm text-cream/90 hover:bg-white/10 hover:text-cream transition-colors"
                    >
                      <UserRound className="w-4 h-4 text-brass mr-2" />
                      My Profile
                    </DropdownMenuItem>
                  </DropdownMenuGroup>
                  <DropdownMenuSeparator className="bg-cream/10 my-1" />
                  <DropdownMenuItem
                    onClick={handleSignOut}
                    className="cursor-pointer rounded-xl px-3 py-2 text-sm text-rose-300 hover:bg-rose-500/15 hover:text-rose-200 transition-colors"
                  >
                    <LogOut className="w-4 h-4 text-rose-400 mr-2" />
                    Sign Out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarFooter>
      )}

      <SidebarRail />
    </Sidebar>
  );
};

export default DashboardSidebar;
