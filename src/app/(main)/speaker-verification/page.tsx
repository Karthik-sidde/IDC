
"use client";

import { useContext, useState } from "react";
import { UserContext } from "@/context/UserContext";
import { useRouter } from "next/navigation";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { UploadCloud, FileCheck, Clock, Loader2, PartyPopper } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function SpeakerVerificationPage() {
  const { user } = useContext(UserContext);
  const router = useRouter();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    // Simulate API call
    setTimeout(() => {
        setIsSubmitting(false);
        setIsSubmitted(true);
        toast({
            title: "Documents Submitted!",
            description: "Your verification documents have been submitted for review. We'll notify you once the process is complete.",
        });
    }, 2000);
  };
  
  if (!user) {
    // Redirect to login if not authenticated
    router.push('/login');
    return (
        <div className="text-center py-10">
            <p className="text-muted-foreground">Please log in to apply for speaker verification.</p>
        </div>
    )
  }

  if (user.verificationStatus === 'approved') {
    return (
      <div className="mx-auto max-w-lg space-y-6">
        <Alert variant="default" className="border-green-500">
           <PartyPopper className="h-4 w-4 text-green-500" />
            <AlertTitle className="text-green-500">You're Approved!</AlertTitle>
            <AlertDescription>
                Congratulations! You are now a verified speaker. You can start creating and managing your events.
            </AlertDescription>
        </Alert>
        <Button onClick={() => router.push('/admin/events/new')} className="w-full">
            Create Your First Event
        </Button>
      </div>
    )
  }
  
  if (isSubmitted || user.verificationStatus === 'pending') {
     return (
         <div className="mx-auto max-w-lg">
             <Card className="glass">
                <CardHeader className="text-center">
                    <Clock className="mx-auto h-12 w-12 text-primary" />
                    <CardTitle className="mt-4">Verification Pending</CardTitle>
                    <CardDescription>
                        Your submission is currently under review by our team. This usually takes 1-2 business days. We will notify you via email once your account has been approved.
                    </CardDescription>
                </CardHeader>
             </Card>
         </div>
     )
  }

  return (
    <div className="mx-auto max-w-lg space-y-6">
      <div>
        <h1 className="text-2xl font-bold font-headline">Become a Speaker</h1>
        <p className="text-muted-foreground">
          To ensure the quality of our events, we require speakers to complete a
          brief verification process.
        </p>
      </div>
      <form onSubmit={handleSubmit}>
        <Card className="glass">
          <CardHeader>
            <CardTitle>Submit Documents</CardTitle>
            <CardDescription>
              Please upload a government-issued ID and a link to your
              professional profile (e.g., LinkedIn).
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="id-document">Government ID</Label>
              <Input id="id-document" type="file" required />
              <p className="text-xs text-muted-foreground pt-1">
                e.g., Driver's License, Passport.
              </p>
            </div>
            <div className="space-y-2">
              <Label htmlFor="professional-profile">
                Professional Profile URL
              </Label>
              <Input
                id="professional-profile"
                type="url"
                placeholder="https://linkedin.com/in/username"
                required
              />
               <p className="text-xs text-muted-foreground pt-1">
                Your LinkedIn, personal website, or other portfolio.
              </p>
            </div>
          </CardContent>
          <CardFooter>
             <Button type="submit" className="w-full hover:glow" disabled={isSubmitting}>
                {isSubmitting ? (
                    <>
                        <Loader2 className="animate-spin" />
                        <span>Submitting...</span>
                    </>
                ) : (
                    <>
                        <UploadCloud />
                        <span>Submit for Review</span>
                    </>
                )}
            </Button>
          </CardFooter>
        </Card>
      </form>
    </div>
  );
}

    