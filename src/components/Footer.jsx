import { useEffect, useState, useRef } from 'react'
import { Link } from 'react-router-dom'
import {
  FiGithub,
  FiLinkedin,
  FiMail,
  FiHeart,
  FiExternalLink,
  FiArrowUpRight,
  FiArrowUp,
} from 'react-icons/fi'
import { SiGooglescholar, SiKaggle } from 'react-icons/si'
import {
  motion,
  useMotionValue,
  useReducedMotion,
  useSpring,
} from 'framer-motion'
import { supabase } from '../lib/supabase' // adjust path if your supabase client is elsewhere

function getSocialIcon(platformName) {
  const key = platformName.trim().toLowerCase()

  if (key.includes('github')) return <FiGithub size={16} />
  if (key.includes('linkedin')) return <FiLinkedin size={16} />
  if (key.includes('scholar')) return <SiGooglescholar size={16} />
  if (key.includes('kaggle')) return <SiKaggle size={16} />
  if (key.includes('email') || key.includes('mail')) return <FiMail size={16} />
  return <FiExternalLink size={16} />
}

function MagneticChip({ href, label, icon }) {
  const ref = useRef(null)
  const reduceMotion = useReducedMotion()

  const mx = useMotionValue(0)
  const my = useMotionValue(0)

  const x = useSpring(mx, { stiffness: 180, damping: 20, mass: 0.8 })
  const y = useSpring(my, { stiffness: 180, damping: 20, mass: 0.8 })

  const handleMove = (e) => {
    if (reduceMotion || !ref.current) return

    const rect = ref.current.getBoundingClientRect()
    const dx = e.clientX - (rect.left + rect.width / 2)
    const dy = e.clientY - (rect.top + rect.height / 2)

    mx.set(dx * 0.14)
    my.set(dy * 0.14)
  }

  const handleLeave = () => {
    mx.set(0)
    my.set(0)
  }

  return (
    <motion.a
      ref={ref}
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      onMouseMove={handleMove}
      onMouseLeave={handleLeave}
      style={reduceMotion ? {} : { x, y }}
      whileHover={reduceMotion ? {} : { scale: 1.03 }}
      whileTap={{ scale: 0.98 }}
      className="group inline-flex items-center gap-2 rounded-2xl border border-gray-200 bg-white/80 px-3.5 py-2.5 text-sm text-gray-700 backdrop-blur-xl transition-all duration-300 hover:border-accent hover:text-accent dark:border-white/10 dark:bg-white/[0.05] dark:text-white/70 dark:hover:border-accent dark:hover:text-white"
    >
      <span className="text-accent transition-transform duration-300 group-hover:scale-110">
        {icon}
      </span>
      <span>{label}</span>
    </motion.a>
  )
}

