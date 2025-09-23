

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
import { type Event, type Speaker, type Ticket } from "@/lib/types";
import { format } from "date-fns";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { UserContext } from "@/context/UserContext";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { ShieldAlert, Loader2, Wand2, Upload, Users, Check, ChevronsUpDown, Map, PlusCircle, Trash2, Ticket as TicketIcon } from "lucide-react";
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
import { Separator } from "@/components/ui/separator";

type TicketTier = {
    tier: string;
    price: number;
}

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
  const [ticketTiers, setTicketTiers] = useState<TicketTier[]>([{ tier: "General Admission", price: 0 }]);
  const [venueCapacity, setVenueCapacity] = useState(100);
  const [isPublishing, setIsPublishing] = useState(false);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [selectedSpeakers, setSelectedSpeakers] = useState<Speaker[]>([]);
  
  const canCreateEvent = user?.role.includes('admin') || (user?.role === 'speaker' && user?.verificationStatus === 'approved');
  
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

  const handleAddTier = () => {
    setTicketTiers([...ticketTiers, { tier: "", price: 0 }]);
  };

  const handleRemoveTier = (index: number) => {
    const newTiers = ticketTiers.filter((_, i) => i !== index);
    setTicketTiers(newTiers);
  };

  const handleTierChange = (index: number, field: 'tier' | 'price', value: string | number) => {
    const newTiers = [...ticketTiers];
    if (field === 'price') {
      newTiers[index][field] = Number(value);
    } else {
      newTiers[index][field] = String(value);
    }
    setTicketTiers(newTiers);
  };


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !canCreateEvent) return;
    
    if (ticketTiers.length === 0 || ticketTiers.some(t => !t.tier)) {
        toast({
            variant: "destructive",
            title: "Validation Error",
            description: "Please ensure all ticket tiers have a name.",
        });
        return;
    }

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
      tickets: ticketTiers,
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
          <CardTitle>Venue</CardTitle>
          <CardDescription>
            Specify where the event will take place.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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
                    <p className="text-xs text-muted-foreground">
                        {venueType === 'online' ? 'Online events have unlimited capacity.' : 'Total number of attendees allowed.'}
                    </p>
                </div>
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
        </CardContent>
      </Card>
      
      <Card className="glass">
        <CardHeader>
            <div className="flex justify-between items-center">
                <div>
                    <CardTitle>Ticketing</CardTitle>
                    <CardDescription>
                        Create different ticket tiers for your event. Set price to 0 for free tickets.
                    </CardDescription>
                </div>
                <Button type="button" variant="outline" size="sm" onClick={handleAddTier} disabled={isPublishing}>
                    <PlusCircle />
                    Add Tier
                </Button>
            </div>
        </CardHeader>
        <CardContent className="space-y-4">
            {ticketTiers.length === 0 ? (
                <div className="text-center text-muted-foreground border-2 border-dashed rounded-lg p-8">
                    <TicketIcon className="mx-auto h-12 w-12" />
                    <p className="mt-4 font-semibold">No ticket tiers created.</p>
                    <p className="text-sm">Click "Add Tier" to create your first ticket.</p>
                </div>
            ) : (
                ticketTiers.map((tier, index) => (
                    <div key={index} className="p-4 border rounded-lg bg-muted/20">
                         <div className="flex justify-between items-start gap-4">
                            <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor={`tier-name-${index}`}>Tier Name</Label>
                                    <Input
                                        id={`tier-name-${index}`}
                                        placeholder="e.g., General Admission"
                                        value={tier.tier}
                                        onChange={(e) => handleTierChange(index, 'tier', e.target.value)}
                                        disabled={isPublishing}
                                        required
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor={`tier-price-${index}`}>Price (₹)</Label>
                                    <Input
                                        id={`tier-price-${index}`}
                                        type="number"
                                        placeholder="e.g., 25"
                                        value={tier.price}
                                        min={0}
                                        onChange={(e) => handleTierChange(index, 'price', e.target.value)}
                                        disabled={isPublishing}
                                        required
                                    />
                                </div>
                            </div>
                            <Button 
                                type="button" 
                                variant="ghost" 
                                size="icon"
                                onClick={() => handleRemoveTier(index)} 
                                disabled={isPublishing || ticketTiers.length <= 1}
                                className="mt-7 text-muted-foreground hover:text-destructive"
                            >
                                <Trash2 className="h-4 w-4"/>
                            </Button>
                         </div>
                    </div>
                ))
            )}
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

    

    