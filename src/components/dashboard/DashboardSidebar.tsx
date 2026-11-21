"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  CalendarCheck,
  CarFront,
  ChevronsUpDown,
  House,
  LayoutDashboard,
  LayoutGrid,
  LogOut,
  UserRound,
  Users,
  WrenchOff,
  ClipboardClock,
  CreditCardPlus
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
  user: [
    {
      title: "Overview",
      href: "/dashboard/user/overview",
      icon: LayoutDashboard,
    },
    {
      title: "My Appointments",
      href: "/dashboard/user/appointments",
      icon: CalendarCheck,
    },
    {
      title: "Browse services",
      href: "/dashboard/user/service",
      icon: WrenchOff,
    },
    {
      title: "My Profile",
      href: "/dashboard/user/profile",
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
      title: "Manage services",
      href: "/dashboard/admin/manage-service",
      icon: WrenchOff,
    },
    {
      title: "Appointment",
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
      icon: CreditCardPlus,
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

  const role = user?.role || "user"; // Default role
  const sidebarItems = roleBasedSidebarItems[role as TUserRole] || [];

  // console.log(sidebarItems, "sidebarItems");

  // On mobile the sidebar is a sheet; close it after navigating.
  const closeMobile = () => setOpenMobile(false);

  const handleSignOut = () => {
    authClient.signOut();
    router.push("/signin");
  };

  return (
    <Sidebar collapsible="icon" className="bg-[#bcc2d2]">
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              size="lg"
              tooltip="Salon Book"
              render={
                <Link
                  href={`/`}
                  onClick={closeMobile}
                />
              }
            >
              <div className="grid aspect-square size-8 place-items-center rounded-lg bg-[#15295e] text-[#ffc107]">
                <CarFront />
              </div>
              <div className="grid flex-1 text-left leading-tight">
                <span className="truncate font-semibold">Salon Book</span>
                <span className="truncate text-xs text-sidebar-foreground/70">
                  dashboard
                </span>
              </div>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>

              {sidebarItems.map((item: TDashboardSidebarItem) => {
                const { title, href, icon: Icon } = item;

                return (
                  <SidebarMenuItem key={href}>
                    <SidebarMenuButton
                      tooltip={title}
                      isActive={isActivePath(pathname, href)}
                      className="data-[active=true]:bg-[#15295e] data-[active=true]:text-[#ffc107]"
                      render={<Link href={href} onClick={closeMobile} />}
                    >
                      <Icon />
                      <span>{title}</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      {user && (
        <SidebarFooter>
          <SidebarMenu>
            <SidebarMenuItem>
              <DropdownMenu>
                <DropdownMenuTrigger
                  render={
                    <SidebarMenuButton
                      size="lg"
                      className="data-popup-open:bg-sidebar-accent data-popup-open:text-sidebar-accent-foreground"
                    />
                  }
                >
                  <Avatar className="rounded-lg after:rounded-lg">
                    <AvatarImage
                      src={user.image ?? undefined}
                      alt={user.name}
                      className="rounded-lg"
                    />
                    <AvatarFallback className="rounded-lg">
                      {user.name}
                    </AvatarFallback>
                  </Avatar>
                  <div className="grid flex-1 text-left text-sm leading-tight">
                    <span className="truncate font-medium">{user.name}</span>
                    <span className="truncate text-xs text-sidebar-foreground/70">
                      {user.email}
                    </span>
                  </div>
                  <ChevronsUpDown className="ml-auto" />
                </DropdownMenuTrigger>

                <DropdownMenuContent
                  className="min-w-56"
                  side={isMobile ? "bottom" : "right"}
                  align="end"
                  sideOffset={4}
                >
                  <DropdownMenuGroup>
                    <DropdownMenuLabel className="truncate">
                      Signed in as {user.role ? user.role : "user"}
                    </DropdownMenuLabel>
                    <DropdownMenuItem
                      render={<Link href="/" onClick={closeMobile} />}
                    >
                      <House />
                      Back to site
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      render={<Link href="/profile" onClick={closeMobile} />}
                    >
                      <UserRound />
                      My profile
                    </DropdownMenuItem>
                  </DropdownMenuGroup>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleSignOut}>
                    <LogOut />
                    Sign out
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
