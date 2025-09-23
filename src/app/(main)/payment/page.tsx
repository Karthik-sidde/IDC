

"use client";

import { Suspense } from 'react';
import { useSearchParams, useRouter, notFound } from 'next/navigation';
import { useState, useContext, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { CreditCard, Lock, Loader2, CheckCircle } from 'lucide-react';
import { getMockEvents, addMockTicket } from '@/lib/mock-data';
import { UserContext } from '@/context/UserContext';
import { useToast } from '@/hooks/use-toast';
import { type Ticket, type Event } from '@/lib/types';
import { Separator } from '@/components/ui/separator';

function PaymentPageContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { user } = useContext(UserContext);
  const { toast } = useToast();

  const [isLoading, setIsLoading] = useState(false);
  const [isPaid, setIsPaid] = useState(false);
  const [event, setEvent] = useState<Event | undefined>(undefined);
  const [tierName, setTierName] = useState<string | null>(null);
  
  const eventId = searchParams.get('eventId');

  useEffect(() => {
    if (eventId) {
      const foundEvent = getMockEvents().find(e => e.id === eventId);
      if (foundEvent) {
          setEvent(foundEvent);
          setTierName(searchParams.get('tier'));
      } else {
          notFound();
      }
    }
  }, [eventId, searchParams]);

  useEffect(() => {
    if (!user) {
      router.push('/login');
    }
  }, [user, router]);
  
  if (!eventId || !event || !tierName) {
    return null; // Or a loading spinner
  }

  const ticketInfo = event.tickets.find(t => t.tier === tierName);

  if (!ticketInfo) {
      notFound();
      return null;
  }

  const handlePayment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    setIsLoading(true);
    // Simulate payment processing
    setTimeout(() => {
        const newTicket: Ticket = {
            id: `ticket-${Date.now()}`,
            eventId: event.id,
            userId: user.id,
            tierName: ticketInfo.tier,
            price: ticketInfo.price,
            status: 'confirmed',
            qrCode: `mock-qr-code-${Date.now()}`
        };

        addMockTicket(newTicket);
        setIsLoading(false);
        setIsPaid(true);

        toast({
          title: "Payment Successful!",
          description: `You're all set for ${event.title}.`,
          className: "bg-green-500 text-white",
        });

    }, 2000);
  };

  if (isPaid) {
    return (
         <Card className="w-full max-w-md glass">
            <CardHeader className="text-center">
                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-green-100 dark:bg-green-900">
                    <CheckCircle className="h-8 w-8 text-green-600 dark:text-green-400" />
                </div>
                <CardTitle className="mt-4">Payment Successful</CardTitle>
                <CardDescription>Your ticket for {event.title} has been confirmed.</CardDescription>
            </CardHeader>
            <CardContent>
                <div className="rounded-lg border bg-muted/30 p-4 text-sm">
                    <div className="flex justify-between">
                        <span className="text-muted-foreground">Event</span>
                        <span className="font-medium">{event.title}</span>
                    </div>
                     <Separator className="my-2" />
                    <div className="flex justify-between">
                        <span className="text-muted-foreground">Ticket</span>
                         <span className="font-medium">{ticketInfo.tier}</span>
                    </div>
                    <Separator className="my-2" />
                    <div className="flex justify-between font-bold text-base">
                        <span>Total Paid</span>
                        <span>₹{ticketInfo.price.toFixed(2)}</span>
                    </div>
                </div>
            </CardContent>
            <CardFooter className="flex-col gap-3">
                 <Button className="w-full" onClick={() => router.push('/my-events')}>View My Tickets</Button>
                 <Button variant="outline" className="w-full" onClick={() => router.push('/events')}>Explore More Events</Button>
            </CardFooter>
        </Card>
    );
  }

  return (
    <div className="mx-auto max-w-4xl space-y-8">
        <div>
            <h1 className="text-2xl font-bold font-headline">Complete Your Purchase</h1>
            <p className="text-muted-foreground">
              Secure your spot for "{event.title}".
            </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <Card className="glass">
                <CardHeader>
                    <CardTitle>Order Summary</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="flex justify-between">
                        <span className="text-muted-foreground">{ticketInfo.tier} (x1)</span>
                        <span>₹{ticketInfo.price.toFixed(2)}</span>
                    </div>
                     <Separator />
                    <div className="flex justify-between text-lg font-bold">
                        <span>Total</span>
                        <span>₹{ticketInfo.price.toFixed(2)}</span>
                    </div>
                </CardContent>
            </Card>

            <Card className="glass">
              <form onSubmit={handlePayment}>
                <CardHeader>
                    <CardTitle>Payment Details</CardTitle>
                    <CardDescription>Enter your card information. This is a simulated payment.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="card-number">Card Number</Label>
                        <div className="relative">
                            <CreditCard className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                            <Input id="card-number" placeholder="**** **** **** 1234" className="pl-10" />
                        </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                         <div className="space-y-2">
                            <Label htmlFor="expiry">Expiry</Label>
                            <Input id="expiry" placeholder="MM/YY" />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="cvc">CVC</Label>
                            <Input id="cvc" placeholder="123" />
                        </div>
                    </div>
                     <div className="space-y-2">
                        <Label htmlFor="name-on-card">Name on Card</Label>
                        <Input id="name-on-card" defaultValue={user?.name} />
                    </div>
                </CardContent>
                <CardFooter>
                    <Button type="submit" className="w-full hover:glow" disabled={isLoading}>
                        {isLoading ? <Loader2 className="animate-spin" /> : <Lock />}
                        <span>{isLoading ? 'Processing...' : `Pay ₹${ticketInfo.price.toFixed(2)}`}</span>
                    </Button>
                </CardFooter>
              </form>
            </Card>
        </div>
    </div>
  )
}

export default function PaymentPage() {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <PaymentPageContent />
        </Suspense>
    )
}
