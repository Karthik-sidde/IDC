
"use client";

import { motion } from "framer-motion";
import { AppLogo } from "../AppLogo";

const Node = ({ x, y, delay }: { x: string; y: string; delay: number }) => (
  <motion.div
    className="absolute h-3 w-3 rounded-full bg-primary shadow-[0_0_12px_theme(colors.primary/80%)]"
    style={{ left: x, top: y }}
    initial={{ scale: 0, opacity: 0 }}
    animate={{ 
        scale: [0, 1.2, 1], 
        opacity: 1,
        y: [0, -5, 0], // floating effect
    }}
    transition={{ 
        duration: 0.5, 
        delay, 
        ease: "circOut",
        y: {
            delay: delay + 0.5,
            duration: 2.5,
            repeat: Infinity,
            repeatType: "mirror",
            ease: "easeInOut"
        }
    }}
  />
);

export const AnimatedDiagram = () => {
    const size = 300;
  return (
    <div className="flex flex-col items-center justify-center gap-6 text-center">
        <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
        >
            <AppLogo />
        </motion.div>
        <motion.h1 
            className="text-3xl font-bold font-headline tracking-tight text-foreground"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1, ease: "easeOut" }}
        >
            Indian Data Club
        </motion.h1>
        <motion.p 
            className="max-w-md text-muted-foreground"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2, ease: "easeOut" }}
        >
            Unlock the power of data. Connect with experts, attend exclusive events, and accelerate your career in the data industry.
        </motion.p>
        <div style={{width: size, height: size}} className="relative mt-8">
            <Node x="50%" y="0%" delay={0.3} />
            <Node x="15%" y="25%" delay={0.4} />
            <Node x="85%" y="25%" delay={0.5} />
            <Node x="0%" y="70%" delay={0.6} />
            <Node x="30%" y="70%" delay={0.7} />
            <Node x="70%" y="70%" delay={0.8} />
            <Node x="100%" y="70%" delay={0.9} />
            <Node x="50%" y="100%" delay={1.0} />
        </div>
    </div>
  );
};
