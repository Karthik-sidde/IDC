
"use client";

import { useState, useEffect, useContext } from "react";
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
import { format } from "date-fns";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { UserContext } from "@/context/UserContext";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { ShieldAlert, Loader2 } from "lucide-react";
import { generateEventImage } from "@/ai/flows/generate-event-image";

export default function NewEventPage() {
  const router = useRouter();
  const { user } = useContext(UserContext);
  const { toast } = useToast();
  const [title, setTitle] = useState("My Awesome Event");
  const [description, setDescription] = useState("This is a description of my awesome event.");
  const [chapter, setChapter] = useState("Bangalore");
  const [date, setDate] = useState(format(new Date(), "yyyy-MM-dd'T'HH:mm"));
  const [venueType, setVenueType] = useState<"physical" | "online">("physical");
  const [venueDetails, setVenueDetails] = useState("Some place cool");
  const [ticketTier, setTicketTier] = useState("General Admission");
  const [ticketPrice, setTicketPrice] = useState(0);
  const [ticketQuantity, setTicketQuantity] = useState(100);
  const [eventType, setEventType] = useState<"free" | "paid">("paid");
  const [isPublishing, setIsPublishing] = useState(false);
  
  const canCreateEvent = user?.role.includes('admin') || (user?.role === 'speaker' && user?.verificationStatus === 'approved');

  useEffect(() => {
    if (eventType === "free") {
      setTicketPrice(0);
    } else {
      if (ticketPrice === 0) {
        setTicketPrice(10);
      }
    }
  }, [eventType, ticketPrice]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !canCreateEvent) return;

    setIsPublishing(true);
    toast({
        title: "Generating Event Art...",
        description: "Our AI is creating a custom cover image for your event. Please wait.",
    });

    let coverImage;
    try {
        const imagePrompt = `${title}: ${description}`;
        coverImage = await generateEventImage(imagePrompt);
    } catch (error) {
        console.error("Failed to generate event image:", error);
        toast({
            variant: "destructive",
            title: "Image Generation Failed",
            description: "Using a default image. You can edit the event later.",
        });
        coverImage = `https://picsum.photos/seed/event${Date.now()}/600/400`;
    }


    const newEvent: Event = {
      id: `event-${Date.now()}`,
      title,
      description,
      chapter,
      date: new Date(date),
      venue: {
        type: venueType,
        details: venueDetails,
      },
      tickets: [
        {
          tier: ticketTier,
          price: eventType === 'free' ? 0 : Number(ticketPrice),
          quantity: Number(ticketQuantity),
        },
      ],
      organizerId: user.id,
      coverImage: coverImage,
      speakers: [],
    };

    addMockEvent(newEvent);
    setIsPublishing(false);

    toast({
      title: "Event Published!",
      description: `"${newEvent.title}" has been successfully created.`,
    });

    router.push("/admin/events");
  };
  
  if (!canCreateEvent) {
    return (
        <div className="mx-auto max-w-3xl space-y-6">
             <Alert variant="destructive">
                <ShieldAlert className="h-4 w-4" />
                <AlertTitle>Access Denied</AlertTitle>
                <AlertDescription>
                    {user?.role === 'speaker' && user?.verificationStatus === 'pending'
                    ? 'Your speaker application is under review. You can create events once you are approved.'
                    : 'You do not have permission to create events.'}
                </AlertDescription>
            </Alert>
        </div>
    )
  }

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
              disabled={isPublishing}
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
              disabled={isPublishing}
            />
          </div>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="chapter">Chapter</Label>
              <Select
                onValueChange={(value) => setChapter(value)}
                value={chapter}
                required
                disabled={isPublishing}
              >
                <SelectTrigger id="chapter">
                  <SelectValue placeholder="Select chapter" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Bangalore">Bangalore</SelectItem>
                  <SelectItem value="Hyderabad">Hyderabad</SelectItem>
                  <SelectItem value="Mumbai">Mumbai</SelectItem>
                  <SelectItem value="Other">Other</SelectItem>
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
                disabled={isPublishing}
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
                disabled={isPublishing}
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
                disabled={isPublishing}
              />
            </div>
          </div>
          
           <div className="space-y-2">
              <Label>Event Type</Label>
              <RadioGroup
                defaultValue={eventType}
                onValueChange={(value) => setEventType(value as 'free' | 'paid')}
                className="flex items-center gap-4"
                disabled={isPublishing}
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="paid" id="r-paid" />
                  <Label htmlFor="r-paid">Paid</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="free" id="r-free" />
                  <Label htmlFor="r-free">Free</Label>
                </div>
              </RadioGroup>
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
                disabled={isPublishing}
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
                disabled={eventType === "free" || isPublishing}
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
                disabled={isPublishing}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-end gap-2">
        <Button variant="outline" type="button" onClick={() => router.back()} disabled={isPublishing}>Cancel</Button>
        <Button type="submit" className="hover:glow" disabled={isPublishing}>
            {isPublishing ? <Loader2 className="animate-spin" /> : null}
            {isPublishing ? "Publishing..." : "Publish Event"}
        </Button>
      </div>
    </form>
  );
}
