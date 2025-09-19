"use client";

import { useContext, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { UserContext } from "@/context/UserContext";
import { Loader2, ArrowRight } from "lucide-react";
import { AppLogo } from "@/components/AppLogo";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { Progress } from "@/components/ui/progress";

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
  
  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
  };

  return (
      <div className="w-full">
        {/* Hero Section */}
        <section className="relative h-[60vh] flex items-center justify-center text-center text-white p-4">
            <Image 
                src="https://picsum.photos/seed/homebg/1920/1080"
                alt="Community Networking"
                fill
                className="object-cover"
                data-ai-hint="community networking"
            />
            <div className="absolute inset-0 bg-black/50" />
            <motion.div
                className="relative z-10"
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, ease: "easeOut" }}
            >
                <h1 className="text-4xl md:text-6xl font-headline font-bold">
                    Join the Indian Data Club
                </h1>
                <p className="mt-4 text-lg md:text-xl max-w-2xl mx-auto">
                    A community-driven platform for data enthusiasts to learn, connect, and grow.
                </p>
                <Button
                    size="lg"
                    className="mt-8 hover:glow text-lg"
                    onClick={() => router.push('/events')}
                >
                    Explore Events
                    <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
            </motion.div>
        </section>
        
        {/* About Section */}
         <section className="py-16 px-4 md:px-8 bg-background">
            <motion.div 
              className="max-w-5xl mx-auto"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.3 }}
              transition={{ staggerChildren: 0.2 }}
            >
                <motion.h2 className="text-3xl font-headline text-center mb-4" variants={cardVariants}>About Us</motion.h2>
                <motion.p className="text-lg text-muted-foreground text-center max-w-3xl mx-auto" variants={cardVariants}>
                   Welcome to Indian Data Club, a community focused on data education and networking. We provide a platform for individuals to enhance their skills, connect with peers, and stay updated with the latest trends in the data world.
                </motion.p>
                
                <div className="grid md:grid-cols-3 gap-8 mt-12 text-center">
                    <motion.div variants={cardVariants}>
                        <Card className="glass h-full">
                            <CardContent className="p-6">
                                <h3 className="text-xl font-bold font-headline mb-2">Membership</h3>
                                <p className="text-muted-foreground">Join a vibrant community of data professionals and learners. Gain access to exclusive forums, resources, and networking opportunities.</p>
                            </CardContent>
                        </Card>
                    </motion.div>
                    <motion.div variants={cardVariants}>
                        <Card className="glass h-full">
                            <CardContent className="p-6">
                                <h3 className="text-xl font-bold font-headline mb-2">Events & Workshops</h3>
                                <p className="text-muted-foreground">Participate in a variety of events, from hands-on workshops to large-scale conferences, both online and in-person.</p>
                            </CardContent>
                        </Card>
                    </motion.div>
                    <motion.div variants={cardVariants}>
                        <Card className="glass h-full">
                            <CardContent className="p-6">
                                <h3 className="text-xl font-bold font-headline mb-2">Content & Resources</h3>
                                <p className="text-muted-foreground">Access a rich library of materials, including tutorials, workshop slides, and project showcases shared by the community.</p>
                            </CardContent>
                        </Card>
                    </motion.div>
                </div>
            </motion.div>
        </section>

        {/* Terms Snippet Section */}
        <section className="py-16 px-4 md:px-8 bg-secondary/30">
             <motion.div 
              className="max-w-3xl mx-auto"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.5 }}
            >
                <motion.h2 className="text-3xl font-headline text-center mb-4" variants={cardVariants}>User Conduct</motion.h2>
                <motion.p className="text-lg text-muted-foreground text-center" variants={cardVariants}>
                   As a member, you agree to foster a respectful and collaborative environment. Harassment, spamming, and sharing of illegal content are strictly prohibited. By participating, you help us maintain a positive and professional community for everyone. For more details, please review our full terms.
                </motion.p>
                 <motion.div className="text-center mt-6" variants={cardVariants}>
                    <Link href="/terms" className="text-primary hover:underline">
                        Read full Terms & Conditions
                    </Link>
                </motion.div>
            </motion.div>
        </section>

        {/* Contact Section */}
        <footer className="py-8 px-4 text-center bg-background">
            <p className="text-muted-foreground">Have questions? Reach out to us at <a href="mailto:hello@indiandataclub.com" className="text-primary hover:underline">hello@indiandataclub.com</a></p>
        </footer>
      </div>
  );
};


export default function Home() {
  const { user, loading } = useContext(UserContext);
  const router = useRouter();
  const [initialLoading, setInitialLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setInitialLoading(false);
    }, 3500); 

    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (!initialLoading && !loading && user) {
       if (user.role === "user") {
        router.push("/events");
      } else {
        router.push("/admin/dashboard");
      }
    }
  }, [user, loading, initialLoading, router]);

  if (initialLoading || loading) {
    return <LoadingScreen />;
  }

  return <HomePageContent />;
}
