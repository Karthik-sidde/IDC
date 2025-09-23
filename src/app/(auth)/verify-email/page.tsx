
"use client";

import { Suspense } from 'react';
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { MailCheck, Loader2 } from "lucide-react";
import { useState } from "react";
import { verifyUserEmail } from '@/lib/mock-data';
import { useToast } from "@/hooks/use-toast";
import Link from 'next/link';

function VerifyEmailContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const email = searchParams.get('email');

  const handleVerification = () => {
    if (!email) return;

    setIsLoading(true);
    // Simulate API call to verify email
    setTimeout(() => {
      const isVerified = verifyUserEmail(email);
      setIsLoading(false);
      if (isVerified) {
        toast({
            title: "Email Verified!",
            description: "Your email has been successfully verified. You can now log in.",
        });
        router.push("/login");
      } else {
         toast({
            variant: "destructive",
            title: "Verification Failed",
            description: "Could not find a user with that email.",
        });
      }
    }, 1500);
  };

  return (
    <Card className="w-full max-w-md glass">
      <CardHeader className="text-center">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
          <MailCheck className="h-10 w-10 text-primary" />
        </div>
        <CardTitle className="mt-4">Verify Your Email</CardTitle>
        <CardDescription>
          A verification link has been sent to <span className="font-semibold text-primary">{email}</span>. Please click the button below to complete your registration.
        </CardDescription>
      </CardHeader>
      <CardContent>
          <p className="text-xs text-center text-muted-foreground">In a real application, you would click a link in your email. For this demo, just click the button.</p>
      </CardContent>
      <CardFooter className="flex flex-col gap-4">
        <Button
          className="w-full hover:glow"
          onClick={handleVerification}
          disabled={isLoading || !email}
        >
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Verifying...
            </>
          ) : (
            "Verify Email Address"
          )}
        </Button>
         <p className="text-xs text-muted-foreground">
            Wrong email? <Link href="/login" className="text-primary underline">Go back to Sign Up</Link>
        </p>
      </CardFooter>
    </Card>
  );
}

export default function VerifyEmailPage() {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <VerifyEmailContent />
        </Suspense>
    )
}
