// src/components/GallerySection.jsx
import { useState, useEffect, useRef, useCallback } from 'react'
import { motion, AnimatePresence, useScroll, useTransform } from 'framer-motion'
import { FiX, FiDownload, FiShare2, FiChevronLeft, FiChevronRight, FiZoomIn, FiGrid, FiFilter } from 'react-icons/fi'
import { supabase } from '../lib/supabase';

/* ─────────────────────────────────────────
   Helpers
───────────────────────────────────────── */
function formatSize(bytes) {
  if (!bytes) return '0 B'
  if (bytes < 1024)       return `${bytes} B`
  if (bytes < 1024 ** 2)  return `${(bytes / 1024).toFixed(1)} KB`
  return `${(bytes / 1024 ** 2).toFixed(1)} MB`
}

const BENTO_PATTERN = [
  'col-span-1 row-span-2', 'col-span-2 row-span-2', 'col-span-1 row-span-2', 
  'col-span-2 row-span-1', 'col-span-1 row-span-1', 'col-span-1 row-span-1', 
  'col-span-1 row-span-1', 'col-span-1 row-span-2', 'col-span-2 row-span-1', 
  'col-span-1 row-span-1', 'col-span-1 row-span-1', 'col-span-2 row-span-2',
]
const getBento = i => BENTO_PATTERN[i % BENTO_PATTERN.length]

/* ─────────────────────────────────────────
   Hero Banner with Parallax
───────────────────────────────────────── */
function HeroBanner() {
  const ref = useRef(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end start'] })
  const y = useTransform(scrollYProgress, [0, 1], ['0%', '30%'])

  return (
    <div ref={ref} className="relative h-[42vh] min-h-[280px] overflow-hidden flex items-center justify-center">
      <motion.div style={{ y }} className="absolute inset-0 scale-110">
        <div className="w-full h-full bg-cover bg-center" style={{ backgroundImage: "url('https://images.unsplash.com/photo-1518020382113-a7e8fc38eac9?w=1800&q=80')" }} />
      </motion.div>
      <div className="absolute inset-0 bg-black/75" />
      <div className="absolute inset-0" style={{ background: 'radial-gradient(ellipse at center, transparent 40%, rgba(180,100,0,0.2) 100%)' }} />
      <div className="absolute inset-0 opacity-[0.035] pointer-events-none" style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`, backgroundSize: '128px' }} />
      
      <div className="relative z-10 text-center px-4 select-none">
        <motion.p initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="text-amber-400/80 text-xs font-bold tracking-[0.45em] uppercase mb-3">
          K.M. Afaq · Portfolio
        </motion.p>
        <motion.h1 initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="text-5xl md:text-7xl font-black text-white leading-none" style={{ fontFamily: "'Georgia', serif", letterSpacing: '-0.02em' }}>
          DARK <span className="text-amber-400">CINEMA</span>
        </motion.h1>
        <motion.p initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="text-gray-400 text-sm mt-4 tracking-[0.25em] uppercase">
          Cinematic Full-Screen Experience
        </motion.p>
        <motion.div initial={{ scaleX: 0 }} animate={{ scaleX: 1 }} transition={{ delay: 0.55, duration: 0.9 }} className="w-24 h-px bg-amber-400/60 mx-auto mt-5" />
      </div>
      <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-black to-transparent" />
    </div>
  )
}

/* ─────────────────────────────────────────
   Filter Bar, BentoCard, FilmStrip, Lightbox, EmptyState 
───────────────────────────────────────── */
function FilterBar({ active, setActive, counts, categories }) {
  const all = ['All', ...categories]
  return (
    <div className="flex items-center gap-2 flex-wrap">
      <FiFilter size={13} className="text-amber-400/60 flex-shrink-0" />
      {all.map(f => (
        <button key={f} onClick={() => setActive(f)} className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-bold tracking-wider uppercase transition-all duration-300 ${active === f ? 'bg-amber-400 text-black shadow-lg shadow-amber-400/25' : 'bg-white/5 text-gray-400 border border-white/10 hover:border-amber-400/40 hover:text-amber-300'}`}>
          {f}
          <span className={`text-[10px] px-1.5 py-0.5 rounded-full font-black ${active === f ? 'bg-black/20 text-black' : 'bg-white/10 text-gray-600'}`}>
            {f === 'All' ? counts.total : (counts[f] ?? 0)}
          </span>
        </button>
      ))}
    </div>
  )
}

