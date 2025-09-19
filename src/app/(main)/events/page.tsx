
"use client";

import { useState, useEffect } from "react";
import { EventCard } from "@/components/events/EventCard";
import { getMockEvents, mockUsers, getMockTickets } from "@/lib/mock-data";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Wand2, Search, X } from "lucide-react";
import { getPersonalizedEventRecommendations } from "@/ai/flows/personalized-event-recommendations";
import { type Event } from "@/lib/types";

export default function EventsPage() {
  const [events, setEvents] = useState<Event[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isRecommended, setIsRecommended] = useState(false);

  useEffect(() => {
    setEvents(getMockEvents());
  }, []);


  const handleRecommendations = async () => {
    setIsLoading(true);
    setIsRecommended(true);

    const user = mockUsers.find(u => u.role === 'user');
    if (!user) {
        setIsLoading(false);
        return;
    }

    const mockTickets = getMockTickets();
    const userPastEventIds = mockTickets.filter(t => t.userId === user.id).map(t => t.eventId);
    const allMockEvents = getMockEvents();
    const userPastEvents = allMockEvents.filter(e => userPastEventIds.includes(e.id));
    
    try {
      const recommendations = await getPersonalizedEventRecommendations({
        userPastEvents: JSON.stringify(userPastEvents),
        userPreferences: 'Loves tech and music events, preferably on weekends.',
        allEvents: JSON.stringify(allMockEvents),
      });

      const recommendedIds = JSON.parse(recommendations.recommendedEvents);
      const recommendedEvents = allMockEvents.filter(event => recommendedIds.includes(event.id));
      setEvents(recommendedEvents);
    } catch (error) {
      console.error("Failed to get recommendations:", error);
      // Fallback or show error
    } finally {
      setIsLoading(false);
    }
  };

  const resetFilters = () => {
    setEvents(getMockEvents());
    setIsRecommended(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input placeholder="Search events..." className="pl-10" />
        </div>
        <div className="flex gap-2">
            <Select>
                <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Filter by category" />
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value="tech">Tech</SelectItem>
                    <SelectItem value="music">Music</SelectItem>
                    <SelectItem value="arts">Arts</SelectItem>
                    <SelectItem value="business">Business</SelectItem>
                </SelectContent>
            </Select>

            {isRecommended ? (
               <Button variant="outline" onClick={resetFilters}>
                    <X className="mr-2 h-4 w-4"/>
                    Clear Recommendations
                </Button>
            ) : (
                <Button onClick={handleRecommendations} disabled={isLoading} className="hover:glow">
                    {isLoading ? (
                    <Wand2 className="mr-2 h-4 w-4 animate-pulse" />
                    ) : (
                    <Wand2 className="mr-2 h-4 w-4" />
                    )}
                    Get Recommendations
                </Button>
            )}
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {events.map((event) => (
          <EventCard key={event.id} event={event} />
        ))}
      </div>
    </div>
  );
}
