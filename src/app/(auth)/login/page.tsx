
"use client";

import { useState, useContext, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  AtSign,
  KeyRound,
  Loader2,
  LogIn,
  UserPlus,
  User,
  Mic,
  Check,
} from "lucide-react";
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
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";
import { ScrollArea } from "@/components/ui/scroll-area";

const passwordSchema = z
  .string()
  .min(8, "Password must be at least 8 characters long")
  .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
  .regex(/[0-9]/, "Password must contain at least one number");

const registerSchema = z
  .object({
    name: z.string().min(1, "Name is required"),
    email: z.string().email("Invalid email address"),
    password: passwordSchema,
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });

type RegisterFormValues = z.infer<typeof registerSchema>;

const GoogleIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 48 48"
    width="24px"
    height="24px"
    {...props}
  >
    <path
      fill="#FFC107"
      d="M43.611,20.083H42V20H24v8h11.303c-1.649,4.657-6.08,8-11.303,8c-6.627,0-12-5.373-12-12c0-6.627,5.373-12,12-12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C12.955,4,4,12.955,4,24c0,11.045,8.955,20,20,20c11.045,0,20-8.955,20-20C44,22.659,43.862,21.35,43.611,20.083z"
    />
    <path
      fill="#FF3D00"
      d="M6.306,14.691l6.571,4.819C14.655,15.108,18.961,12,24,12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C16.318,4,9.656,8.337,6.306,14.691z"
    />
    <path
      fill="#4CAF50"
      d="M24,44c5.166,0,9.86-1.977,13.409-5.192l-6.19-5.238C29.211,35.091,26.715,36,24,36c-5.222,0-9.619-3.317-11.283-7.946l-6.522,5.025C9.505,39.556,16.227,44,24,44z"
    />
    <path
      fill="#1976D2"
      d="M43.611,20.083H42V20H24v8h11.303c-0.792,2.237-2.231,4.166-4.087,5.574l6.19,5.238C39.901,35.639,44,29.833,44,24C44,22.659,43.862,21.35,43.611,20.083z"
    />
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
  <svg
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <path
      d="M19.5 12C19.5 16.1421 16.1421 19.5 12 19.5C7.85786 19.5 4.5 16.1421 4.5 12C4.5 7.85786 7.85786 4.5 12 4.5C16.1421 4.5 19.5 7.85786 19.5 12Z"
      stroke="currentColor"
      strokeWidth="1.5"
    />
    <path
      d="M10.9395 10.3601L14.0607 14.2399"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
    />
    <path
      d="M15 9.75C15 9.33579 14.6642 9 14.25 9C13.8358 9 13.5 9.33579 13.5 9.75C13.5 10.1642 13.8358 10.5 14.25 10.5C14.6642 10.5 15 10.1642 15 9.75Z"
      fill="currentColor"
    />
    <path
      d="M10.5 14.25C10.5 13.8358 10.1642 13.5 9.75 13.5C9.33579 13.5 9 13.8358 9 14.25C9 14.6642 9.33579 15 9.75 15C10.1642 15 10.5 14.6642 10.5 14.25Z"
      fill="currentColor"
    />
  </svg>
);


interface FormFieldProps {
    name: keyof RegisterFormValues;
    label: string;
    icon: React.ReactNode;
    placeholder: string;
    type?: string;
    register: any;
    errors: any;
    isDirty: boolean;
    isValid: boolean;
}

const FormField: React.FC<FormFieldProps> = ({ name, label, icon, placeholder, type = "text", register, errors, isDirty, isValid }) => (
    <div className="space-y-2">
        <Label htmlFor={name}>{label}</Label>
        <div className="relative flex items-center">
            <div className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground">{icon}</div>
            <Input
                id={name}
                type={type}
                placeholder={placeholder}
                {...register(name)}
                className={cn("pl-10", errors[name] && "border-destructive")}
            />
             <AnimatePresence>
                {isDirty && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.5 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.5 }}
                        className="absolute right-3"
                    >
                        {isValid ? (
                             <Check className="h-5 w-5 text-green-500" />
                        ) : (
                            // Error icon can be added here if desired
                            null
                        )}
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
        {errors[name] && <p className="text-sm text-destructive">{errors[name].message}</p>}
    </div>
);


