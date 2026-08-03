import { useEffect, useState } from 'react'
import { 
  FiFolder, FiShare2, FiStar, FiZap, FiBookOpen, FiFileText, 
  FiImage, FiAward, FiCpu, FiMessageSquare, FiUsers, FiArrowRight 
} from 'react-icons/fi'
import { Link } from 'react-router-dom'
import AdminLayout from '../../components/admin/AdminLayout'
import AdminHeader from '../../components/admin/AdminHeader'
import { supabase } from '../../lib/supabase' // Directly calling your main client configuration

export default function Dashboard() {
  const [counts, setCounts] = useState({ 
    projects: 0, socials: 0, publications: 0, blogs: 0, 
    gallery: 0, certificates: 0, skills: 0, testimonials: 0, messages: 0 
  })
  const [featuredProjects, setFeaturedProjects] = useState([])
  const [recentMessages, setRecentMessages] = useState([])
  const [recentTestimonials, setRecentTestimonials] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function loadMasterDashboardDirectly() {
      try {
        setLoading(true)
        
        // We run all queries in parallel. If a table name has a typo, it might throw an error, 
        // so we map over them safely to return an empty array [] instead of crashing the dashboard.
        const safeFetch = async (tableName, selectStr = '*') => {
          try {
            const { data, error } = await supabase.from(tableName).select(selectStr)
            if (error) {
              console.warn(`Supabase safeFetch Warning for table "${tableName}":`, error.message)
              return []
            }
            return data || []
          } catch (err) {
            console.error(`Failed executing fetch on table "${tableName}":`, err)
            return []
          }
        }

        // ── LIVE INVENTORY PARALLEL REQUESTS ──
        // NOTE: If your database table names are slightly different (e.g. 'technical_skills' instead of 'skills'), 
        // change the string name inside the quotes below!
        const [
          projects, 
          socials, 
          publications, 
          blogs, 
          gallery, 
          certificates, 
          skills, 
          testimonials, 
          messages
        ] = await Promise.all([
          safeFetch('projects'),
          safeFetch('social_links'),
          safeFetch('publications'),
          safeFetch('blogs'),
          safeFetch('gallery'),
          safeFetch('certifications'), // change to 'certificates' if your table name differs
          safeFetch('technical_skills'),         // change to 'technical_skills' or 'technicalSkillsAdmin' if needed
          safeFetch('testimonials'),
          safeFetch('messages')
        ])

        setCounts({
          projects: projects.length,
          socials: socials.length,
          publications: publications.length,
          blogs: blogs.length,
          gallery: gallery.length,
          certificates: certificates.length,
          skills: skills.length,
          testimonials: testimonials.length,
          messages: messages.length
        })

        // Sort data filters safely on the frontend client side
        setFeaturedProjects(projects.filter((item) => item.featured).slice(0, 2))
        
        // Sort and slice messages/testimonials by their timestamp if it exists
        const sortedMessages = [...messages].sort((a, b) => new Date(b.created_at || 0) - new Date(a.created_at || 0))
        setRecentMessages(sortedMessages.slice(0, 3))
        
        setRecentTestimonials(testimonials.slice(0, 2))

      } catch (error) {
        console.error("Direct dashboard runtime database sync failed:", error)
      } finally {
        setLoading(false)
      }
    }
    loadMasterDashboardDirectly()
  }, [])

  const statCards = [
    { label: 'Projects', value: counts.projects, icon: FiFolder, color: 'text-blue-500 bg-blue-500/10', link: '/admin/projects' },
    { label: 'Publications', value: counts.publications, icon: FiBookOpen, color: 'text-emerald-500 bg-emerald-500/10', link: '/admin/publications' },
    { label: 'Certificates', value: counts.certificates, icon: FiAward, color: 'text-purple-500 bg-purple-500/10', link: '/admin/certifications' },
    { label: 'Technical Skills', value: counts.skills, icon: FiCpu, color: 'text-cyan-500 bg-cyan-500/10', link: '/admin/technical-skills' },
    { label: 'Testimonials', value: counts.testimonials, icon: FiUsers, color: 'text-orange-500 bg-orange-500/10', link: '/admin/testimonials' },
    { label: 'User Messages', value: counts.messages, icon: FiMessageSquare, color: 'text-red-500 bg-red-500/10', link: '/admin/messages' },
    { label: 'Blog Posts', value: counts.blogs, icon: FiFileText, color: 'text-amber-500 bg-amber-500/10', link: '/admin/blogs' },
    { label: 'Active Socials', value: counts.socials, icon: FiZap, color: 'text-indigo-500 bg-indigo-500/10', link: '/admin/social-links' },
  ]

  if (loading) {
    return (
      <AdminLayout>
        <AdminHeader title="Dashboard" subtitle="Overview of your complete portfolio workspace." />
        <div className="p-8 text-sm font-mono text-gray-500 animate-pulse">Querying live Supabase tables...</div>
      </AdminLayout>
    )
  }

  return (
    <AdminLayout>
      <AdminHeader title="Dashboard Master View" subtitle="Direct real-time database query pipeline bypassing adminApi helpers." />
      
      <div className="space-y-8 px-5 py-6 lg:px-8">
        
        {/* ── CARD COUNTERS ── */}
        <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {statCards.map((card) => {
            const Icon = card.icon;
            return (
              <Link to={card.link} key={card.label} className="group rounded-3xl border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-800 dark:bg-gray-900 hover:border-accent/50 transition-all">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wider text-gray-400 dark:text-gray-500">{card.label}</p>
                    <h3 className="mt-2 text-3xl font-bold tracking-tight text-gray-900 dark:text-white group-hover:text-accent transition-colors">{card.value}</h3>
                  </div>
                  <div className={`flex h-11 w-11 items-center justify-center rounded-xl ${card.color}`}>
                    <Icon size={18} />
                  </div>
                </div>
              </Link>
            )
          })}
        </section>

        {/* ── LOWER FEEDS BLOCK ── */}
        <section className="grid gap-6 lg:grid-cols-2">
          
          {/* USER INBOX MESSAGES MONITOR */}
          <div className="rounded-3xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-900">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-md font-bold text-gray-900 dark:text-white flex items-center gap-2">
                <FiMessageSquare className="text-red-500" /> Recent Contact Messages
              </h2>
              <Link to="/admin/messages" className="text-xs text-accent hover:underline flex items-center gap-0.5">Open Inbox <FiArrowRight /></Link>
            </div>
            <div className="space-y-3">
              {recentMessages.length === 0 ? (
                <p className="text-xs text-gray-400 italic py-2">Your contact form inbox is empty or table name mismatch.</p>
              ) : (
                recentMessages.map((msg) => (
                  <div key={msg.id} className="p-3.5 rounded-2xl bg-gray-50 dark:bg-gray-950 border border-gray-100 dark:border-gray-850">
                    <div className="flex justify-between items-center gap-2">
                      <span className="text-xs font-bold text-gray-800 dark:text-gray-200 truncate">{msg.name || msg.email}</span>
                      <span className="text-[10px] font-mono text-gray-400 shrink-0">
                        {msg.created_at ? new Date(msg.created_at).toLocaleDateString() : 'Recent'}
                      </span>
                    </div>
                    <p className="text-xs text-gray-500 dark:text-gray-400 line-clamp-2 mt-1 leading-relaxed">{msg.message || msg.text}</p>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* PEER TESTIMONIAL REVIEWS MONITOR */}
          <div className="rounded-3xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-900">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-md font-bold text-gray-900 dark:text-white flex items-center gap-2">
                <FiUsers className="text-orange-500" /> Active Testimonials
              </h2>
              <Link to="/admin/testimonials" className="text-xs text-accent hover:underline flex items-center gap-0.5">Manage Reviews <FiArrowRight /></Link>
            </div>
            <div className="space-y-3">
              {recentTestimonials.length === 0 ? (
                <p className="text-xs text-gray-400 italic py-2">No testimonial quotes indexed or table name mismatch.</p>
              ) : (
                recentTestimonials.map((test) => (
                  <div key={test.id} className="p-3.5 rounded-2xl bg-gray-50 dark:bg-gray-950 border border-gray-100 dark:border-gray-850 flex gap-3 items-start">
                    {test.avatar || test.image ? (
                      <img src={test.avatar || test.image} className="w-8 h-8 rounded-full object-cover mt-0.5 shrink-0 shadow-sm" alt="" />
                    ) : (
                      <div className="w-8 h-8 rounded-full bg-orange-500/10 text-orange-500 font-bold text-xs flex items-center justify-center shrink-0 mt-0.5">”</div>
                    )}
                    <div className="min-w-0 flex-1">
                      <h4 className="text-xs font-bold text-gray-900 dark:text-white truncate">{test.name}</h4>
                      <p className="text-[10px] text-gray-400 truncate">{test.role || test.designation}</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400 line-clamp-1 italic mt-1">"{test.text || test.content}"</p>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

        </section>
      </div>
    </AdminLayout>
  )
}