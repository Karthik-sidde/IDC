
"use client";

import { useContext, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { UserContext } from "@/context/UserContext";
import { Loader2, ArrowRight, BookOpen, Users, BrainCircuit, Briefcase } from "lucide-react";
import { AppLogo } from "@/components/AppLogo";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { Progress } from "@/components/ui/progress";
import { mockEvents } from "@/lib/mock-data";
import { EventCard } from "@/components/events/EventCard";


const LoadingScreen = () => {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(timer);
          return 100;
        }
        return prev + 1;
      });
    }, 30); // Adjust timing for desired speed
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="flex h-screen w-full flex-col items-center justify-center bg-background gap-4">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <AppLogo />
      </motion.div>
      <motion.p
        className="text-lg font-semibold text-primary"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        Indian Data Club
      </motion.p>
      <motion.div
        className="w-1/4 mt-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.4 }}
      >
        <Progress value={progress} className="w-full" />
      </motion.div>
    </div>
  );
};


const HomePageContent = () => {
  const router = useRouter();
  
  const featuredEvents = mockEvents.filter(e => e.date > new Date()).slice(0, 3);
  
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        ease: "easeOut",
      },
    },
  };

  return (
      <div className="w-full">
        {/* Hero Section */}
        <section className="relative h-[70vh] flex items-center justify-center text-center text-white p-4">
            <Image 
                src="https://picsum.photos/seed/homebg/1920/1080"
                alt="Community Networking"
                fill
                className="object-cover"
                data-ai-hint="community networking"
            />
            <div className="absolute inset-0 bg-black/60" />
            <motion.div
                className="relative z-10"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.8, ease: "easeOut" }}
            >
                <h1 className="text-4xl md:text-6xl font-headline font-bold tracking-tight">
                    Welcome to the Indian Data Club
                </h1>
                <p className="mt-4 text-lg md:text-xl max-w-3xl mx-auto text-white/90">
                    A community-driven platform for data enthusiasts to learn, connect, and grow through expert-led events and workshops.
                </p>
                <Button
                    size="lg"
                    className="mt-8 hover:glow text-lg"
                    onClick={() => router.push('/events')}
                >
                    Explore Events
                    <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
                </Button>
            </motion.div>
        </section>
        
        {/* About Section */}
         <section className="py-20 px-4 md:px-8 bg-background">
            <motion.div 
              className="max-w-5xl mx-auto"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.2 }}
              variants={containerVariants}
            >
                <motion.h2 className="text-4xl font-headline text-center mb-4" variants={itemVariants}>
                    Learn, Network, and Innovate
                </motion.h2>
                <motion.p className="text-lg text-muted-foreground text-center max-w-3xl mx-auto mb-16" variants={itemVariants}>
                   The Indian Data Club is India's premier community for data science professionals, students, and enthusiasts. Our mission is to foster a collaborative environment for continuous learning and professional growth in the world of data.
                </motion.p>
                
                <motion.div 
                  className="grid md:grid-cols-3 gap-8 text-center"
                  variants={containerVariants}
                >
                    <motion.div variants={itemVariants}>
                        <Card className="glass h-full">
                            <CardHeader>
                                <BookOpen className="h-10 w-10 mx-auto text-primary mb-2" />
                                <h3 className="text-xl font-bold font-headline">Education</h3>
                            </CardHeader>
                            <CardContent>
                                <p className="text-muted-foreground">Gain access to exclusive workshops, tutorials, and resources designed to sharpen your data skills, from fundamentals to advanced AI.</p>
                            </CardContent>
                        </Card>
                    </motion.div>
                    <motion.div variants={itemVariants}>
                        <Card className="glass h-full">
                            <CardHeader>
                                <Users className="h-10 w-10 mx-auto text-primary mb-2" />
                                <h3 className="text-xl font-bold font-headline">Community</h3>
                            </CardHeader>
                             <CardContent>
                                <p className="text-muted-foreground">Join a vibrant community to network with peers, find mentors, and collaborate on exciting data projects.</p>
                            </CardContent>
                        </Card>
                    </motion.div>
                    <motion.div variants={itemVariants}>
                        <Card className="glass h-full">
                           <CardHeader>
                                <Briefcase className="h-10 w-10 mx-auto text-primary mb-2" />
                                <h3 className="text-xl font-bold font-headline">Careers</h3>
                            </CardHeader>
                            <CardContent>
                                <p className="text-muted-foreground">Discover career opportunities, get resume feedback, and connect with top companies looking for data talent.</p>
                            </CardContent>
                        </Card>
                    </motion.div>
                </motion.div>
            </motion.div>
        </section>

        {/* Featured Events */}
        {featuredEvents.length > 0 && (
            <section className="py-20 px-4 md:px-8 bg-secondary/30">
                <motion.div
                    className="max-w-7xl mx-auto"
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, amount: 0.1 }}
                    variants={containerVariants}
                >
                    <motion.h2 variants={itemVariants} className="text-4xl font-headline text-center mb-4">Featured Events</motion.h2>
                    <motion.p variants={itemVariants} className="text-lg text-muted-foreground text-center max-w-3xl mx-auto mb-12">
                        Check out some of our upcoming workshops and conferences.
                    </motion.p>
                    <motion.div variants={containerVariants} className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                        {featuredEvents.map((event, i) => (
                           <motion.div key={event.id} variants={itemVariants}>
                                <EventCard event={event} />
                           </motion.div>
                        ))}
                    </motion.div>
                </motion.div>
            </section>
        )}

        {/* Why Join Us Section */}
         <section className="py-20 px-4 md:px-8 bg-background">
            <motion.div 
              className="max-w-5xl mx-auto"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.2 }}
              variants={containerVariants}
            >
                <motion.h2 className="text-4xl font-headline text-center mb-12" variants={itemVariants}>Why Join the Indian Data Club?</motion.h2>
                <div className="grid md:grid-cols-2 gap-x-12 gap-y-8">
                    <motion.div className="flex gap-4" variants={itemVariants}>
                        <div className="flex-shrink-0"><BrainCircuit className="h-8 w-8 text-primary" /></div>
                        <div>
                            <h3 className="text-xl font-bold">Expert-Led Workshops</h3>
                            <p className="text-muted-foreground mt-1">Learn practical skills from industry veterans at the top of their fields in data science, analytics, and AI.</p>
                        </div>
                    </motion.div>
                    <motion.div className="flex gap-4" variants={itemVariants}>
                        <div className="flex-shrink-0"><Users className="h-8 w-8 text-primary" /></div>
                        <div>
                            <h3 className="text-xl font-bold">Exclusive Networking</h3>
                            <p className="text-muted-foreground mt-1">Connect with a curated community of professionals, expanding your network and finding new opportunities.</p>
                        </div>
                    </motion.div>
                    <motion.div className="flex gap-4" variants={itemVariants}>
                        <div className="flex-shrink-0"><Briefcase className="h-8 w-8 text-primary" /></div>
                        <div>
                            <h3 className="text-xl font-bold">Career Advancement</h3>
                            <p className="text-muted-foreground mt-1">Get access to job boards, career fairs, and mentorship programs designed to help you land your dream job.</p>
                        </div>
                    </motion.div>
                    <motion.div className="flex gap-4" variants={itemVariants}>
                        <div className="flex-shrink-0"><BookOpen className="h-8 w-8 text-primary" /></div>
                        <div>
                            <h3 className="text-xl font-bold">Rich Resource Library</h3>
                            <p className="text-muted-foreground mt-1">Leverage a vast collection of code repositories, datasets, and presentation slides from past events.</p>
                        </div>
                    </motion.div>
                </div>
            </motion.div>
        </section>

        {/* Terms Snippet Section */}
        <section className="py-20 px-4 md:px-8 bg-secondary/30">
             <motion.div 
              className="max-w-3xl mx-auto text-center"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.3 }}
              variants={containerVariants}
            >
                <motion.h2 className="text-3xl font-headline mb-4" variants={itemVariants}>Join a Community Built on Respect</motion.h2>
                <motion.p className="text-lg text-muted-foreground" variants={itemVariants}>
                   We are committed to maintaining a professional and collaborative environment. Our community guidelines ensure a positive experience for everyone.
                </motion.p>
                 <motion.div className="mt-6" variants={itemVariants}>
                    <Button asChild>
                        <Link href="/terms">
                            Read Our Terms & Conditions
                        </Link>
                    </Button>
                </motion.div>
            </motion.div>
        </section>

        {/* Contact Section */}
        <footer className="py-8 px-4 text-center bg-background">
            <p className="text-muted-foreground">Have questions? Reach out to us at <a href="mailto:hello@indiandataclub.com" className="text-primary hover:underline">hello@indiandataclub.com</a></p>
            <p className="text-xs text-muted-foreground mt-2">&copy; {new Date().getFullYear()} Indian Data Club. All Rights Reserved.</p>
        </footer>
      </div>
  );
};


export default function Home() {
  const { loading } = useContext(UserContext);
  const [initialLoading, setInitialLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setInitialLoading(false);
    }, 3500); 

    return () => clearTimeout(timer);
  }, []);

  if (initialLoading || loading) {
    return <LoadingScreen />;
  }

  return <HomePageContent />;
}

    