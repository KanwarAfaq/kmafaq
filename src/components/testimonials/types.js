// src/components/testimonials/types.js

// Simple JSDoc type style for clarity in JS.
export const createTestimonial = (overrides = {}) => ({
  id: "",
  text: "",
  name: "",
  title: "",
  institution: "",
  photo: "",
  ...overrides,
});