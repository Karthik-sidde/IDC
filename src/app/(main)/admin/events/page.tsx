
"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { format, isBefore, isSameDay, addDays, startOfDay } from "date-fns";
import { MoreHorizontal, PlusCircle } from "lucide-react";
import { getMockEvents } from "@/lib/mock-data";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useState, useEffect, useMemo } from "react";
import { type Event } from "@/lib/types";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useToast } from "@/hooks/use-toast";

type EventStatus = "Ongoing" | "Upcoming" | "Past";

export default function AdminEventsPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [events, setEvents] = useState<Event[]>([]);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [eventToDelete, setEventToDelete] = useState<Event | null>(null);

  useEffect(() => {
    setEvents(getMockEvents());
  }, []);

  const getEventStatus = (event: Event): EventStatus => {
    const now = new Date();
    const eventDate = new Date(event.date);
    const today = startOfDay(new Date());

    if (isBefore(eventDate, today)) {
        return "Past";
    }
    
    if (isSameDay(eventDate, now) || (isBefore(eventDate, addDays(now, 2)) && isBefore(now, eventDate))) {
        return "Ongoing";
    }
    
    return "Upcoming";
  };
  
  const sortedEvents = useMemo(() => {
    const statusOrder: Record<EventStatus, number> = {
      "Ongoing": 1,
      "Upcoming": 2,
      "Past": 3,
    };
    return [...events].sort((a, b) => {
        const statusA = getEventStatus(a);
        const statusB = getEventStatus(b);
        if (statusA !== statusB) {
            return statusOrder[statusA] - statusOrder[statusB];
        }
        // For events with same status, sort by date (upcoming soonest, past most recent)
        if(statusA === 'Upcoming') return a.date.getTime() - b.date.getTime();
        return b.date.getTime() - a.date.getTime();
    });
  }, [events]);


  const handleDeleteClick = (event: Event) => {
    setEventToDelete(event);
    setIsDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = () => {
    if (eventToDelete) {
      setEvents(events.filter((event) => event.id !== eventToDelete.id));
      toast({
        title: "Event Deleted",
        description: `"${eventToDelete.title}" has been removed.`,
      });
    }
    setIsDeleteDialogOpen(false);
    setEventToDelete(null);
  };

  return (
    <>
      <Card className="glass">
        <CardHeader>
          <div className="flex justify-between items-start">
            <div>
              <CardTitle className="font-headline">Manage Events</CardTitle>
              <CardDescription>
                Here you can create, edit, and manage all events.
              </CardDescription>
            </div>
            <Link href="/admin/events/new">
              <Button>
                <PlusCircle className="mr-2 h-4 w-4" />
                Create Event
              </Button>
            </Link>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Event</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Venue</TableHead>
                <TableHead>
                  <span className="sr-only">Actions</span>
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {sortedEvents.map((event) => {
                const status = getEventStatus(event);

                return (
                  <TableRow key={event.id}>
                    <TableCell className="font-medium">{event.title}</TableCell>
                    <TableCell>
                      <Badge
                        variant={
                          status === "Past"
                            ? "outline"
                            : status === "Ongoing"
                            ? "destructive"
                            : "secondary"
                        }
                      >
                        {status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {format(new Date(event.date), "MMM d, yyyy, p")}
                    </TableCell>
                    <TableCell>
                      {event.venue.type === "online"
                        ? "Online"
                        : event.venue.details}
                    </TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button
                            aria-haspopup="true"
                            size="icon"
                            variant="ghost"
                          >
                            <MoreHorizontal className="h-4 w-4" />
                            <span className="sr-only">Toggle menu</span>
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuLabel>Actions</DropdownMenuLabel>
                          <DropdownMenuItem
                            onSelect={() => router.push("/admin/events/new")}
                            disabled={status === 'Past' || status === 'Ongoing'}
                          >
                            Edit
                          </DropdownMenuItem>
                          <DropdownMenuItem disabled>
                            View Attendees
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            className="text-destructive focus:text-destructive focus:bg-destructive/10"
                            onSelect={() => handleDeleteClick(event)}
                          >
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
      
      <AlertDialog
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
      >
        <AlertDialogContent className="glass">
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the
              event "{eventToDelete?.title}".
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteConfirm}>
              Yes, Delete Event
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
