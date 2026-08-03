import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { FiClock, FiTag, FiArrowRight, FiSearch } from 'react-icons/fi'
import { supabase } from '../lib/supabase'

export default function Blog() {
  const [search, setSearch] = useState('')
  const [dbBlogs, setDbBlogs] = useState([])

  // Load articles dynamically from your Supabase instance when component mounts
  useEffect(() => {
    const fetchBlogs = async () => {
      const { data, error } = await supabase
        .from('blogs')
        .select('*')
        .order('date', { ascending: false });

      if (error) {
        console.error("Error pulling database blogs:", error);
      } else if (data) {
        setDbBlogs(data);
      }
    };

    fetchBlogs();
  }, []);

  // Filter against your live cloud data records
  const filtered = dbBlogs.filter(b =>
    b.title.toLowerCase().includes(search.toLowerCase()) ||
    b.excerpt.toLowerCase().includes(search.toLowerCase()) ||
    b.tags?.some(t => t.toLowerCase().includes(search.toLowerCase()))
  )

  return (
    <div>
      {/* ── Banner ── */}
      <section
        className="relative h-64 md:h-80 flex items-center justify-center"
        style={{
          backgroundImage: 'url(https://images.unsplash.com/photo-1456324504439-367cee3b3c32?w=1600&q=80)',
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
            Articles & Notes
          </p>
          <h1 className="text-4xl md:text-6xl font-black text-white">
            My <span className="text-accent">Blog</span>
          </h1>
        </motion.div>
      </section>

      {/* ── Search ── */}
      <section className="py-8 px-4 md:px-8 lg:px-16 bg-white dark:bg-gray-950 border-b border-gray-100 dark:border-gray-800">
        <div className="max-w-3xl mx-auto relative">
          <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
          <input
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search articles by title, topic or tag..."
            className="w-full pl-11 pr-4 py-3 rounded-2xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white outline-none focus:border-accent transition-all text-sm"
          />
        </div>
      </section>

      {/* ── Blog Posts ── */}
      <section className="section-padding bg-white dark:bg-gray-950">
        <div className="max-w-4xl mx-auto">

          {filtered.length === 0 && (
            <div className="text-center py-20 text-gray-400">
              <FiSearch size={40} className="mx-auto mb-4 opacity-40" />
              <p className="text-lg">No articles found for "<strong>{search}</strong>"</p>
            </div>
          )}

          <div className="flex flex-col gap-6">
            {filtered.map((post, i) => (
              <motion.article
                key={post.slug}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="group bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 hover:border-accent overflow-hidden transition-all duration-300 hover:shadow-xl"
              >
                <div className="p-6 md:p-8">
                  {/* Meta */}
                  <div className="flex flex-wrap items-center gap-3 mb-3 text-sm text-gray-400 dark:text-gray-500">
                    <span>
                      {new Date(post.date).toLocaleDateString('en-US', {
                        year: 'numeric', month: 'long', day: 'numeric'
                      })}
                    </span>
                    <span>·</span>
                    <span className="flex items-center gap-1">
                      <FiClock size={13} /> {post.read_time} {/* Maps perfectly to DB underscore field! */}
                    </span>
                  </div>

                  {/* Title */}
                  <h2 className="text-xl md:text-2xl font-bold text-gray-900 dark:text-white mb-3 group-hover:text-accent transition-colors">
                    {post.title}
                  </h2>

                  {/* Excerpt */}
                  <p className="text-gray-500 dark:text-gray-400 leading-relaxed mb-5 text-sm md:text-base">
                    {post.excerpt}
                  </p>

                  {/* Tags + Read More */}
                  <div className="flex flex-wrap items-center justify-between gap-4">
                    <div className="flex flex-wrap gap-2">
                      {post.tags?.map(tag => (
                        <span key={tag} className="flex items-center gap-1 tag-pill">
                          <FiTag size={10} /> {tag}
                        </span>
                      ))}
                    </div>
                    <Link
                      to={`/blog/${post.slug}`}
                      className="flex items-center gap-1.5 text-sm font-semibold text-accent hover:underline underline-offset-4 transition-all"
                    >
                      Read Article <FiArrowRight size={14} />
                    </Link>
                  </div>
                </div>
              </motion.article>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}