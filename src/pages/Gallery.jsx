// src/pages/Gallery.jsx
import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { FiX, FiZoomIn, FiChevronLeft, FiChevronRight } from 'react-icons/fi'
import { supabase } from '../lib/supabase'

const categories = ['All', 'AI Research', 'NLP', 'Data Science', 'Automation', 'Development', 'Research']

export default function Gallery() {
  const [active,   setActive]   = useState('All')
  const [lightbox, setLightbox] = useState(null)
  const [dbGallery, setDbGallery] = useState([])

  // Fetch gallery images dynamically from Supabase
  useEffect(() => {
    const fetchGallery = async () => {
      const { data, error } = await supabase
        .from('gallery')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error("Error pulling database gallery:", error);
      } else if (data) {
        setDbGallery(data);
      }
    };
    fetchGallery();
  }, []);

  const filtered = active === 'All'
    ? dbGallery
    : dbGallery.filter(g => g.folder === active) // Assuming your table uses 'folder' for categorization

  const openLightbox = (item) => setLightbox(item)
  const closeLightbox = () => setLightbox(null)

  const navigate = (dir) => {
    const idx  = filtered.findIndex(g => g.id === lightbox.id)
    const next = (idx + dir + filtered.length) % filtered.length
    setLightbox(filtered[next])
  }

  return (
    <div>

      {/* ── Banner ── */}
      <section
        className="relative h-64 md:h-80 flex items-center justify-center"
        style={{
          backgroundImage: 'url(https://images.unsplash.com/photo-1620712943543-bcc4688e7485?w=1600&q=80)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        <div className="absolute inset-0 bg-black/70" />
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className="relative z-10 text-center px-4"
        >
          <p className="text-accent font-mono text-sm tracking-widest uppercase mb-3">
            Visual Showcase
          </p>
          <h1 className="text-4xl md:text-6xl font-black text-white">
            My <span className="text-accent">Gallery</span>
          </h1>
        </motion.div>
      </section>

      {/* ── Category Filter ── */}
      <section className="py-8 px-4 md:px-8 lg:px-16 bg-white dark:bg-gray-950 border-b border-gray-100 dark:border-gray-800">
        <div className="max-w-6xl mx-auto flex flex-wrap gap-2 justify-center">
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setActive(cat)}
              className={`px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200
                ${active === cat
                  ? 'bg-accent text-white shadow-lg scale-105'
                  : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:text-accent'
                }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </section>

      {/* ── Cinematic Grid ── */}
      <section className="section-padding bg-gray-950">
        <div className="max-w-7xl mx-auto">
          <motion.div layout className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            <AnimatePresence>
              {filtered.map((item, i) => (
                <motion.div
                  key={item.id || i}
                  layout
                  initial={{ opacity: 0, scale: 0.85 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.85 }}
                  transition={{ duration: 0.4, delay: i * 0.06 }}
                  className={`cinematic-card group ${i % 5 === 0 ? 'sm:col-span-2 h-72' : 'h-60'}`}
                  onClick={() => openLightbox(item)}
                >
                  <img
                    src={item.url}
                    alt={item.name}
                    className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

                  {/* Category Badge */}
                  <div className="absolute top-4 left-4">
                    <span className="px-3 py-1 rounded-full text-xs font-semibold bg-accent text-white">
                      {item.folder}
                    </span>
                  </div>

                  {/* Zoom Icon */}
                  <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <div className="p-2 rounded-full bg-white/20 backdrop-blur-sm text-white">
                      <FiZoomIn size={16} />
                    </div>
                  </div>

                  {/* Hover Overlay */}
                  <div className="cinematic-overlay">
                    <h3 className="text-white font-bold text-lg leading-tight mb-1">
                      {item.name}
                    </h3>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>

          {filtered.length === 0 && (
            <div className="text-center py-20 text-gray-500">
              <p className="text-lg">No items in this category.</p>
            </div>
          )}
        </div>
      </section>

      {/* ── Lightbox ── */}
      <AnimatePresence>
        {lightbox && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[999] bg-black/95 backdrop-blur-md flex items-center justify-center px-4"
            onClick={closeLightbox}
          >
            <motion.div
              initial={{ scale: 0.85, opacity: 0 }}
              animate={{ scale: 1,    opacity: 1 }}
              exit={{ scale: 0.85,    opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="relative max-w-4xl w-full"
              onClick={e => e.stopPropagation()}
            >
              {/* Close Button */}
              <button
                onClick={closeLightbox}
                className="absolute -top-12 right-0 p-2 text-white/70 hover:text-white transition-colors"
              >
                <FiX size={28} />
              </button>

              {/* Image */}
              <img
                src={lightbox.url}
                alt={lightbox.name}
                className="w-full max-h-[70vh] object-contain rounded-2xl shadow-2xl"
              />

              {/* Caption */}
              <div className="mt-4 text-center">
                <span className="inline-block px-3 py-1 rounded-full text-xs font-semibold bg-accent text-white mb-2">
                  {lightbox.folder}
                </span>
                <h3 className="text-white text-xl font-bold mb-1">{lightbox.name}</h3>
              </div>

              {/* Prev / Next Buttons */}
              <button
                onClick={() => navigate(-1)}
                className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-14 p-3 rounded-full bg-white/10 text-white hover:bg-accent transition-all hidden md:flex"
              >
                <FiChevronLeft size={22} />
              </button>
              <button
                onClick={() => navigate(1)}
                className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-14 p-3 rounded-full bg-white/10 text-white hover:bg-accent transition-all hidden md:flex"
              >
                <FiChevronRight size={22} />
              </button>

              {/* Mobile Prev/Next */}
              <div className="flex justify-center gap-4 mt-4 md:hidden">
                <button
                  onClick={() => navigate(-1)}
                  className="p-3 rounded-full bg-white/10 text-white hover:bg-accent transition-all"
                >
                  <FiChevronLeft size={22} />
                </button>
                <button
                  onClick={() => navigate(1)}
                  className="p-3 rounded-full bg-white/10 text-white hover:bg-accent transition-all"
                >
                  <FiChevronRight size={22} />
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}