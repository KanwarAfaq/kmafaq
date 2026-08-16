import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import Sitemap from 'vite-plugin-sitemap'

export default defineConfig({
  plugins: [
    react(), 
    Sitemap({ 
      generateRobotsTxt: true,
      hostname: 'https://kmafaq.site', 
      // Only the exact lowercase paths that match your App.jsx routing
      dynamicRoutes: [
        '/about',
        '/contact',
        '/all-in-one',
        '/certifications',
        '/p-gallery',
        '/projects',
        '/publications',
        '/blog'
      ]
    })
  ],
  base: '/', 
})