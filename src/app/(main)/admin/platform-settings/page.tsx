import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { ShieldCheck, Palette } from "lucide-react";

export default function PlatformSettingsPage() {
  return (
    <div className="mx-auto max-w-4xl space-y-8">
      <div>
        <h1 className="text-2xl font-bold font-headline">Platform Settings</h1>
        <p className="text-muted-foreground">
          Manage global settings for the entire platform.
        </p>
      </div>

      <Card className="glass">
        <CardHeader>
          <div className="flex items-center gap-3">
            <Palette className="h-6 w-6 text-primary" />
            <CardTitle>Theme & Branding</CardTitle>
          </div>
          <CardDescription>
            Customize the look and feel of the application.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
            <div className="space-y-2">
              <Label htmlFor="primary-color">Primary Color</Label>
              <Input id="primary-color" type="color" defaultValue="#4f46e5" className="h-12"/>
            </div>
            <div className="space-y-2">
              <Label htmlFor="background-color">Background Color</Label>
              <Input id="background-color" type="color" defaultValue="#f0f2f5" className="h-12"/>
            </div>
             <div className="space-y-2">
              <Label htmlFor="accent-color">Accent Color</Label>
              <Input id="accent-color" type="color" defaultValue="#7c3aed" className="h-12"/>
            </div>
          </div>
           <div className="space-y-2">
              <Label htmlFor="logo">Application Logo</Label>
              <Input id="logo" type="file" />
               <p className="text-xs text-muted-foreground pt-1">Upload an SVG, PNG, or JPG file (max 2MB).</p>
            </div>
        </CardContent>
      </Card>

      <Card className="glass">
        <CardHeader>
           <div className="flex items-center gap-3">
            <ShieldCheck className="h-6 w-6 text-primary" />
            <CardTitle>Security</CardTitle>
          </div>
          <CardDescription>
            Manage API keys and other security-related settings.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
            <div>
                <h3 className="font-medium">Google Maps API Key</h3>
                <p className="text-sm text-muted-foreground">Used for displaying maps on event pages.</p>
                <div className="flex items-center gap-2 mt-2">
                    <Input id="google-maps-key" type="password" defaultValue="....-....-....-xyz" />
                    <Button variant="outline">Reveal</Button>
                </div>
            </div>
             <Separator />
             <div>
                <h3 className="font-medium">Unsplash API Key</h3>
                <p className="text-sm text-muted-foreground">Used for fetching event cover images.</p>
                <div className="flex items-center gap-2 mt-2">
                    <Input id="unsplash-key" type="password" defaultValue="....-....-....-abc" />
                    <Button variant="outline">Reveal</Button>
                </div>
            </div>
        </CardContent>
      </Card>

      <div className="flex justify-end">
        <Button className="hover:glow">Save Changes</Button>
      </div>
    </div>
  );
}

    