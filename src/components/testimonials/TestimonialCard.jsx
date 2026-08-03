// src/components/testimonials/TestimonialCard.jsx
import React from "react";

function TestimonialCard({ item, className = "", children }) {
  return (
    <article
      className={`rounded-3xl border border-white/10 bg-white/5 p-6 shadow-lg backdrop-blur-md ${className}`}
      aria-label={`Testimonial from ${item.name}`}
    >
      <blockquote className="space-y-4">
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

      {children}
    </article>
  );
}

export default TestimonialCard;