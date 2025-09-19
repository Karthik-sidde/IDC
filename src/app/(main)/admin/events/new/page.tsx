import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";

export default function NewEventPage() {
  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold font-headline">Create a New Event</h1>
        <p className="text-muted-foreground">
          Fill out the details below to publish a new event.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Event Details</CardTitle>
          <CardDescription>
            Provide the main information about your event.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">Event Title</Label>
            <Input id="title" placeholder="e.g., Annual Tech Conference" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              placeholder="Describe your event in a few words."
            />
          </div>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="space-y-2">
                <Label htmlFor="category">Category</Label>
                <Select>
                    <SelectTrigger id="category">
                        <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="tech">Tech</SelectItem>
                        <SelectItem value="music">Music</SelectItem>
                        <SelectItem value="arts">Arts</SelectItem>
                        <SelectItem value="business">Business</SelectItem>
                        <SelectItem value="lifestyle">Lifestyle</SelectItem>
                        <SelectItem value="food">Food</SelectItem>
                    </SelectContent>
                </Select>
            </div>
            <div className="space-y-2">
                <Label htmlFor="date">Date & Time</Label>
                <Input id="date" type="datetime-local" />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Venue & Ticketing</CardTitle>
          <CardDescription>
            Specify where the event will take place and ticket details.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="space-y-2">
                <Label htmlFor="venue-type">Venue Type</Label>
                <Select>
                    <SelectTrigger id="venue-type">
                        <SelectValue placeholder="Select venue type" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="physical">Physical</SelectItem>
                        <SelectItem value="online">Online</SelectItem>
                    </SelectContent>
                </Select>
            </div>
            <div className="space-y-2">
                <Label htmlFor="venue-details">Venue Details</Label>
                <Input id="venue-details" placeholder="e.g., Convention Center or Zoom Link" />
            </div>
           </div>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                <div className="space-y-2">
                    <Label htmlFor="ticket-tier">Ticket Tier</Label>
                    <Input id="ticket-tier" placeholder="e.g., General Admission" defaultValue="General Admission"/>
                </div>
                 <div className="space-y-2">
                    <Label htmlFor="ticket-price">Price (₹)</Label>
                    <Input id="ticket-price" type="number" placeholder="e.g., 25" />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="ticket-quantity">Quantity</Label>
                    <Input id="ticket-quantity" type="number" placeholder="e.g., 500" />
                </div>
           </div>
        </CardContent>
      </Card>

      <div className="flex justify-end gap-2">
        <Button variant="outline">Save Draft</Button>
        <Button className="hover:glow">Publish Event</Button>
      </div>
    </div>
  );
}
