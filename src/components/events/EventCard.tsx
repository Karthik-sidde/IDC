import Link from "next/link";
import Image from "next/image";
import { format } from "date-fns";
import {
  ArrowRight,
  Calendar,
  MapPin,
  Ticket,
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

interface EventCardProps {
  event: Event;
}

export function EventCard({ event }: EventCardProps) {
  const isFree = event.tickets.some((t) => t.price === 0);

  return (
    <Link href={`/events/${event.id}`}>
      <Card className="group relative flex h-full flex-col overflow-hidden transition-all hover:shadow-2xl hover:-translate-y-1">
        <CardHeader className="p-0">
          <div className="relative h-48 w-full">
            <Image
              src={event.coverImage}
              alt={event.title}
              fill
              className="object-cover transition-transform duration-300 group-hover:scale-105"
              data-ai-hint="event cover"
            />
             <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
            <Badge
              variant={isFree ? "secondary" : "destructive"}
              className="absolute right-2 top-2"
            >
              {isFree ? "Free" : `$${event.tickets[0].price}`}
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
            <Button variant="outline" className="w-full">
                <span>View Details</span>
                <ArrowRight className="transition-transform group-hover:translate-x-1" />
            </Button>
        </CardFooter>
      </Card>
    </Link>
  );
}