function BentoCard({ img, index, onClick }) {
  const [loaded, setLoaded] = useState(false)
  return (
    <motion.div layout initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.93 }} transition={{ duration: 0.4, delay: index * 0.045 }} onClick={() => onClick(index)} className={`${getBento(index)} relative group cursor-pointer overflow-hidden rounded-xl bg-gray-900 border border-white/5 hover:border-amber-400/30 transition-colors duration-300`}>
      {!loaded && <div className="absolute inset-0 bg-gradient-to-br from-gray-800 to-gray-900 animate-pulse" />}
      <img src={img.url} alt={img.name} loading="lazy" onLoad={() => setLoaded(true)} className={`w-full h-full object-cover transition-all duration-700 group-hover:scale-110 group-hover:brightness-[0.65] ${loaded ? 'opacity-100' : 'opacity-0'}`} />
      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500" style={{ background: 'linear-gradient(to top, rgba(120,60,0,0.7) 0%, transparent 60%)' }} />
      <div className="absolute bottom-0 left-0 right-0 p-3 md:p-4 translate-y-full group-hover:translate-y-0 transition-transform duration-500 ease-out">
        <p className="text-white font-bold text-sm leading-snug truncate drop-shadow-lg">{img.name}</p>
        <div className="flex items-center gap-2 mt-1.5">
          <span className="text-amber-400 text-[10px] font-bold uppercase tracking-widest bg-amber-400/15 px-2 py-0.5 rounded-full border border-amber-400/25">{img.folder}</span>
          <span className="text-gray-400 text-[10px]">{formatSize(img.size)}</span>
        </div>
      </div>
      <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
        <div className="w-8 h-8 rounded-full bg-black/50 backdrop-blur-sm flex items-center justify-center border border-white/20"><FiZoomIn size={14} className="text-amber-400" /></div>
      </div>
      <div className="absolute top-3 left-3">
        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-black/60 backdrop-blur-sm text-amber-400 border border-amber-400/20 uppercase tracking-widest">{img.folder}</span>
      </div>
    </motion.div>
  )
}

function FilmStrip({ images, onOpen }) {
  const ref = useRef(null)
  const scroll = dir => ref.current?.scrollBy({ left: dir * 280, behavior: 'smooth' })
  if (!images.length) return null
  return (
    <div className="relative">
      <button onClick={() => scroll(-1)} className="absolute left-0 top-1/2 -translate-y-1/2 z-10 w-9 h-9 rounded-full bg-black/80 border border-white/10 hover:border-amber-400/50 flex items-center justify-center text-gray-400 hover:text-amber-400 transition-all"><FiChevronLeft size={16} /></button>
      <div ref={ref} className="flex gap-3 overflow-x-auto px-10 py-3" style={{ scrollbarWidth: 'none' }}>
        {images.map((img, i) => (
          <div key={img.id || i} onClick={() => onOpen(i)} className="relative flex-shrink-0 w-52 h-36 rounded-lg overflow-hidden cursor-pointer group border border-white/5 hover:border-amber-400/40 transition-all">
            <img src={img.url} alt={img.name} loading="lazy" className="w-full h-full object-cover group-hover:scale-110 group-hover:brightness-75 transition-all duration-500" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
            <p className="absolute bottom-2 left-2 right-2 text-white text-xs font-semibold truncate opacity-0 group-hover:opacity-100 transition-opacity drop-shadow">{img.name}</p>
          </div>
        ))}
      </div>
      <button onClick={() => scroll(1)} className="absolute right-0 top-1/2 -translate-y-1/2 z-10 w-9 h-9 rounded-full bg-black/80 border border-white/10 hover:border-amber-400/50 flex items-center justify-center text-gray-400 hover:text-amber-400 transition-all"><FiChevronRight size={16} /></button>
    </div>
  )
}