export default function LoginPage() {
  const [isLoginLoading, setIsLoginLoading] = useState(false);
  const [isRegisterLoading, setIsRegisterLoading] = useState(false);

  const [loginEmail, setLoginEmail] = useState("");
  const router = useRouter();
  const { login } = useContext(UserContext);
  const { toast } = useToast();

   const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isValid, dirtyFields },
  } = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    mode: "onChange",
  });

  const passwordValue = watch("password");
  
  const handleRedirect = () => {
    const redirectPath = sessionStorage.getItem('redirectAfterLogin') || '/events';
    sessionStorage.removeItem('redirectAfterLogin');
    router.push(redirectPath);
  }

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoginLoading(true);
    // Simulate API call
    setTimeout(() => {
      login(loginEmail);
      setIsLoginLoading(false);
      handleRedirect();
    }, 1000);
  };
  
   const handleRegister = (data: RegisterFormValues) => {
    setIsRegisterLoading(true);
    const newUser = {
      id: `user-${Date.now()}`,
      name: data.name,
      email: data.email,
      role: 'user' as UserRole,
      status: 'active' as const,
      emailVerified: false,
      profile: {
        avatar: `https://picsum.photos/seed/${Date.now()}/100/100`,
        bio: "",
        isComplete: false
      },
    };
    addMockUser(newUser);

    setTimeout(() => {
        setIsRegisterLoading(false);
        router.push(`/verify-email?email=${data.email}`);
    }, 1500)
  };
  
  const handleGoogleLogin = () => {
      setIsLoginLoading(true);
      setTimeout(() => {
          login("alex.doe@example.com"); // Use mock user for demo
          setIsLoginLoading(false);
          toast({
              title: "Logged In!",
              description: "You have successfully signed in with Google.",
          });
          handleRedirect();
      }, 1000);
  }


  return (
    <Card className="w-full max-w-sm glass">
      <Tabs defaultValue="login" className="w-full">
        <CardHeader>
          <div className="mx-auto mb-4">
            <AppLogo />
          </div>
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="login">Sign In</TabsTrigger>
            <TabsTrigger value="register">Create Account</TabsTrigger>
          </TabsList>
        </CardHeader>
        <TabsContent value="login">
          <form onSubmit={handleLogin}>
           <ScrollArea className="h-[420px] w-full">
            <CardContent className="space-y-4 pr-6">
              <CardDescription className="text-center">
                Welcome back! Sign in to continue.
              </CardDescription>

              <div className="space-y-3">
                <Button variant="outline" className="w-full text-black bg-white hover:bg-gray-100 hover:text-black">
                  <CodebasicsIcon className="mr-2 h-5 w-5" />
                  Continue with Codebasics
                </Button>
                <Button variant="outline" className="w-full" onClick={handleGoogleLogin} disabled={isLoginLoading}>
                   {isLoginLoading ? <Loader2 className="mr-2 h-5 w-5 animate-spin" /> : <GoogleIcon className="mr-2 h-5 w-5" />}
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
                <Label htmlFor="login-email">Email</Label>
                <div className="relative">
                  <AtSign className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="login-email"
                    type="email"
                    placeholder="Enter your email"
                    required
                    value={loginEmail}
                    onChange={(e) => setLoginEmail(e.target.value)}
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
           </ScrollArea>
            <CardFooter className="flex flex-col gap-4">
              <Button
                type="submit"
                className="w-full hover:glow"
                disabled={isLoginLoading}
              >
                {isLoginLoading ? <Loader2 className="animate-spin" /> : <LogIn />}
                <span>Sign In</span>
              </Button>
            </CardFooter>
          </form>
        </TabsContent>
        <TabsContent value="register">
          <form onSubmit={handleSubmit(handleRegister)}>
            <ScrollArea className="h-[420px] w-full">
                <CardContent className="space-y-4 pr-6">
                <CardDescription className="text-center">
                    Create a new account to join the community.
                </CardDescription>

                <div className="space-y-3">
                    <Button variant="outline" className="w-full text-black bg-white hover:bg-gray-100 hover:text-black">
                    <CodebasicsIcon className="mr-2 h-5 w-5" />
                    Continue with Codebasics
                    </Button>
                    <Button variant="outline" className="w-full" onClick={handleGoogleLogin} disabled={isLoginLoading}>
                      {isLoginLoading ? <Loader2 className="mr-2 h-5 w-5 animate-spin" /> : <GoogleIcon className="mr-2 h-5 w-5" />}
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

                <FormField 
                        name="name"
                        label="Name"
                        icon={<User />}
                        placeholder="Enter your name"
                        register={register}
                        errors={errors}
                        isDirty={!!dirtyFields.name}
                        isValid={!errors.name}
                    />

                    <FormField 
                        name="email"
                        label="Email"
                        icon={<AtSign />}
                        placeholder="Enter your email"
                        type="email"
                        register={register}
                        errors={errors}
                        isDirty={!!dirtyFields.email}
                        isValid={!errors.email}
                    />

                    <FormField 
                        name="password"
                        label="Password"
                        icon={<KeyRound />}
                        placeholder="Enter your password"
                        type="password"
                        register={register}
                        errors={errors}
                        isDirty={!!dirtyFields.password}
                        isValid={!errors.password && !!passwordValue && passwordValue.length > 0}
                    />
                    
                    <FormField 
                        name="confirmPassword"
                        label="Re-enter Password"
                        icon={<KeyRound />}
                        placeholder="Re-enter your password"
                        type="password"
                        register={register}
                        errors={errors}
                        isDirty={!!dirtyFields.confirmPassword}
                        isValid={!errors.confirmPassword && !!watch("confirmPassword") && watch("confirmPassword") === passwordValue}
                    />

                </CardContent>
            </ScrollArea>
            <CardFooter>
              <Button
                type="submit"
                className="w-full hover:glow transition-all duration-300"
                disabled={isRegisterLoading || !isValid}
              >
                {isRegisterLoading ? (
                  <Loader2 className="animate-spin" />
                ) : (
                  <UserPlus />
                )}
                <span>Create Account</span>
              </Button>
            </CardFooter>
          </form>
        </TabsContent>
      </Tabs>
    </Card>
  );
}
