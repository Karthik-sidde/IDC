
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
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
import { useToast } from "@/hooks/use-toast";
import { addMockEvent } from "@/lib/mock-data";
import { type Event } from "@/lib/types";

export default function NewEventPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [date, setDate] = useState("");
  const [venueType, setVenueType] = useState<"physical" | "online">("physical");
  const [venueDetails, setVenueDetails] = useState("");
  const [ticketTier, setTicketTier] = useState("General Admission");
  const [ticketPrice, setTicketPrice] = useState(0);
  const [ticketQuantity, setTicketQuantity] = useState(100);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const newEvent: Event = {
      id: `event-${Date.now()}`,
      title,
      description,
      category,
      date: new Date(date),
      venue: {
        type: venueType,
        details: venueDetails,
      },
      tickets: [
        {
          tier: ticketTier,
          price: Number(ticketPrice),
          quantity: Number(ticketQuantity),
        },
      ],
      organizerId: "admin-1", // Assuming current admin is the organizer
      coverImage: `https://picsum.photos/seed/event${Date.now()}/600/400`,
    };

    addMockEvent(newEvent);

    toast({
      title: "Event Published!",
      description: `"${newEvent.title}" has been successfully created.`,
    });

    router.push("/admin/events");
  };

  return (
    <form onSubmit={handleSubmit} className="mx-auto max-w-3xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold font-headline">Create a New Event</h1>
        <p className="text-muted-foreground">
          Fill out the details below to publish a new event.
        </p>
      </div>

      <Card className="glass">
        <CardHeader>
          <CardTitle>Event Details</CardTitle>
          <CardDescription>
            Provide the main information about your event.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">Event Title</Label>
            <Input
              id="title"
              placeholder="e.g., Annual Tech Conference"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              placeholder="Describe your event in a few words."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
            />
          </div>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="category">Category</Label>
              <Select
                onValueChange={(value) => setCategory(value)}
                value={category}
                required
              >
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
              <Input
                id="date"
                type="datetime-local"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                required
              />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="glass">
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
              <Select
                onValueChange={(value) => setVenueType(value as "physical" | "online")}
                value={venueType}
              >
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
              <Input
                id="venue-details"
                placeholder="e.g., Convention Center or Zoom Link"
                value={venueDetails}
                onChange={(e) => setVenueDetails(e.target.value)}
                required
              />
            </div>
          </div>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            <div className="space-y-2">
              <Label htmlFor="ticket-tier">Ticket Tier</Label>
              <Input
                id="ticket-tier"
                placeholder="e.g., General Admission"
                value={ticketTier}
                onChange={(e) => setTicketTier(e.target.value)}
                defaultValue="General Admission"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="ticket-price">Price (₹)</Label>
              <Input
                id="ticket-price"
                type="number"
                placeholder="e.g., 25"
                value={ticketPrice}
                onChange={(e) => setTicketPrice(Number(e.target.value))}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="ticket-quantity">Quantity</Label>
              <Input
                id="ticket-quantity"
                type="number"
                placeholder="e.g., 500"
                value={ticketQuantity}
                onChange={(e) => setTicketQuantity(Number(e.target.value))}
                required
              />
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-end gap-2">
        <Button variant="outline" type="button" onClick={() => router.back()}>Cancel</Button>
        <Button type="submit" className="hover:glow">Publish Event</Button>
      </div>
    </form>
  );
}
