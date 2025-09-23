
"use client";

import { useState, useContext } from "react";
import { useRouter } from "next/navigation";
import { AtSign, KeyRound, Loader2, LogIn } from "lucide-react";
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
import { UserContext } from "@/context/UserContext";
import { type UserRole } from "@/lib/types";
import { AppLogo } from "@/components/AppLogo";
import Link from "next/link";

export default function AdminLoginPage() {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const { login } = useContext(UserContext);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    // Simulate API call
    setTimeout(() => {
      // Default to 'admin' role for this login form.
      // The login logic will verify if the user is actually an admin.
      login(email, "admin");
      setIsLoading(false);
      router.push("/admin/dashboard");
    }, 1000);
  };

  return (
    <Card className="w-full max-w-sm glass">
      <form onSubmit={handleLogin}>
        <CardHeader className="text-center">
          <div className="mx-auto mb-4">
            <AppLogo />
          </div>
          <CardTitle>Admin Portal</CardTitle>
          <CardDescription>
            Please sign in to access the admin dashboard.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="login-email">Email</Label>
            <div className="relative">
              <AtSign className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                id="login-email"
                type="email"
                placeholder="Enter your email"
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
                placeholder="Enter your password"
                className="pl-10"
              />
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex flex-col gap-4">
          <Button
            type="submit"
            className="w-full hover:glow"
            disabled={isLoading}
          >
            {isLoading ? <Loader2 className="animate-spin" /> : <LogIn />}
            <span>Sign In</span>
          </Button>
           <p className="text-xs text-muted-foreground">
                Not an admin? <Link href="/" className="text-primary underline">Go back to main site</Link>
            </p>
        </CardFooter>
      </form>
    </Card>
  );
}
