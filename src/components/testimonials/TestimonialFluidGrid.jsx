// src/components/testimonials/TestimonialFluidGrid.jsx
import React from "react";
import { motion, useReducedMotion } from "framer-motion";
import TestimonialCard from "./TestimonialCard";

function TestimonialFluidGrid({ items }) {
  const reduceMotion = useReducedMotion();

  if (!items || items.length === 0) return null;

  return (
    <section aria-label="Testimonial grid">
      <div className="mb-4">
        <h3 className="text-xl font-semibold text-white">What people say</h3>
        <p className="text-sm text-white/60">
          Responsive grid with subtle motion.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-12">
        {items.map((item, i) => {
          const wide = i === 0 || i === 3;
          return (
            <motion.div
              key={item.id}
              className={wide ? "xl:col-span-7" : "xl:col-span-5"}
              initial={
                reduceMotion ? { opacity: 1 } : { opacity: 0, y: 18 }
              }
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.35, delay: i * 0.05 }}
            >
              <TestimonialCard item={item} className="h-full" />
            </motion.div>
          );
        })}
      </div>
    </section>
  );
}

export default TestimonialFluidGrid;