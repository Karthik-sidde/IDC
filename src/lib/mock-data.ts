

import type { User, Event, Ticket, Speaker } from "./types";
import { subDays, addDays } from "date-fns";

export let mockUsers: User[] = [
  {
    id: "user-1",
    name: "Alex Doe",
    email: "alex.doe@example.com",
    role: "user",
    status: "active",
    emailVerified: true,
    profile: {
      avatar: "https://picsum.photos/seed/avatar1/100/100",
      bio: "Tech enthusiast and event lover.",
      xUrl: "https://x.com/alexdoe",
      linkedinUrl: "https://linkedin.com/in/alexdoe",
      isComplete: true,
    },
  },
  {
    id: "admin-1",
    name: "Bernard Lane",
    email: "bernard.lane@example.com",
    role: "admin",
    status: "active",
    emailVerified: true,
    profile: {
      avatar: "https://picsum.photos/seed/avatar2/100/100",
      bio: "Event organizer for tech conferences.",
      isComplete: true,
    },
  },
  {
    id: "super-admin-1",
    name: "Casey Smith",
    email: "casey.smith@example.com",
    role: "super_admin",
    status: "active",
    emailVerified: true,
    profile: {
      avatar: "https://picsum.photos/seed/avatar3/100/100",
      bio: "Platform administrator.",
      isComplete: true,
    },
  },
  {
    id: "speaker-1",
    name: "Diana Prince",
    email: "diana.prince@example.com",
    role: "speaker",
    status: "active",
    emailVerified: true,
    verificationStatus: "pending",
    profile: {
      avatar: "https://picsum.photos/seed/avatar4/100/100",
      bio: "Expert in decentralized systems and blockchain technology.",
      isComplete: true,
    },
  },
    {
    id: "speaker-2",
    name: "Elon Musk",
    email: "elon.musk@example.com",
    role: "speaker",
    status: "active",
    emailVerified: true,
    verificationStatus: "approved",
    profile: {
      avatar: "https://picsum.photos/seed/avatar5/100/100",
      bio: "Works on sustainable energy and space exploration.",
      isComplete: true,
    },
  },
];

const mockSpeakers: Speaker[] = [
    {
        id: "spk-1",
        name: "Satya Nadella",
        title: "CEO of Microsoft",
        avatar: "https://picsum.photos/seed/spk1/100/100",
        bio: "Satya Nadella is a business executive who is the executive chairman and CEO of Microsoft. He is a leading voice in the technology industry, focusing on cloud computing, AI, and digital transformation. He will be discussing the future of AI and its impact on modern businesses.",
        social: {
            x: "https://x.com/satyanadella",
            linkedin: "https://linkedin.com/in/satyanadella"
        }
    },
    {
        id: "spk-2",
        name: "Vitalik Buterin",
        title: "Co-founder of Ethereum",
        avatar: "https://picsum.photos/seed/spk2/100/100",
        bio: "Vitalik Buterin is a programmer and writer primarily known as one of the co-founders of Ethereum. He will be giving a keynote on the evolution of decentralized finance (DeFi) and the next generation of blockchain protocols.",
        social: {
            x: "https://x.com/VitalikButerin",
            linkedin: "https://linkedin.com/in/vitalik-buterin-267a81a5"
        }
    },
    {
        id: "spk-3",
        name: "Dr. Fei-Fei Li",
        title: "Professor at Stanford University",
        avatar: "https://picsum.photos/seed/spk3/100/100",
        bio: "Dr. Fei-Fei Li is a leading AI researcher, known for her work on computer vision and AI ethics. She is the co-director of Stanford's Human-Centered AI Institute. Her talk will cover the importance of human-centric AI and its ethical implications.",
        social: {
            x: "https://x.com/drfeifei",
            linkedin: "https://linkedin.com/in/fei-fei-li-4541247"
        }
    }
]


const mockEvents: Event[] = [
  {
    id: "event-1",
    title: "Future of Web3 Summit",
    description: "An immersive conference exploring the future of decentralized technologies, blockchain, and Web3. This summit brings together the brightest minds and leading voices in the decentralized space. Attendees will have the opportunity to participate in hands-on workshops, listen to visionary keynotes from industry pioneers, and network with a global community of developers, investors, and enthusiasts. Whether you're a seasoned expert or new to the world of Web3, this event will provide valuable insights and connections to help you navigate the next wave of the internet.",
    category: "Tech",
    date: addDays(new Date(), 15),
    venue: {
      type: "physical",
      details: "Metropolis Convention Center",
    },
    tickets: [{ tier: "General Admission", price: 199, quantity: 500 }],
    organizerId: "speaker-2",
    coverImage: "https://picsum.photos/seed/event1/600/400",
    speakers: [mockSpeakers[1], mockSpeakers[0]]
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
    speakers: [],
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
    speakers: [],
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
    speakers: [mockSpeakers[2]],
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
    speakers: [],
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
    speakers: [],
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
    const existingUser = mockUsers.find(u => u.email === user.email);
    if (!existingUser) {
        mockUsers.push(user);
    }
}

export const verifyUserEmail = (email: string) => {
    let found = false;
    mockUsers = mockUsers.map(u => {
        if (u.email === email) {
            found = true;
            return { ...u, emailVerified: true };
        }
        return u;
    });
    return found;
}

// Also export the raw data for cases where we don't want to use the functions
export type { User, Event, Ticket, UserRole } from "./types";
