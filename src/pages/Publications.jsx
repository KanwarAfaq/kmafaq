import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { FiExternalLink, FiBookOpen } from 'react-icons/fi'
import { supabase } from '../lib/supabase'
import CiteButton from '../components/CiteButton'

// ── Research domains (unchanged, still static config) ──
const researchAreas = [
  {
    id: 'All',
    title: 'All Publications',
    desc: 'Explore my complete portfolio of peer-reviewed manuscripts, conference papers, and academic research.',
    icon: '📚',
    keywords: [],
  },
  {
    id: 'NLP',
    title: 'Natural Language Processing',
    desc: 'Code-mixed Roman Urdu–English text normalization, dataset construction, and preprocessing pipelines.',
    icon: '🧠',
    keywords: ['urdu', 'nlp', 'language', 'text', 'sentiment', 'bert', 'roberta', 'linguistics', 'word'],
  },
  {
    id: 'Air Quality',
    title: 'Air Quality Prediction',
    desc: 'Deep learning models for PM2.5 and AQI forecasting using environmental sensor time-series data with CNN, LSTM, and GRU.',
    icon: '🌍',
    keywords: ['air', 'quality', 'pm2.5', 'aqi', 'forecasting', 'time-series', 'cnn', 'lstm', 'gru', 'environmental', 'pollution'],
  },
  {
    id: 'Automation',
    title: 'Data Collection & Automation',
    desc: 'Large-scale social media scraping, dataset construction, and automated annotation pipelines for machine learning.',
    icon: '⚙️',
    keywords: ['scraping', 'dataset', 'automation', 'collection', 'annotation', 'social media', 'pipeline', 'corpus'],
  },
]

// ── Type tabs config ──
const typeTabs = [
  { id: 'all', label: 'All' },
  { id: 'journal', label: 'Journal' },
  { id: 'conference', label: 'Conference' },
  { id: 'book', label: 'Book / Chapter' },
  { id: 'preprint', label: 'Preprint' },
]

