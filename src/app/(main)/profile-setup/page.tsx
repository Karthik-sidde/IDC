
"use client";

import { useContext, useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { UserContext } from "@/context/UserContext";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { Loader2, Save, Upload, UserCircle } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { type User } from "@/lib/types";

export default function ProfileSetupPage() {
  const { user, setUser, loading } = useContext(UserContext);
  const router = useRouter();
  const { toast } = useToast();
  
  const [profileData, setProfileData] = useState({
    avatar: user?.profile.avatar || "",
    bio: user?.profile.bio || "",
  });

  const [progress, setProgress] = useState(0);

  useEffect(() => {
    if (user) {
      setProfileData({
        avatar: user.profile.avatar,
        bio: user.profile.bio,
      });
    }
  }, [user]);

  useEffect(() => {
    let newProgress = 10; // Base for account creation
    if (profileData.avatar && !profileData.avatar.includes('picsum.photos')) newProgress += 45;
    if (profileData.bio.trim().length > 10) newProgress += 45;
    setProgress(newProgress);
  }, [profileData]);

  if (loading) {
    return <div className="flex justify-center items-center h-full"><Loader2 className="animate-spin h-8 w-8" /></div>;
  }
  
  if (!user) {
    router.push('/login');
    return null;
  }
  
  const handleSkip = () => {
    if (user) {
       setUser({ ...user, profile: { ...user.profile, isComplete: false } });
       router.push("/events");
        toast({
            title: "Setup Skipped",
            description: "You can complete your profile later from your profile settings.",
            variant: "default",
        });
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (user) {
      const updatedUser: User = {
        ...user,
        profile: {
          ...user.profile,
          ...profileData,
          isComplete: true,
        },
      };
      setUser(updatedUser);
      toast({
        title: "Profile Setup Complete!",
        description: "Welcome! You can now explore the platform.",
      });
      router.push("/events");
    }
  };
  
  const handleAvatarChange = () => {
    // In a real app, this would open a file dialog
    toast({
        title: "Feature not implemented",
        description: "Avatar uploads will be available soon.",
    });
    // For demo, we just cycle the picsum seed
    setProfileData(prev => ({...prev, avatar: `https://picsum.photos/seed/${Date.now()}/100/100`}))
  }

  return (
    <div className="mx-auto max-w-2xl space-y-8">
      <div>
        <h1 className="text-3xl font-bold font-headline">Welcome, {user.name}!</h1>
        <p className="text-muted-foreground">
          Let's set up your profile. A complete profile helps you connect with others.
        </p>
      </div>

      <Card className="glass">
          <CardHeader>
             <div className="flex justify-between items-center">
                 <CardTitle>Profile Completion</CardTitle>
                 <span className="text-sm font-bold text-primary">{progress}%</span>
             </div>
             <Progress value={progress} className="h-2" />
          </CardHeader>
      </Card>

      <form onSubmit={handleSubmit}>
        <Card className="glass">
          <CardHeader>
            <div className="flex items-center gap-3">
              <UserCircle className="h-6 w-6 text-primary" />
              <CardTitle>Set Up Your Profile</CardTitle>
            </div>
            <CardDescription>
              Add a photo and a short bio to introduce yourself.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex flex-col items-center gap-4 text-center">
              <Avatar className="h-24 w-24 border-2 border-primary">
                <AvatarImage src={profileData.avatar} />
                <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
              </Avatar>
              <Button type="button" variant="outline" onClick={handleAvatarChange}>
                <Upload className="mr-2 h-4 w-4" />
                Upload Photo
              </Button>
            </div>
            <div className="space-y-2">
              <Label htmlFor="bio">Bio</Label>
              <Textarea
                id="bio"
                placeholder="Tell the community a little about yourself..."
                value={profileData.bio}
                onChange={(e) => setProfileData(prev => ({...prev, bio: e.target.value}))}
                rows={4}
              />
            </div>
          </CardContent>
        </Card>

        <div className="mt-6 flex flex-col-reverse sm:flex-row justify-end gap-2">
          <Button variant="ghost" type="button" onClick={handleSkip}>
            Skip for now
          </Button>
          <Button type="submit" className="hover:glow">
            <Save className="mr-2 h-4 w-4" />
            Continue
          </Button>
        </div>
      </form>
    </div>
  );
}