function Lightbox({ images, index, onClose, onNext, onPrev }) {
  const img = images[index]
  if (!img) return null
  const handleDownload = () => { const a = document.createElement('a'); a.href = img.url; a.download = img.name; a.click() }
  const handleShare = async () => { navigator.share ? await navigator.share({ title: img.name, url: img.url }) : navigator.clipboard.writeText(window.location.href) }

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[9999] bg-black/96 backdrop-blur-md flex items-center justify-center" onClick={onClose}>
      <div className="absolute inset-0 pointer-events-none" style={{ background: 'radial-gradient(ellipse at center, transparent 50%, rgba(120,60,0,0.28) 100%)' }} />
      <div className="absolute top-0 left-0 right-0 flex items-center justify-between px-5 py-4 z-10 bg-gradient-to-b from-black/80 to-transparent" onClick={e => e.stopPropagation()}>
        <div>
          <p className="text-white font-bold text-sm truncate max-w-[200px] md:max-w-xs">{img.name}</p>
          <p className="text-amber-400/70 text-[10px] mt-0.5 uppercase tracking-widest">{img.folder} · {formatSize(img.size)}</p>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-gray-600 text-xs mr-1 hidden md:block">{index + 1} / {images.length}</span>
          <button onClick={handleShare} className="w-9 h-9 rounded-full bg-white/10 hover:bg-amber-400/20 border border-white/10 hover:border-amber-400/40 flex items-center justify-center text-gray-300 hover:text-amber-400 transition-all"><FiShare2 size={14} /></button>
          <button onClick={handleDownload} className="w-9 h-9 rounded-full bg-white/10 hover:bg-amber-400/20 border border-white/10 hover:border-amber-400/40 flex items-center justify-center text-gray-300 hover:text-amber-400 transition-all"><FiDownload size={14} /></button>
          <button onClick={onClose} className="w-9 h-9 rounded-full bg-white/10 hover:bg-red-500/30 border border-white/10 hover:border-red-500/40 flex items-center justify-center text-gray-300 hover:text-red-400 transition-all"><FiX size={15} /></button>
        </div>
      </div>
      <button onClick={e => { e.stopPropagation(); onPrev() }} className="absolute left-3 md:left-5 z-10 w-11 h-11 rounded-full bg-black/60 hover:bg-amber-400/20 border border-white/10 hover:border-amber-400/50 flex items-center justify-center text-gray-300 hover:text-amber-400 transition-all backdrop-blur-sm"><FiChevronLeft size={22} /></button>
      <AnimatePresence mode="wait"><motion.img key={img.id || index} src={img.url} alt={img.name} initial={{ opacity: 0, scale: 0.93 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 1.05 }} transition={{ duration: 0.32 }} onClick={e => e.stopPropagation()} className="max-w-[88vw] max-h-[80vh] object-contain rounded-xl shadow-2xl shadow-black border border-white/5" /></AnimatePresence>
      <button onClick={e => { e.stopPropagation(); onNext() }} className="absolute right-3 md:right-5 z-10 w-11 h-11 rounded-full bg-black/60 hover:bg-amber-400/20 border border-white/10 hover:border-amber-400/50 flex items-center justify-center text-gray-300 hover:text-amber-400 transition-all backdrop-blur-sm"><FiChevronRight size={22} /></button>
    </motion.div>
  )
}

function EmptyState() {
  return (
    <div className="col-span-4 flex flex-col items-center justify-center py-32 text-center">
      <div className="w-20 h-20 rounded-2xl bg-amber-400/10 border border-amber-400/20 flex items-center justify-center mb-6"><FiGrid size={32} className="text-amber-400/40" /></div>
      <p className="text-gray-500 text-lg font-semibold mb-2">No images found</p>
    </div>
  )
}

