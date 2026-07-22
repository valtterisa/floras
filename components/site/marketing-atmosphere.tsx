"use client";

import { useEffect, useRef } from "react";
import {
  motion,
  useMotionTemplate,
  useMotionValue,
  useReducedMotion,
  useSpring,
} from "framer-motion";

export function MarketingAtmosphere() {
  const reduce = useReducedMotion();
  const root = useRef<HTMLDivElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const sx = useSpring(x, { stiffness: 60, damping: 24, mass: 0.6 });
  const sy = useSpring(y, { stiffness: 60, damping: 24, mass: 0.6 });
  const spot = useMotionTemplate`radial-gradient(520px circle at ${sx}px ${sy}px, var(--atmosphere-spot), var(--atmosphere-spot-mid) 35%, transparent 65%)`;
  const halo = useMotionTemplate`radial-gradient(280px circle at ${sx}px ${sy}px, var(--atmosphere-halo), transparent 70%)`;

  useEffect(() => {
    if (reduce) return;

    const onMove = (e: PointerEvent) => {
      x.set(e.clientX);
      y.set(e.clientY);
    };

    const onLeave = () => {
      x.set(window.innerWidth * 0.5);
      y.set(window.innerHeight * 0.28);
    };

    onLeave();
    window.addEventListener("pointermove", onMove, { passive: true });
    window.addEventListener("pointerleave", onLeave);
    return () => {
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerleave", onLeave);
    };
  }, [reduce, x, y]);

  if (reduce) {
    return (
      <div
        aria-hidden
        className="pointer-events-none fixed inset-0 -z-10 overflow-hidden bg-[var(--atmosphere)]"
      >
        <div
          className="absolute left-1/2 top-[28%] h-[420px] w-[640px] -translate-x-1/2 -translate-y-1/2 opacity-70"
          style={{
            background:
              "radial-gradient(closest-side, var(--atmosphere-spot), transparent)",
          }}
        />
      </div>
    );
  }

  return (
    <div
      ref={root}
      aria-hidden
      className="pointer-events-none fixed inset-0 -z-10 overflow-hidden bg-[var(--atmosphere)]"
    >
      <motion.div className="absolute inset-0" style={{ background: spot }} />
      <motion.div className="absolute inset-0 opacity-80" style={{ background: halo }} />
      <div
        className="absolute inset-0 opacity-[0.28] dark:opacity-[0.2]"
        style={{
          backgroundImage:
            "linear-gradient(to right, var(--atmosphere-grid) 1px, transparent 1px), linear-gradient(to bottom, var(--atmosphere-grid) 1px, transparent 1px)",
          backgroundSize: "64px 64px",
          maskImage:
            "radial-gradient(ellipse 70% 55% at 50% 30%, black 20%, transparent 75%)",
        }}
      />
    </div>
  );
}
