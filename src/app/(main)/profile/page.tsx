
"use client";

import { useContext, useState, useEffect } from "react";
import { UserContext } from "@/context/UserContext";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { Linkedin, UserCircle, Save, Upload, Calendar, Clock, ArrowRight, Ticket } from "lucide-react";
import { type User, type Event, type Ticket as TicketType } from "@/lib/types";
import { getMockEvents, getMockTickets } from "@/lib/mock-data";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Link from "next/link";
import { format } from "date-fns";
import Image from "next/image";

const XIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="currentColor"
      {...props}
    >
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
);

type EventWithTicket = { event: Event, ticket: TicketType };

const ProfileEventCard = ({ event, ticket }: EventWithTicket) => (
    <Card className="overflow-hidden transition-shadow hover:shadow-lg glass">
      <div className="flex">
        <div className="relative h-full w-24 flex-shrink-0">
          <Image
            src={event.coverImage}
            alt={event.title}
            fill
            className="object-cover"
            data-ai-hint="event cover"
          />
        </div>
        <div className="flex flex-1 flex-col p-4">
            <h4 className="font-semibold truncate">{event.title}</h4>
            <p className="text-xs text-muted-foreground flex items-center gap-1.5 mt-1">
                <Calendar className="h-3 w-3" />
                {format(new Date(event.date), 'MMM d, yyyy')}
            </p>
            <div className="flex justify-end mt-2">
                <Link href={`/events/${event.id}`}>
                    <Button size="sm" variant="ghost">
                        View Event
                        <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                </Link>
            </div>
        </div>
      </div>
    </Card>
);


