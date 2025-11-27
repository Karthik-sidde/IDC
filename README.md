
# Eventide Platform - Project Specifications

This document outlines the technical specifications, architecture, and features of the Eventide Platform, a modern, full-stack event management application.

---

### **Frontend**

*   **Framework**: Next.js (with App Router)
*   **Language**: TypeScript
*   **UI Library**: React
*   **Styling**: Tailwind CSS for utility-first styling.
*   **Component Library**: shadcn/ui for pre-built, accessible components.
*   **Animations**: Framer Motion for smooth page transitions and UI animations.
*   **State Management**: React Context API for managing global state like user authentication.
*   **Forms**: React Hook Form with Zod for robust and type-safe form validation.
*   **Code Quality**: ESLint and TypeScript for type-checking and linting.

---

### **Backend (Headless CMS)**

The backend is a **separate, externally hosted Payload CMS application**. The frontend consumes its REST API to fetch all content. Ensure your `.env` file contains the correct `NEXT_PUBLIC_PAYLOAD_URL` pointing to your live CMS instance.

---

### **Key Application Features**

*   **Headless Content Management**: All content (events, speakers, media) is managed through a user-friendly Payload CMS admin panel.
*   **Dynamic Event Listings**: The frontend fetches events live from the Payload CMS. Users can search and filter events by chapter, type (paid/free), and sort by date or title.
*   **Detailed Event Pages**: Each event has a dedicated page displaying its description, schedule, venue details (including an embedded Google Map for physical events), and speaker profiles.
*   **User Authentication (Mocked)**: A complete, mock authentication flow including sign-in, registration, and email verification pages.
*   **Ticketing Flow (Mocked)**: A simulated user journey for event registration, including instant confirmation for free events and a mock payment gateway for paid tickets.
*   **User Profiles & Dashboards**:
    *   **My Tickets**: A dedicated page for users to view their upcoming and past event tickets.
    *   **Profile Management**: Users can update their personal information, bio, and social media links.
*   **Responsive Design**: The application is fully responsive and designed to work seamlessly across desktop, tablet, and mobile devices.

---

### **How to Run This Project**

1.  **Configure Environment**: Create a `.env` file in the root directory and add `NEXT_PUBLIC_PAYLOAD_URL=<your_payload_cms_url>`.
2.  **Install Dependencies**: Open a terminal and run `npm install`.
3.  **Start the Development Server**: Run `npm run dev`.
4.  Your frontend is now running at `http://localhost:9002`.

