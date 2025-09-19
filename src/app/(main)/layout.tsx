
"use client";

import {
  SidebarProvider,
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarFooter,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarInset,
  SidebarTrigger,
  SidebarGroup,
  SidebarGroupLabel,
} from "@/components/ui/sidebar";
import { AppLogo } from "@/components/AppLogo";
import { UserNav } from "@/components/UserNav";
import { ThemeToggle } from "@/components/ThemeToggle";
import {
  LayoutDashboard,
  Calendar,
  Ticket,
  Users,
  QrCode,
  Settings,
  LogOut,
  ChevronRight,
  Shield,
  LogIn
} from "lucide-react";
import { useContext } from "react";
import { UserContext } from "@/context/UserContext";
import { usePathname, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";

export default function MainLayout({ children }: { children: React.ReactNode }) {
  const { user, logout } = useContext(UserContext);
  const router = useRouter();
  const pathname = usePathname();

  const handleLogout = () => {
    logout();
    router.push("/");
  };

  const menuItems = [
    {
      role: ["user", "admin", "super_admin", "guest"],
      href: "/events",
      icon: Calendar,
      label: "Browse Events",
    },
    {
      role: ["user"],
      href: "/my-events",
      icon: Ticket,
      label: "My Tickets",
    },
    {
      role: ["admin", "super_admin"],
      href: "/admin/dashboard",
      icon: LayoutDashboard,
      label: "Dashboard",
      group: "Admin",
    },
    {
      role: ["admin", "super_admin"],
      href: "/admin/events",
      icon: Calendar,
      label: "Manage Events",
      group: "Admin",
    },
    {
      role: ["admin", "super_admin"],
      href: "/admin/scanner",
      icon: QrCode,
      label: "Check-in Scanner",
      group: "Admin",
    },
    {
      role: ["super_admin"],
      href: "/admin/users",
      icon: Users,
      label: "Manage Users",
      group: "Super Admin",
    },
     {
      role: ["super_admin"],
      href: "/admin/platform-settings",
      icon: Shield,
      label: "Platform Settings",
      group: "Super Admin",
    },
  ];

  const currentUserRole = user?.role || "guest";

  const userMenu = menuItems.filter(
    (item) => !item.group && item.role.includes(currentUserRole)
  );
  const adminMenu = menuItems.filter(
    (item) => item.group === "Admin" && user && item.role.includes(user.role)
  );
  const superAdminMenu = menuItems.filter(
    (item) => item.group === "Super Admin" && user && item.role.includes(user.role)
  );
  
  const getPageTitle = () => {
    if (pathname === '/') return 'Home';
    const allMenus = [...userMenu, ...adminMenu, ...superAdminMenu];
    const
 
activeItem = allMenus.find(item => pathname.startsWith(item.href) && item.href !== '/');
    return activeItem?.label || "Events";
  }


  return (
    <SidebarProvider>
      <Sidebar side="left" variant="inset" collapsible="icon">
        <SidebarHeader>
          <AppLogo />
        </SidebarHeader>
        <SidebarContent>
          <SidebarGroup>
            <SidebarMenu>
              {userMenu.map((item) => (
                <SidebarMenuItem key={item.href}>
                  <SidebarMenuButton
                    onClick={() => router.push(item.href)}
                    isActive={pathname === item.href}
                    tooltip={item.label}
                  >
                    <item.icon />
                    <span>{item.label}</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroup>

          {adminMenu.length > 0 && (
            <SidebarGroup>
              <SidebarGroupLabel className="font-headline">Admin</SidebarGroupLabel>
              <SidebarMenu>
                {adminMenu.map((item) => (
                  <SidebarMenuItem key={item.href}>
                    <SidebarMenuButton
                      onClick={() => router.push(item.href)}
                      isActive={pathname.startsWith(item.href)}
                      tooltip={item.label}
                    >
                      <item.icon />
                      <span>{item.label}</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroup>
          )}

          {superAdminMenu.length > 0 && (
            <SidebarGroup>
              <SidebarGroupLabel className="font-headline">Super Admin</SidebarGroupLabel>
              <SidebarMenu>
                {superAdminMenu.map((item) => (
                  <SidebarMenuItem key={item.href}>
                    <SidebarMenuButton
                      onClick={() => router.push(item.href)}
                      isActive={pathname.startsWith(item.href)}
                      tooltip={item.label}
                    >
                      <item.icon />
                      <span>{item.label}</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroup>
          )}
        </SidebarContent>
        <SidebarFooter>
          {user && (
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton onClick={handleLogout} tooltip="Logout">
                  <LogOut />
                  <span>Logout</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          )}
        </SidebarFooter>
      </Sidebar>
      <SidebarInset>
         <header className="sticky top-0 z-10 flex h-14 items-center justify-between gap-4 border-b bg-background/80 px-4 backdrop-blur-sm sm:static sm:h-auto sm:border-0 sm:bg-transparent sm:px-6 sm:pt-4">
          <div className="flex items-center gap-2">
            <SidebarTrigger className="md:hidden" />
             <h1 className="text-xl font-semibold font-headline tracking-tight">
                {getPageTitle()}
            </h1>
          </div>
          <div className="flex items-center gap-2">
            <ThemeToggle />
            {user ? (
              <UserNav />
            ) : (
               <Button variant="outline" onClick={() => router.push('/login')}>
                <LogIn className="mr-2 h-4 w-4"/>
                Sign In
              </Button>
            )}
          </div>
        </header>
        <main className="flex-1 p-4 sm:px-6 sm:pb-6">
           <AnimatePresence mode="wait">
            <motion.div
              key={pathname}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
            >
              {children}
            </motion.div>
          </AnimatePresence>
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}
