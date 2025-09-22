import type { User, Event, Ticket } from "./types";
import { subDays, addDays } from "date-fns";

export const mockUsers: User[] = [
  {
    id: "user-1",
    name: "Alex Doe",
    email: "alex.doe@example.com",
    role: "user",
    status: "active",
    profile: {
      avatar: "https://picsum.photos/seed/avatar1/100/100",
      bio: "Tech enthusiast and event lover.",
      xUrl: "https://x.com/alexdoe",
      linkedinUrl: "https://linkedin.com/in/alexdoe"
    },
  },
  {
    id: "admin-1",
    name: "Bernard Lane",
    email: "bernard.lane@example.com",
    role: "admin",
    status: "active",
    profile: {
      avatar: "https://picsum.photos/seed/avatar2/100/100",
      bio: "Event organizer for tech conferences.",
    },
  },
  {
    id: "super-admin-1",
    name: "Casey Smith",
    email: "casey.smith@example.com",
    role: "super_admin",
    status: "active",
    profile: {
      avatar: "https://picsum.photos/seed/avatar3/100/100",
      bio: "Platform administrator.",
    },
  },
  {
    id: "speaker-1",
    name: "Diana Prince",
    email: "diana.prince@example.com",
    role: "speaker",
    status: "active",
    verificationStatus: "pending",
    profile: {
      avatar: "https://picsum.photos/seed/avatar4/100/100",
      bio: "Expert in decentralized systems and blockchain technology.",
    },
  },
    {
    id: "speaker-2",
    name: "Elon Musk",
    email: "elon.musk@example.com",
    role: "speaker",
    status: "active",
    verificationStatus: "approved",
    profile: {
      avatar: "https://picsum.photos/seed/avatar5/100/100",
      bio: "Works on sustainable energy and space exploration.",
    },
  },
];

const mockEvents: Event[] = [
  {
    id: "event-1",
    title: "Future of Web3 Summit",
    description: "An immersive conference exploring the future of decentralized technologies, blockchain, and Web3. Join industry leaders for keynotes, workshops, and networking.",
    category: "Tech",
    date: addDays(new Date(), 15),
    venue: {
      type: "physical",
      details: "Metropolis Convention Center",
    },
    tickets: [{ tier: "General Admission", price: 199, quantity: 500 }],
    organizerId: "speaker-2",
    coverImage: "https://picsum.photos/seed/event1/600/400",
  },
  {
    id: "event-2",
    title: "Starlight Music Festival",
    description: "A 3-day outdoor music festival featuring top artists from around the globe. Experience music, art, and community under the stars.",
    category: "Music",
    date: addDays(new Date(), 45),
    venue: {
      type: "physical",
      details: "Canyon Creek Fields",
    },
    tickets: [
      { tier: "Weekend Pass", price: 299, quantity: 2000 },
      { tier: "VIP Pass", price: 599, quantity: 300 },
    ],
    organizerId: "admin-1",
    coverImage: "https://picsum.photos/seed/event2/600/400",
  },
  {
    id: "event-3",
    title: "Modern Art Exhibition: 'Dimensions'",
    description: "A gallery opening showcasing contemporary artists who push the boundaries of form and dimension. Wine and cheese will be served.",
    category: "Arts",
    date: addDays(new Date(), 5),
    venue: {
      type: "physical",
      details: "The Avant-Garde Gallery",
    },
    tickets: [{ tier: "Free Entry", price: 0, quantity: 200 }],
    organizerId: "admin-1",
    coverImage: "https://picsum.photos/seed/event3/600/400",
  },
  {
    id: "event-4",
    title: "Innovate & Pitch Night",
    description: "Watch the brightest startups pitch their ideas to a panel of venture capitalists. Network with founders and investors.",
    category: "Business",
    date: addDays(new Date(), 22),
    venue: {
      type: "online",
      details: "https://zoom.us/j/1234567890",
    },
    tickets: [{ tier: "Online Access", price: 25, quantity: 1000 }],
    organizerId: "speaker-2",
    coverImage: "https://picsum.photos/seed/event4/600/400",
  },
  {
    id: "event-5",
    title: "Sustainable Living Workshop",
    description: "A hands-on workshop to learn about sustainable practices, from urban gardening to zero-waste living. All materials provided.",
    category: "Lifestyle",
    date: subDays(new Date(), 10),
    venue: {
      type: "physical",
      details: "Green Community Hub",
    },
    tickets: [{ tier: "Workshop Fee", price: 50, quantity: 50 }],
    organizerId: "admin-1",
    coverImage: "https://picsum.photos/seed/event5/600/400",
  },
  {
    id: "event-6",
    title: "Global Food Fair",
    description: "Taste the world at our annual food fair, featuring dozens of vendors with authentic cuisine from every continent.",
    category: "Food",
    date: subDays(new Date(), 30),
    venue: {
      type: "physical",
      details: "City Park",
    },
    tickets: [{ tier: "Entry", price: 10, quantity: 5000 }],
    organizerId: "admin-1",
    coverImage: "https://picsum.photos/seed/event6/600/400",
  },
];

let mockTickets: Ticket[] = [
  {
    id: "ticket-1",
    eventId: "event-5",
    userId: "user-1",
    price: 50,
    status: "confirmed",
    qrCode: "mock-qr-code-1",
  },
  {
    id: "ticket-2",
    eventId: "event-6",
    userId: "user-1",
    price: 10,
    status: "confirmed",
    qrCode: "mock-qr-code-2",
  },
];

// Function to get events
export const getMockEvents = () => mockEvents;

// Function to add an event
export const addMockEvent = (event: Event) => {
  mockEvents.unshift(event);
};

// Function to get tickets
export const getMockTickets = () => mockTickets;

// Function to add a ticket
export const addMockTicket = (ticket: Ticket) => {
  mockTickets.push(ticket);
};

// Function to add a user
export const addMockUser = (user: User) => {
    mockUsers.push(user);
}

// Also export the raw data for cases where we don't want to use the functions
export type { User, Event, Ticket, UserRole } from "./types";
