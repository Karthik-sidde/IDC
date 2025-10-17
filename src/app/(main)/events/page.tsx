
"use client";

import { useState, useEffect, useMemo } from "react";
import { EventCard } from "@/components/events/EventCard";
import { getMockEvents } from "@/lib/mock-data";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Search } from "lucide-react";
import { type Event } from "@/lib/types";
import { motion } from "framer-motion";

type SortOption = "date-asc" | "date-desc" | "title-asc";

export default function EventsPage() {
  const [events, setEvents] = useState<Event[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedChapter, setSelectedChapter] = useState("all");
  const [eventType, setEventType] = useState("all");
  const [sortOption, setSortOption] = useState<SortOption>("date-asc");

  useEffect(() => {
    setEvents(getMockEvents());
  }, []);

  const filteredAndSortedEvents = useMemo(() => {
    let filtered = events.filter((event) => {
      const matchesQuery =
        event.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        event.description.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesChapter =
        selectedChapter === "all" || event.chapter === selectedChapter;
      const isFree = event.tickets.some((t) => t.price === 0);
      const matchesType =
        eventType === "all" ||
        (eventType === "free" && isFree) ||
        (eventType === "paid" && !isFree);
      
      return matchesQuery && matchesChapter && matchesType;
    });

    return filtered.sort((a, b) => {
        switch(sortOption) {
            case 'date-asc':
                return new Date(a.date).getTime() - new Date(b.date).getTime();
            case 'date-desc':
                return new Date(b.date).getTime() - new Date(a.date).getTime();
            case 'title-asc':
                return a.title.localeCompare(b.title);
            default:
                return 0;
        }
    });

  }, [events, searchQuery, selectedChapter, eventType, sortOption]);

  const chapters = useMemo(() => {
    const allChapters = events.map(e => e.chapter);
    return [...new Set(allChapters)];
  }, [events]);
  
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.05,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.4,
        ease: "easeOut",
      },
    },
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search events by title or keyword..."
            className="pl-10"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <div className="flex flex-col gap-2 sm:flex-row">
          <Select value={selectedChapter} onValueChange={setSelectedChapter}>
            <SelectTrigger className="w-full sm:w-[180px]">
              <SelectValue placeholder="Filter by chapter" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Chapters</SelectItem>
              {chapters.map(chapter => (
                <SelectItem key={chapter} value={chapter}>{chapter}</SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={eventType} onValueChange={setEventType}>
            <SelectTrigger className="w-full sm:w-[150px]">
              <SelectValue placeholder="Filter by type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Types</SelectItem>
              <SelectItem value="paid">Paid</SelectItem>
              <SelectItem value="free">Free</SelectItem>
            </SelectContent>
          </Select>

          <Select value={sortOption} onValueChange={(v) => setSortOption(v as SortOption)}>
            <SelectTrigger className="w-full sm:w-[180px]">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="date-asc">Date (Soonest)</SelectItem>
              <SelectItem value="date-desc">Date (Latest)</SelectItem>
              <SelectItem value="title-asc">Title (A-Z)</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {filteredAndSortedEvents.length > 0 ? (
        <motion.div 
            className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
        >
            {filteredAndSortedEvents.map((event) => (
                <motion.div key={event.id} variants={itemVariants}>
                    <EventCard event={event} />
                </motion.div>
            ))}
        </motion.div>
      ) : (
        <div className="text-center py-16 text-muted-foreground">
            <p className="text-lg font-semibold">No events found</p>
            <p>Try adjusting your search or filters.</p>
        </div>
      )}
    </div>
  );
}
