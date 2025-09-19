export type UserRole = "super_admin" | "admin" | "user";

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  status: "active" | "suspended";
  profile: {
    avatar: string;
    bio: string;
  };
}

export interface Event {
  id: string;
  title: string;
  description: string;
  category: string;
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
}

export interface Ticket {
  id: string;
  eventId: string;
  userId: string;
  price: number;
  status: "pending" | "confirmed" | "cancelled";
  qrCode: string;
}
