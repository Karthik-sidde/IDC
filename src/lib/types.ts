

export type UserRole = "super_admin" | "admin" | "user" | "speaker";

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  status: "active" | "suspended";
  emailVerified: boolean;
  verificationStatus?: "pending" | "approved" | "rejected";
  profile: {
    avatar: string;
    bio: string;
    xUrl?: string;
    linkedinUrl?: string;
    isComplete?: boolean;
  };
}

export interface Speaker {
  id: string;
  name: string;
  title: string;
  avatar: string;
  bio: string;
  social: {
    x?: string;
    linkedin?: string;
  };
}

export interface Event {
  id:string;
  title: string;
  description: string;
  chapter: string;
  date: Date;
  venue: {
    type: "physical" | "online";
    details: string; // Address or URL
  };
  tickets: {
    tier: string;
    price: number;
    quantity: number;
  }[];
  organizerId: string;
  coverImage: string;
  speakers: Speaker[];
}

export interface Ticket {
  id: string;
  eventId: string;
  userId: string;
  price: number;
  status: "pending" | "confirmed" | "cancelled";
  qrCode: string;
}
