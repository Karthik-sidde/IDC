

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
  Linkedin,
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
import { type Ticket as TicketType, type Event, type User, type Speaker } from '@/lib/types';
import { LoginDialog } from '@/components/auth/LoginDialog';
import Link from 'next/link';

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


const SpeakerCard = ({ speaker }: { speaker: Speaker }) => (
    <Card className="glass">
        <CardContent className="p-6">
            <div className="flex flex-col sm:flex-row items-center gap-6">
                <Avatar className="h-24 w-24 border-2 border-primary">
                    <AvatarImage src={speaker.avatar} alt={speaker.name} />
                    <AvatarFallback>{speaker.name.charAt(0)}</AvatarFallback>
                </Avatar>
                <div className="flex-1 text-center sm:text-left">
                    <h3 className="text-xl font-bold font-headline">{speaker.name}</h3>
                    <p className="text-primary font-medium">{speaker.title}</p>
                    <div className="flex justify-center sm:justify-start gap-3 mt-2">
                        {speaker.social.x && (
                            <Link href={speaker.social.x} target="_blank" rel="noreferrer">
                                <Button variant="ghost" size="icon" className="h-8 w-8">
                                    <XIcon className="h-4 w-4" />
                                </Button>
                            </Link>
                        )}
                        {speaker.social.linkedin && (
                            <Link href={speaker.social.linkedin} target="_blank" rel="noreferrer">
                                <Button variant="ghost" size="icon" className="h-8 w-8">
                                    <Linkedin className="h-4 w-4" />
                                </Button>
                            </Link>
                        )}
                    </div>
                </div>
            </div>
            <p className="mt-4 text-sm text-muted-foreground leading-relaxed">{speaker.bio}</p>
        </CardContent>
    </Card>
);


export default function EventDetailPage({ params }: { params: { id: string } }) {
  const { user } = useContext(UserContext);
  const { toast } = useToast();
  const router = useRouter();
  const pathname = usePathname();
  
  const [event, setEvent] = useState<Event | undefined>(undefined);
  const [isRegistered, setIsRegistered] = useState(false);
  const [attendees, setAttendees] = useState<User[]>([]);
  const [isLoginDialogOpen, setIsLoginDialogOpen] = useState(false);
  const [justLoggedIn, setJustLoggedIn] = useState(false);

  useEffect(() => {
    const foundEvent = getMockEvents().find((e) => e.id === params.id);
    setEvent(foundEvent);
  }, [params.id]);


  useEffect(() => {
    if (event) {
        const userTickets = getMockTickets().filter(ticket => ticket.eventId === event.id);
        const attendeeUsers = mockUsers.filter(u => userTickets.some(ticket => ticket.userId === u.id));
        setAttendees(attendeeUsers);

        if (user) {
            const hasTicket = userTickets.some(ticket => ticket.userId === user.id);
            setIsRegistered(hasTicket);
        } else {
            setIsRegistered(false);
        }
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
        sessionStorage.setItem('redirectAfterLogin', pathname);
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
    setAttendees([...attendees, user]);

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

  const MAX_DISPLAY_ATTENDEES = 7;
  const remainingAttendees = attendees.length > MAX_DISPLAY_ATTENDEES ? attendees.length - MAX_DISPLAY_ATTENDEES : 0;

  const defaultTab = event.speakers.length > 0 ? "speakers" : "overview";


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
            <Badge className="mt-2 text-base">{event.chapter} Chapter</Badge>
          </div>
        </div>
      </Card>
      
      <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
        {/* Main Content */}
        <div className="md:col-span-2">
            <Tabs defaultValue={defaultTab}>
                <TabsList className='w-full'>
                    <TabsTrigger value="overview" className='flex-1'>About</TabsTrigger>
                    {event.speakers.length > 0 && <TabsTrigger value="speakers" className='flex-1'>Speakers</TabsTrigger>}
                    <TabsTrigger value="attendees" className='flex-1'>Attendees ({attendees.length})</TabsTrigger>
                </TabsList>
                <TabsContent value="overview" className='mt-6 text-foreground/90 prose dark:prose-invert max-w-none'>
                    <p className='whitespace-pre-wrap leading-relaxed'>{event.description}</p>
                </TabsContent>
                 <TabsContent value="speakers" className='mt-6 space-y-6'>
                    {event.speakers.length > 0 ? (
                        event.speakers.map(speaker => <SpeakerCard key={speaker.id} speaker={speaker} />)
                    ) : (
                        <p className="text-muted-foreground text-center py-4">Speaker information will be announced soon.</p>
                    )}
                </TabsContent>
                <TabsContent value="attendees" className='mt-6'>
                    {attendees.length > 0 ? (
                        <div className="flex flex-wrap items-center gap-4">
                            {attendees.map(attendee => (
                               <div key={attendee.id} className="flex flex-col items-center gap-2 text-center">
                                    <Avatar className="h-16 w-16 border-2 border-primary">
                                        <AvatarImage src={attendee.profile.avatar} alt={attendee.name} />
                                        <AvatarFallback>{attendee.name.charAt(0)}</AvatarFallback>
                                    </Avatar>
                                    <span className="text-sm font-medium">{attendee.name}</span>
                               </div>
                            ))}
                        </div>
                    ) : (
                        <p className="text-muted-foreground text-center py-4">No attendees have registered yet. Be the first!</p>
                    )}
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
                <AlertDialogContent className='glass'>
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