export default function ProfilePage() {
  const { user, setUser } = useContext(UserContext);
  const { toast } = useToast();
  const [profile, setProfile] = useState<User | null>(null);
  const [upcomingEvents, setUpcomingEvents] = useState<EventWithTicket[]>([]);
  const [pastEvents, setPastEvents] = useState<EventWithTicket[]>([]);


  useEffect(() => {
    if (user) {
      setProfile(JSON.parse(JSON.stringify(user))); // Deep copy
      
      const tickets = getMockTickets().filter((t) => t.userId === user.id);
      const mockEvents = getMockEvents();
      
      const eventsWithTickets = tickets.map((ticket) => {
          const event = mockEvents.find((e) => e.id === ticket.eventId);
          return event ? { event, ticket } : null;
      }).filter((item): item is EventWithTicket => item !== null);

      const upcoming = eventsWithTickets.filter(({ event }) => new Date(event.date) >= new Date());
      const past = eventsWithTickets.filter(({ event }) => new Date(event.date) < new Date());
      
      setUpcomingEvents(upcoming.sort((a,b) => a.event.date.getTime() - b.event.date.getTime()));
      setPastEvents(past.sort((a,b) => b.event.date.getTime() - a.event.date.getTime()));

    }
  }, [user]);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    if (profile) {
      const { id, value } = e.target;
      // Handle nested profile properties
      if (['bio', 'xUrl', 'linkedinUrl'].includes(id)) {
        setProfile(prev => prev ? { ...prev, profile: { ...prev.profile, [id]: value } } : null);
      } else {
        setProfile(prev => prev ? { ...prev, [id]: value } : null);
      }
    }
  };
  
  const handleAvatarChange = () => {
    // In a real app, this would open a file dialog
    toast({
        title: "Feature not implemented",
        description: "Avatar uploads will be available soon.",
    });
    if (profile) {
      const newAvatar = `https://picsum.photos/seed/${Date.now()}/100/100`;
      setProfile({ ...profile, profile: { ...profile.profile, avatar: newAvatar } });
    }
  }


  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (profile) {
      const updatedUser = {
          ...profile,
          profile: {
              ...profile.profile,
              isComplete: true, // Mark as complete on save
          }
      };
      setUser(updatedUser);
      toast({
        title: "Profile Updated",
        description: "Your profile information has been successfully saved.",
      });
    }
  };

  if (!profile) {
    return <div>Loading...</div>;
  }

  return (
    <div className="mx-auto max-w-4xl space-y-8">
       <div>
        <h1 className="text-2xl font-bold font-headline">Your Profile</h1>
        <p className="text-muted-foreground">
          Manage your personal information and social links.
        </p>
      </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <form onSubmit={handleSubmit} className="space-y-6">
                <Card className="glass">
                <CardHeader>
                    <div className="flex items-center gap-3">
                        <UserCircle className="h-6 w-6 text-primary" />
                        <CardTitle>Personal Information</CardTitle>
                    </div>
                    <CardDescription>
                    Update your photo, name, and bio.
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                    <div className="flex items-center gap-4">
                    <Avatar className="h-20 w-20">
                        <AvatarImage src={profile.profile.avatar} />
                        <AvatarFallback>{profile.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <Button type="button" variant="outline" onClick={handleAvatarChange}>
                        <Upload className="mr-2 h-4 w-4"/>
                        Change Photo
                    </Button>
                    </div>
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                        <div className="space-y-2">
                            <Label htmlFor="name">Name</Label>
                            <Input
                            id="name"
                            value={profile.name}
                            onChange={handleInputChange}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="email">Email</Label>
                            <Input id="email" value={profile.email} disabled />
                        </div>
                    </div>
                    <div className="space-y-2">
                    <Label htmlFor="bio">Bio</Label>
                    <Textarea
                        id="bio"
                        placeholder="Tell us a little about yourself"
                        value={profile.profile.bio}
                        onChange={handleInputChange}
                        rows={3}
                    />
                    </div>
                </CardContent>
                </Card>

                <Card className="glass">
                <CardHeader>
                    <CardTitle>Social Links</CardTitle>
                    <CardDescription>
                        Add your professional social media profiles.
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="space-y-2">
                    <Label htmlFor="xUrl">X (Twitter)</Label>
                    <div className="relative">
                        <XIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input
                            id="xUrl"
                            placeholder="https://x.com/username"
                            value={profile.profile.xUrl || ""}
                            onChange={handleInputChange}
                            className="pl-10"
                        />
                    </div>
                    </div>
                    <div className="space-y-2">
                    <Label htmlFor="linkedinUrl">LinkedIn</Label>
                    <div className="relative">
                        <Linkedin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input
                        id="linkedinUrl"
                        placeholder="https://linkedin.com/in/username"
                        value={profile.profile.linkedinUrl || ""}
                        onChange={handleInputChange}
                        className="pl-10"
                        />
                    </div>
                    </div>
                </CardContent>
                </Card>

                <div className="flex justify-end">
                <Button type="submit" className="hover:glow">
                    <Save className="mr-2 h-4 w-4" />
                    Save Changes
                </Button>
                </div>
            </form>
          </div>
          <div className="lg:col-span-1">
             <Card className="glass">
                <CardHeader>
                     <div className="flex items-center gap-3">
                        <Ticket className="h-6 w-6 text-primary" />
                        <CardTitle>My Events</CardTitle>
                    </div>
                    <CardDescription>Your registered events.</CardDescription>
                </CardHeader>
                <CardContent>
                    <Tabs defaultValue="upcoming">
                        <TabsList className="grid w-full grid-cols-2">
                            <TabsTrigger value="upcoming">Upcoming</TabsTrigger>
                            <TabsTrigger value="past">Past</TabsTrigger>
                        </TabsList>
                        <TabsContent value="upcoming" className="mt-4 space-y-3 max-h-96 overflow-y-auto pr-1">
                            {upcomingEvents.length > 0 ? (
                                upcomingEvents.map(({event, ticket}) => <ProfileEventCard key={ticket.id} event={event} ticket={ticket} />)
                            ) : (
                                <p className="text-sm text-muted-foreground text-center py-4">No upcoming events.</p>
                            )}
                        </TabsContent>
                         <TabsContent value="past" className="mt-4 space-y-3 max-h-96 overflow-y-auto pr-1">
                            {pastEvents.length > 0 ? (
                                pastEvents.map(({event, ticket}) => <ProfileEventCard key={ticket.id} event={event} ticket={ticket} />)
                            ) : (
                                <p className="text-sm text-muted-foreground text-center py-4">No past events found.</p>
                            )}
                        </TabsContent>
                    </Tabs>
                </CardContent>
             </Card>
          </div>
      </div>
    </div>
  );
}


  