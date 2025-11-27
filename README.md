
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

The backend is a separate, self-contained Payload CMS application located in the `payload-cms/` directory.

*   **Platform**: Payload CMS
*   **Database**: MongoDB (configured via `payload-cms/src/payload.config.ts`)
*   **Authentication**: Payload's built-in authentication for CMS admin users.
*   **API**: Automatically generated REST and GraphQL APIs that the frontend consumes.

---

### **Generative AI**

*   **Framework**: Genkit
*   **Provider**: Google AI
*   **Model**: Gemini 2.5 Flash
*   **Feature**: Personalized event recommendations based on user history and preferences, implemented in `src/ai/flows/`.

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
*   **AI-Powered Recommendations**: A Genkit flow provides personalized event suggestions to users.
*   **Responsive Design**: The application is fully responsive and designed to work seamlessly across desktop, tablet, and mobile devices.

---

### **How to Run This Project**

There are two separate applications to run: the **Frontend** and the **Backend (CMS)**.

#### **1. Running the Backend (Payload CMS)**

1.  Open a **new terminal**.
2.  Navigate to the CMS directory: `cd payload-cms`
3.  Install dependencies: `npm install`
4.  Start the server: `npm run dev`
5.  Your CMS is now running at `http://localhost:3000`. You can access the admin panel at `http://localhost:3000/admin`.

#### **2. Running the Frontend (Next.js)**

1.  Open another terminal.
2.  If you are not in the root directory, navigate back to it.
3.  Install dependencies: `npm install`
4.  Start the development server: `npm run dev`
5.  Your frontend is now running at `http://localhost:9002`.

You can now use the website and manage its content through the CMS simultaneously.
