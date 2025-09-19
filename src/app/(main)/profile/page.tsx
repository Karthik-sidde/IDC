
"use client";

import { useContext, useState, useEffect } from "react";
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
import { Linkedin, UserCircle, Save } from "lucide-react";
import { type User } from "@/lib/types";

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


export default function ProfilePage() {
  const { user, setUser } = useContext(UserContext); // Assuming setUser is available for local state update
  const { toast } = useToast();
  const [profile, setProfile] = useState<User | null>(null);

  useEffect(() => {
    if (user) {
      setProfile(user);
    }
  }, [user]);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    if (profile) {
      const { id, value } = e.target;
      if (id === 'bio') {
        setProfile({ ...profile, profile: { ...profile.profile, bio: value } });
      } else if (id === 'xUrl' || id === 'linkedinUrl') {
         setProfile({ ...profile, profile: { ...profile.profile, [id]: value } });
      }
      else {
        setProfile({ ...profile, [id]: value });
      }
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (profile) {
      // In a real app, you would call an API to update the user
      // For this mock, we update context if setUser is provided
      if (setUser) {
        setUser(profile);
      }
      toast({
        title: "Profile Updated",
        description: "Your profile information has been successfully saved.",
      });
    }
  };

  if (!profile) {
    return <div>Loading...</div>;
  }

  return (
    <div className="mx-auto max-w-3xl space-y-8">
       <div>
        <h1 className="text-2xl font-bold font-headline">Your Profile</h1>
        <p className="text-muted-foreground">
          Manage your personal information and social links.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <Card className="glass">
          <CardHeader>
             <div className="flex items-center gap-3">
                <UserCircle className="h-6 w-6 text-primary" />
                <CardTitle>Personal Information</CardTitle>
            </div>
            <CardDescription>
              Update your photo, name, and bio.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center gap-4">
              <Avatar className="h-20 w-20">
                <AvatarImage src={profile.profile.avatar} />
                <AvatarFallback>{profile.name.charAt(0)}</AvatarFallback>
              </Avatar>
              <Button type="button" variant="outline">
                Change Photo
              </Button>
            </div>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                    <Label htmlFor="name">Name</Label>
                    <Input
                    id="name"
                    value={profile.name}
                    onChange={handleInputChange}
                    />
                </div>
                 <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input id="email" value={profile.email} disabled />
                </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="bio">Bio</Label>
              <Textarea
                id="bio"
                placeholder="Tell us a little about yourself"
                value={profile.profile.bio}
                onChange={handleInputChange}
                rows={3}
              />
            </div>
          </CardContent>
        </Card>

        <Card className="glass">
          <CardHeader>
            <CardTitle>Social Links</CardTitle>
             <CardDescription>
                Add your professional social media profiles.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
             <div className="space-y-2">
              <Label htmlFor="xUrl">X (Twitter)</Label>
               <div className="relative">
                 <XIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="xUrl"
                    placeholder="https://x.com/username"
                    value={profile.profile.xUrl || ""}
                    onChange={handleInputChange}
                    className="pl-10"
                  />
               </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="linkedinUrl">LinkedIn</Label>
              <div className="relative">
                <Linkedin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="linkedinUrl"
                  placeholder="https://linkedin.com/in/username"
                  value={profile.profile.linkedinUrl || ""}
                  onChange={handleInputChange}
                  className="pl-10"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="flex justify-end">
          <Button type="submit" className="hover:glow">
            <Save className="mr-2 h-4 w-4" />
            Save Changes
          </Button>
        </div>
      </form>
    </div>
  );
}
