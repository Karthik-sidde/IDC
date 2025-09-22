
"use client";

import { useState, useContext } from "react";
import { useRouter, usePathname } from "next/navigation";
import { AtSign, KeyRound, Loader2, LogIn, PartyPopper, User, Mic } from "lucide-react";
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
import { AppLogo } from "@/components/AppLogo";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Link from "next/link";
import { type UserRole } from "@/lib/types";
import { addMockUser } from "@/lib/mock-data";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

export default function LoginPage() {
  const [email, setEmail] = useState("alex.doe@example.com");
  const [name, setName] = useState("Alex Doe");
  const [role, setRole] = useState<UserRole>("user");
  const [isLoading, setIsLoading] = useState(false);
  const [isRegistering, setIsRegistering] = useState(false);
  const router = useRouter();
  const pathname = usePathname();
  const { login } = useContext(UserContext);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    // Simulate API call
    setTimeout(() => {
      login(email);
      setIsLoading(false);
      const redirectPath = sessionStorage.getItem('redirectAfterLogin') || '/events';
      sessionStorage.removeItem('redirectAfterLogin');
      router.push(redirectPath);
    }, 1000);
  };
  
  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setIsRegistering(true);
    
    // Simulate API call for registration
    setTimeout(() => {
      const newUser = {
        id: `user-${Date.now()}`,
        name,
        email,
        role,
        status: "active" as const,
        verificationStatus: role === 'speaker' ? 'pending' as const : undefined,
        profile: {
          avatar: `https://picsum.photos/seed/${Date.now()}/100/100`,
          bio: "",
        },
      };
      addMockUser(newUser);
      login(email);

      setIsLoading(false);
      setIsRegistering(false);
      
      if (role === 'speaker') {
        router.push('/speaker-verification');
      } else {
        const redirectPath = sessionStorage.getItem('redirectAfterLogin') || '/events';
        sessionStorage.removeItem('redirectAfterLogin');
        router.push(redirectPath);
      }
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
                Sign in to your account to continue.
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
            </CardContent>
            <CardFooter className="flex flex-col gap-4">
              <Button
                type="submit"
                className="w-full hover:glow"
                disabled={isLoading}
                onClick={() => {
                  if (pathname) sessionStorage.setItem('redirectAfterLogin', pathname);
                }}
              >
                {isLoading && !isRegistering ? <Loader2 className="animate-spin" /> : <LogIn />}
                <span>Sign In</span>
              </Button>
              <p className="text-xs text-muted-foreground">
                Are you an admin? <Link href="/admin/login" className="text-primary underline">Login here</Link>
              </p>
            </CardFooter>
          </form>
        </TabsContent>
        <TabsContent value="register">
           <form onSubmit={handleRegister}>
            <CardContent className="space-y-4">
               <CardDescription className="text-center">
                Create a new account.
              </CardDescription>

              <div className="space-y-2">
                <Label>I want to sign up as a...</Label>
                <RadioGroup
                    defaultValue={role}
                    onValueChange={(value) => setRole(value as UserRole)}
                    className="grid grid-cols-2 gap-4"
                >
                    <Label className="flex flex-col items-center justify-center rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary">
                        <RadioGroupItem value="user" id="r-user" className="sr-only"/>
                        <User className="mb-3 h-6 w-6" />
                        Attendee
                    </Label>
                    <Label className="flex flex-col items-center justify-center rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary">
                        <RadioGroupItem value="speaker" id="r-speaker" className="sr-only"/>
                        <Mic className="mb-3 h-6 w-6" />
                        Speaker
                    </Label>
                </RadioGroup>
              </div>

                <div className="space-y-2">
                <Label htmlFor="register-name">Name</Label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="register-name"
                    type="text"
                    placeholder="Alex Doe"
                    required
                    onChange={(e) => setName(e.target.value)}
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
                 onClick={() => {
                  if (pathname) sessionStorage.setItem('redirectAfterLogin', pathname);
                }}
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
