import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { QrCode, Camera } from "lucide-react";

export default function QRScannerPage() {
  return (
    <div className="mx-auto max-w-lg space-y-6">
       <div>
        <h1 className="text-2xl font-bold font-headline">QR Code Scanner</h1>
        <p className="text-muted-foreground">
          Use the camera to scan attendee QR codes for check-in.
        </p>
      </div>
      <Card>
        <CardContent className="p-6">
          <div className="aspect-square w-full rounded-lg bg-muted flex items-center justify-center">
            <div className="text-center text-muted-foreground">
                <Camera className="mx-auto h-16 w-16" />
                <p className="mt-2">Camera feed will appear here</p>
            </div>
          </div>
        </CardContent>
      </Card>
       <Button size="lg" className="w-full hover:glow">
          <QrCode className="mr-2 h-5 w-5" />
          Start Scanning
        </Button>
    </div>
  );
}
