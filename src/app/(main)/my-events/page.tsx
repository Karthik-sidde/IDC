"use client";

import { getMockTickets, mockEvents } from '@/lib/mock-data';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Ticket, Calendar, Clock, ArrowRight, User, Mail, QrCode } from 'lucide-react';
import { format } from 'date-fns';
import Image from 'next/image';
import Link from 'next/link';
import { useContext, useMemo, useState } from 'react';
import { UserContext } from '@/context/UserContext';
import { type Event, type Ticket as TicketType } from '@/lib/types';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Separator } from '@/components/ui/separator';

export default function MyEventsPage() {
  const { user } = useContext(UserContext);
  const [selectedTicket, setSelectedTicket] = useState<{event: Event, ticket: TicketType} | null>(null);

  const { upcomingEvents, pastEvents, userTickets } = useMemo(() => {
    if (!user) return { upcomingEvents: [], pastEvents: [], userTickets: [] };

    const tickets = getMockTickets().filter((t) => t.userId === user.id);
    
    const eventsWithTickets = tickets.map((ticket) => {
        const event = mockEvents.find((e) => e.id === ticket.eventId);
        return event ? { event, ticket } : null;
    }).filter((item): item is { event: Event, ticket: TicketType } => item !== null);

    const upcoming = eventsWithTickets.filter(({ event }) => event.date >= new Date());
    const past = eventsWithTickets.filter(({ event }) => event.date < new Date());
    
    return { upcomingEvents: upcoming, pastEvents: past, userTickets: tickets };
  }, [user]);

  const EventTicketCard = ({ event, ticket }: { event: Event, ticket: TicketType }) => (
    <Card className="overflow-hidden transition-shadow hover:shadow-lg glass">
      <div className="flex flex-col sm:flex-row">
        <div className="relative h-40 w-full sm:w-48 flex-shrink-0">
          <Image
            src={event.coverImage}
            alt={event.title}
            fill
            className="object-cover"
            data-ai-hint="event cover"
          />
        </div>
        <div className="flex flex-1 flex-col">
            <CardHeader>
                <CardTitle className="font-headline text-xl">{event.title}</CardTitle>
                <CardDescription className="flex items-center gap-2 pt-1">
                    <Calendar className="h-4 w-4" />
                    {format(event.date, 'EEE, MMM d, yyyy')}
                    <Clock className="ml-2 h-4 w-4" />
                    {format(event.date, 'p')}
                </CardDescription>
            </CardHeader>
            <CardFooter className="mt-auto pt-0 px-6 pb-4">
                <div className='flex w-full justify-end gap-2'>
                    <Button variant="ghost" onClick={() => setSelectedTicket({event, ticket})}>
                        <Ticket className="mr-2 h-4 w-4" />
                        View Ticket
                    </Button>
                    <Link href={`/events/${event.id}`}>
                        <Button>
                            View Event
                            <ArrowRight className="ml-2 h-4 w-4" />
                        </Button>
                    </Link>
                </div>
            </CardFooter>
        </div>
      </div>
    </Card>
  );

  if (!user) {
    return (
        <div className="text-center text-muted-foreground py-8">
            Please log in to see your events.
        </div>
    )
  }

  return (
    <>
      <div className="space-y-6">
        <Tabs defaultValue="upcoming" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="upcoming">Upcoming Events</TabsTrigger>
            <TabsTrigger value="past">Past Events</TabsTrigger>
          </TabsList>
          <TabsContent value="upcoming" className="mt-6">
            <div className="space-y-4">
              {upcomingEvents.length > 0 ? (
                upcomingEvents.map(
                  ({event, ticket}) => event && <EventTicketCard key={event.id} event={event} ticket={ticket} />
                )
              ) : (
                <p className='text-center text-muted-foreground py-8'>You have no upcoming events.</p>
              )}
            </div>
          </TabsContent>
          <TabsContent value="past" className="mt-6">
            <div className="space-y-4">
              {pastEvents.length > 0 ? (
                pastEvents.map(
                  ({event, ticket}) => event && <EventTicketCard key={event.id} event={event} ticket={ticket} />
                )
              ) : (
                <p className='text-center text-muted-foreground py-8'>You have no past events.</p>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </div>
      
      {selectedTicket && (
        <Dialog open={!!selectedTicket} onOpenChange={() => setSelectedTicket(null)}>
          <DialogContent className="sm:max-w-md glass">
            <DialogHeader>
              <DialogTitle className="font-headline text-2xl flex items-center gap-2">
                <Ticket className="text-primary"/>
                {selectedTicket.event.title}
              </DialogTitle>
              <DialogDescription>
                This is your official ticket. Present this at the event for entry.
              </DialogDescription>
            </DialogHeader>
            <div className="py-4 space-y-4">
              <div className='p-6 border rounded-lg bg-muted/30 flex flex-col items-center justify-center gap-4'>
                 <QrCode className="h-40 w-40 text-foreground" />
                 <p className="text-sm text-muted-foreground font-mono">{selectedTicket.ticket.qrCode}</p>
              </div>
              <Separator />
              <div className="space-y-3 text-sm">
                <div className="flex items-center gap-3">
                  <User className="h-4 w-4 text-muted-foreground" />
                  <span className="font-medium">{user.name}</span>
                </div>
                <div className="flex items-center gap-3">
                  <Mail className="h-4 w-4 text-muted-foreground" />
                  <span className="font-medium">{user.email}</span>
                </div>
                 <div className="flex items-center gap-3">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <span className="font-medium">{format(selectedTicket.event.date, 'EEEE, MMMM d, yyyy - p')}</span>
                </div>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </>
  );
}
