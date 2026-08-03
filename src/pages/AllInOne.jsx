import { useState, useEffect, useRef } from 'react'
import { supabase } from '../lib/supabase'
import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import toast from 'react-hot-toast'
import CiteButton from '../components/CiteButton'
import TestimonialCarousel from '../components/testimonials/TestimonialCarousel'
import TestimonialFlipGrid from '../components/testimonials/TestimonialFlipGrid'
import TestimonialFluidGrid from '../components/testimonials/TestimonialFluidGrid'
import SkillChart from '../components/SkillChart'
import Reveal from '../components/Reveal'
import ResearchGraph from '../components/ResearchGraph'
import ResumePdf from '../components/ResumePdf'
import {
  FiHome,
  FiUser,
  FiCode,
  FiImage,
  FiBookOpen,
  FiMail,
  FiArrowUp,
  FiGithub,
  FiLinkedin,
  FiDownload,
  FiArrowRight,
  FiTag,
  FiClock,
  FiSend,
  FiCheckCircle,
  FiAlertCircle,
  FiMapPin,
  FiExternalLink,
  FiCopy,
  FiAward,
  FiFileText,
  FiPrinter,
} from 'react-icons/fi'
import { SiGooglescholar, SiKaggle } from 'react-icons/si'
import Certificates from './Certifications'

const sections = [
  { id: 'aio-home', label: 'Home', icon: <FiHome size={14} /> },
  { id: 'aio-about', label: 'About', icon: <FiUser size={14} /> },
  { id: 'aio-projects', label: 'Projects', icon: <FiCode size={14} /> },
  { id: 'aio-gallery', label: 'Gallery', icon: <FiImage size={14} /> },
  { id: 'aio-certs', label: 'Certs', icon: <FiCheckCircle size={14} /> },
  { id: 'aio-publications', label: 'Pubs', icon: <FiFileText size={14} /> },
  { id: 'aio-blog', label: 'Blog', icon: <FiBookOpen size={14} /> },
  { id: 'aio-testimonials', label: 'Reviews', icon: <FiAward size={14} /> },
  { id: 'aio-contact', label: 'Contact', icon: <FiMail size={14} /> },
]

function SideNav({ active }) {
  const scrollTo = (id) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <div className="fixed right-5 top-1/2 z-50 hidden -translate-y-1/2 flex-col gap-3 lg:flex">
      {sections.map((s) => (
        <button
          key={s.id}
          onClick={() => scrollTo(s.id)}
          title={s.label}
          className={`group relative flex h-9 w-9 items-center justify-center rounded-full border-2 transition-all duration-300 ${
            active === s.id
              ? 'scale-110 border-accent bg-accent text-white shadow-lg'
              : 'border-gray-200 bg-white text-gray-400 hover:border-accent hover:text-accent dark:border-gray-700 dark:bg-gray-800'
          }`}
        >
          {s.icon}
          <span className="pointer-events-none absolute right-12 whitespace-nowrap rounded-lg bg-gray-900 px-2 py-1 text-xs text-white opacity-0 transition-opacity group-hover:opacity-100">
            {s.label}
          </span>
        </button>
      ))}
    </div>
  )
}

function ScrollTopBtn() {
  const [show, setShow] = useState(false)

  useEffect(() => {
    const handler = () => setShow(window.scrollY > 400)
    window.addEventListener('scroll', handler)
    return () => window.removeEventListener('scroll', handler)
  }, [])

  return show ? (
    <button
      onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
      className="fixed bottom-8 right-5 z-50 rounded-full bg-accent p-3 text-white shadow-lg transition-all hover:opacity-90"
    >
      <FiArrowUp size={18} />
    </button>
  ) : null
}

