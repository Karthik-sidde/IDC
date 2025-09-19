import Link from "next/link";
import { format } from "date-fns";
import { MoreHorizontal, PlusCircle } from "lucide-react";
import { mockEvents } from "@/lib/mock-data";
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

export default function AdminEventsPage() {
  return (
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
            {mockEvents.map((event) => {
              const now = new Date();
              const eventDate = event.date;
              const status =
                eventDate < now
                  ? "Past"
                  : eventDate > now && eventDate < new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000)
                  ? "Ongoing"
                  : "Upcoming";

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
                    {format(event.date, "MMM d, yyyy, p")}
                  </TableCell>
                  <TableCell>
                    {event.venue.type === 'online' ? 'Online' : event.venue.details}
                    </TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button aria-haspopup="true" size="icon" variant="ghost">
                          <MoreHorizontal className="h-4 w-4" />
                          <span className="sr-only">Toggle menu</span>
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                        <DropdownMenuItem>Edit</DropdownMenuItem>
                        <DropdownMenuItem>View Attendees</DropdownMenuItem>
                        <DropdownMenuItem className="text-destructive focus:text-destructive focus:bg-destructive/10">Delete</DropdownMenuItem>
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
  );
}

    