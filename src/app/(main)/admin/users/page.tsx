"use client";

import { useState, useContext } from "react";
import { mockUsers } from "@/lib/mock-data";
import { type User, type UserRole } from "@/lib/types";
import { UserContext } from "@/context/UserContext";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MoreHorizontal, UserPlus, CheckCircle, ShieldAlert } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogClose,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";

export default function AdminUsersPage() {
  const { user: currentUser } = useContext(UserContext);
  const [users, setUsers] = useState<User[]>(mockUsers);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [isAddUserOpen, setIsAddUserOpen] = useState(false);
  const [isChangeRoleOpen, setIsChangeRoleOpen] = useState(false);
  const [isSuspendUserOpen, setIsSuspendUserOpen] = useState(false);
  const [isApproveSpeakerOpen, setIsApproveSpeakerOpen] = useState(false);
  const [newUser, setNewUser] = useState({
    name: "",
    email: "",
    role: "user" as UserRole,
  });
  const [newRole, setNewRole] = useState<UserRole>("user");
  const { toast } = useToast();

  const canManageRoles = currentUser?.role === "super_admin";

  const getRoleVariant = (role: string) => {
    switch (role) {
      case "super_admin":
        return "destructive";
      case "admin":
        return "secondary";
      case "speaker":
        return "default";
      default:
        return "outline";
    }
  };

  const getVerificationStatusVariant = (status?: string) => {
    switch(status) {
        case 'approved': return 'secondary';
        case 'pending': return 'default';
        case 'rejected': return 'destructive';
        default: return 'outline';
    }
  }

  const handleOpenChangeRole = (user: User) => {
    if (user.id === currentUser?.id) return;
    setSelectedUser(user);
    setNewRole(user.role);
    setIsChangeRoleOpen(true);
  };

  const handleOpenSuspendUser = (user: User) => {
    if (user.id === currentUser?.id) return;
    setSelectedUser(user);
    setIsSuspendUserOpen(true);
  };

  const handleOpenApproveSpeaker = (user: User) => {
    setSelectedUser(user);
    setIsApproveSpeakerOpen(true);
  }

  const handleAddUser = () => {
    const userToAdd: User = {
      id: `user-${Date.now()}`,
      ...newUser,
      status: "active",
      profile: {
        avatar: `https://picsum.photos/seed/${Date.now()}/100/100`,
        bio: "",
      },
    };
    setUsers([...users, userToAdd]);
    setIsAddUserOpen(false);
    setNewUser({ name: "", email: "", role: "user" });
  };

  const handleChangeRole = () => {
    if (selectedUser && canManageRoles) {
      setUsers(
        users.map((u) =>
          u.id === selectedUser.id ? { ...u, role: newRole } : u
        )
      );
    }
    setIsChangeRoleOpen(false);
    setSelectedUser(null);
  };

  const handleSuspendUser = () => {
    if (selectedUser) {
      setUsers(
        users.map((u) =>
          u.id === selectedUser.id ? { ...u, status: u.status === 'active' ? 'suspended' : 'active' } : u
        )
      );
    }
    setIsSuspendUserOpen(false);
    setSelectedUser(null);
  };

  const handleApproveSpeaker = () => {
     if (selectedUser) {
      setUsers(
        users.map((u) =>
          u.id === selectedUser.id ? { ...u, verificationStatus: 'approved' } : u
        )
      );
       toast({
        title: "Speaker Approved",
        description: `${selectedUser.name} can now create events.`,
      });
    }
    setIsApproveSpeakerOpen(false);
    setSelectedUser(null);
  }

  return (
    <>
      <Card className="glass">
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle className="font-headline">User Management</CardTitle>
            <CardDescription>
              View, edit, and manage all users on the platform.
            </CardDescription>
          </div>
          <Button onClick={() => setIsAddUserOpen(true)}>
            <UserPlus className="mr-2 h-4 w-4" />
            Add User
          </Button>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>User</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>
                  <span className="sr-only">Actions</span>
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {users.map((user) => (
                <TableRow key={user.id} className={user.status === 'suspended' ? 'opacity-50' : ''}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <Avatar className="h-9 w-9">
                        <AvatarImage src={user.profile.avatar} alt={user.name} />
                        <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <span className="font-medium">{user.name}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                     <div className="flex items-center gap-2">
                        <Badge variant={getRoleVariant(user.role)} className="capitalize">
                          {user.role.replace("_", " ")}
                        </Badge>
                        {user.role === 'speaker' && (
                             <Badge variant={getVerificationStatusVariant(user.verificationStatus)} className="capitalize">
                                {user.verificationStatus}
                            </Badge>
                        )}
                     </div>
                  </TableCell>
                   <TableCell>
                    <Badge variant={user.status === 'active' ? 'secondary' : 'destructive'} className="capitalize">
                      {user.status}
                    </Badge>
                  </TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          aria-haspopup="true"
                          size="icon"
                          variant="ghost"
                          disabled={user.id === currentUser?.id}
                        >
                          <MoreHorizontal className="h-4 w-4" />
                          <span className="sr-only">Toggle menu</span>
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                        {user.role === 'speaker' && user.verificationStatus === 'pending' && (
                            <DropdownMenuItem onClick={() => handleOpenApproveSpeaker(user)}>
                                <CheckCircle className="mr-2 h-4 w-4"/>
                                Approve Speaker
                            </DropdownMenuItem>
                        )}
                        <DropdownMenuItem disabled>Edit User</DropdownMenuItem>
                        {canManageRoles && user.status === 'active' && (
                          <DropdownMenuItem onClick={() => handleOpenChangeRole(user)}>
                            Change Role
                          </DropdownMenuItem>
                        )}
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                          className={user.status === 'active' ? "text-destructive focus:text-destructive focus:bg-destructive/10" : ""}
                          onClick={() => handleOpenSuspendUser(user)}
                        >
                          {user.status === 'active' ? 'Suspend User' : 'Reactivate User'}
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Add User Dialog */}
      <Dialog open={isAddUserOpen} onOpenChange={setIsAddUserOpen}>
        <DialogContent className="glass">
          <DialogHeader>
            <DialogTitle>Add a New User</DialogTitle>
            <DialogDescription>
              Enter the details for the new user.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                value={newUser.name}
                onChange={(e) =>
                  setNewUser({ ...newUser, name: e.target.value })
                }
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={newUser.email}
                onChange={(e) =>
                  setNewUser({ ...newUser, email: e.target.value })
                }
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="role">Role</Label>
              <Select
                value={newUser.role}
                onValueChange={(value) =>
                  setNewUser({ ...newUser, role: value as UserRole })
                }
                disabled={!canManageRoles}
              >
                <SelectTrigger id="role">
                  <SelectValue placeholder="Select a role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="user">User</SelectItem>
                  <SelectItem value="speaker">Speaker</SelectItem>
                  {canManageRoles && (
                    <>
                      <SelectItem value="admin">Admin</SelectItem>
                      <SelectItem value="super_admin">Super Admin</SelectItem>
                    </>
                  )}
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline">Cancel</Button>
            </DialogClose>
            <Button onClick={handleAddUser}>Add User</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Change Role Dialog */}
      <Dialog open={isChangeRoleOpen} onOpenChange={setIsChangeRoleOpen}>
        <DialogContent className="glass">
          <DialogHeader>
            <DialogTitle>Change User Role</DialogTitle>
            <DialogDescription>
              Select a new role for {selectedUser?.name}.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <Select value={newRole} onValueChange={(v) => setNewRole(v as UserRole)}>
              <SelectTrigger>
                <SelectValue placeholder="Select a role" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="user">User</SelectItem>
                <SelectItem value="speaker">Speaker</SelectItem>
                 {canManageRoles && (
                    <>
                        <SelectItem value="admin">Admin</SelectItem>
                        <SelectItem value="super_admin">Super Admin</SelectItem>
                    </>
                 )}
              </SelectContent>
            </Select>
          </div>
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline">Cancel</Button>
            </DialogClose>
            <Button onClick={handleChangeRole}>Update Role</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Suspend User Alert */}
      <AlertDialog open={isSuspendUserOpen} onOpenChange={setIsSuspendUserOpen}>
        <AlertDialogContent className="glass">
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              {selectedUser?.status === 'active'
                ? `This will suspend ${selectedUser?.name} and restrict their access to the platform. This action can be undone later.`
                : `This will reactivate ${selectedUser?.name}'s account and restore their access.`}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleSuspendUser}>
              {selectedUser?.status === 'active' ? 'Yes, Suspend User' : 'Yes, Reactivate User'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
      
      {/* Approve Speaker Alert */}
      <AlertDialog open={isApproveSpeakerOpen} onOpenChange={setIsApproveSpeakerOpen}>
        <AlertDialogContent className="glass">
          <AlertDialogHeader>
            <AlertDialogTitle>Approve Speaker?</AlertDialogTitle>
            <AlertDialogDescription>
                Are you sure you want to approve {selectedUser?.name} as a speaker? They will be able to create and manage events.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleApproveSpeaker}>
              Yes, Approve
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
