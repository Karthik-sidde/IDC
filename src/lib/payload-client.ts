
import type { Event, Speaker } from "./types";

const PAYLOAD_API_URL = process.env.NEXT_PUBLIC_PAYLOAD_URL;

// Type guard to check if an object is a valid Payload media object
const isPayloadMedia = (media: any): media is { url: string; alt: string } => {
  return media && typeof media === 'object' && typeof media.url === 'string' && typeof media.alt === 'string';
};

// This function transforms the raw data from Payload into the 'Event' type your app uses
const transformPayloadEvent = (item: any): Event => {
  const eventDate = item.date ? new Date(item.date) : new Date();

  // Handle speakers: ensure it's an array and transform correctly
  const speakers: Speaker[] = Array.isArray(item.speakers) ? item.speakers.map((speaker: any) => ({
    id: speaker.id,
    name: speaker.name || "Unnamed Speaker",
    title: speaker.title || "Speaker",
    avatar: isPayloadMedia(speaker.avatar) ? `${PAYLOAD_API_URL}${speaker.avatar.url}` : "https://picsum.photos/seed/speaker/100/100",
    bio: speaker.bio || "No bio available.",
    social: {
        x: speaker.social?.x || undefined,
        linkedin: speaker.social?.linkedin || undefined,
    }
  })) : [];
  
  // Handle tickets: ensure it's an array
  const tickets = Array.isArray(item.tickets) ? item.tickets.map((ticket: any) => ({
      tier: ticket.tier || "Standard",
      price: ticket.price || 0,
  })) : [];

  return {
    id: item.id,
    title: item.title || "Untitled Event",
    description: item.description || "No description provided.",
    chapter: item.chapter || "Other",
    date: eventDate,
    venue: {
      type: item.venue?.type || "online",
      details: item.venue?.details || "TBD",
      googleMapsLink: item.venue?.googleMapsLink || undefined,
    },
    capacity: item.capacity || Infinity,
    tickets: tickets,
    organizerId: item.organizer?.id || 'unknown-organizer',
    coverImage: isPayloadMedia(item.coverImage) ? `${PAYLOAD_API_URL}${item.coverImage.url}` : `https://picsum.photos/seed/${item.id}/600/400`,
    speakers: speakers,
  };
};

export async function getPayloadEvents(): Promise<Event[]> {
  if (!PAYLOAD_API_URL) {
    console.warn("Payload API URL is not configured. Returning empty array.");
    return [];
  }

  try {
    const response = await fetch(`${PAYLOAD_API_URL}/api/events?depth=2`);
    if (!response.ok) {
      throw new Error(`Failed to fetch events: ${response.statusText}`);
    }
    const data = await response.json();
    if (data.docs && Array.isArray(data.docs)) {
        return data.docs.map(transformPayloadEvent);
    }
    return [];
  } catch (error) {
    console.error("Error fetching events from Payload:", error);
    return [];
  }
}
