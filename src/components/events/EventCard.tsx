
import Link from "next/link";
import Image from "next/image";
import { format, isBefore, addHours, isWithinInterval, startOfToday, isSameDay, addDays } from "date-fns";
import {
  ArrowRight,
  Calendar,
  MapPin,
  Ban,
} from "lucide-react";
import { type Event } from "@/lib/types";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Button } from "../ui/button";
import { cn } from "@/lib/utils";

interface EventCardProps {
  event: Event;
}

export function EventCard({ event }: EventCardProps) {
  const isFree = event.tickets.some((t) => t.price === 0);
  const now = new Date();
  const eventDate = new Date(event.date);
  
  const isPast = isBefore(eventDate, now);
  const isOngoing = !isPast && isBefore(eventDate, addDays(now, 2));


  const cardContent = (
    <Card className={cn(
        "group relative flex h-full flex-col overflow-hidden transition-all hover:shadow-2xl hover:-translate-y-1 glass",
        isPast && "opacity-60 grayscale hover:shadow-lg hover:-translate-y-0 cursor-not-allowed"
    )}>
        <CardHeader className="p-0">
          <div className="relative h-48 w-full">
            <Image
              src={event.coverImage}
              alt={event.title}
              fill
              className={cn(
                  "object-cover transition-transform duration-300",
                  !isPast && "group-hover:scale-105"
              )}
              data-ai-hint="event cover"
            />
             <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
             
             {isOngoing && (
                <Badge
                    variant="destructive"
                    className="absolute left-2 top-2 animate-pulse"
                >
                    Ongoing
                </Badge>
             )}

            <Badge
              variant={isFree ? "secondary" : "destructive"}
              className="absolute right-2 top-2"
            >
              {isFree ? "Free" : `₹${event.tickets[0].price}`}
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="flex flex-1 flex-col p-4">
            <h3 className="font-headline text-lg font-semibold leading-tight tracking-tight">
                {event.title}
            </h3>
            <div className="mt-2 flex items-center gap-2 text-sm text-muted-foreground">
                <Calendar className="h-4 w-4" />
                <span>{format(event.date, "MMM d, yyyy")}</span>
            </div>
            <div className="mt-1 flex items-center gap-2 text-sm text-muted-foreground">
                <MapPin className="h-4 w-4" />
                <span>{event.venue.type === 'online' ? 'Online' : event.venue.details}</span>
            </div>
            <p className="mt-3 flex-1 text-sm text-muted-foreground line-clamp-2">
                {event.description}
            </p>
        </CardContent>
        <CardFooter className="p-4 pt-0">
            {isPast ? (
                 <Button variant="outline" className="w-full" disabled>
                    <Ban />
                    <span>Bookings Closed</span>
                </Button>
            ) : (
                <Button variant="outline" className="w-full">
                    <span>View Details</span>
                    <ArrowRight className="transition-transform group-hover:translate-x-1" />
                </Button>
            )}
        </CardFooter>
      </Card>
  );

  if (isPast) {
    return <div>{cardContent}</div>;
  }

  return (
    <Link href={`/events/${event.id}`}>
      {cardContent}
    </Link>
  );
}
