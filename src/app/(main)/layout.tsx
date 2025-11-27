
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
  Calendar,
  Ticket,
  LogOut,
  LogIn,
  FileCheck,
  AlertCircle,
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
  
  const showProfileCompletionReminder = user && !user.profile.isComplete;


  const menuItems = [
    {
      role: ["user", "admin", "super_admin", "guest", "speaker"],
      href: "/events",
      icon: Calendar,
      label: "Browse Events",
    },
    {
      role: ["user", "speaker", "admin", "super_admin"],
      href: "/my-events",
      icon: Ticket,
      label: "My Tickets",
    },
    {
      role: ["user", "speaker"],
      href: "/speaker-verification",
      icon: FileCheck,
      label: "Become a Speaker",
      condition: (user: any) => user?.verificationStatus !== 'approved',
    },
  ];

  const currentUserRole = user?.role || "guest";

  const userMenu = menuItems.filter(
    (item) => item.role.includes(currentUserRole) && (!item.condition || item.condition(user))
  );
  
  const getPageTitle = () => {
    if (pathname === '/') return 'Home';
    if (pathname === '/profile-setup') return 'Create Your Profile';

    const activeItem = userMenu.find(item => pathname.startsWith(item.href) && item.href !== '/');
    return activeItem?.label || "Events";
  }


  return (
    <SidebarProvider>
      <Sidebar side="left" variant="inset" collapsible="icon">
        <SidebarHeader>
          <AppLogo />
        </SidebarHeader>
        <SidebarContent>
           {showProfileCompletionReminder && (
             <SidebarGroup>
                <div className="p-2 bg-yellow-100/10 border border-yellow-500/30 rounded-lg text-center mx-2">
                    <AlertCircle className="h-6 w-6 text-yellow-500 mx-auto mb-2"/>
                    <p className="text-xs text-yellow-300 mb-2">Complete your profile to get the full experience!</p>
                    <Button size="sm" className="h-7 text-xs" onClick={() => router.push('/profile-setup')}>Complete Profile</Button>
                </div>
             </SidebarGroup>
          )}

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
