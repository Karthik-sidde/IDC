
"use client";

import { motion } from "framer-motion";
import { AppLogo } from "../AppLogo";

const Node = ({ x, y, delay }: { x: string; y: string; delay: number }) => (
  <motion.div
    className="absolute h-3 w-3 rounded-full bg-primary shadow-[0_0_12px_theme(colors.primary/80%)]"
    style={{ left: x, top: y }}
    initial={{ scale: 0, opacity: 0 }}
    animate={{ scale: [0, 1.2, 1], opacity: 1 }}
    transition={{ duration: 0.5, delay, ease: "circOut" }}
  />
);

const Connector = ({
  x1,
  y1,
  x2,
  y2,
  delay,
}: {
  x1: number;
  y1: number;
  x2: number;
  y2: number;
  delay: number;
}) => {
  const length = Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2));
  const angle = Math.atan2(y2 - y1, x2 - x1) * (180 / Math.PI);

  return (
    <motion.div
      className="absolute h-px origin-left bg-gradient-to-r from-primary to-primary/30"
      style={{
        left: `${x1}px`,
        top: `${y1}px`,
        width: `${length}px`,
        transform: `rotate(${angle}deg)`,
      }}
      initial={{ scaleX: 0 }}
      animate={{ scaleX: 1 }}
      transition={{ duration: 0.7, delay, ease: "easeOut" }}
    />
  );
};

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

            {/* Connectors */}
            <Connector x1={size*0.5+6} y1={6} x2={size*0.15+6} y2={size*0.25+6} delay={1.1} />
            <Connector x1={size*0.5+6} y1={6} x2={size*0.85+6} y2={size*0.25+6} delay={1.2} />
            <Connector x1={size*0.15+6} y1={size*0.25+6} x2={size*0+6} y2={size*0.70+6} delay={1.3} />
            <Connector x1={size*0.15+6} y1={size*0.25+6} x2={size*0.30+6} y2={size*0.70+6} delay={1.4} />
            <Connector x1={size*0.85+6} y1={size*0.25+6} x2={size*0.70+6} y2={size*0.70+6} delay={1.5} />
            <Connector x1={size*0.85+6} y1={size*0.25+6} x2={size*1+6} y2={size*0.70+6} delay={1.6} />
            <Connector x1={size*0.30+6} y1={size*0.70+6} x2={size*0.5+6} y2={size*1+6} delay={1.7} />
            <Connector x1={size*0.70+6} y1={size*0.70+6} x2={size*0.5+6} y2={size*1+6} delay={1.8} />
        </div>
    </div>
  );
};
