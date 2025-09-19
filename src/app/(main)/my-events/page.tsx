import { mockTickets, mockEvents } from '@/lib/mock-data';
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
import { Ticket, Calendar, Clock, ArrowRight } from 'lucide-react';
import { format } from 'date-fns';
import Image from 'next/image';
import Link from 'next/link';

export default function MyEventsPage() {
  // Assuming a logged-in user with id 'user-1'
  const userId = 'user-1';
  const userTickets = mockTickets.filter((t) => t.userId === userId);
  const upcomingEvents = userTickets
    .map((ticket) => mockEvents.find((e) => e.id === ticket.eventId))
    .filter((event) => event && event.date >= new Date());
  const pastEvents = userTickets
    .map((ticket) => mockEvents.find((e) => e.id === ticket.eventId))
    .filter((event) => event && event.date < new Date());

  const EventTicketCard = ({ event }: { event: any }) => (
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
                    <Button variant="ghost">
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

  return (
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
                (event) => event && <EventTicketCard key={event.id} event={event} />
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
                (event) => event && <EventTicketCard key={event.id} event={event} />
              )
            ) : (
              <p className='text-center text-muted-foreground py-8'>You have no past events.</p>
            )}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}

    