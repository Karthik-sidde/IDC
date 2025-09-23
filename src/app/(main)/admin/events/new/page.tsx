

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
import { addMockEvent, mockSpeakers } from "@/lib/mock-data";
import { type Event, type Speaker } from "@/lib/types";
import { format } from "date-fns";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { UserContext } from "@/context/UserContext";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { ShieldAlert, Loader2, Wand2, Upload, Users, Check, ChevronsUpDown, Map } from "lucide-react";
import Image from "next/image";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { ImageDropzone } from "@/components/ImageDropzone";

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
  const [googleMapsLink, setGoogleMapsLink] = useState("");
  const [ticketTier, setTicketTier] = useState("General Admission");
  const [ticketPrice, setTicketPrice] = useState(0);
  const [venueCapacity, setVenueCapacity] = useState(100);
  const [eventType, setEventType] = useState<"free" | "paid">("paid");
  const [isPublishing, setIsPublishing] = useState(false);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [selectedSpeakers, setSelectedSpeakers] = useState<Speaker[]>([]);
  
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
  
  useEffect(() => {
    if (venueType === 'online') {
      setVenueCapacity(Infinity);
      setGoogleMapsLink(""); // Clear maps link for online events
    } else {
      if (venueCapacity === Infinity) {
        setVenueCapacity(100); // Reset to a default value
      }
    }
  }, [venueType, venueCapacity]);

  const handleFileChange = (file: File | null) => {
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    } else {
      setImagePreview(null);
    }
  };


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !canCreateEvent) return;

    setIsPublishing(true);
    
    let finalCoverImage = `https://picsum.photos/seed/event${Date.now()}/600/400`;

    if (imagePreview) {
        finalCoverImage = imagePreview;
         toast({
            title: "Processing Upload...",
            description: "Your custom image is being saved.",
        });
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
        googleMapsLink: venueType === 'physical' ? googleMapsLink : undefined,
      },
      capacity: venueType === 'online' ? Infinity : venueCapacity,
      tickets: [
        {
          tier: ticketTier,
          price: eventType === 'free' ? 0 : Number(ticketPrice),
        },
      ],
      organizerId: user.id,
      coverImage: finalCoverImage,
      speakers: selectedSpeakers,
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
          <CardTitle>Speakers</CardTitle>
          <CardDescription>Select the speakers for this event.</CardDescription>
        </CardHeader>
        <CardContent>
           <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                size="lg"
                className="w-full justify-between"
                disabled={isPublishing}
              >
                <div className="flex gap-1 items-center">
                  <Users className="h-4 w-4" />
                  Select Speakers
                  {selectedSpeakers.length > 0 && <Badge variant="secondary" className="ml-2">{selectedSpeakers.length}</Badge>}
                </div>
                <ChevronsUpDown className="h-4 w-4 shrink-0 opacity-50" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-[--radix-popover-trigger-width] p-0" align="start">
              <Command>
                <CommandInput placeholder="Search speakers..." />
                <CommandList>
                  <CommandEmpty>No speakers found.</CommandEmpty>
                  <CommandGroup>
                    {mockSpeakers.map((speaker) => (
                      <CommandItem
                        key={speaker.id}
                        onSelect={() => {
                          setSelectedSpeakers((current) =>
                            current.some(s => s.id === speaker.id)
                              ? current.filter((s) => s.id !== speaker.id)
                              : [...current, speaker]
                          );
                        }}
                      >
                        <Check
                          className={cn(
                            "mr-2 h-4 w-4",
                            selectedSpeakers.some(s => s.id === speaker.id)
                              ? "opacity-100"
                              : "opacity-0"
                          )}
                        />
                        <span>{speaker.name}</span>
                      </CommandItem>
                    ))}
                  </CommandGroup>
                </CommandList>
              </Command>
            </PopoverContent>
          </Popover>
          <div className="mt-4 flex flex-wrap gap-2">
              {selectedSpeakers.map(speaker => (
                  <Badge key={speaker.id} variant="secondary">
                      {speaker.name}
                  </Badge>
              ))}
          </div>
        </CardContent>
      </Card>
      
      <Card className="glass">
        <CardHeader>
          <CardTitle>Cover Image</CardTitle>
          <CardDescription>
            Upload a cover image for your event. A good image makes your event stand out.
          </CardDescription>
        </CardHeader>
        <CardContent>
             <ImageDropzone 
                onFileChange={handleFileChange}
                preview={imagePreview}
                disabled={isPublishing}
            />
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
          <div className="space-y-2">
              <Label>Venue Type</Label>
               <RadioGroup
                defaultValue={venueType}
                onValueChange={(value) => setVenueType(value as "physical" | "online")}
                className="grid grid-cols-2 gap-4"
                disabled={isPublishing}
              >
                <Label className="flex items-center space-x-2 rounded-md border p-4 cursor-pointer data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary">
                  <RadioGroupItem value="physical" id="r-physical" />
                  <span>Physical</span>
                </Label>
                <Label className="flex items-center space-x-2 rounded-md border p-4 cursor-pointer data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary">
                  <RadioGroupItem value="online" id="r-online" />
                  <span>Online</span>
                </Label>
              </RadioGroup>
          </div>
          
           <div className="space-y-2">
              <Label htmlFor="venue-details">Venue Details</Label>
              <Input
                id="venue-details"
                placeholder={venueType === 'physical' ? "e.g., Convention Center, Bangalore" : "e.g., Zoom Link"}
                value={venueDetails}
                onChange={(e) => setVenueDetails(e.target.value)}
                required
                disabled={isPublishing}
              />
            </div>
            
            {venueType === 'physical' && (
                 <div className="space-y-2">
                    <Label htmlFor="google-maps-link">Google Maps Embed Link</Label>
                    <div className="relative">
                        <Map className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input
                            id="google-maps-link"
                            placeholder="Paste the HTML embed code from Google Maps"
                            value={googleMapsLink}
                            onChange={(e) => setGoogleMapsLink(e.target.value)}
                            disabled={isPublishing}
                            className="pl-10"
                        />
                    </div>
                    <p className="text-xs text-muted-foreground">
                        Go to Google Maps, find your location, click 'Share', then 'Embed a map', and copy the `src` URL.
                    </p>
                </div>
            )}
          
           <div className="space-y-2">
              <Label>Event Type</Label>
              <RadioGroup
                defaultValue={eventType}
                onValueChange={(value) => setEventType(value as 'free' | 'paid')}
                className="grid grid-cols-2 gap-4"
                disabled={isPublishing}
              >
                <Label className="flex items-center space-x-2 rounded-md border p-4 cursor-pointer data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary">
                  <RadioGroupItem value="paid" id="r-paid" />
                  <span>Paid</span>
                </Label>
                 <Label className="flex items-center space-x-2 rounded-md border p-4 cursor-pointer data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary">
                  <RadioGroupItem value="free" id="r-free" />
                  <span>Free</span>
                </Label>
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
              <Label htmlFor="venue-capacity">Venue Capacity</Label>
              <Input
                id="venue-capacity"
                type="number"
                placeholder="e.g., 500"
                value={isFinite(venueCapacity) ? venueCapacity : ''}
                onChange={(e) => setVenueCapacity(Number(e.target.value))}
                required
                disabled={isPublishing || venueType === 'online'}
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
