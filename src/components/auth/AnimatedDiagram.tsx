
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
      width: 12,
      height: 12,
      boxShadow: "0 0 12px 1px hsl(var(--primary) / 0.7)",
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
        {/* Body 1 */}
        <Orbit radius={80} duration={12}>
          <Node x="0%" y="50%" delay={0.5} />
        </Orbit>

        {/* Body 2 */}
        <Orbit radius={120} duration={18}>
          <Node x="20%" y="20%" delay={0.6} />
        </Orbit>

        {/* Body 3 */}
         <Orbit radius={150} duration={25}>
            <Node x="100%" y="50%" delay={0.7} />
        </Orbit>

      </div>
    </div>
  );
};