export default function Publications() {
  const [dbPublications, setDbPublications] = useState([])
  const [loading, setLoading] = useState(true)
  const [activeFilter, setActiveFilter] = useState('All')      // research domain
  const [pubTypeFilter, setPubTypeFilter] = useState('all')    // type: all/journal/conference/book

  useEffect(() => {
    const fetchPublications = async () => {
      try {
        const { data, error } = await supabase
          .from('publications')
          .select('*')
          .order('year', { ascending: false })

        if (error) throw error
        if (data) setDbPublications(data)
      } catch (err) {
        console.error('Error pulling database publications:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchPublications()
  }, [])

  // ── Helper: check research domain match ──
  const checkMatch = (paper, areaId) => {
    if (areaId === 'All') return true

    if (paper.category && paper.category === areaId) return true

    const area = researchAreas.find((r) => r.id === areaId)
    if (area && area.keywords.length > 0) {
      const searchString = `${paper.title} ${paper.journal}`.toLowerCase()
      return area.keywords.some((keyword) =>
        searchString.includes(keyword.toLowerCase())
      )
    }

    return false
  }

  // ── NEW: helper to check publication type ──
  const checkType = (paper, typeFilter) => {
    if (typeFilter === 'all') return true

    const rawType =
      paper.type ||
      paper.pub_type ||
      paper.publication_type ||
      paper.category ||
      ''
    const t = String(rawType).toLowerCase()

    if (!t) return false

    if (typeFilter === 'journal') {
      return (
        t.includes('journal') ||
        t.includes('transactions') ||
        t.includes('letters')
      )
    }

    if (typeFilter === 'conference') {
      return (
        t.includes('conference') ||
        t.includes('proceedings') ||
        t.includes('workshop') ||
        t.includes('symposium')
      )
    }

    if (typeFilter === 'book') {
      return (
        t.includes('book') ||
        t.includes('chapter') ||
        t.includes('monograph')
      )
    }
   if (typeFilter === 'preprint') {
      return (
        t.includes('preprint') ||
        t.includes('submitted') ||
        t.includes('under review')
      )
    }
    return true
  }

  // ── Combined filtering ──
  const filteredPublications = dbPublications.filter(
    (paper) => checkMatch(paper, activeFilter) && checkType(paper, pubTypeFilter)
  )

  // Counts per domain card, respecting current type tab
  const getPaperCount = (areaId) =>
    dbPublications.filter(
      (paper) => checkMatch(paper, areaId) && checkType(paper, pubTypeFilter)
    ).length

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 py-16">
      <div className="max-w-5xl mx-auto px-4 md:px-6">
        {/* Header */}
        <div className="mb-10 text-center">
          <p className="text-sm font-semibold tracking-[0.25em] text-accent mb-3">
            Academic Research
          </p>
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-3">
            Publications & Manuscripts
          </h1>
          <p className="text-gray-500 dark:text-gray-400 max-w-2xl mx-auto text-sm md:text-base">
            Peer-reviewed research across natural language processing, air quality
            forecasting, and large-scale data collection for real-world machine
            learning systems.
          </p>
        </div>

        {/* Domain selector cards */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          {researchAreas.map((area) => {
            const count = getPaperCount(area.id)
            const isActive = activeFilter === area.id

            return (
              <button
                key={area.id}
                onClick={() => setActiveFilter(area.id)}
                className={`group relative rounded-2xl border px-4 py-4 text-left transition-all ${
                  isActive
                    ? 'bg-accent text-white border-accent shadow-lg shadow-accent/20'
                    : 'bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-800 hover:border-accent/70 hover:shadow-md'
                }`}
              >
                <div className="flex items-start gap-3">
                  <div className="text-xl md:text-2xl">{area.icon}</div>
                  <div>
                    <div className="flex items-center justify-between gap-2">
                      <h2
                        className={`text-sm md:text-base font-semibold ${
                          isActive
                            ? 'text-white'
                            : 'text-gray-900 dark:text-white'
                        }`}
                      >
                        {area.title}
                      </h2>
                      <span
                        className={`inline-flex items-center justify-center rounded-full text-[10px] md:text-xs px-2 py-0.5 font-semibold ${
                          isActive
                            ? 'bg-white/15 text-white'
                            : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300'
                        }`}
                      >
                        {count} papers
                      </span>
                    </div>
                    <p
                      className={`mt-1 text-[11px] md:text-xs leading-snug ${
                        isActive
                          ? 'text-white/80'
                          : 'text-gray-500 dark:text-gray-400'
                      }`}
                    >
                      {area.desc}
                    </p>
                  </div>
                </div>
              </button>
            )
          })}
        </div>

        {/* NEW: Type tabs */}
        <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
          <div className="flex flex-wrap gap-2">
            {typeTabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setPubTypeFilter(tab.id)}
                className={`px-3 py-1.5 text-xs rounded-full border transition-colors ${
                  pubTypeFilter === tab.id
                    ? 'bg-accent text-white border-accent'
                    : 'bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-300 hover:border-accent hover:text-accent'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          <p className="text-xs md:text-sm text-gray-500 dark:text-gray-400">
            Showing{' '}
            <span className="font-semibold text-accent">
              {filteredPublications.length}
            </span>{' '}
            results
          </p>
        </div>

        {/* Publications list */}
        <div className="space-y-4">
          {loading && (
            <div className="text-center py-10 text-gray-500 dark:text-gray-400 text-sm">
              Fetching manuscripts...
            </div>
          )}

          {!loading && filteredPublications.length === 0 && (
            <div className="text-center py-10 text-gray-500 dark:text-gray-400 text-sm">
              No publications found in this category yet.
            </div>
          )}

          <AnimatePresence>
            {filteredPublications.map((paper) => {
              // ── RESOLVE DESTINATION LINK STRINGS FOR TITLES ──
              const targetPaperLink = paper.doi || paper.pdf || paper.scholar || null;

              return (
                <motion.article
                  key={paper.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.18 }}
                  className="group bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl px-4 py-4 md:px-5 md:py-5 shadow-sm hover:border-accent/80 hover:shadow-md hover:shadow-accent/10 transition-all"
                >
                  <div className="flex items-start gap-3 md:gap-4">
                    <div className="mt-1">
                      <div className="inline-flex items-center justify-center rounded-full bg-accent/10 text-accent p-1.5 md:p-2">
                        <FiBookOpen className="w-3 h-3 md:w-4 md:h-4" />
                      </div>
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex flex-wrap items-start justify-between gap-2">
                        
                        {/* ── INTERACTIVE PAPER TITLE CLICK FLOW ── */}
                        <h3 className="text-sm md:text-base font-semibold text-gray-900 dark:text-white transition-colors">
                          {targetPaperLink ? (
                            <a
                              href={targetPaperLink}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="hover:text-accent hover:underline cursor-pointer transition-all duration-150"
                            >
                              {paper.title}
                            </a>
                          ) : (
                            paper.title
                          )}
                        </h3>

                        <div className="flex items-center gap-2 text-[10px] md:text-xs text-gray-500 dark:text-gray-400">
                          <span className="inline-flex items-center rounded-full bg-gray-100 dark:bg-gray-800 px-2 py-0.5">
                            {paper.year}
                          </span>
                          {paper.type && (
                            <span className="inline-flex items-center rounded-full bg-gray-100 dark:bg-gray-800 px-2 py-0.5 capitalize">
                              {paper.type}
                            </span>
                          )}
                        </div>
                      </div>

                      <p className="mt-1 text-[11px] md:text-xs text-gray-600 dark:text-gray-300">
                        {paper.authors}
                      </p>

                      <p className="mt-0.5 text-[11px] md:text-xs text-gray-500 dark:text-gray-400 italic">
                        {paper.journal}
                      </p>

                      <div className="mt-2 flex flex-wrap items-center gap-2">
                        {/* ── BOTTOM LINKS FALLBACK HUD ── */}
                        {targetPaperLink && (
                          <a
                            href={targetPaperLink}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1.5 text-[11px] md:text-xs text-accent hover:underline"
                          >
                            <FiExternalLink className="w-3 h-3" />
                            View paper
                          </a>
                        )}
                        <CiteButton paper={paper} />
                      </div>
                    </div>
                  </div>
                </motion.article>
              )
            })}
          </AnimatePresence>
        </div>
      </div>
    </div>
  )
}