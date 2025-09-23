
"use client";

import { useState, useContext } from "react";
import { useRouter, usePathname } from "next/navigation";
import { AtSign, KeyRound, Loader2, LogIn, UserPlus, User, Mic } from "lucide-react";
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
import { addMockUser, mockUsers } from "@/lib/mock-data";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useToast } from "@/hooks/use-toast";
import { Separator } from "@/components/ui/separator";


const GoogleIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" width="24px" height="24px" {...props}>
        <path fill="#FFC107" d="M43.611,20.083H42V20H24v8h11.303c-1.649,4.657-6.08,8-11.303,8c-6.627,0-12-5.373-12-12c0-6.627,5.373-12,12-12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C12.955,4,4,12.955,4,24c0,11.045,8.955,20,20,20c11.045,0,20-8.955,20-20C44,22.659,43.862,21.35,43.611,20.083z" />
        <path fill="#FF3D00" d="M6.306,14.691l6.571,4.819C14.655,15.108,18.961,12,24,12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C16.318,4,9.656,8.337,6.306,14.691z" />
        <path fill="#4CAF50" d="M24,44c5.166,0,9.86-1.977,13.409-5.192l-6.19-5.238C29.211,35.091,26.715,36,24,36c-5.222,0-9.619-3.317-11.283-7.946l-6.522,5.025C9.505,39.556,16.227,44,24,44z" />
        <path fill="#1976D2" d="M43.611,20.083H42V20H24v8h11.303c-0.792,2.237-2.231,4.166-4.087,5.571l6.19,5.238C44.57,34.933,48,29.898,48,24C48,22.659,47.862,21.35,47.611,20.083z" />
    </svg>
);
  
const XIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="currentColor"
      {...props}
    >
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
);

const CodebasicsIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg width="24" height="24" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
        <path d="M14.0002 0.166992C6.3562 0.166992 0.166992 6.3562 0.166992 14.0002C0.166992 21.6442 6.3562 27.8337 14.0002 27.8337C21.6442 27.8337 27.8337 21.6442 27.8337 14.0002C27.8337 6.3562 21.6442 0.166992 14.0002 0.166992ZM19.6732 20.3002L14.0002 14.6272L8.32724 20.3002L7.00024 19.0872L12.7872 13.3002L7.00024 7.51324L8.21324 6.30024L14.0002 12.0872L19.7872 6.30024L21.0002 7.51324L15.2132 13.3002L20.9872 19.0732L19.6732 20.3002Z" fill="currentColor"/>
    </svg>
);



export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [role, setRole] = useState<UserRole>("user");
  const [isLoading, setIsLoading] = useState(false);
  const [isRegistering, setIsRegistering] = useState(false);
  const router = useRouter();
  const pathname = usePathname();
  const { login } = useContext(UserContext);
  const { toast } = useToast();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    setTimeout(() => {
      const userToLogin = mockUsers.find(u => u.email === email);
      if (userToLogin && !userToLogin.emailVerified) {
          toast({
            variant: "destructive",
            title: "Email Not Verified",
            description: "Please verify your email before logging in.",
          });
          router.push(`/verify-email?email=${email}`);
          setIsLoading(false);
          return;
      }

      login(email);
      setIsLoading(false);
      
      const redirectPath = sessionStorage.getItem('redirectAfterLogin') || '/events';
      sessionStorage.removeItem('redirectAfterLogin');
      router.push(redirectPath);
    }, 1000);
  };
  
  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();

    const existingUser = mockUsers.find(u => u.email === email);
    if (existingUser) {
        toast({
            variant: "destructive",
            title: "User Exists",
            description: "A user with this email already exists. Please sign in.",
        });
        return;
    }

    setIsLoading(true);
    setIsRegistering(true);
    
    setTimeout(() => {
      const newUser = {
        id: `user-${Date.now()}`,
        name,
        email,
        role,
        status: "active" as const,
        emailVerified: false,
        verificationStatus: role === 'speaker' ? 'pending' as const : undefined,
        profile: {
          avatar: `https://picsum.photos/seed/${Date.now()}/100/100`,
          bio: "",
        },
      };
      addMockUser(newUser);

      setIsLoading(false);
      setIsRegistering(false);
      
      router.push(`/verify-email?email=${email}`);
      toast({
        title: "Registration Successful!",
        description: "Please check your email to verify your account.",
      });

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
              
              <div className="space-y-3">
                  <Button variant="outline" className="w-full text-black bg-white hover:bg-gray-100">
                    <CodebasicsIcon className="mr-2 h-5 w-5" />
                    Continue with Codebasics
                  </Button>
                  <Button variant="outline" className="w-full">
                    <GoogleIcon className="mr-2 h-5 w-5" />
                    Continue with Google
                  </Button>
                  <Button variant="outline" className="w-full">
                    <XIcon className="mr-2 h-5 w-5" />
                    Continue with X
                  </Button>
              </div>

               <div className="flex items-center space-x-2">
                <Separator className="flex-1" />
                <span className="text-xs text-muted-foreground">OR</span>
                <Separator className="flex-1" />
              </div>


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
                    placeholder="State your name"
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
                    placeholder="yourname@gmail.com"
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
                {isLoading && isRegistering ? <Loader2 className="animate-spin" /> : <UserPlus />}
                <span>Create Account</span>
              </Button>
            </CardFooter>
          </form>
        </TabsContent>
      </Tabs>
    </Card>
  );
}
