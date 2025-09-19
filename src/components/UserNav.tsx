"use client";

import { useContext } from "react";
import {
  LogOut,
  User as UserIcon,
  Shield,
  UserCog,
  Replace,
} from "lucide-react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { UserContext } from "@/context/UserContext";
import { useRouter } from "next/navigation";
import { UserRole } from "@/lib/types";

export function UserNav() {
  const { user, logout, switchRole } = useContext(UserContext);
  const router = useRouter();

  if (!user) {
    return null;
  }

  const getInitials = (name: string) => {
    const names = name.split(" ");
    if (names.length > 1) {
      return `${names[0][0]}${names[1][0]}`;
    }
    return name.substring(0, 2);
  };

  const handleLogout = () => {
    logout();
    router.push("/login");
  };

  const handleRoleSwitch = (role: UserRole) => {
    switchRole(role);
    // You might want to force a reload or redirect to the new default page
    window.location.href = "/";
  };
  
  const RoleIcon =
    user.role === 'super_admin' ? Shield : user.role === 'admin' ? UserCog : UserIcon;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="relative h-8 w-8 rounded-full">
          <Avatar className="h-8 w-8">
            <AvatarImage src={user.profile.avatar} alt={user.name} />
            <AvatarFallback>{getInitials(user.name)}</AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56" align="end" forceMount>
        <DropdownMenuLabel className="font-normal">
          <div className="flex items-center gap-2">
             <RoleIcon className="w-4 h-4 text-muted-foreground" />
            <div className="flex flex-col space-y-1">
              <p className="text-sm font-medium leading-none">{user.name}</p>
              <p className="text-xs leading-none text-muted-foreground">
                {user.email}
              </p>
            </div>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuLabel className="font-normal text-xs">Switch Role</DropdownMenuLabel>
          <DropdownMenuItem onSelect={() => handleRoleSwitch("user")} disabled={user.role === 'user'}>
            <UserIcon className="mr-2 h-4 w-4" />
            <span>User</span>
          </DropdownMenuItem>
          <DropdownMenuItem onSelect={() => handleRoleSwitch("admin")} disabled={user.role === 'admin'}>
            <UserCog className="mr-2 h-4 w-4" />
            <span>Admin</span>
          </DropdownMenuItem>
          <DropdownMenuItem onSelect={() => handleRoleSwitch("super_admin")} disabled={user.role === 'super_admin'}>
            <Shield className="mr-2 h-4 w-4" />
            <span>Super Admin</span>
          </DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuItem onSelect={handleLogout}>
          <LogOut className="mr-2 h-4 w-4" />
          <span>Log out</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
