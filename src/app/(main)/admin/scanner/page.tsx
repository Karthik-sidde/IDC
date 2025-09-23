
"use client";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  QrCode,
  Camera,
  VideoOff,
  CheckCircle,
  XCircle,
  AlertCircle,
  User,
  Ticket,
  Loader2,
} from "lucide-react";
import { useState, useRef, useEffect, useCallback } from "react";
import { useToast } from "@/hooks/use-toast";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import jsQR from "jsqr";
import { getMockTickets, mockUsers } from "@/lib/mock-data";
import { type Ticket as TicketType, type User as UserType } from "@/lib/types";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

type ScanResult = {
  status: "success" | "already_scanned" | "invalid";
  ticket: TicketType;
  user: UserType;
};

// Store scanned ticket IDs in memory for the session
const scannedTickets = new Set<string>();

export default function QRScannerPage() {
  const [isScanning, setIsScanning] = useState(false);
  const [hasCameraPermission, setHasCameraPermission] = useState<
    boolean | null
  >(null);
  const [scanResult, setScanResult] = useState<ScanResult | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { toast } = useToast();

  const handleScan = useCallback(async () => {
    if (videoRef.current && videoRef.current.readyState === videoRef.current.HAVE_ENOUGH_DATA && canvasRef.current) {
        const video = videoRef.current;
        const canvas = canvasRef.current;
        const context = canvas.getContext("2d");

        if (context) {
            canvas.height = video.videoHeight;
            canvas.width = video.videoWidth;
            context.drawImage(video, 0, 0, canvas.width, canvas.height);
            const imageData = context.getImageData(0, 0, canvas.width, canvas.height);
            const code = jsQR(imageData.data, imageData.width, imageData.height, {
                inversionAttempts: "dontInvert",
            });

            if (code) {
                setIsScanning(false); // Stop scanning once a code is found
                
                const ticketId = code.data;
                const ticket = getMockTickets().find(t => t.qrCode === ticketId);
                
                if (ticket) {
                    if (scannedTickets.has(ticket.id)) {
                        const user = mockUsers.find(u => u.id === ticket.userId);
                        setScanResult({ status: 'already_scanned', ticket, user: user! });
                    } else {
                        scannedTickets.add(ticket.id);
                        const user = mockUsers.find(u => u.id === ticket.userId);
                        setScanResult({ status: 'success', ticket, user: user! });
                    }
                } else {
                    // To demonstrate the invalid state, as all QR codes from tickets are valid
                    setScanResult({ status: 'invalid', ticket: { id: 'invalid', qrCode: ticketId } as any, user: {} as any });
                }
            }
        }
    }
  }, []);


  useEffect(() => {
    let animationFrameId: number;

    const tick = () => {
      if (isScanning) {
        handleScan();
        animationFrameId = requestAnimationFrame(tick);
      }
    };

    const startScan = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: "environment" },
        });
        setHasCameraPermission(true);

        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          videoRef.current.onloadedmetadata = () => {
            animationFrameId = requestAnimationFrame(tick);
          };
        }
      } catch (error) {
        console.error("Error accessing camera:", error);
        setHasCameraPermission(false);
        toast({
          variant: "destructive",
          title: "Camera Access Denied",
          description:
            "Please enable camera permissions in your browser settings to scan QR codes.",
        });
      }
    };

    if (isScanning) {
      startScan();
    }

    return () => {
      cancelAnimationFrame(animationFrameId);
      // Cleanup: stop video stream when component unmounts or scanning stops
      if (videoRef.current && videoRef.current.srcObject) {
        const stream = videoRef.current.srcObject as MediaStream;
        stream.getTracks().forEach((track) => track.stop());
        videoRef.current.srcObject = null;
      }
    };
  }, [isScanning, toast, handleScan]);
  
  const handleStartStopScan = () => {
    if (isScanning) {
        setIsScanning(false);
    } else {
        setScanResult(null);
        setIsScanning(true);
    }
  }
  
  const getResultIcon = () => {
    if (!scanResult) return null;
    switch(scanResult.status) {
      case 'success':
        return <CheckCircle className="h-16 w-16 text-green-500" />;
      case 'already_scanned':
        return <AlertCircle className="h-16 w-16 text-yellow-500" />;
      case 'invalid':
        return <XCircle className="h-16 w-16 text-destructive" />;
    }
  }

  return (
    <>
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
              {!isScanning && !scanResult && (
                <div className="text-center text-muted-foreground">
                  <Camera className="mx-auto h-16 w-16" />
                  <p className="mt-2">Click "Start Scanning" to open camera</p>
                </div>
              )}

              <video
                ref={videoRef}
                className={cn("w-full h-full object-cover", !isScanning && "hidden")}
                autoPlay
                muted
                playsInline
              />
              <canvas ref={canvasRef} style={{ display: 'none' }} />

              {isScanning && hasCameraPermission === false && (
                <Alert variant="destructive" className="m-4">
                  <VideoOff className="h-4 w-4" />
                  <AlertTitle>Camera Access Required</AlertTitle>
                  <AlertDescription>
                    Please allow camera access in your browser to use this feature.
                  </AlertDescription>
                </Alert>
              )}
            </div>
          </CardContent>
        </Card>
        <Button
          size="lg"
          className="w-full hover:glow"
          onClick={handleStartStopScan}
          disabled={hasCameraPermission === false}
        >
          {isScanning ? <Loader2 className="animate-spin" /> : <QrCode />}
          {isScanning ? "Scanning..." : "Start Scanning"}
        </Button>
      </div>

      <Dialog open={!!scanResult} onOpenChange={(open) => !open && setScanResult(null)}>
        <DialogContent className="glass">
          {scanResult && (
            <>
                <DialogHeader className="text-center items-center">
                    {getResultIcon()}
                    <DialogTitle className="text-2xl font-headline mt-4">
                        {scanResult.status === 'success' && 'Check-in Successful'}
                        {scanResult.status === 'already_scanned' && 'Already Checked In'}
                        {scanResult.status === 'invalid' && 'Invalid Ticket'}
                    </DialogTitle>
                     <DialogDescription>
                        {scanResult.status === 'invalid' ? `QR Code data "${scanResult.ticket.qrCode}" not found.` : `Ticket for ${scanResult.user.name}`}
                    </DialogDescription>
                </DialogHeader>

                {scanResult.status !== 'invalid' && (
                    <div className="py-4 space-y-4">
                         <div className="flex items-center gap-4 p-4 rounded-lg bg-muted/50 border">
                            <Avatar className="h-16 w-16">
                                <AvatarImage src={scanResult.user.profile.avatar} />
                                <AvatarFallback>{scanResult.user.name.charAt(0)}</AvatarFallback>
                            </Avatar>
                            <div className="space-y-1">
                                <p className="font-bold text-lg">{scanResult.user.name}</p>
                                <p className="text-sm text-muted-foreground">{scanResult.user.email}</p>
                            </div>
                        </div>
                        <Card>
                            <CardHeader>
                                <CardTitle className="text-lg flex items-center gap-2"><Ticket /> Ticket Details</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-2 text-sm">
                                <div className="flex justify-between">
                                    <span className="text-muted-foreground">Tier</span>
                                    <span className="font-medium">{scanResult.ticket.tierName}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-muted-foreground">Price</span>
                                    <span className="font-medium">₹{scanResult.ticket.price}</span>
                                </div>
                                 <div className="flex justify-between">
                                    <span className="text-muted-foreground">Status</span>
                                    <span className="font-medium capitalize">{scanResult.ticket.status}</span>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                )}
                
                <DialogFooter>
                    <Button className="w-full" onClick={() => setScanResult(null)}>
                        Scan Next Ticket
                    </Button>
                </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
