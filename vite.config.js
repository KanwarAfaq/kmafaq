import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import Sitemap from 'vite-plugin-sitemap'
export default defineConfig({
  plugins: [
    react(), // Kept only once
    Sitemap({ 
      generateRobotsTxt: true,
      hostname: 'https://kmafaq.site', // Replace with your actual Spaceship domain
      dynamicRoutes: [
        '/',
        '/About',
        '/Contact',
        '/BlogPost',
        '/all-in-one',
        '/Certifications',
         '/p-gallery',
          '/NotFound',
           '/Projects',
            '/Publications',
            '/Blog'
        // Add all your page routes here!
      ]
    })
  ],
  base: '/', // Correct base path for your repo
})