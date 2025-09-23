
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
g-10"
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
            disabled={isLoginLoading}
          >
            {isLoginLoading ? <Loader2 className="animate-spin" /> : <LogIn />}
            <span>Sign In</span>
          </Button>
          <p className="text-xs text-muted-foreground">
            Are you an admin?{" "}
            <Link href="/admin/login" className="text-primary underline">
              Login here
            </Link>
          </p>
        </CardFooter>
      </form>
    </TabsContent>
    <TabsContent value="register">
      <form onSubmit={handleSubmit(handleRegister)}>
        <CardContent className="space-y-4">
          <CardDescription className="text-center">
            Create a new account to join the community.
          </CardDescription>

          <div className="space-y-3">
            <Button variant="outline" className="w-full text-black bg-white hover:bg-gray-100 hover:text-black">
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

           <FormField 
                name="name"
                label="Name"
                icon={<User />}
                placeholder="State your name"
                register={register}
                errors={errors}
                isDirty={dirtyFields.name}
                isValid={!errors.name}
            />

            <FormField 
                name="email"
                label="Email"
                icon={<AtSign />}
                placeholder="yourname@gmail.com"
                type="email"
                register={register}
                errors={errors}
                isDirty={dirtyFields.email}
                isValid={!errors.email}
            />

            <FormField 
                name="password"
                label="Password"
                icon={<KeyRound />}
                placeholder="Min. 8 characters"
                type="password"
                register={register}
                errors={errors}
                isDirty={dirtyFields.password}
                isValid={!errors.password && passwordValue?.length > 0}
            />
            
             <FormField 
                name="confirmPassword"
                label="Re-enter Password"
                icon={<KeyRound />}
                placeholder="Confirm your password"
                type="password"
                register={register}
                errors={errors}
                isDirty={dirtyFields.confirmPassword}
                isValid={!errors.confirmPassword && watch("confirmPassword") === passwordValue}
            />

        </CardContent>
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

    