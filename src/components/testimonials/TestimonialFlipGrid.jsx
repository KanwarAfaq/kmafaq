// src/components/testimonials/TestimonialFlipGrid.jsx
import React, { useState } from "react";
import { motion, useReducedMotion } from "framer-motion";

function FlipCard({ item }) {
  const [flipped, setFlipped] = useState(false);
  const reduceMotion = useReducedMotion();

  const toggle = () => setFlipped((v) => !v);

  return (
    <button
      type="button"
      onClick={toggle}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          toggle();
        }
      }}
      className="group w-full text-left focus:outline-none"
      aria-pressed={flipped}
      aria-label={`Flip testimonial from ${item.name}`}
    >
      <div className="relative h-[320px] w-full [perspective:1200px]">
        <motion.div
          className="relative h-full w-full transition-transform duration-500 [transform-style:preserve-3d]"
          animate={{ rotateY: flipped ? 180 : 0 }}
          transition={reduceMotion ? { duration: 0 } : { duration: 0.55 }}
        >
          {/* FRONT */}
          <div className="absolute inset-0 rounded-3xl border border-white/10 bg-white/5 p-6 shadow-lg [backface-visibility:hidden]">
            <p className="text-sm uppercase tracking-[0.2em] text-white/45">
              Front
            </p>
            <blockquote className="mt-4">
              <p className="text-sm leading-7 text-white/85">“{item.text}”</p>
            </blockquote>
            <div className="mt-6 flex items-center gap-4">
              <img
                src={item.photo}
                alt={item.name}
                className="h-14 w-14 rounded-full object-cover ring-2 ring-white/15"
                loading="lazy"
              />
              <div>
                <p className="font-semibold text-white">{item.name}</p>
                <p className="text-sm text-white/70">
                  {item.title} · {item.institution}
                </p>
              </div>
            </div>
            <p className="mt-6 text-xs text-white/45">
              Click or press Enter to view details
            </p>
          </div>

          {/* BACK */}
          <div className="absolute inset-0 rounded-3xl border border-cyan-400/20 bg-gradient-to-br from-cyan-500/15 to-fuchsia-500/15 p-6 shadow-lg [backface-visibility:hidden] [transform:rotateY(180deg)]">
            <p className="text-sm uppercase tracking-[0.2em] text-white/45">
              Back
            </p>
            <div className="mt-6 space-y-3 text-white/85">
              <p className="text-lg font-semibold">{item.name}</p>
              <p className="text-sm">{item.title}</p>
              <p className="text-sm">{item.institution}</p>
              <p className="pt-2 text-sm text-white/70">
                Use this side for a second quote, project outcome, or summary.
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </button>
  );
}

function TestimonialFlipGrid({ items }) {
  if (!items || items.length === 0) return null;

  return (
    <section aria-label="Flipping testimonials">
      <div className="mb-4">
        <h3 className="text-xl font-semibold text-white">Recommendations</h3>
        <p className="text-sm text-white/60">
          Tap or press Enter/Space to flip each card.
        </p>
      </div>

      <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
        {items.map((item) => (
          <FlipCard key={item.id} item={item} />
        ))}
      </div>
    </section>
  );
}

export default TestimonialFlipGrid;