/* ─────────────────────────────────────────
   MAIN COMPONENT FOR ALL-IN-ONE
───────────────────────────────────────── */
export default function GallerySection() {
  const [activeFilter, setActiveFilter] = useState('All')
  const [lightboxIndex, setLightboxIndex] = useState(null)
  const [viewMode, setViewMode] = useState('bento')
  const [dbImages, setDbImages] = useState([]);

  useEffect(() => {
    const fetchGallery = async () => {
      const { data, error } = await supabase
        .from('gallery')
        .select('*')
        .order('created_at', { ascending: false });
        
      if (error) {
        console.error("Error fetching images:", error);
      } else {
        setDbImages(data);
      }
    };

    fetchGallery();
  }, []);

  // DYNAMICALLY GENERATE CATEGORIES FROM SUPABASE
  const galleryCategories = [...new Set(dbImages.map(img => img.folder))].filter(Boolean);

  // Filter logic uses the new dynamic categories
  const filtered = activeFilter === 'All' ? dbImages : dbImages.filter(img => img.folder === activeFilter)
  const counts = { total: dbImages.length, ...galleryCategories.reduce((acc, f) => ({ ...acc, [f]: dbImages.filter(img => img.folder === f).length }), {}) }

  const openLightbox = useCallback(i => setLightboxIndex(i), [])
  const closeLightbox = useCallback(() => setLightboxIndex(null), [])
  const nextImage = useCallback(() => setLightboxIndex(i => (i + 1) % filtered.length), [filtered.length])
  const prevImage = useCallback(() => setLightboxIndex(i => (i - 1 + filtered.length) % filtered.length), [filtered.length])

  useEffect(() => {
    const handler = e => {
      if (lightboxIndex === null) return
      if (e.key === 'ArrowRight') nextImage()
      if (e.key === 'ArrowLeft') prevImage()
      if (e.key === 'Escape') closeLightbox()
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [lightboxIndex, nextImage, prevImage, closeLightbox])

  useEffect(() => {
    document.body.style.overflow = lightboxIndex !== null ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [lightboxIndex])

  return (
    <section id="gallery" className="bg-black text-white relative py-12">
      <HeroBanner />
      
      <div className="sticky top-0 z-30 bg-black/90 backdrop-blur-md border-b border-white/5">
        <div className="max-w-7xl mx-auto px-4 md:px-8 py-3 flex flex-wrap items-center justify-between gap-3">
          <FilterBar active={activeFilter} setActive={f => { setActiveFilter(f) }} counts={counts} categories={galleryCategories} />
          <div className="flex items-center gap-1 bg-white/5 rounded-full p-1 border border-white/10">
            <button onClick={() => setViewMode('bento')} className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider transition-all ${viewMode === 'bento' ? 'bg-amber-400 text-black' : 'text-gray-500 hover:text-amber-400'}`}><FiGrid size={12} /> Grid</button>
            <button onClick={() => setViewMode('filmstrip')} className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider transition-all ${viewMode === 'filmstrip' ? 'bg-amber-400 text-black' : 'text-gray-500 hover:text-amber-400'}`}>▶ Film</button>
          </div>
        </div>
      </div>

      <main className="max-w-7xl mx-auto px-4 md:px-8 py-8">
        <div className="flex items-center gap-4 mb-8">
          <div className="flex-1 h-px bg-gradient-to-r from-amber-400/40 to-transparent" />
          <p className="text-amber-400/70 text-xs font-bold uppercase tracking-[0.3em] whitespace-nowrap">{activeFilter === 'All' ? 'All Works' : activeFilter} <span className="ml-2 text-gray-700">· {filtered.length} images</span></p>
          <div className="flex-1 h-px bg-gradient-to-l from-amber-400/40 to-transparent" />
        </div>

        {viewMode === 'filmstrip' && (
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="mb-8 bg-gray-950 rounded-2xl p-4 border border-white/5">
            <FilmStrip images={filtered} onOpen={openLightbox} />
          </motion.div>
        )}

        {viewMode === 'bento' && (
          <motion.div layout className="grid grid-cols-2 md:grid-cols-4 auto-rows-[160px] md:auto-rows-[190px] gap-3">
            <AnimatePresence>
              {filtered.length === 0 ? <EmptyState /> : filtered.map((img, i) => <BentoCard key={img.id || i} img={img} index={i} onClick={openLightbox} />)}
            </AnimatePresence>
          </motion.div>
        )}
      </main>

      <AnimatePresence>
        {lightboxIndex !== null && <Lightbox images={filtered} index={lightboxIndex} onClose={closeLightbox} onNext={nextImage} onPrev={prevImage} />}
      </AnimatePresence>
    </section>
  )
}