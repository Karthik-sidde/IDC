
"use client";

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
import { ShieldCheck, Palette, Save, Loader2, RotateCcw } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useState, useEffect } from 'react';

// Helper to convert hex to HSL string
function hexToHsl(hex: string): string {
    hex = hex.replace('#', '');
    const r = parseInt(hex.substring(0, 2), 16) / 255;
    const g = parseInt(hex.substring(2, 4), 16) / 255;
    const b = parseInt(hex.substring(4, 6), 16) / 255;

    const max = Math.max(r, g, b);
    const min = Math.min(r, g, b);
    let h = 0, s = 0, l = (max + min) / 2;

    if (max !== min) {
        const d = max - min;
        s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
        switch (max) {
            case r: h = (g - b) / d + (g < b ? 6 : 0); break;
            case g: h = (b - r) / d + 2; break;
            case b: h = (r - g) / d + 4; break;
        }
        h /= 6;
    }

    h = Math.round(h * 360);
    s = Math.round(s * 100);
    l = Math.round(l * 100);
    
    return `${h} ${s}% ${l}%`;
}

// Helper to convert HSL string to hex
function hslToHex(hsl: string): string {
    const [h, s, l] = hsl.split(' ').map(val => parseInt(val.replace('%','')));
    const s_norm = s / 100;
    const l_norm = l / 100;

    const c = (1 - Math.abs(2 * l_norm - 1)) * s_norm;
    const x = c * (1 - Math.abs((h / 60) % 2 - 1));
    const m = l_norm - c / 2;
    let r = 0, g = 0, b = 0;

    if (h >= 0 && h < 60) { [r, g, b] = [c, x, 0]; }
    else if (h >= 60 && h < 120) { [r, g, b] = [x, c, 0]; }
    else if (h >= 120 && h < 180) { [r, g, b] = [0, c, x]; }
    else if (h >= 180 && h < 240) { [r, g, b] = [0, x, c]; }
    else if (h >= 240 && h < 300) { [r, g, b] = [x, 0, c]; }
    else if (h >= 300 && h < 360) { [r, g, b] = [c, 0, x]; }

    const toHex = (n: number) => Math.round((n + m) * 255).toString(16).padStart(2, '0');
    return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
}

const DEFAULT_THEME = {
  primary: '217 91% 60%',
  accent: '217 91% 60%',
  background: '220 20% 98%',
  dark_primary: '217 91% 60%',
  dark_accent: '217 91% 60%',
  dark_background: '220 20% 7%',
};

export default function PlatformSettingsPage() {
  const { toast } = useToast();
  const [isSaving, setIsSaving] = useState(false);

  const [lightTheme, setLightTheme] = useState({
      primary: hslToHex(DEFAULT_THEME.primary),
      accent: hslToHex(DEFAULT_THEME.accent),
      background: hslToHex(DEFAULT_THEME.background),
  });

  const [darkTheme, setDarkTheme] = useState({
      primary: hslToHex(DEFAULT_THEME.dark_primary),
      accent: hslToHex(DEFAULT_THEME.dark_accent),
      background: hslToHex(DEFAULT_THEME.dark_background),
  });

  useEffect(() => {
    const root = document.documentElement;
    const fetchColor = (variable: string) => hslToHex(getComputedStyle(root).getPropertyValue(variable).trim());
    
    setLightTheme({
        primary: fetchColor('--theme-primary'),
        accent: fetchColor('--theme-accent'),
        background: fetchColor('--theme-background'),
    });
     setDarkTheme({
        primary: fetchColor('--theme-dark-primary'),
        accent: fetchColor('--theme-dark-accent'),
        background: fetchColor('--theme-dark-background'),
    });
  }, []);

  const handleLightChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setLightTheme({...lightTheme, [e.target.id]: e.target.value });
  };
  
  const handleDarkChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setDarkTheme({...darkTheme, [e.target.id]: e.target.value });
  };

  const saveTheme = () => {
    setIsSaving(true);
    
    const theme = {
        '--theme-primary': hexToHsl(lightTheme.primary),
        '--theme-accent': hexToHsl(lightTheme.accent),
        '--theme-background': hexToHsl(lightTheme.background),
        '--theme-dark-primary': hexToHsl(darkTheme.primary),
        '-theme-dark-accent': hexToHsl(darkTheme.accent),
        '--theme-dark-background': hexToHsl(darkTheme.background),
    };

    localStorage.setItem('idc-theme', JSON.stringify(theme));

    Object.entries(theme).forEach(([key, value]) => {
      document.documentElement.style.setProperty(key, value);
    });

    setTimeout(() => {
        setIsSaving(false);
        toast({
            title: "Theme Saved!",
            description: "Your new platform theme has been applied."
        });
    }, 1000);
  };

  const resetTheme = () => {
      localStorage.removeItem('idc-theme');
      window.location.reload();
  }


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
            Customize the look and feel of the application for both light and dark modes. Changes will apply globally.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-8">
          <div>
            <h3 className="text-lg font-semibold mb-4">Light Theme</h3>
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
                <div className="space-y-2">
                <Label htmlFor="primary">Primary Color</Label>
                <Input id="primary" type="color" value={lightTheme.primary} onChange={handleLightChange} className="h-12"/>
                </div>
                <div className="space-y-2">
                <Label htmlFor="accent">Accent Color</Label>
                <Input id="accent" type="color" value={lightTheme.accent} onChange={handleLightChange} className="h-12"/>
                </div>
                <div className="space-y-2">
                <Label htmlFor="background">Background Color</Label>
                <Input id="background" type="color" value={lightTheme.background} onChange={handleLightChange} className="h-12"/>
                </div>
            </div>
          </div>
          <Separator />
           <div>
            <h3 className="text-lg font-semibold mb-4">Dark Theme</h3>
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
                <div className="space-y-2">
                <Label htmlFor="primary">Primary Color</Label>
                <Input id="primary" type="color" value={darkTheme.primary} onChange={handleDarkChange} className="h-12"/>
                </div>
                <div className="space-y-2">
                <Label htmlFor="accent">Accent Color</Label>
                <Input id="accent" type="color" value={darkTheme.accent} onChange={handleDarkChange} className="h-12"/>
                </div>
                <div className="space-y-2">
                <Label htmlFor="background">Background Color</Label>
                <Input id="background" type="color" value={darkTheme.background} onChange={handleDarkChange} className="h-12"/>
                </div>
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

      <div className="flex justify-end gap-2">
        <Button variant="outline" onClick={resetTheme} disabled={isSaving}><RotateCcw /> Reset to Default</Button>
        <Button className="hover:glow" onClick={saveTheme} disabled={isSaving}>
            {isSaving ? <Loader2 className="animate-spin" /> : <Save />}
            Save Changes
        </Button>
      </div>
    </div>
  );
}
