import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { FiGithub, FiExternalLink, FiSearch } from 'react-icons/fi'
import { Helmet } from 'react-helmet-async'
import { supabase } from '../lib/supabase'

// New Components
import LazyImage from '../components/LazyImage'
import RepoStats from '../components/RepoStats'

const categories = ['All', 'NLP', 'ML', 'Automation', 'Tools']

export default function Projects() {
  const [active, setActive] = useState('All')
  const [search, setSearch] = useState('')
  const [dbProjects, setDbProjects] = useState([])

  useEffect(() => {
    const fetchProjects = async () => {
      const { data, error } = await supabase
        .from('projects')
        .select('*')
        .order('id', { ascending: true });
        
      if (error) {
        console.error("Error pulling database projects:", error);
      } else {
        setDbProjects(data);
      }
    };

    fetchProjects();
  }, []);

  const filtered = dbProjects.filter(p => {
    const matchCat = active === 'All' || p.category === active
    const matchSearch =
      p.title.toLowerCase().includes(search.toLowerCase()) ||
      p.desc_text.toLowerCase().includes(search.toLowerCase()) ||
      p.tags?.some(t => t.toLowerCase().includes(search.toLowerCase()))
    return matchCat && matchSearch
  })

  return (
    <>
      <Helmet>
        <title>Projects | K.M. AFAQ</title>
        <meta name="description" content="Explore the research projects and tools developed by K.M. Afaq, an AI Researcher specializing in NLP and machine learning." />
      </Helmet>
      
      <div>
        {/* ── Banner ── */}
        <section
          className="relative h-64 md:h-80 flex items-center justify-center"
          style={{
            backgroundImage: 'url(https://images.unsplash.com/photo-1555952517-2e8e729e0b44?w=1600&q=80)',
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
              Research & Development
            </p>
            <h1 className="text-4xl md:text-6xl font-black text-white">
              My <span className="text-accent">Projects</span>
            </h1>
          </motion.div>
        </section>

        {/* ── Filters & Search ── */}
        <section className="py-10 px-4 md:px-8 lg:px-16 bg-white dark:bg-gray-950 border-b border-gray-100 dark:border-gray-800">
          <div className="max-w-6xl mx-auto flex flex-col md:flex-row gap-4 items-center justify-between">
            <div className="flex flex-wrap gap-2">
              {categories.map(cat => (
                <button
                  key={cat}
                  onClick={() => setActive(cat)}
                  className={`px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200
                  ${active === cat
                      ? 'bg-accent text-white shadow-lg'
                      : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:text-accent'}`}
                >
                  {cat}
                </button>
              ))}
            </div>

            <div className="relative w-full md:w-64">
              <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
              <input
                type="text"
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder="Search projects..."
                className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white text-sm outline-none focus:border-accent transition-all" />
            </div>
          </div>
        </section>

        {/* ── Project Grid ── */}
        <section className="section-padding bg-white dark:bg-gray-950">
          <div className="max-w-6xl mx-auto">
            {filtered.length === 0 && (
              <div className="text-center py-20 text-gray-400 dark:text-gray-500">
                <FiSearch size={40} className="mx-auto mb-4 opacity-40" />
                <p className="text-lg">No projects found for "<strong>{search}</strong>"</p>
              </div>
            )}

            <motion.div layout className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              <AnimatePresence>
                {filtered.map((p, i) => (
                  <motion.div
                    key={p.id}
                    layout
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    transition={{ duration: 0.3, delay: i * 0.05 }}
                    className="group bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 hover:border-accent overflow-hidden transition-all duration-300 hover:shadow-xl flex flex-col"
                  >
                    {/* Lazy Loaded Image */}
                    <div className="relative h-44 overflow-hidden">
                      <LazyImage
                        src={p.image}
                        alt={p.title}
                        className="w-full h-full group-hover:scale-105 transition-transform duration-500"
                      />
                      {p.featured && (
                        <span className="absolute top-3 left-3 bg-accent text-white text-xs font-bold px-3 py-1 rounded-full z-10">
                          Featured
                        </span>
                      )}
                      <span className="absolute top-3 right-3 bg-black/50 backdrop-blur-sm text-white text-xs px-3 py-1 rounded-full z-10">
                        {p.category}
                      </span>
                    </div>

                    {/* Content */}
                    <div className="p-5 flex flex-col flex-1">
                      <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2 group-hover:text-accent transition-colors">
                        {p.title}
                      </h3>
                      <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed mb-4 flex-1">
                        {p.desc_text}
                      </p>

                      {/* Tags */}
                      <div className="flex flex-wrap gap-1.5 mb-4">
                        {p.tags?.slice(0, 3).map(t => (
                          <span key={t} className="tag-pill bg-gray-100 dark:bg-gray-700 px-2 py-0.5 rounded text-xs">
                            {t}
                          </span>
                        ))}
                      </div>

                      {/* Links + Stats */}
                      <div className="flex items-center justify-between mt-auto">
                        <div className="flex gap-3">
                          {p.github && (
                            <a href={p.github} target="_blank" rel="noopener noreferrer"
                              className="flex items-center gap-1.5 text-sm text-gray-500 dark:text-gray-400 hover:text-accent transition-colors">
                              <FiGithub size={15} /> GitHub
                            </a>
                          )}
                          {p.demo && (
                            <a href={p.demo} target="_blank" rel="noopener noreferrer"
                              className="flex items-center gap-1.5 text-sm text-gray-500 dark:text-gray-400 hover:text-accent transition-colors">
                              <FiExternalLink size={15} /> Demo
                            </a>
                          )}
                        </div>
                        {/* Live Repo Stats */}
                        {p.github && <RepoStats repoUrl={p.github} />}
                      </div>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </motion.div>
          </div>
        </section>
      </div>
    </>
  )
}