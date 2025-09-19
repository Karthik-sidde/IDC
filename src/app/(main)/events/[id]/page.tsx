
"use client";

import Image from 'next/image';
import { notFound, useRouter, usePathname } from 'next/navigation';
import { getMockEvents, mockUsers, addMockTicket, getMockTickets } from '@/lib/mock-data';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import {
  Calendar,
  Clock,
  MapPin,
  Ticket,
  Users,
  Video,
  CreditCard,
  CheckCircle2,
} from 'lucide-react';
import { format } from 'date-fns';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { useState, useContext, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { UserContext } from '@/context/UserContext';
import { type Ticket as TicketType, type Event } from '@/lib/types';
import { LoginDialog } from '@/components/auth/LoginDialog';


export default function EventDetailPage({ params }: { params: { id: string } }) {
  const { user } = useContext(UserContext);
  const { toast } = useToast();
  const router = useRouter();
  const pathname = usePathname();
  
  const [event, setEvent] = useState<Event | undefined>(undefined);
  const [isRegistered, setIsRegistered] = useState(false);
  const [isLoginDialogOpen, setIsLoginDialogOpen] = useState(false);
  const [justLoggedIn, setJustLoggedIn] = useState(false);

  useEffect(() => {
    const foundEvent = getMockEvents().find((e) => e.id === params.id);
    setEvent(foundEvent);
  }, [params.id]);


  useEffect(() => {
    if (user && event) {
      const userTickets = getMockTickets();
      const hasTicket = userTickets.some(ticket => ticket.userId === user.id && ticket.eventId === event.id);
      setIsRegistered(hasTicket);
    } else {
        setIsRegistered(false);
    }
  }, [user, event]);


  if (!event) {
    // To be handled by loading state in a real app, for now it might flash notFound
    const foundEvent = getMockEvents().find((e) => e.id === params.id);
    if (!foundEvent) notFound();
    setEvent(foundEvent);
    return null; // Or a loading spinner
  }
  const organizer = mockUsers.find((u) => u.id === event.organizerId);
  const isFree = event.tickets.some(ticket => ticket.price === 0);

  const handleRegisterClick = () => {
    if (!user) {
        setIsLoginDialogOpen(true);
    } else {
        // If user is logged in and event is not free, go to payment
        if (!isFree) {
            router.push(`/payment?eventId=${event.id}`);
        }
        // If it's free, the AlertDialog will be triggered by the button
    }
  };

  const processFreeRegistration = () => {
    if (!user) return; // Should not happen
    
    const newTicket: TicketType = {
        id: `ticket-${Date.now()}`,
        eventId: event.id,
        userId: user.id,
        price: 0, // Free event
        status: 'confirmed',
        qrCode: `mock-qr-code-${Date.now()}`
    };

    addMockTicket(newTicket);
    setIsRegistered(true);

    toast({
      title: "Registration Successful!",
      description: `You're all set for ${event.title}.`,
      variant: "default",
      className: "bg-green-500 text-white",
    });
  };

  const onLoginSuccess = () => {
    setJustLoggedIn(true);
    toast({
        title: "Logged In!",
        description: "You can now register for the event.",
    });
  }

  const RegisterButton = () => (
     <Button size="lg" className="w-full hover:glow text-lg py-6" disabled={isRegistered && !!user}>
        {isRegistered && !!user ? (
          <>
            <CheckCircle2 className="mr-2 h-5 w-5" />
            Registered
          </>
        ) : (
          <>
            <Ticket className="mr-2 h-5 w-5" />
            Register Now
          </>
        )}
      </Button>
  );

  return (
    <div className="mx-auto max-w-5xl space-y-8">
      {/* Hero Section */}
      <Card className="overflow-hidden glass">
        <div className="relative h-64 w-full md:h-96">
          <Image
            src={event.coverImage}
            alt={event.title}
            fill
            className="object-cover"
            priority
            data-ai-hint="event cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-black/10" />
          <div className="absolute bottom-0 left-0 p-6 md:p-8">
            <h1 className="font-headline text-3xl font-bold text-white md:text-5xl">
              {event.title}
            </h1>
            <Badge className="mt-2 text-base">{event.category}</Badge>
          </div>
        </div>
      </Card>
      
      <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
        {/* Main Content */}
        <div className="md:col-span-2">
            <Tabs defaultValue="overview">
                <TabsList className='w-full'>
                    <TabsTrigger value="overview" className='flex-1'>Overview</TabsTrigger>
                    <TabsTrigger value="schedule" className='flex-1'>Schedule</TabsTrigger>
                    <TabsTrigger value="speakers" className='flex-1'>Speakers</TabsTrigger>
                </TabsList>
                <TabsContent value="overview" className='mt-6 text-foreground/90'>
                    <p className='whitespace-pre-wrap leading-relaxed'>{event.description}</p>
                </TabsContent>
                 <TabsContent value="schedule" className='mt-6'>
                    <p>Event schedule will be displayed here.</p>
                </TabsContent>
                 <TabsContent value="speakers" className='mt-6'>
                    <p>Speaker information will be displayed here.</p>
                </TabsContent>
            </Tabs>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          <Card className="glass">
            <CardHeader>
              <CardTitle className="font-headline">Event Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-sm">
              <div className="flex items-start gap-3">
                <Calendar className="h-5 w-5 flex-shrink-0 text-primary" />
                <div>
                  <p className="font-semibold">{format(event.date, 'eeee, MMMM d, yyyy')}</p>
                  <p className="text-muted-foreground">{format(event.date, 'p')}</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                {event.venue.type === 'online' ? (
                  <Video className="h-5 w-5 flex-shrink-0 text-primary" />
                ) : (
                  <MapPin className="h-5 w-5 flex-shrink-0 text-primary" />
                )}
                 <div>
                    <p className="font-semibold">{event.venue.type === 'online' ? 'Online Event' : event.venue.details}</p>
                    <p className="text-muted-foreground">{event.venue.type === 'online' ? 'Link will be provided upon registration' : 'Venue address'}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="glass">
            <CardHeader>
              <CardTitle className="font-headline">Tickets</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {event.tickets.map((ticket) => (
                <div key={ticket.tier} className="flex justify-between items-center">
                  <span className="font-medium">{ticket.tier}</span>
                  <Badge variant="secondary" className="text-base">
                    {ticket.price === 0 ? 'Free' : `₹${ticket.price.toFixed(2)}`}
                  </Badge>
                </div>
              ))}
            </CardContent>
          </Card>

          {organizer && (
            <Card className="glass">
            <CardHeader>
              <CardTitle className="font-headline">Organizer</CardTitle>
            </CardHeader>
             <CardContent className="flex items-center gap-3">
                <Avatar>
                    <AvatarImage src={organizer.profile.avatar} />
                    <AvatarFallback>{organizer.name.charAt(0)}</AvatarFallback>
                </Avatar>
                <div>
                    <p className="font-semibold">{organizer.name}</p>
                    <p className="text-sm text-muted-foreground">Event Organizer</p>
                </div>
             </CardContent>
            </Card>
          )}

          {user ? (
            isFree ? (
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <RegisterButton />
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Confirm Registration</AlertDialogTitle>
                    <AlertDialogDescription>
                      You are about to register for "{event.title}". This is a free event. Continue?
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction onClick={processFreeRegistration}>
                      Confirm Registration
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            ) : (
               <div onClick={handleRegisterClick}>
                <RegisterButton />
               </div>
            )
          ) : (
             <div onClick={handleRegisterClick}>
                <RegisterButton />
             </div>
          )}
        </div>
      </div>
       <LoginDialog 
        open={isLoginDialogOpen} 
        onOpenChange={setIsLoginDialogOpen}
        onLoginSuccess={onLoginSuccess}
      />
    </div>
  );
}
