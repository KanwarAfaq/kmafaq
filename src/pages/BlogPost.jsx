import { useState, useEffect } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { FiArrowLeft, FiClock, FiTag, FiCalendar } from 'react-icons/fi'
import { supabase } from '../lib/supabase'

export default function BlogPost() {
  const { slug } = useParams()
  const navigate = useNavigate()
  
  const [post, setPost] = useState(null)
  const [others, setOthers] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchPostData = async () => {
      setLoading(true)
      try {
        // 1. Fetch the primary matching post by slug
        const { data: mainPost, error: mainError } = await supabase
          .from('blogs')
          .select('*')
          .eq('slug', slug)
          .single();

        if (mainError || !mainPost) {
          console.error("Post not found:", mainError);
          setPost(null);
        } else {
          setPost(mainPost);

          // 2. Fetch alternative suggestion recommendations (excluding current post)
          const { data: recommendations } = await supabase
            .from('blogs')
            .select('*')
            .neq('slug', slug)
            .range(0, 1); // Limit smoothly to 2 items max

          if (recommendations) setOthers(recommendations);
        }
      } catch (err) {
        console.error("Failed to stream blog data from cloud storage:", err);
      } finally {
        setLoading(false)
      }
    };

    fetchPostData();
  }, [slug]);

  // Handle loading fallback gracefully
  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center text-center">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-accent mb-4"></div>
        <p className="text-gray-500 text-sm font-mono">Loading document...</p>
      </div>
    )
  }

  // Handle missing record view fallback
  if (!post) return (
    <div className="min-h-screen flex flex-col items-center justify-center text-center px-4">
      <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">Post not found</h2>
      <Link to="/blog" className="btn-accent">Back to Blogs</Link>
    </div>
  )

  return (
    <div>
      {/* ── Banner ── */}
      <section
        className="relative h-56 md:h-72 flex items-end justify-start pb-8"
        style={{
          backgroundImage: 'url(https://images.unsplash.com/photo-1456324504439-367cee3b3c32?w=1600&q=80)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        <div className="absolute inset-0 bg-black/75" />
        <div className="relative z-10 max-w-3xl mx-auto w-full px-4 md:px-8">
          <button
            onClick={() => navigate('/blog')}
            className="flex items-center gap-2 text-white/70 hover:text-white text-sm mb-4 transition-colors"
          >
            <FiArrowLeft size={16} /> Back to Blog
          </button>
          <h1 className="text-2xl md:text-4xl font-black text-white leading-tight">
            {post.title}
          </h1>
        </div>
      </section>

      {/* ── Article ── */}
      <section className="section-padding bg-white dark:bg-gray-950">
        <div className="max-w-3xl mx-auto">

          {/* Meta */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-wrap items-center gap-4 mb-8 pb-8 border-b border-gray-200 dark:border-gray-700"
          >
            <span className="flex items-center gap-1.5 text-sm text-gray-500 dark:text-gray-400">
              <FiCalendar size={14} />
              {new Date(post.date).toLocaleDateString('en-US', {
                year: 'numeric', month: 'long', day: 'numeric'
              })}
            </span>
            <span className="flex items-center gap-1.5 text-sm text-gray-500 dark:text-gray-400">
              <FiClock size={14} /> {post.read_time} {/* Maps perfectly to DB underscore property field */}
            </span>
            <div className="flex flex-wrap gap-2">
              {post.tags?.map(tag => (
                <span key={tag} className="flex items-center gap-1 tag-pill">
                  <FiTag size={10} /> {tag}
                </span>
              ))}
            </div>
          </motion.div>

          {/* HTML Content (Replaced Markdown) */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="prose prose-lg dark:prose-invert max-w-none w-full break-words
              prose-headings:font-bold prose-headings:text-gray-900 dark:prose-headings:text-white
              prose-p:text-gray-600 dark:prose-p:text-gray-300
              prose-a:text-accent prose-a:no-underline hover:prose-a:underline prose-a:break-all
              prose-strong:text-gray-900 dark:prose-strong:text-white
              prose-code:text-accent prose-code:bg-gray-100 dark:prose-code:bg-gray-800
              prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded prose-code:break-words
              prose-pre:bg-gray-900 prose-pre:text-gray-100 prose-pre:overflow-x-auto
              prose-blockquote:border-l-accent prose-blockquote:text-gray-500
              prose-table:text-sm prose-table:overflow-x-auto prose-th:bg-gray-100 dark:prose-th:bg-gray-800
              prose-img:rounded-xl prose-img:max-w-full prose-hr:border-gray-200 dark:prose-hr:border-gray-700"
            dangerouslySetInnerHTML={{ __html: post.content || '' }}
          />

          {/* Author Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mt-12 p-6 bg-gray-50 dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 flex items-center gap-4"
          >
            <div className="w-14 h-14 rounded-full overflow-hidden border-2 border-accent flex-shrink-0">
              <img
                src="https://res.cloudinary.com/dfmi4udfs/image/upload/v1782224423/gallery/general/IMG_2017_dflq3u.jpg"
                alt="K.M. AFAQ"
                className="w-full h-full object-cover"
              />
            </div>
            <div>
              <p className="font-bold text-gray-900 dark:text-white">Kanwar Muhammad Afaq</p>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                AI Researcher · NLP Engineer · Data Scientist
              </p>
            </div>
          </motion.div>

          {/* More Articles */}
          {others.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="mt-12"
            >
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-6">
                More Articles
              </h3>
              <div className="grid sm:grid-cols-2 gap-4">
                {others.map(b => (
                  <Link
                    key={b.slug}
                    to={`/blog/${b.slug}`}
                    className="group p-5 bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 hover:border-accent transition-all duration-300 hover:shadow-lg"
                  >
                    <div className="flex items-center gap-1.5 text-xs text-gray-400 mb-2">
                      <FiClock size={11} /> {b.read_time}
                    </div>
                    <h4 className="font-semibold text-gray-900 dark:text-white text-sm group-hover:text-accent transition-colors leading-snug">
                      {b.title}
                    </h4>
                  </Link>
                ))}
              </div>
            </motion.div>
          )}

          {/* Back Button */}
          <div className="mt-10 pt-8 border-t border-gray-200 dark:border-gray-700">
            <Link to="/blog" className="btn-outline">
              <FiArrowLeft /> Back to Blog
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}