import { createContext, useContext, useEffect, useMemo, useRef, useState } from 'react'
import { supabase } from '../lib/supabase'
import { SEARCH_STATIC_PAGES } from '../config/navigation'

const SearchContext = createContext()
const CACHE_TTL_MS = 5 * 60 * 1000

const tableConfigs = [
  { table: 'projects', type: 'Project', path: () => '/projects' },
  { table: 'blogs', type: 'Blog', path: (row) => row.slug ? '/blog/' + encodeURIComponent(row.slug) : '/blog' },
  { table: 'publications', type: 'Publication', path: () => '/publications' },
  { table: 'certifications', type: 'Certification', path: () => '/certifications' },
  { table: 'gallery', type: 'Gallery', path: () => '/gallery' },
  { table: 'technical_skills', type: 'Skill', path: () => '/about' },
  { table: 'profile_timeline', type: 'Timeline', path: () => '/about' },
  { table: 'testimonials', type: 'Testimonial', path: () => '/about' },
  { table: 'phd_scholarships', type: 'Scholarship', path: () => '/scholarships' },
  { table: 'profile_settings', type: 'Profile', path: () => '/about' },
]

const preferredTitleKeys = ['title', 'name', 'skill_name', 'institution', 'certificate_name', 'full_name', 'label', 'year']
const preferredDescKeys = [
  'excerpt', 'description', 'desc', 'desc_text', 'summary', 'abstract', 'journal', 'publisher',
  'authors', 'issuer', 'skills', 'category', 'place', 'role', 'text_content',
  'strategic_fit', 'country', 'salary_funding', 'hero_subtitle', 'bio_paragraph_1',
]

function scalarText(value) {
  if (value == null) return ''
  if (typeof value === 'string' || typeof value === 'number' || typeof value === 'boolean') return String(value)
  if (Array.isArray(value)) return value.map(scalarText).filter(Boolean).join(' ')
  if (typeof value === 'object') return Object.values(value).map(scalarText).filter(Boolean).join(' ')
  return ''
}

function pickFirst(row, keys) {
  for (const key of keys) {
    const value = scalarText(row?.[key]).trim()
    if (value) return value
  }
  return ''
}

function normalizeRow(row, config) {
  return {
    title: pickFirst(row, preferredTitleKeys) || config.type,
    desc: pickFirst(row, preferredDescKeys),
    path: config.path(row),
    type: config.type,
    searchText: scalarText(row),
    updatedAt: row?.updated_at || row?.created_at || row?.date || null,
  }
}

async function fetchDirectIndex() {
  const settled = await Promise.allSettled(
    tableConfigs.map(async (config) => {
      const { data, error } = await supabase.from(config.table).select('*').limit(500)
      if (error) throw error
      return (data || []).map((row) => normalizeRow(row, config))
    })
  )
  return settled.flatMap((result) => result.status === 'fulfilled' ? result.value : [])
}

async function fetchSiteIndex() {
  try {
    const response = await fetch('/site-index.json', { headers: { Accept: 'application/json' } })
    if (response.ok) {
      const payload = await response.json()
      if (Array.isArray(payload?.items)) return payload.items
    }
  } catch {
    // Vite dev has no Vercel API route; fall back to direct public Supabase queries.
  }
  return fetchDirectIndex()
}

function resultScore(item, query) {
  const q = query.toLowerCase()
  const title = (item.title || '').toLowerCase()
  const desc = (item.desc || '').toLowerCase()
  const body = (item.searchText || '').toLowerCase()
  const type = (item.type || '').toLowerCase()
  let score = 0
  if (title === q) score += 100
  if (title.startsWith(q)) score += 60
  if (title.includes(q)) score += 40
  if (type.includes(q)) score += 20
  if (desc.includes(q)) score += 14
  if (body.includes(q)) score += 8
  for (const word of q.split(/\s+/).filter(Boolean)) {
    if (title.includes(word)) score += 8
    else if (desc.includes(word)) score += 4
    else if (body.includes(word)) score += 2
  }
  return score
}

export const SearchProvider = ({ children }) => {
  const [query, setQuery] = useState('')
  const [open, setOpen] = useState(false)
  const [searchData, setSearchData] = useState(SEARCH_STATIC_PAGES)
  const [loading, setLoading] = useState(false)
  const lastLoadedAt = useRef(0)
  const activeLoad = useRef(null)

  const refreshSearchIndex = async ({ force = false } = {}) => {
    if (!force && Date.now() - lastLoadedAt.current < CACHE_TTL_MS) return
    if (activeLoad.current) return activeLoad.current

    setLoading(true)
    activeLoad.current = (async () => {
      try {
        const dynamicItems = await fetchSiteIndex()
        const unique = new Map()
        ;[...SEARCH_STATIC_PAGES, ...dynamicItems].forEach((item) => {
          unique.set([item.type, item.path, item.title].join('|'), item)
        })
        setSearchData([...unique.values()])
        lastLoadedAt.current = Date.now()
      } catch (error) {
        console.error('Failed to build website search index:', error)
      } finally {
        setLoading(false)
        activeLoad.current = null
      }
    })()
    return activeLoad.current
  }

  useEffect(() => {
    if (open) refreshSearchIndex()
  }, [open])

  useEffect(() => {
    const handler = () => refreshSearchIndex({ force: true })
    window.addEventListener('focus', handler)
    return () => window.removeEventListener('focus', handler)
  }, [])

  const results = useMemo(() => {
    const q = query.trim().toLowerCase()
    if (q.length < 2) return []
    return searchData
      .map((item) => ({ item, score: resultScore(item, q) }))
      .filter(({ score }) => score > 0)
      .sort((a, b) => b.score - a.score)
      .slice(0, 30)
      .map(({ item }) => item)
  }, [query, searchData])

  const recentItems = useMemo(() => (
    searchData
      .filter((item) => item.type === 'Blog' || item.type === 'Scholarship')
      .sort((a, b) => new Date(b.updatedAt || 0) - new Date(a.updatedAt || 0))
      .slice(0, 6)
  ), [searchData])

  return (
    <SearchContext.Provider value={{ query, setQuery, open, setOpen, results, loading, recentItems, refreshSearchIndex }}>
      {children}
    </SearchContext.Provider>
  )
}

export const useSearch = () => useContext(SearchContext)
