"use client";

import { useState, useContext } from "react";
import { useRouter } from "next/navigation";
import { AtSign, KeyRound, Loader2, LogIn, PartyPopper, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { UserContext } from "@/context/UserContext";
import { type UserRole } from "@/lib/types";
import { AppLogo } from "@/components/AppLogo";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";

export default function LoginPage() {
  const [email, setEmail] = useState("alex.doe@example.com");
  const [role, setRole] = useState<UserRole>("user");
  const [isLoading, setIsLoading] = useState(false);
  const [isRegistering, setIsRegistering] = useState(false);
  const router = useRouter();
  const { login } = useContext(UserContext);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    // Simulate API call
    setTimeout(() => {
      login(email, role);
      setIsLoading(false);
      router.push("/");
    }, 1000);
  };
  
  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setIsRegistering(true);
    // Simulate API call for registration
    setTimeout(() => {
      // For mock purposes, we'll just log in the new user as a 'user'
      login(email, "user");
      setIsLoading(false);
      setIsRegistering(false);
      router.push("/");
    }, 1000);
  };


  return (
    <Card className="w-full max-w-sm glass">
      <Tabs defaultValue="login" className="w-full">
        <CardHeader>
           <div className="mx-auto mb-4">
            <AppLogo />
          </div>
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="login">Sign In</TabsTrigger>
            <TabsTrigger value="register">Sign Up</TabsTrigger>
          </TabsList>
        </CardHeader>
        <TabsContent value="login">
          <form onSubmit={handleLogin}>
            <CardContent className="space-y-4">
               <CardDescription className="text-center">
                Select a role to sign in to your account
              </CardDescription>
              <div className="space-y-2">
                <Label htmlFor="login-email">Email</Label>
                <div className="relative">
                  <AtSign className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="login-email"
                    type="email"
                    placeholder="m@example.com"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="login-password">Password</Label>
                <div className="relative">
                  <KeyRound className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="login-password"
                    type="password"
                    required
                    defaultValue="password123"
                    className="pl-10"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="role">Role</Label>
                <Select
                  value={role}
                  onValueChange={(value) => setRole(value as UserRole)}
                >
                  <SelectTrigger id="role" className="w-full">
                    <SelectValue placeholder="Select a role" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="user">User / Attendee</SelectItem>
                    <SelectItem value="admin">Admin / Organizer</SelectItem>
                    <SelectItem value="super_admin">Super Admin</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
            <CardFooter className="flex flex-col gap-4">
              <Button
                type="submit"
                className="w-full hover:glow"
                disabled={isLoading}
              >
                {isLoading && !isRegistering ? <Loader2 className="animate-spin" /> : <LogIn />}
                <span>Sign In</span>
              </Button>
            </CardFooter>
          </form>
        </TabsContent>
        <TabsContent value="register">
           <form onSubmit={handleRegister}>
            <CardContent className="space-y-4">
               <CardDescription className="text-center">
                Create a new attendee account.
              </CardDescription>
                <div className="space-y-2">
                <Label htmlFor="register-name">Name</Label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="register-name"
                    type="text"
                    placeholder="Alex Doe"
                    required
                    className="pl-10"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="register-email">Email</Label>
                <div className="relative">
                  <AtSign className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="register-email"
                    type="email"
                    placeholder="m@example.com"
                    required
                     onChange={(e) => setEmail(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="register-password">Password</Label>
                <div className="relative">
                  <KeyRound className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="register-password"
                    type="password"
                    required
                    className="pl-10"
                  />
                </div>
              </div>
            </CardContent>
            <CardFooter>
                <Button
                type="submit"
                className="w-full hover:glow"
                disabled={isLoading}
              >
                {isLoading && isRegistering ? <Loader2 className="animate-spin" /> : <PartyPopper />}
                <span>Create Account</span>
              </Button>
            </CardFooter>
          </form>
        </TabsContent>
      </Tabs>
    </Card>
  );
}
