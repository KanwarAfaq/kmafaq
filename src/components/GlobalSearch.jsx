import { useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { useSearch } from '../context/SearchContext'
import { FiSearch, FiX, FiCode, FiImage, FiBookOpen, FiLayout } from 'react-icons/fi'

const typeIcons = {
  Page:    <FiLayout size={14} />,
  Project: <FiCode size={14} />,
  Gallery: <FiImage size={14} />,
  Blog:    <FiBookOpen size={14} />,
}

const typeColors = {
  Page:    'bg-blue-100 text-blue-600 dark:bg-blue-900/40 dark:text-blue-400',
  Project: 'bg-purple-100 text-purple-600 dark:bg-purple-900/40 dark:text-purple-400',
  Gallery: 'bg-pink-100 text-pink-600 dark:bg-pink-900/40 dark:text-pink-400',
  Blog:    'bg-green-100 text-green-600 dark:bg-green-900/40 dark:text-green-400',
}

export default function GlobalSearch() {
  const { query, setQuery, open, setOpen, results } = useSearch()
  const navigate = useNavigate()
  const inputRef = useRef(null)

  useEffect(() => {
    const handler = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault()
        setOpen(true)
      }
      if (e.key === 'Escape') setOpen(false)
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [setOpen])

  useEffect(() => {
    if (open) setTimeout(() => inputRef.current?.focus(), 100)
    else setQuery('')
  }, [open, setQuery])

  const handleSelect = (path) => {
    navigate(path)
    setOpen(false)
    setQuery('')
  }

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[999] bg-black/60 backdrop-blur-sm flex items-start justify-center pt-20 px-4"
          onClick={() => setOpen(false)}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: -20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -20 }}
            transition={{ duration: 0.2 }}
            className="w-full max-w-2xl bg-white dark:bg-gray-900 rounded-2xl shadow-2xl border border-gray-200 dark:border-gray-700 overflow-hidden"
            onClick={e => e.stopPropagation()}
          >
            {/* Search Input */}
            <div className="flex items-center gap-3 px-4 py-4 border-b border-gray-200 dark:border-gray-700">
              <FiSearch size={20} className="text-gray-400 flex-shrink-0" />
              <input
                ref={inputRef}
                type="text"
                value={query}
                onChange={e => setQuery(e.target.value)}
                placeholder="Search pages, projects, blog posts..."
                className="flex-1 bg-transparent text-gray-900 dark:text-white placeholder-gray-400 outline-none text-base"
              />
              <div className="flex items-center gap-2">
                <kbd className="hidden sm:inline-flex px-2 py-1 text-xs bg-gray-100 dark:bg-gray-800 text-gray-500 rounded border border-gray-300 dark:border-gray-600">
                  ESC
                </kbd>
                <button
                  onClick={() => setOpen(false)}
                  className="p-1 rounded-lg text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 transition-all"
                >
                  <FiX size={18} />
                </button>
              </div>
            </div>

            {/* Results */}
            <div className="max-h-96 overflow-y-auto">
              {query.trim().length > 1 && results.length === 0 && (
                <div className="px-4 py-12 text-center text-gray-400 dark:text-gray-500">
                  <FiSearch size={32} className="mx-auto mb-3 opacity-40" />
                  <p className="text-sm">No results found for "<strong>{query}</strong>"</p>
                </div>
              )}

              {results.length > 0 && (
                <div className="py-2">
                  {results.map((item, i) => (
                    <button
                      key={i}
                      onClick={() => handleSelect(item.path)}
                      className="w-full flex items-center gap-3 px-4 py-3 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors text-left group"
                    >
                      <span className={`flex items-center gap-1 px-2 py-1 rounded-md text-xs font-medium flex-shrink-0 ${typeColors[item.type]}`}>
                        {typeIcons[item.type]}
                        {item.type}
                      </span>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900 dark:text-white truncate group-hover:text-accent transition-colors">
                          {item.title}
                        </p>
                        <p className="text-xs text-gray-400 dark:text-gray-500 truncate">
                          {item.desc}
                        </p>
                      </div>
                      <span className="text-xs text-gray-300 dark:text-gray-600 flex-shrink-0">
                        {item.path}
                      </span>
                    </button>
                  ))}
                </div>
              )}

              {/* Default hint when empty */}
              {query.trim().length <= 1 && (
                <div className="px-4 py-8 text-center text-gray-400 dark:text-gray-500">
                  <p className="text-sm mb-3">Start typing to search across all content</p>
                  <div className="flex flex-wrap justify-center gap-2 text-xs">
                    {['NLP', 'Air Quality', 'Projects', 'Blog', 'Gallery'].map(hint => (
                      <button
                        key={hint}
                        onClick={() => setQuery(hint)}
                        className="px-3 py-1 rounded-full bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400 hover:text-accent hover:bg-gray-200 dark:hover:bg-gray-700 transition-all"
                      >
                        {hint}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Footer hint */}
            <div className="px-4 py-2.5 border-t border-gray-100 dark:border-gray-800 flex items-center justify-between">
              <span className="text-xs text-gray-400">
                {results.length > 0 ? `${results.length} result${results.length > 1 ? 's' : ''}` : 'Type to search'}
              </span>
              <span className="text-xs text-gray-400 hidden sm:block">
                Press <kbd className="px-1.5 py-0.5 bg-gray-100 dark:bg-gray-800 rounded border border-gray-300 dark:border-gray-600 text-xs">Ctrl+K</kbd> to open anytime
              </span>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}