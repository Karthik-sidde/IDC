
"use client";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription
} from "@/components/ui/card";
import {
  Banknote,
  Users,
  CalendarCheck,
  Activity,
  ArrowRight,
  UserPlus,
  Ticket,
} from "lucide-react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  XAxis,
  YAxis,
  Line,
  LineChart,
} from "recharts";
import { ChartContainer, ChartTooltip, ChartTooltipContent, type ChartConfig } from "@/components/ui/chart";
import { getMockEvents, getMockTickets, mockUsers } from "@/lib/mock-data";
import { useState, useEffect, useMemo } from "react";
import { type Event, type Ticket as TicketType, type User } from "@/lib/types";
import { isBefore, isSameDay, addDays, format, subDays, eachDayOfInterval, startOfToday } from "date-fns";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";


const revenueChartConfig = {
  revenue: {
    label: "Revenue",
    color: "hsl(var(--primary))",
  },
} satisfies ChartConfig;

const topEventsChartConfig = {
  revenue: {
    label: "Revenue",
    color: "hsl(var(--primary))",
  }
} satisfies ChartConfig

type RecentActivity = {
    type: 'registration' | 'ticket_purchase';
    user: User;
    event?: Event;
    ticket?: TicketType;
    timestamp: Date;
}


export default function AdminDashboardPage() {
    const [events, setEvents] = useState<Event[]>([]);
    const [tickets, setTickets] = useState<TicketType[]>([]);
    const [users, setUsers] = useState<User[]>([]);
    
    useEffect(() => {
        setEvents(getMockEvents());
        setTickets(getMockTickets());
        setUsers(mockUsers);
    }, []);

    const { 
        totalRevenue, 
        totalRegistrations, 
        revenueChange, 
        registrationsChange 
    } = useMemo(() => {
        const now = new Date();
        const last30Days = subDays(now, 30);
        const last60Days = subDays(now, 60);

        const ticketsLast30Days = tickets.filter(t => new Date(t.purchaseDate || now) > last30Days);
        const ticketsFrom30To60Days = tickets.filter(t => {
            const purchaseDate = new Date(t.purchaseDate || now);
            return purchaseDate <= last30Days && purchaseDate > last60Days;
        });

        const revenueLast30Days = ticketsLast30Days.reduce((acc, t) => acc + t.price, 0);
        const revenueFrom30To60Days = ticketsFrom30To60Days.reduce((acc, t) => acc + t.price, 0);
        
        const registrationsLast30Days = ticketsLast30Days.length;
        const registrationsFrom30To60Days = ticketsFrom30To60Days.length;

        const calculateChange = (current: number, previous: number) => {
             if (previous === 0) return current > 0 ? 100 : 0;
             return ((current - previous) / previous) * 100;
        }

        return {
            totalRevenue: revenueLast30Days,
            totalRegistrations: registrationsLast30Days,
            revenueChange: calculateChange(revenueLast30Days, revenueFrom30To60Days),
            registrationsChange: calculateChange(registrationsLast30Days, registrationsFrom30To60Days),
        }

    }, [tickets]);


     const dailyRevenueData = useMemo(() => {
        const today = startOfToday();
        const last30Days = subDays(today, 29);
        const days = eachDayOfInterval({ start: last30Days, end: today });
        
        return days.map(day => {
            const dailyTickets = tickets.filter(t => isSameDay(new Date(t.purchaseDate || today), day));
            const revenue = dailyTickets.reduce((sum, t) => sum + t.price, 0);
            return {
                date: format(day, "MMM d"),
                revenue,
            };
        });
    }, [tickets]);

    const topEventsData = useMemo(() => {
         const eventRevenue: {[key: string]: number} = {};
         tickets.forEach(ticket => {
             if (!eventRevenue[ticket.eventId]) {
                 eventRevenue[ticket.eventId] = 0;
             }
             eventRevenue[ticket.eventId] += ticket.price;
         });

         return Object.entries(eventRevenue)
            .map(([eventId, revenue]) => {
                const event = events.find(e => e.id === eventId);
                return {
                    name: event?.title.slice(0, 15) + (event && event.title.length > 15 ? '...' : '') || 'Unknown',
                    revenue
                }
            })
            .sort((a,b) => b.revenue - a.revenue)
            .slice(0, 5);

    }, [tickets, events]);


    const { ongoingEvents, upcomingEvents } = useMemo(() => {
        const now = new Date();
        const ongoing: Event[] = [];
        const upcoming: Event[] = [];

        events
            .sort((a,b) => a.date.getTime() - b.date.getTime())
            .forEach(event => {
                const eventDate = new Date(event.date);
                const isPast = isBefore(eventDate, now) && !isSameDay(eventDate, now);
                const isOngoing = (isSameDay(eventDate, now) || (isBefore(eventDate, addDays(now, 2)) && isBefore(now, eventDate)) ) && !isPast;


                if (isOngoing) {
                    ongoing.push(event);
                } else if (!isPast) {
                    upcoming.push(event);
                }
        });
        return { ongoingEvents: ongoing, upcomingEvents: upcoming };
    }, [events]);
    
    const recentActivity = useMemo(() => {
        const ticketPurchases: RecentActivity[] = tickets.map(ticket => {
            const user = users.find(u => u.id === ticket.userId);
            const event = events.find(e => e.id === ticket.eventId);
            return {
                type: 'ticket_purchase',
                user: user!,
                event: event!,
                ticket: ticket,
                timestamp: new Date(ticket.purchaseDate || new Date())
            }
        }).filter(item => item.user && item.event);

        // Sort all activities by timestamp descending and take the last 5
        return ticketPurchases
            .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime())
            .slice(0, 5);

    }, [tickets, users, events]);

    const getRegistrationsForEvent = (eventId: string) => {
        return getMockTickets().filter(ticket => ticket.eventId === eventId).length;
    }


  return (
    <div className="space-y-6">
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card className="glass">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue (30d)</CardTitle>
            <Banknote className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">₹{totalRevenue.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">
                <span className={revenueChange >= 0 ? 'text-green-500' : 'text-destructive'}>
                    {revenueChange >= 0 ? '+' : ''}{revenueChange.toFixed(1)}%
                </span> from last month
            </p>
          </CardContent>
        </Card>
        <Card className="glass">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Registrations (30d)</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">+{totalRegistrations}</div>
             <p className="text-xs text-muted-foreground">
                <span className={registrationsChange >= 0 ? 'text-green-500' : 'text-destructive'}>
                    {registrationsChange >= 0 ? '+' : ''}{registrationsChange.toFixed(1)}%
                </span> from last month
            </p>
          </CardContent>
        </Card>
        <Card className="glass">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Events</CardTitle>
            <CalendarCheck className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{events.length}</div>
            <p className="text-xs text-muted-foreground">{upcomingEvents.length} upcoming</p>
          </CardContent>
        </Card>
        <Card className="glass">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">New Users (30d)</CardTitle>
            <UserPlus className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">+12</div>
            <p className="text-xs text-muted-foreground">+5.2% from last month</p>
          </CardContent>
        </Card>
      </div>
      <div className="grid gap-6 lg:grid-cols-5">
        <Card className="glass lg:col-span-3">
          <CardHeader>
            <CardTitle className="font-headline">Revenue Trends</CardTitle>
            <CardDescription>Revenue over the last 30 days.</CardDescription>
          </CardHeader>
          <CardContent>
             <ChartContainer config={revenueChartConfig} className="h-[250px] w-full">
              <LineChart data={dailyRevenueData} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="date" tickLine={false} axisLine={false} tickMargin={8} tickFormatter={(value) => value.slice(0,6)} />
                <YAxis tickLine={false} axisLine={false} tickMargin={8} tickFormatter={(value) => `₹${Number(value) / 1000}k`} />
                <ChartTooltip cursor={{fill: 'hsl(var(--muted))'}} content={<ChartTooltipContent indicator="dot"/>} />
                <Line type="monotone" dataKey="revenue" stroke="var(--color-revenue)" strokeWidth={2} dot={false} />
              </LineChart>
            </ChartContainer>
          </CardContent>
        </Card>
        <Card className="glass lg:col-span-2">
            <CardHeader>
                <CardTitle className="font-headline">Top Events by Revenue</CardTitle>
                <CardDescription>Your 5 most profitable events.</CardDescription>
            </CardHeader>
            <CardContent>
                <ChartContainer config={topEventsChartConfig} className="h-[250px] w-full">
                    <BarChart data={topEventsData} layout="vertical" margin={{ left: -10, right: 30 }}>
                        <CartesianGrid horizontal={false} />
                        <YAxis dataKey="name" type="category" tickLine={false} axisLine={false} tickMargin={10} width={80} />
                        <XAxis dataKey="revenue" type="number" hide />
                        <ChartTooltip cursor={{fill: 'hsl(var(--muted))'}} content={<ChartTooltipContent />} />
                        <Bar dataKey="revenue" fill="var(--color-revenue)" radius={4} />
                    </BarChart>
                </ChartContainer>
            </CardContent>
        </Card>
      </div>
      <div className="grid gap-6 lg:grid-cols-5">
         <div className="lg:col-span-3 space-y-6">
            <Card className="glass">
                <CardHeader>
                    <CardTitle className="font-headline">Ongoing &amp; Imminent Events</CardTitle>
                    <CardDescription>Events happening now or in the next 48 hours.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    {ongoingEvents.length &gt; 0 ? ongoingEvents.map(event =&gt; {
                        const registrations = getRegistrationsForEvent(event.id);
                        const capacity = event.capacity;
                        const progress = capacity === Infinity ? 0 : (registrations / capacity) * 100;
                        return (
                            &lt;div key={event.id}&gt;
                                &lt;div className="flex justify-between items-center mb-1"&gt;
                                    &lt;Link href={`/events/${event.id}`} className="font-semibold hover:underline truncate"&gt;{event.title}&lt;/Link&gt;
                                    &lt;span className="text-sm font-medium text-muted-foreground"&gt;
                                        {registrations} / {capacity === Infinity ? '∞' : capacity}
                                    &lt;/span&gt;
                                &lt;/div&gt;
                                &lt;Progress value={progress} /&gt;
                                &lt;div className="flex justify-between items-center"&gt;
                                    &lt;p className="text-xs text-muted-foreground mt-1"&gt;{format(event.date, "MMM d, p")}&lt;/p&gt;
                                    &lt;Badge variant="destructive" className="animate-pulse"&gt;Ongoing&lt;/Badge&gt;
                                &lt;/div&gt;
                            &lt;/div&gt;
                        )
                    }) : (
                        &lt;p className="text-sm text-muted-foreground text-center py-4"&gt;No ongoing events right now.&lt;/p&gt;
                    )}
                &lt;/CardContent&gt;
            &lt;/Card&gt;

            &lt;Card className="glass"&gt;
                &lt;CardHeader&gt;
                    &lt;CardTitle className="font-headline"&gt;Upcoming Events&lt;/CardTitle&gt;
                &lt;/CardHeader&gt;
                &lt;CardContent className="space-y-3"&gt;
                    {upcomingEvents.slice(0, 5).map((event, index) =&gt; (
                        &lt;div key={event.id}&gt;
                            &lt;div className="flex justify-between items-start"&gt;
                                &lt;div&gt;
                                    &lt;p className="font-semibold"&gt;{event.title}&lt;/p&gt;
                                    &lt;p className="text-sm text-muted-foreground"&gt;{format(event.date, "eeee, MMM d")}&lt;/p&gt;
                                &lt;/div&gt;
                                &lt;Link href={`/events/${event.id}`}&gt;
                                    &lt;Button variant="ghost" size="sm"&gt;
                                        View
                                        &lt;ArrowRight className="h-4 w-4 ml-1" /&gt;
                                    &lt;/Button&gt;
                                &lt;/Link&gt;
                            &lt;/div&gt;
                            {index &lt; upcomingEvents.slice(0, 5).length - 1 &amp;&amp; &lt;Separator className="my-2" /&gt;}
                        &lt;/div&gt;
                    ))}&lt;/CardContent&gt;
            &lt;/Card&gt;
        &lt;/div&gt;
         &lt;Card className="glass lg:col-span-2"&gt;
            &lt;CardHeader&gt;
                &lt;CardTitle className="font-headline"&gt;Recent Activity&lt;/CardTitle&gt;
            &lt;/CardHeader&gt;
            &lt;CardContent className="space-y-4"&gt;
                {recentActivity.map((activity, index) =&gt; (
                    &lt;div key={index} className="flex items-center gap-4"&gt;
                        &lt;Avatar className="h-9 w-9"&gt;
                            &lt;AvatarImage src={activity.user?.profile.avatar} /&gt;
                            &lt;AvatarFallback&gt;{activity.user?.name.charAt(0)}&lt;/AvatarFallback&gt;
                        &lt;/Avatar&gt;
                        &lt;div className="flex-1 text-sm"&gt;
                            &lt;p&gt;
                                &lt;span className="font-semibold"&gt;{activity.user?.name}&lt;/span&gt; purchased a ticket for &lt;Link href={`/events/${activity.event?.id}`} className="font-semibold hover:underline"&gt;{activity.event?.title}&lt;/Link&gt;.
                            &lt;/p&gt;
                            &lt;p className="text-xs text-muted-foreground"&gt;
                                {format(activity.timestamp, "MMM d, p")}
                            &lt;/p&gt;
                        &lt;/div&gt;
                        &lt;div className="font-semibold text-sm"&gt;
                           +₹{activity.ticket?.price}
                        &lt;/div&gt;
                    &lt;/div&gt;
                ))}&lt;/CardContent&gt;
        &lt;/Card&gt;
      &lt;/div&gt;
    &lt;/div&gt;
  );
}

    