
"use client";

import { motion } from "framer-motion";
import { AppLogo } from "../AppLogo";

const Orbit = ({
  children,
  radius,
  duration,
  delay = 0,
}: {
  children: React.ReactNode;
  radius: number;
  duration: number;
  delay?: number;
}) => (
  <motion.div
    className="absolute top-1/2 left-1/2"
    style={{
      width: radius * 2,
      height: radius * 2,
      x: "-50%",
      y: "-50%",
    }}
    initial={{ rotate: 0 }}
    animate={{ rotate: 360 }}
    transition={{
      duration,
      ease: "linear",
      repeat: Infinity,
      delay,
    }}
  >
    {children}
  </motion.div>
);

const Node = ({
  x,
  y,
  delay,
  isNucleus = false,
}: {
  x: string;
  y: string;
  delay: number;
  isNucleus?: boolean;
}) => (
  <motion.div
    className="absolute rounded-full bg-primary"
    style={{
      left: x,
      top: y,
      width: isNucleus ? 16 : 12,
      height: isNucleus ? 16 : 12,
      boxShadow: `0 0 12px 1px hsl(var(--primary) / ${
        isNucleus ? "0.9" : "0.7"
      })`,
    }}
    initial={{ scale: 0, opacity: 0 }}
    animate={{
      scale: 1,
      opacity: 1,
    }}
    transition={{
      duration: 0.5,
      delay,
      ease: "circOut",
    }}
  />
);

export const AnimatedDiagram = () => {
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
        Unlock the power of data. Connect with experts, attend exclusive events,
        and accelerate your career in the data industry.
      </motion.p>
      <div className="relative mt-8 h-80 w-80">
        {/* Nucleus */}
        <Node x="50%" y="50%" delay={0.3} isNucleus />

        {/* Orbit 1 */}
        <Orbit radius={60} duration={10}>
          <Node x="0%" y="50%" delay={0.5} />
        </Orbit>

        {/* Orbit 2 */}
        <Orbit radius={100} duration={15}>
          <Node x="20%" y="20%" delay={0.7} />
          <Node x="80%" y="80%" delay={0.8} />
        </Orbit>

        {/* Orbit 3 */}
        <Orbit radius={140} duration={20}>
          <Node x="50%" y="0%" delay={0.9} />
           <Node x="100%" y="50%" delay={1.0} />
           <Node x="0%" y="50%" delay={1.1} />
        </Orbit>
      </div>
    </div>
  );
};
