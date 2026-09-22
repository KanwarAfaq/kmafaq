import { createContext, useContext, useEffect, useRef, useState } from 'react'
import { supabase } from '../lib/supabase'

const SearchContext = createContext()

const STATIC_PAGES = [
  { title: 'Home', desc: 'Main landing page', path: '/', type: 'Page' },
  { title: 'About', desc: 'My background and skills', path: '/about', type: 'Page' },
  { title: 'Projects', desc: 'Research and development projects', path: '/projects', type: 'Page' },
  { title: 'Publications', desc: 'Academic publications and manuscripts', path: '/publications', type: 'Page' },
  { title: 'Certifications', desc: 'Technical certifications and learning', path: '/certifications', type: 'Page' },
  { title: 'Gallery', desc: 'Visual showcase', path: '/gallery', type: 'Page' },
  { title: 'Blog', desc: 'Articles and notes', path: '/blog', type: 'Page' },
  { title: 'Contact', desc: 'Get in touch', path: '/contact', type: 'Page' },
  { title: 'Scholarships', desc: 'AI and NLP PhD opportunity tracker', path: '/scholarships', type: 'Page' },
  { title: 'All-in-One', desc: 'Single page view', path: '/all-in-one', type: 'Page' },
]

export const SearchProvider = ({ children }) => {
  const [query, setQuery] = useState('')
  const [open, setOpen] = useState(false)
  const [searchData, setSearchData] = useState(STATIC_PAGES)
  const [results, setResults] = useState([])
  const loadedDynamicData = useRef(false)

  useEffect(() => {
    if (!open || loadedDynamicData.current) return
    loadedDynamicData.current = true
    let cancelled = false

    const buildDynamicIndex = async () => {
      try {
        const [{ data: projects }, { data: blogs }] = await Promise.all([
          supabase.from('projects').select('title, desc_text, id'),
          supabase.from('blogs').select('title, excerpt, slug'),
        ])

        if (cancelled) return

        const projectItems = (projects || []).map((project) => ({
          title: project.title,
          desc: project.desc_text,
          path: '/projects',
          type: 'Project',
        }))

        const blogItems = (blogs || [])
          .filter((blog) => blog.slug)
          .map((blog) => ({
            title: blog.title,
            desc: blog.excerpt,
            path: '/blog/' + blog.slug,
            type: 'Blog',
          }))

        setSearchData([...STATIC_PAGES, ...projectItems, ...blogItems])
      } catch (error) {
        loadedDynamicData.current = false
        console.error('Failed to build dynamic search index:', error)
      }
    }

    buildDynamicIndex()
    return () => {
      cancelled = true
    }
  }, [open])

  useEffect(() => {
    if (!query.trim()) {
      setResults([])
      return
    }

    const normalizedQuery = query.toLowerCase()
    setResults(
      searchData.filter(
        (item) =>
          item.title?.toLowerCase().includes(normalizedQuery) ||
          item.desc?.toLowerCase().includes(normalizedQuery) ||
          item.type?.toLowerCase().includes(normalizedQuery)
      )
    )
  }, [query, searchData])

  return (
    <SearchContext.Provider value={{ query, setQuery, open, setOpen, results }}>
      {children}
    </SearchContext.Provider>
  )
}

export const useSearch = () => useContext(SearchContext)
