// src/components/testimonials/TestimonialCarousel.jsx
import React, { useEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import TestimonialCard from "./TestimonialCard";

function TestimonialCarousel({ items, autoplay = true, intervalMs = 5000 }) {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const shouldReduceMotion = useReducedMotion();
  const startX = useRef(null);

  const count = items.length;
  const active = useMemo(() => items[index], [items, index]);

  const next = () => setIndex((v) => (v + 1) % count);
  const prev = () => setIndex((v) => (v - 1 + count) % count);

  useEffect(() => {
    if (!autoplay || paused || shouldReduceMotion || count < 2) return;
    const t = window.setInterval(next, intervalMs);
    return () => window.clearInterval(t);
  }, [autoplay, paused, shouldReduceMotion, intervalMs, count]);

  const onKeyDown = (e) => {
    if (e.key === "ArrowRight") next();
    if (e.key === "ArrowLeft") prev();
    if (e.key === "Home") setIndex(0);
    if (e.key === "End") setIndex(count - 1);
  };

  const onPointerDown = (e) => {
    startX.current = e.clientX;
  };

  const onPointerUp = (e) => {
    if (startX.current === null) return;
    const dx = e.clientX - startX.current;
    if (Math.abs(dx) > 40) {
      if (dx < 0) next();
      else prev();
    }
    startX.current = null;
  };

  if (!items || items.length === 0) return null;

  return (
    <section
      className="relative overflow-hidden"
      tabIndex={0}
      onKeyDown={onKeyDown}
      onFocus={() => setPaused(true)}
      onBlur={() => setPaused(false)}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      aria-roledescription="carousel"
      aria-label="Testimonials carousel"
    >
      <div className="mb-4 flex items-center justify-between">
        <div>
          <h3 className="text-xl font-semibold text-white">Testimonials</h3>
          <p className="text-sm text-white/60">
            Swipe, use arrow keys, or autoplay.
          </p>
        </div>

        <div className="flex gap-2">
          <button
            type="button"
            onClick={prev}
            className="rounded-full border border-white/15 px-4 py-2 text-sm text-white hover:bg-white/10 focus:outline-none focus:ring-2 focus:ring-cyan-400"
            aria-label="Previous testimonial"
          >
            Prev
          </button>
          <button
            type="button"
            onClick={next}
            className="rounded-full border border-white/15 px-4 py-2 text-sm text-white hover:bg-white/10 focus:outline-none focus:ring-2 focus:ring-cyan-400"
            aria-label="Next testimonial"
          >
            Next
          </button>
        </div>
      </div>

      <div
        className="relative"
        onPointerDown={onPointerDown}
        onPointerUp={onPointerUp}
      >
        <AnimatePresence mode="wait">
          <motion.div
            key={active.id}
            initial={
              shouldReduceMotion ? { opacity: 0 } : { opacity: 0, x: 30 }
            }
            animate={{ opacity: 1, x: 0 }}
            exit={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, x: -30 }}
            transition={{ duration: 0.35 }}
            aria-live="polite"
          >
            <TestimonialCard item={active} className="min-h-[260px]" />
          </motion.div>
        </AnimatePresence>
      </div>

      <div className="mt-4 flex items-center justify-center gap-2">
        {items.map((item, i) => (
          <button
            key={item.id}
            type="button"
            onClick={() => setIndex(i)}
            className={`h-2.5 rounded-full transition-all focus:outline-none focus:ring-2 focus:ring-cyan-400 ${
              i === index ? "w-8 bg-cyan-400" : "w-2.5 bg-white/30"
            }`}
            aria-label={`Go to testimonial ${i + 1}`}
            aria-pressed={i === index}
          />
        ))}
      </div>
    </section>
  );
}

export default TestimonialCarousel;