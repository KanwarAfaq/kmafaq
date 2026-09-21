# K.M. AFAQ — AI Research Portfolio

Source code for the official portfolio of **Kanwar Muhammad Afaq (K.M. AFAQ)**, an AI researcher working across natural language processing, machine learning, deep learning, code-mixed Roman Urdu, environmental forecasting, and applied data systems.

Production: https://kmafaq.site/

## Stack

- React 19 + Vite
- React Router
- Tailwind CSS
- Framer Motion
- Supabase-backed portfolio content
- Vercel deployment

## Public routes

- `/` — Home
- `/about` — Research profile and background
- `/projects` — AI/ML/NLP projects
- `/publications` — Publications and manuscripts
- `/certifications` — Certifications
- `/gallery` — Research and professional gallery
- `/blog` and `/blog/:slug` — Technical articles
- `/contact` — Contact page
- `/scholarships` — AI/NLP PhD opportunity tracker

Legacy `/p-gallery` permanently redirects to `/gallery`.

## SEO / GEO architecture

The site includes route-specific titles and descriptions, canonical URLs, Open Graph/Twitter metadata, JSON-LD for the researcher, article-level `BlogPosting` data, `robots.txt`, `sitemap.xml`, and an auxiliary `llms.txt` file. Admin and password-reset routes are explicitly excluded from indexing.

The sitemap is generated during the production build so database-backed blog slugs can be included when build-time environment variables are available.

## Local development

Run `npm ci`, then `npm run dev`. Create a local `.env` from `.env.example` and never commit environment files.

## Validation

Before production deployment, run `npm run lint` and `npm run build`. Verify the homepage, gallery, blog listing, a blog article, sitemap, robots file, a real 404, and the legacy gallery redirect.
