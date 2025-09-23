
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
} from "lucide-react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
  Line,
  LineChart,
} from "recharts";
import { ChartContainer, ChartTooltip, ChartTooltipContent, type ChartConfig } from "@/components/ui/chart";
import { getMockEvents, getMockTickets } from "@/lib/mock-data";
import { useState, useEffect, useMemo } from "react";
import { type Event } from "@/lib/types";
import { isBefore, isSameDay, addDays, format } from "date-fns";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Separator } from "@/components/ui/separator";

const revenueData = [
  { month: 'Jan', revenue: 12000 },
  { month: 'Feb', revenue: 19000 },
  { month: 'Mar', revenue: 15000 },
  { month: 'Apr', revenue: 25000 },
  { month: 'May', revenue: 18000 },
  { month: 'Jun', revenue: 32000 },
];

const revenueChartConfig = {
  revenue: {
    label: "Revenue",
    color: "hsl(var(--primary))",
  },
} satisfies ChartConfig;


export default function AdminDashboardPage() {
    const [events, setEvents] = useState<Event[]>([]);
    const [totalRevenue, setTotalRevenue] = useState(0);
    const [totalRegistrations, setTotalRegistrations] = useState(0);

    useEffect(() => {
        const mockEvents = getMockEvents();
        const mockTickets = getMockTickets();
        setEvents(mockEvents);

        const revenue = mockTickets.reduce((acc, ticket) => acc + ticket.price, 0);
        setTotalRevenue(revenue);
        setTotalRegistrations(mockTickets.length);
    }, []);

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
    
    const getRegistrationsForEvent = (eventId: string) => {
        return getMockTickets().filter(ticket => ticket.eventId === eventId).length;
    }


  return (
    <div className="space-y-6">
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card className="glass">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            <Banknote className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">₹{totalRevenue.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">+20.1% from last month</p>
          </CardContent>
        </Card>
        <Card className="glass">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Registrations</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">+{totalRegistrations}</div>
            <p className="text-xs text-muted-foreground">+180.1% from last month</p>
          </CardContent>
        </Card>
        <Card className="glass">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Events Hosted</CardTitle>
            <CalendarCheck className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">+{events.length}</div>
            <p className="text-xs text-muted-foreground">Total events in system</p>
          </CardContent>
        </Card>
        <Card className="glass">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Engagement Rate</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">78%</div>
            <p className="text-xs text-muted-foreground">Avg. across all events</p>
          </CardContent>
        </Card>
      </div>
      <div className="grid gap-6 lg:grid-cols-2">
        <Card className="glass">
          <CardHeader>
            <CardTitle className="font-headline">Revenue Trends</CardTitle>
            <CardDescription>Monthly revenue over the last 6 months.</CardDescription>
          </CardHeader>
          <CardContent>
             <ChartContainer config={revenueChartConfig} className="h-[300px] w-full">
              <LineChart data={revenueData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="month" tickLine={false} axisLine={false} />
                <YAxis tickLine={false} axisLine={false} tickFormatter={(value) => `₹${Number(value) / 1000}k`} />
                <ChartTooltip cursor={{fill: 'hsl(var(--muted))'}} content={<ChartTooltipContent />} />
                <Legend />
                <Line type="monotone" dataKey="revenue" stroke="var(--color-revenue)" strokeWidth={2} dot={{r:4, fill: 'var(--color-revenue)'}} activeDot={{ r: 6 }} />
              </LineChart>
            </ChartContainer>
          </CardContent>
        </Card>
         <div className="space-y-6">
            <Card className="glass">
            <CardHeader>
                <CardTitle className="font-headline">Ongoing & Imminent Events</CardTitle>
                <CardDescription>Events happening now or in the next 48 hours.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                {ongoingEvents.length > 0 ? ongoingEvents.map(event => {
                    const registrations = getRegistrationsForEvent(event.id);
                    const capacity = event.capacity;
                    const progress = capacity === Infinity ? 0 : (registrations / capacity) * 100;
                    return (
                        <div key={event.id}>
                            <div className="flex justify-between items-center mb-1">
                                <Link href={`/events/${event.id}`} className="font-semibold hover:underline truncate">{event.title}</Link>
                                <span className="text-sm font-medium text-muted-foreground">
                                    {registrations} / {capacity === Infinity ? '∞' : capacity}
                                </span>
                            </div>
                            <Progress value={progress} />
                            <p className="text-xs text-muted-foreground mt-1">{format(event.date, "MMM d, p")}</p>
                        </div>
                    )
                }) : (
                    <p className="text-sm text-muted-foreground text-center py-4">No ongoing events right now.</p>
                )}
            </CardContent>
            </Card>

            <Card className="glass">
                <CardHeader>
                    <CardTitle className="font-headline">Upcoming Events</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                    {upcomingEvents.slice(0, 5).map((event, index) => (
                        <div key={event.id}>
                            <div className="flex justify-between items-start">
                                <div>
                                    <p className="font-semibold">{event.title}</p>
                                    <p className="text-sm text-muted-foreground">{format(event.date, "eeee, MMM d")}</p>
                                </div>
                                <Link href={`/events/${event.id}`}>
                                    <Button variant="ghost" size="sm">
                                        View
                                        <ArrowRight className="h-4 w-4 ml-1" />
                                    </Button>
                                </Link>
                            </div>
                            {index < upcomingEvents.slice(0, 5).length - 1 && <Separator className="my-2" />}
                        </div>
                    ))}
                </CardContent>
            </Card>
        </div>
      </div>
    </div>
  );
}