export default function Footer() {
  const reduceMotion = useReducedMotion()
  const [socials, setSocials] = useState([])

  // fallback socials if DB is empty or fails
  const fallbackSocials = [
    { platform_name: 'GitHub', profile_url: 'https://github.com/KanwarAfaq' },
    {
      platform_name: 'LinkedIn',
      profile_url: 'https://linkedin.com/in/kanwarafaq',
    },
    {
      platform_name: 'Email',
      profile_url: 'mailto:kmafaq786@email.com',
    },
    {
      platform_name: 'Google Scholar',
      profile_url: 'https://scholar.google.com',
    },
    { platform_name: 'Kaggle', profile_url: 'https://www.kaggle.com' },
  ]

  // load active social links from Supabase
  useEffect(() => {
    let cancelled = false

    async function loadSocials() {
      try {
        const { data, error } = await supabase
          .from('social_links')
          .select('*')
          .eq('is_active', true)
          .order('id', { ascending: true })

        if (error) {
          console.error('Failed to load socials for footer', error)
          if (!cancelled) setSocials(fallbackSocials)
          return
        }

        if (!cancelled) {
          if (data && data.length > 0) {
            setSocials(data)
          } else {
            setSocials(fallbackSocials)
          }
        }
      } catch (err) {
        console.error('Footer socials error', err)
        if (!cancelled) setSocials(fallbackSocials)
      }
    }

    loadSocials()

    return () => {
      cancelled = true
    }
  }, [])

  const navLinks = [
    { label: 'Home', path: '/' },
    { label: 'About', path: '/about' },
    { label: 'Projects', path: '/projects' },
    { label: 'Gallery', path: 'p-gallery' },
    { label: 'Blog', path: '/blog' },
    { label: 'Contact', path: '/contact' },
  ]

  const revealItem = {
    hidden: { opacity: 0, y: reduceMotion ? 0 : 18 },
    visible: (i = 0) => ({
      opacity: 1,
      y: 0,
      transition: {
        type: 'spring',
        stiffness: 170,
        damping: 22,
        mass: 0.9,
        delay: i * 0.08,
      },
    }),
  }

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: reduceMotion ? 'auto' : 'smooth',
    })
  }

  return (
    <footer className="relative mt-28 overflow-hidden border-t border-gray-200 bg-[#f8fafc] text-gray-900 dark:border-white/10 dark:bg-[#050816] dark:text-white">
      {/* background glow */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute left-[-8%] top-[-10%] h-72 w-72 rounded-full bg-accent/10 blur-[120px]" />
        <div className="absolute right-[-4%] top-[18%] h-80 w-80 rounded-full bg-cyan-400/10 blur-[140px]" />
        <div className="absolute inset-0 bg-[linear-gradient(to_bottom,transparent,rgba(255,255,255,0.35))] dark:bg-[linear-gradient(to_bottom,transparent,rgba(255,255,255,0.02))]" />
      </div>

      <div className="relative mx-auto max-w-7xl px-4 py-16 md:px-8 lg:py-20">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-12 lg:gap-10">
          {/* brand / intro */}
          <motion.div
            variants={revealItem}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
            custom={0}
            className="lg:col-span-5"
          >
            <div className="mb-6 inline-flex items-center gap-3 rounded-2xl border border-gray-200 bg-white/80 px-4 py-3 shadow-sm backdrop-blur-xl dark:border-white/10 dark:bg-white/[0.05]">
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-accent text-sm font-black tracking-widest text-white shadow-[0_10px_35px_rgba(20,184,166,0.25)]">
                KA
              </div>
              <div>
               
                <h3 className="text-lg font-semibold tracking-tight">
                  K.M. <span className="text-accent">AFAQ</span>
                  
                </h3>
              </div>
            </div>

            <h2 className="max-w-xl text-3xl font-semibold leading-tight tracking-tight md:text-4xl">
              Building AI systems for language, prediction, and practical impact.
            </h2>

            <p className="mt-5 max-w-xl text-sm leading-7 text-gray-600 md:text-[15px] dark:text-white/65">
              AI researcher specializing in Roman Urdu NLP, code-mixed language
              processing, and deep learning for environmental prediction. I build
              clean, research-driven systems with practical value.
            </p>

            <div className="mt-6 inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 px-4 py-2 text-sm text-emerald-700 dark:border-emerald-500/20 dark:bg-emerald-500/10 dark:text-emerald-300">
              <span className="h-2.5 w-2.5 animate-pulse rounded-full bg-emerald-500" />
              <span className="font-medium">Currently open for:</span>
              <span>
                Research collaborations, AI consulting, and applied NLP projects
              </span>
            </div>

            <div className="mt-7 flex flex-wrap gap-3">
              <Link
                to="/contact"
                className="group inline-flex items-center gap-2 rounded-2xl bg-gray-900 px-5 py-3 text-sm font-semibold text-white transition-all duration-300 hover:-translate-y-0.5 hover:bg-accent dark:bg-white dark:text-slate-900 dark:hover:text-white"
              >
                Start a conversation
                <FiArrowUpRight className="transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </Link>

              <Link
                to="/projects"
                className="inline-flex items-center gap-2 rounded-2xl border border-gray-200 bg-white/80 px-5 py-3 text-sm font-medium text-gray-700 backdrop-blur-xl transition-all duration-300 hover:border-accent hover:text-accent dark:border-white/10 dark:bg-white/[0.05] dark:text-white/75 dark:hover:border-accent dark:hover:text-white"
              >
                Explore projects
              </Link>
            </div>
          </motion.div>

          {/* nav */}
          <motion.div
            variants={revealItem}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
            custom={1}
            className="lg:col-span-3"
          >
            <div className="rounded-3xl border border-gray-200 bg-white/80 p-6 shadow-sm backdrop-blur-xl dark:border-white/10 dark:bg-white/[0.04]">
              <p className="mb-5 text-[11px] uppercase tracking-[0.22em] text-gray-500 dark:text-white/45">
                Navigation
              </p>

              <div className="grid grid-cols-2 gap-x-6 gap-y-4">
                {navLinks.map((l) => (
                  <Link
                    key={l.path}
                    to={l.path}
                    className="group inline-flex items-center text-sm text-gray-600 transition duration-300 hover:text-accent dark:text-white/65 dark:hover:text-white"
                  >
                    <span className="relative">
                      {l.label}
                      <span className="absolute -bottom-1 left-0 h-px w-0 bg-accent transition-all duration-300 group-hover:w-full" />
                    </span>
                  </Link>
                ))}
              </div>
            </div>
          </motion.div>

          {/* social */}
          <motion.div
            variants={revealItem}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
            custom={2}
            className="lg:col-span-4"
          >
            <div className="rounded-3xl border border-gray-200 bg-white/80 p-6 shadow-sm backdrop-blur-xl dark:border-white/10 dark:bg-white/[0.05]">
              <p className="mb-3 text-[11px] uppercase tracking-[0.22em] text-gray-500 dark:text-white/45">
                Connect
              </p>

              <p className="mb-6 text-sm leading-6 text-gray-600 dark:text-white/60">
                Open to research collaboration, academic discussion, technical
                partnerships, and digital product opportunities.
              </p>

              <div className="flex flex-wrap gap-3">
                {socials.map((s, i) => (
                  <MagneticChip
                    key={s.id ?? s.profile_url ?? i}
                    href={s.profile_url}
                    label={s.platform_name}
                    icon={getSocialIcon(s.platform_name)}
                  />
                ))}
              </div>
            </div>
          </motion.div>
        </div>

        {/* bottom strip */}
        <motion.div
          variants={revealItem}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          custom={3}
          className="mt-10 flex flex-col gap-4 border-t border-gray-200 pt-6 md:flex-row md:items-center md:justify-between dark:border-white/10"
        >
          <p className="text-sm text-gray-500 dark:text-white/40">
            © {new Date().getFullYear()} Kanwar Muhammad Afaq — designed for
            research, code, and clarity.
          </p>

          <div className="flex flex-wrap items-center gap-3 text-sm text-gray-500 dark:text-white/40">
            <span className="inline-flex items-center gap-1.5 rounded-full border border-gray-200 bg-white/80 px-3 py-1.5 dark:border-white/10 dark:bg-white/[0.05]">
              Built with <FiHeart size={13} className="text-rose-400" />
            </span>
            <span className="rounded-full border border-gray-200 bg-white/80 px-3 py-1.5 dark:border-white/10 dark:bg-white/[0.05]">
              React
            </span>
            <span className="rounded-full border border-gray-200 bg-white/80 px-3 py-1.5 dark:border-white/10 dark:bg-white/[0.05]">
              Tailwind
            </span>
            <span className="rounded-full border border-gray-200 bg-white/80 px-3 py-1.5 dark:border-white/10 dark:bg-white/[0.05]">
              Framer Motion
            </span>
          </div>
        </motion.div>

        {/* scroll top */}
        <motion.button
          type="button"
          onClick={scrollToTop}
          whileHover={reduceMotion ? {} : { y: -3, scale: 1.02 }}
          whileTap={{ scale: 0.97 }}
          className="absolute bottom-6 right-4 inline-flex h-12 w-12 items-center justify-center rounded-2xl border border-gray-200 bg-white/90 text-gray-700 shadow-lg backdrop-blur-xl transition-colors hover:border-accent hover:text-accent dark:border-white/10 dark:bg-white/[0.08] dark:text-white/70 dark:hover:border-accent dark:hover:text-white md:right-8"
          aria-label="Scroll to top"
        >
          <FiArrowUp size={18} />
        </motion.button>
      </div>
    </footer>
  )
}