export default function AllInOne() {
  const [activeSection, setActiveSection] = useState('aio-home')
  const [contactForm, setContactForm] = useState({ name: '', email: '', subject: '', message: '' })
  const [contactStatus, setContactStatus] = useState('idle')
  const [copied, setCopied] = useState(false)
  const [dbProjects, setDbProjects] = useState([])
  const [dbImages, setDbImages] = useState([])
  const [dbPublications, setDbPublications] = useState([])
  const [dbTestimonials, setDbTestimonials] = useState([])
  const [dbBlogs, setDbBlogs] = useState([])
  const [cvUrl, setCvUrl] = useState('#')
  const [dynamicSocials, setDynamicSocials] = useState([])
const resumeRef = useRef(null)
const [profile, setProfile] = useState(null)
const [dbCertifications, setDbCertifications] = useState([])
const [dbSkills, setDbSkills] = useState([])
  useEffect(() => {
  const fetchAllData = async () => {
    try {
      const [
        projRes,
        imgRes,
        pubRes,
        blogRes,
        assetRes,
        socialRes,
        testRes,
        profileRes,
        certRes,
        skillsRes,
      ] = await Promise.all([
        supabase.from('projects').select('*').order('id', { ascending: true }),
        supabase.from('gallery').select('*').order('created_at', { ascending: false }),
        supabase.from('publications').select('*').order('year', { ascending: false }),
        supabase.from('blogs').select('*').order('date', { ascending: false }),
        supabase
          .from('profile_assets')
          .select('*')
          .eq('asset_name', 'resume_pdf')
          .maybeSingle(),
        supabase.from('social_links').select('*').eq('is_active', true),
        supabase.from('testimonials').select('*').order('id', { ascending: true }),
        supabase
          .from('profile_settings')
          .select('*')
          .order('id', { ascending: true })
          .limit(1)
          .maybeSingle(),
        supabase.from('certifications').select('*').order('date', { ascending: false }),
        supabase.from('technical_skills').select('*').order('display_order', { ascending: true }),
      ])

      if (projRes.data) setDbProjects(projRes.data)
      if (imgRes.data) setDbImages(imgRes.data)
      if (pubRes.data) setDbPublications(pubRes.data)
      if (blogRes.data) setDbBlogs(blogRes.data)
      if (socialRes.data) setDynamicSocials(socialRes.data)
      if (certRes.data) setDbCertifications(certRes.data)

      if (assetRes.data?.file_url) {
        setCvUrl(assetRes.data.file_url)
      }

      if (profileRes.data) {
        setProfile(profileRes.data)
        if (profileRes.data.cv_url) {
          setCvUrl(profileRes.data.cv_url)
        }
      }

      if (skillsRes.data) {
        const normalizedSkills = skillsRes.data.map((item) => ({
          ...item,
          items: Array.isArray(item.items)
            ? item.items
            : Array.isArray(item.skills)
            ? item.skills
            : typeof item.skills === 'string'
            ? item.skills.split(',').map((x) => x.trim()).filter(Boolean)
            : [],
          category: item.category || item.title || 'Skills',
        }))
        setDbSkills(normalizedSkills)
      }

      if (testRes.data) {
        const mappedTestimonials = testRes.data.map((item) => ({
          ...item,
          photo: item.image,
          text: item.text_content,
          title: item.role,
        }))
        setDbTestimonials(mappedTestimonials)
      }
    } catch (err) {
      console.error('Critical landing page sync execution fail:', err)
    }
  }

  fetchAllData()
}, [])
const handleExportResumePdf = async () => {
  const element = resumeRef.current
  if (!element) return

  const html2pdf = (await import('html2pdf.js')).default

  await html2pdf()
    .set({
      margin: 0,
      filename: 'Kanwar-Muhammad-Afaq-Resume.pdf',
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: {
        scale: 2,
        useCORS: true,
        backgroundColor: '#ffffff',
      },
      jsPDF: {
        unit: 'mm',
        format: 'a4',
        orientation: 'portrait',
      },
      pagebreak: {
        mode: ['css', 'legacy'],
      },
    })
    .from(element)
    .save()
}
  useEffect(() => {
    const observers = []

    sections.forEach((s) => {
      const el = document.getElementById(s.id)
      if (!el) return

      const obs = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            setActiveSection(s.id)
          }
        },
        {
          rootMargin: '-20% 0px -60% 0px',
          threshold: 0,
        }
      )

      obs.observe(el)
      observers.push(obs)
    })

    return () => observers.forEach((o) => o.disconnect())
  }, [dbProjects, dbBlogs, dbTestimonials])

  const handleContactChange = (e) =>
    setContactForm((f) => ({ ...f, [e.target.name]: e.target.value }))

  const handleContactSubmit = async (e) => {
    e.preventDefault()
    setContactStatus('loading')
    const toastId = toast.loading('Sending message...')

    try {
      await supabase.from('messages').insert([contactForm])

      const endpoint = profile?.formspree_endpoint || 'https://formspree.io/f/mbdegovd'
      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify(contactForm),
      })

      if (res.ok) {
        setContactStatus('idle')
        setContactForm({ name: '', email: '', subject: '', message: '' })
        toast.success('Message sent successfully!', { id: toastId })
      } else {
        setContactStatus('idle')
        toast.error('Failed to dispatch form pipeline messages.', { id: toastId })
      }
    } catch {
      setContactStatus('idle')
      toast.error('Network trace error detected.', { id: toastId })
    }
  }

  const directEmail = profile?.email || 'kmafaq786@email.com'

  const copyEmail = () => {
    navigator.clipboard.writeText(directEmail)
    setCopied(true)
    toast.success('Email copied to clipboard!')
    setTimeout(() => setCopied(false), 2000)
  }

  const fullName = profile?.full_name || 'Kanwar Muhammad Afaq'
  const shortName = profile?.short_name || 'Afaq'
  const heroTagline = profile?.hero_tagline || 'AI Researcher · NLP Engineer · Data Scientist'
  const heroSubtitle =
    profile?.hero_subtitle ||
    'Researching NLP for code-mixed Roman Urdu text and air quality forecasting with deep learning.'
  const profileImage =
    profile?.profile_image_url ||
    profile?.about_image_url ||
    'https://raw.githubusercontent.com/KanwarAfaq/kmafaq/refs/heads/main/src/images/afaq_profile.jpeg'
  const aboutImage =
    profile?.about_image_url ||
    profile?.profile_image_url ||
    'https://raw.githubusercontent.com/KanwarAfaq/kmafaq/refs/heads/main/src/images/afaq_profile.jpeg'
  const location = profile?.location || 'Taoyuan, Taiwan 🇹🇼'
  const bio1 =
    profile?.bio_paragraph_1 ||
    'I am an AI researcher focused on Natural Language Processing for low-resource code-mixed languages — specifically Roman Urdu–English text normalization for downstream NLP tasks.'
  const bio2 =
    profile?.bio_paragraph_2 ||
    'On the applied side, I build deep learning models for air quality forecasting using CNN, LSTM, and GRU architectures on real-time environmental sensor time-series data.'
  const bio3 = profile?.bio_paragraph_3 || ''

  const roleTags = heroTagline
    .split('·')
    .map((r) => r.trim())
    .filter(Boolean)

  const aboutStats = [
    {
      label: 'Research Papers',
      value:
        profile?.papers_count != null
          ? `${profile.papers_count}+`
          : dbPublications.length
          ? `${dbPublications.length}+`
          : '5+',
    },
    {
      label: 'ML Projects',
      value:
        profile?.projects_count != null
          ? `${profile.projects_count}+`
          : dbProjects.length
          ? `${dbProjects.length}+`
          : '10+',
    },
    {
      label: 'Datasets Built',
      value: profile?.datasets_count != null ? `${profile.datasets_count}+` : '8+',
    },
    {
      label: 'GitHub Repos',
      value: profile?.repos_count != null ? `${profile.repos_count}+` : '20+',
    },
  ]

  return (
  <div className="relative">
      <SideNav active={activeSection} />
      <ScrollTopBtn />

      <Reveal>
        <section
          id="aio-home"
          className="relative flex min-h-screen items-center justify-center overflow-hidden"
          style={{
            backgroundImage: 'url(https://images.unsplash.com/photo-1639322537228-f710d846310a?w=1800&q=90)',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        >
          <div className="absolute inset-0 bg-gradient-to-br from-black/80 via-black/60 to-black/40" />
          <div className="absolute inset-0 bg-gradient-to-t from-gray-950 via-transparent to-transparent" />

          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="relative z-10 mx-auto max-w-4xl px-4 text-center"
          >
            <div className="mb-8 flex justify-center">
              <div className="relative">
                <div className="h-32 w-32 animate-float overflow-hidden rounded-full border-4 border-accent shadow-2xl md:h-40 md:w-40">
                  <img
                    src={profileImage}
                    alt={fullName}
                    className="h-full w-full object-cover"
                  />
                </div>
                <span className="absolute bottom-2 right-2 h-5 w-5 rounded-full border-2 border-white bg-green-400" />
              </div>
            </div>

            <p className="mb-2 font-mono text-sm uppercase tracking-widest text-accent">
              All-in-One Portfolio View
            </p>
            <h1 className="mb-4 text-5xl font-black leading-tight text-white md:text-7xl">
              {fullName.replace(shortName, '').trim()}
              <span className="block text-accent">{shortName}</span>
            </h1>

            <div className="mb-6 flex flex-wrap justify-center gap-2">
              {(roleTags.length ? roleTags : ['AI Researcher', 'NLP Engineer', 'Data Scientist']).map(
                (r) => (
                  <span
                    key={r}
                    className="rounded-full border border-white/20 bg-white/10 px-4 py-1.5 text-sm font-medium text-white backdrop-blur-md"
                  >
                    {r}
                  </span>
                )
              )}
            </div>

            <p className="mx-auto mb-8 max-w-2xl text-lg leading-relaxed text-gray-300">
              {heroSubtitle}
            </p>

            <div className="flex flex-wrap justify-center gap-4">
              <a
                href={cvUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-accent flex items-center gap-2"
              >
                <FiDownload /> Download CV
              </a>
              <button
                onClick={() =>
                  document.getElementById('aio-contact')?.scrollIntoView({ behavior: 'smooth' })
                }
                className="btn-outline flex items-center gap-2"
                style={{ borderColor: 'rgba(255,255,255,0.4)', color: 'white' }}
              >
                <FiMail /> Contact Me
              </button>
              <button
  onClick={handleExportResumePdf}
  className="btn-outline flex items-center gap-2"
  style={{ borderColor: 'rgba(255,255,255,0.4)', color: 'white' }}
>
  <FiPrinter size={16} />
  Resume PDF
</button>
            </div>
          </motion.div>

          <motion.div
            animate={{ y: [0, 10, 0] }}
            transition={{ repeat: Infinity, duration: 2 }}
            className="absolute bottom-8 left-1/2 flex -translate-x-1/2 cursor-pointer flex-col items-center gap-1 text-white/40"
            onClick={() => document.getElementById('aio-about')?.scrollIntoView({ behavior: 'smooth' })}
          >
            <span className="text-xs uppercase tracking-widest">Scroll</span>
            <div className="h-8 w-px bg-white/20" />
          </motion.div>
        </section>
      </Reveal>

      <Reveal>
        <section id="aio-about" className="section-padding bg-white dark:bg-gray-950">
          <div className="mx-auto max-w-6xl">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="mb-12 text-center"
            >
              <h2 className="section-title mb-2 text-4xl font-bold dark:text-white md:text-5xl">
                About <span className="text-accent">Me</span>
              </h2>
              <p className="section-subtitle mx-auto text-gray-500">{heroTagline}</p>
            </motion.div>

            <div className="grid items-center gap-12 lg:grid-cols-2">
              <motion.div
                initial={{ opacity: 0, x: -40 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                className="flex justify-center"
              >
                <div className="relative">
                  <div className="h-64 w-64 overflow-hidden rounded-3xl border-4 border-accent shadow-2xl md:h-80 md:w-80">
                    <img
                      src={aboutImage}
                      alt={fullName}
                      className="h-full w-full object-cover"
                    />
                  </div>
                  <div className="absolute -bottom-4 -right-4 rounded-xl bg-accent px-4 py-2 text-sm font-bold text-white shadow-lg">
                    {profile?.about_badge || 'AI Researcher 🎓'}
                  </div>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: 40 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
              >
                <div className="mb-6 space-y-4 leading-relaxed text-gray-600 dark:text-gray-300">
                  <p>{bio1}</p>
                  <p>{bio2}</p>
                  {bio3 && <p>{bio3}</p>}
                </div>

                <div className="mb-6 grid grid-cols-2 gap-4">
                  {aboutStats.map((s) => (
                    <div
                      key={s.label}
                      className="rounded-2xl border border-gray-200 bg-gray-50 p-4 text-center dark:border-gray-700 dark:bg-gray-800"
                    >
                      <div className="text-2xl font-black text-accent">{s.value}</div>
                      <div className="mt-1 text-xs text-gray-500 dark:text-gray-400">{s.label}</div>
                    </div>
                  ))}
                </div>

                <a
                  href={cvUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-accent inline-flex items-center gap-2"
                >
                  <FiDownload /> Download CV
                </a>
              </motion.div>
            </div>
          </div>
        </section>
      </Reveal>

      <section id="aio-skills" className="section-padding bg-white dark:bg-gray-950">
        <div className="mx-auto max-w-6xl">
          <SkillChart />
        </div>
      </section>

      <Reveal>
        <section id="aio-projects" className="section-padding bg-gray-50 dark:bg-gray-900">
          <div className="mx-auto max-w-6xl">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="mb-12 text-center"
            >
              <h2 className="section-title mb-2 text-4xl font-bold dark:text-white md:text-5xl">
                My <span className="text-accent">Projects</span>
              </h2>
              <p className="section-subtitle mx-auto text-gray-500">Research & development work</p>
            </motion.div>

            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {dbProjects?.slice(0, 3).map((p, i) => (
                <motion.div
                  key={p.id || i}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.08 }}
                  className="group flex flex-col overflow-hidden rounded-2xl border border-gray-200 bg-white transition-all duration-300 hover:border-accent hover:shadow-xl dark:border-gray-700 dark:bg-gray-800"
                >
                  <div className="relative h-44 overflow-hidden">
                    <img
                      src={p.image}
                      alt={p.title}
                      className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                    {p.featured && (
                      <span className="absolute left-3 top-3 rounded-full bg-accent px-3 py-1 text-xs font-bold text-white">
                        Featured
                      </span>
                    )}
                    <span className="absolute right-3 top-3 rounded-full bg-black/50 px-3 py-1 text-xs text-white backdrop-blur-sm">
                      {p.category}
                    </span>
                  </div>
                  <div className="flex flex-1 flex-col p-5">
                    <h3 className="mb-2 text-lg font-bold text-gray-900 transition-colors group-hover:text-accent dark:text-white">
                      {p.title}
                    </h3>
                    <p className="mb-4 flex-1 text-sm leading-relaxed text-gray-500 dark:text-gray-400">
                      {p.desc_text || p.desc}
                    </p>
                    <div className="mb-4 flex flex-wrap gap-1.5">
                      {p.tags?.slice(0, 3).map((t) => (
                        <span
                          key={t}
                          className="rounded-md bg-gray-100 px-2 py-1 text-xs text-gray-600 dark:bg-gray-700 dark:text-gray-300"
                        >
                          {t}
                        </span>
                      ))}
                      {p.tags?.length > 3 && (
                        <span className="rounded-md bg-gray-100 px-2 py-1 text-xs text-gray-600 dark:bg-gray-700 dark:text-gray-300">
                          +{p.tags.length - 3}
                        </span>
                      )}
                    </div>
                    {p.github && (
                      <a
                        href={p.github}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-1.5 text-sm text-gray-500 transition-colors hover:text-accent"
                      >
                        <FiGithub size={14} /> GitHub
                      </a>
                    )}
                  </div>
                </motion.div>
              ))}
            </div>

            <div className="mt-10 text-center">
              <Link to="/projects" className="btn-outline inline-flex items-center gap-2">
                View All Projects <FiArrowRight />
              </Link>
            </div>
          </div>
        </section>
      </Reveal>

      <Reveal>
        <section id="aio-gallery" className="bg-gray-950 py-20">
          <div className="mx-auto max-w-7xl px-4 md:px-8">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="mb-12 text-center"
            >
              <h2 className="mb-4 text-4xl font-bold text-white md:text-5xl">
                My <span className="text-amber-500">Gallery</span>
              </h2>
              <p className="mx-auto max-w-2xl text-lg text-gray-400">
                Visual showcase of research and development work
              </p>
            </motion.div>

            <div className="mb-10 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {dbImages?.slice(0, 6).map((item, i) => (
                <motion.div
                  key={item.id || i}
                  initial={{ opacity: 0, scale: 0.85 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: i * 0.06 }}
                  className={`group relative cursor-pointer overflow-hidden rounded-2xl border border-white/5 transition-colors hover:border-amber-500/30 ${
                    i === 0 ? 'h-72 sm:col-span-2' : 'h-60'
                  }`}
                >
                  <img
                    src={item.url}
                    alt={item.name}
                    className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-110 group-hover:opacity-70"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent" />
                  <div className="absolute left-4 top-4 z-10">
                    <span className="rounded-full bg-amber-500 px-3 py-1 text-xs font-bold uppercase tracking-wider text-black">
                      {item.folder}
                    </span>
                  </div>
                  <div className="absolute bottom-0 left-0 right-0 z-10 translate-y-2 p-5 transition-transform group-hover:translate-y-0">
                    <h3 className="mb-1 text-lg font-bold text-white">{item.name}</h3>
                  </div>
                </motion.div>
              ))}
            </div>

            <div className="mt-12 text-center">
              <Link
                to="/p-gallery"
                className="inline-flex items-center gap-2 rounded-full border px-6 py-3 transition-colors duration-300 hover:bg-white/10"
                style={{ borderColor: 'rgba(255,255,255,0.3)', color: 'white' }}
              >
                View Full Gallery <FiArrowRight />
              </Link>
            </div>
          </div>
        </section>
      </Reveal>

      <Reveal>
        <div id="aio-certs" className="block min-h-[40vh] scroll-mt-20">
          <Certificates />
        </div>
      </Reveal>

      <Reveal>
        <section id="aio-publications" className="section-padding bg-white dark:bg-gray-950">
          <div className="mx-auto max-w-4xl">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="mb-12 text-center"
            >
              <h2 className="section-title mb-2 text-4xl font-bold dark:text-white md:text-5xl">
                My <span className="text-accent">Publications</span>
              </h2>
              <p className="section-subtitle mx-auto text-gray-500">
                Research manuscripts and conference papers
              </p>
            </motion.div>

            <div className="space-y-6">
              {dbPublications?.map((paper, i) => (
                <motion.div
                  key={paper.id || i}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  className="rounded-2xl border border-gray-200 bg-gray-50 p-6 transition-all hover:border-accent dark:border-gray-700 dark:bg-gray-800"
                >
                  <h3 className="mb-2 text-xl font-bold dark:text-white">{paper.title}</h3>
                  <p className="mb-4 text-sm text-gray-500 dark:text-gray-400">
                    {paper.authors} | {paper.journal} ({paper.year})
                  </p>
                  <CiteButton paper={paper} />
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      </Reveal>

      <Reveal>
        <section id="aio-blog" className="section-padding bg-white dark:bg-gray-950">
          <div className="mx-auto max-w-4xl">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="mb-12 text-center"
            >
              <h2 className="section-title mb-2 text-4xl font-bold dark:text-white md:text-5xl">
                Latest <span className="text-accent">Articles</span>
              </h2>
              <p className="section-subtitle mx-auto text-gray-500">
                Research notes and technical writing
              </p>
            </motion.div>

            <div className="mb-10 flex flex-col gap-6">
              {dbBlogs?.slice(0, 3).map((post, i) => (
                <motion.article
                  key={post.slug || i}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  className="group overflow-hidden rounded-2xl border border-gray-200 bg-white p-6 transition-all duration-300 hover:border-accent hover:shadow-xl dark:border-gray-700 dark:bg-gray-800 md:p-8"
                >
                  <div className="mb-3 flex flex-wrap items-center gap-3 text-sm text-gray-400 dark:text-gray-500">
                    <span>
                      {new Date(post.date).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                      })}
                    </span>
                    <span>·</span>
                    <span className="flex items-center gap-1">
                      <FiClock size={13} /> {post.read_time || post.readTime}
                    </span>
                  </div>

                  <h2 className="mb-3 text-xl font-bold text-gray-900 transition-colors group-hover:text-accent dark:text-white">
                    {post.title}
                  </h2>

                  <p className="mb-5 text-sm leading-relaxed text-gray-500 dark:text-gray-400">
                    {post.excerpt}
                  </p>

                  <div className="flex flex-wrap items-center justify-between gap-4">
                    <div className="flex flex-wrap gap-2">
                      {post.tags?.map((tag) => (
                        <span
                          key={tag}
                          className="flex items-center gap-1 rounded-md bg-gray-100 px-2 py-1 text-xs text-gray-600 dark:bg-gray-700 dark:text-gray-300"
                        >
                          <FiTag size={10} /> {tag}
                        </span>
                      ))}
                    </div>
                    <Link
                      to={`/blog/${post.slug}`}
                      className="flex items-center gap-1.5 text-sm font-semibold text-accent underline-offset-4 hover:underline"
                    >
                      Read Article <FiArrowRight size={14} />
                    </Link>
                  </div>
                </motion.article>
              ))}
            </div>

            <div className="text-center">
              <Link to="/blog" className="btn-outline inline-flex items-center gap-2">
                View All Articles <FiArrowRight />
              </Link>
            </div>
          </div>
        </section>
      </Reveal>

      <section id="aio-graph" className="section-padding bg-white dark:bg-gray-950">
        <div className="mx-auto max-w-4xl">
          <div className="mb-8 text-center">
            <h2 className="text-3xl font-bold dark:text-white">
              Research <span className="text-accent">Network</span>
            </h2>
            <p className="mt-2 text-gray-500">Interactive visualization of my research domains.</p>
          </div>
          <ResearchGraph />
        </div>
      </section>

      <section id="aio-testimonials" className="section-padding scroll-mt-12 bg-gray-950 text-white">
        <div className="mx-auto max-w-6xl space-y-20">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center"
          >
            <h2 className="mb-4 text-4xl font-bold md:text-5xl">
              Colleague <span className="text-accent">Recommendations</span>
            </h2>
            <p className="text-lg text-gray-400">
              Feedback from professors and research collaborators
            </p>
          </motion.div>

          {dbTestimonials.length > 0 && (
            <>
              <div>
                <TestimonialCarousel items={dbTestimonials} />
              </div>
              <div className="border-t border-white/10 pt-10">
                <TestimonialFlipGrid items={dbTestimonials} />
              </div>
              <div className="border-t border-white/10 pt-10">
                <TestimonialFluidGrid items={dbTestimonials} />
              </div>
            </>
          )}
        </div>
      </section>

      <section
        id="aio-contact"
        className="section-padding relative scroll-mt-12"
        style={{
          backgroundImage: 'url(https://images.unsplash.com/photo-1516387938699-a93567ec168e?w=1600&q=80)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" />
        <div className="relative z-10 mx-auto max-w-6xl">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-12 text-center"
          >
            <h2 className="mb-4 text-4xl font-bold text-white md:text-5xl">
              Contact <span className="text-accent">Me</span>
            </h2>
            <p className="mx-auto max-w-2xl text-lg text-gray-400">
              Open to research collaborations, academic discussions and AI/NLP projects
            </p>
          </motion.div>

          <div className="grid gap-12 lg:grid-cols-2">
            <motion.div
              initial={{ opacity: 0, x: -40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <div className="mb-6 flex items-center gap-3 rounded-2xl border border-white/10 bg-white/10 p-4 backdrop-blur-md">
                <div className="rounded-xl bg-accent/20 p-3 text-accent">
                  <FiMapPin size={20} />
                </div>
                <div>
                  <p className="text-xs uppercase tracking-widest text-gray-400">Location</p>
                  <p className="font-semibold text-white">{location}</p>
                </div>
              </div>

              <button
                onClick={copyEmail}
                className="group mb-3 flex w-full items-center gap-4 rounded-2xl border border-white/10 bg-white/5 p-4 backdrop-blur-md transition-all duration-300 hover:border-accent hover:shadow-md"
              >
                <div className="rounded-xl bg-white/10 p-2.5 text-gray-400 shadow-sm transition-colors group-hover:text-accent">
                  {copied ? <FiCheckCircle size={20} className="text-green-500" /> : <FiMail size={20} />}
                </div>
                <div className="min-w-0 flex-1 text-left">
                  <p className="text-xs font-medium uppercase tracking-widest text-gray-400">
                    Direct Email
                  </p>
                  <p className="truncate text-sm font-semibold text-white">{directEmail}</p>
                </div>
                <div className="text-gray-400 transition-colors group-hover:text-accent">
                  {copied ? (
                    <span className="text-xs font-bold text-green-500">Copied!</span>
                  ) : (
                    <FiCopy size={16} />
                  )}
                </div>
              </button>

              <div className="space-y-3">
                {dynamicSocials.map((s, i) => {
                  const key = s.platform_name.trim().toLowerCase()

                  let currentIcon = <FiExternalLink size={18} />
                  if (key.includes('github')) currentIcon = <FiGithub size={18} />
                  if (key.includes('linkedin')) currentIcon = <FiLinkedin size={18} />
                  if (key.includes('scholar')) currentIcon = <SiGooglescholar size={18} />
                  if (key.includes('kaggle')) currentIcon = <SiKaggle size={18} />
                  if (key.includes('email') || key.includes('mail')) currentIcon = <FiMail size={18} />

                  return (
                    <motion.a
                      key={s.id || i}
                      href={s.profile_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      initial={{ opacity: 0, x: -20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: i * 0.08 }}
                      className="group flex items-center gap-4 rounded-2xl border border-white/10 bg-white/5 p-4 backdrop-blur-md transition-all duration-300 hover:border-accent"
                    >
                      <div className="rounded-xl bg-white/10 p-2.5 text-gray-400 transition-colors group-hover:text-accent">
                        {currentIcon}
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="text-xs uppercase tracking-widest text-gray-500">
                          {s.platform_name}
                        </p>
                        <p className="truncate text-sm font-semibold text-white">
                          {s.profile_url.replace(/^https?:\/\/(www\.)?/, '')}
                        </p>
                      </div>
                      <FiExternalLink
                        size={14}
                        className="text-gray-600 transition-colors group-hover:text-accent"
                      />
                    </motion.a>
                  )
                })}
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <div className="rounded-3xl border border-white/10 bg-white/10 p-6 backdrop-blur-md md:p-8">
                <h3 className="mb-6 text-xl font-bold text-white">Send a Message</h3>

                <form onSubmit={handleContactSubmit} className="space-y-4">
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div>
                      <input
                        type="text"
                        name="name"
                        value={contactForm.name}
                        onChange={handleContactChange}
                        required
                        placeholder="Your Name *"
                        className="w-full rounded-xl border border-white/20 bg-white/5 px-4 py-3 text-sm text-white placeholder-gray-400 outline-none transition-all focus:border-accent focus:bg-white/10"
                      />
                    </div>
                    <div>
                      <input
                        type="email"
                        name="email"
                        value={contactForm.email}
                        onChange={handleContactChange}
                        required
                        placeholder="Email Address *"
                        className="w-full rounded-xl border border-white/20 bg-white/5 px-4 py-3 text-sm text-white placeholder-gray-400 outline-none transition-all focus:border-accent focus:bg-white/10"
                      />
                    </div>
                  </div>

                  <div>
                    <input
                      type="text"
                      name="subject"
                      value={contactForm.subject}
                      onChange={handleContactChange}
                      required
                      placeholder="Subject *"
                      className="w-full rounded-xl border border-white/20 bg-white/5 px-4 py-3 text-sm text-white placeholder-gray-400 outline-none transition-all focus:border-accent focus:bg-white/10"
                    />
                  </div>

                  <div>
                    <textarea
                      name="message"
                      value={contactForm.message}
                      onChange={handleContactChange}
                      required
                      rows={5}
                      placeholder="Your Message *"
                      className="w-full resize-none rounded-xl border border-white/20 bg-white/5 px-4 py-3 text-sm text-white placeholder-gray-400 outline-none transition-all focus:border-accent focus:bg-white/10"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={contactStatus === 'loading'}
                    className="btn-accent flex w-full items-center justify-center gap-2 disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    {contactStatus === 'loading' ? 'Sending...' : <><FiSend /> Send Message</>}
                  </button>
                </form>
              </div>
            </motion.div>
          </div>
        </div>
      </section>
      <div className="pointer-events-none fixed left-[-99999px] top-0 opacity-0">
  <div ref={resumeRef}>
    <ResumePdf
      profile={profile}
      socials={dynamicSocials}
      projects={dbProjects}
      publications={dbPublications}
      certifications={dbCertifications}
      skills={dbSkills}
    />
  </div>
</div>
    </div>
    
  )
  
}