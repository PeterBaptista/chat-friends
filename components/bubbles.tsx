"use client";

import { useEffect, useState } from "react";

import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

type BubbleProps = {
  x: number;
  y: number;
  color: string;
  size: number;
};

const colors = [
  "#cce4f6", // very light blue
  "#99c9ed", // light blue
  "#66afe5", // medium light blue
  "#3394dc", // medium blue
  "#0079d3", // standard blue
  "#005fa8", // darker blue
  "#00457d", // deep blue
  "#002c52", // very deep navy blue
];

function Bubble({ x, y, color, size }: BubbleProps) {
  return (
    <motion.circle
      cx={x}
      cy={y}
      r={size}
      fill={color}
      initial={{ opacity: 0, scale: 0 }}
      animate={{
        opacity: [0.4, 0.3, 0.4],
        scale: [1, 1.2, 1],
        x: Math.random() * window.innerWidth + 50,
        y: Math.random() * window.innerHeight + 50,
      }}
      transition={{
        duration: 5 + Math.random() * 10,
        repeat: Number.POSITIVE_INFINITY,
        repeatType: "reverse",
      }}
    />
  );
}
export function BubblesBackground({ className }: { className?: string }) {
  const [bubbles, setBubbles] = useState<BubbleProps[]>([]);
  useEffect(() => {
    const newBubbles = Array.from({ length: 20 }, () => ({
      x: Math.random() * window.innerWidth - 50,
      y: Math.random() * window.innerHeight - 50,
      color: colors[Math.floor(Math.random() * colors.length)],
      size: Math.random() * 50 + 5,
    }));
    setBubbles(newBubbles);
  }, []);

  return (
    <svg
      className={cn(
        "w-full body-height z-50 bg-primary/10 overflow-hidden",
        className
      )}
    >
      {bubbles.map((bubble, index) => (
        <Bubble key={index} {...bubble} />
      ))}
    </svg>
  );
}
