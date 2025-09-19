
"use client";

import {
  Card,
  CardContent,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { QrCode, Camera, VideoOff } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";

export default function QRScannerPage() {
  const [isScanning, setIsScanning] = useState(false);
  const [hasCameraPermission, setHasCameraPermission] = useState<boolean | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const { toast } = useToast();

  useEffect(() => {
    const getCameraPermission = async () => {
      if (isScanning) {
        try {
          const stream = await navigator.mediaDevices.getUserMedia({ video: true });
          setHasCameraPermission(true);

          if (videoRef.current) {
            videoRef.current.srcObject = stream;
          }
        } catch (error) {
          console.error("Error accessing camera:", error);
          setHasCameraPermission(false);
          toast({
            variant: "destructive",
            title: "Camera Access Denied",
            description: "Please enable camera permissions in your browser settings to scan QR codes.",
          });
        }
      }
    };

    getCameraPermission();

    return () => {
      // Cleanup: stop video stream when component unmounts or scanning stops
      if (videoRef.current && videoRef.current.srcObject) {
        const stream = videoRef.current.srcObject as MediaStream;
        stream.getTracks().forEach(track => track.stop());
      }
    }
  }, [isScanning, toast]);

  return (
    <div className="mx-auto max-w-lg space-y-6">
      <div>
        <h1 className="text-2xl font-bold font-headline">QR Code Scanner</h1>
        <p className="text-muted-foreground">
          Use the camera to scan attendee QR codes for check-in.
        </p>
      </div>
      <Card className="glass">
        <CardContent className="p-6">
          <div className="aspect-video w-full rounded-lg bg-muted flex items-center justify-center overflow-hidden">
            {isScanning ? (
              <video ref={videoRef} className="w-full h-full object-cover" autoPlay muted playsInline/>
            ) : (
              <div className="text-center text-muted-foreground">
                <Camera className="mx-auto h-16 w-16" />
                <p className="mt-2">Click "Start Scanning" to open camera</p>
              </div>
            )}
          </div>
           {isScanning && hasCameraPermission === false && (
                <Alert variant="destructive" className="mt-4">
                  <VideoOff className="h-4 w-4" />
                  <AlertTitle>Camera Access Required</AlertTitle>
                  <AlertDescription>
                    Please allow camera access in your browser to use this feature. You may need to refresh the page after granting permission.
                  </AlertDescription>
                </Alert>
            )}
        </CardContent>
      </Card>
      <Button size="lg" className="w-full hover:glow" onClick={() => setIsScanning(!isScanning)}>
        <QrCode className="mr-2 h-5 w-5" />
        {isScanning ? "Stop Scanning" : "Start Scanning"}
      </Button>
    </div>
  );
}
