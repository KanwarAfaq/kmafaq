import { useState, useEffect } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'
import { Link } from 'react-router-dom'
import HeroParticles from '../components/HeroParticles'
import { supabase } from '../lib/supabase'
import {
  FiGithub,
  FiLinkedin,
  FiMail,
  FiDownload,
  FiArrowRight,
  FiCode,
  FiCpu,
  FiDatabase,
  FiBookOpen,
} from 'react-icons/fi'

const fadeUp = {
  hidden: { opacity: 0, y: 40 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6 } },
}

const stagger = {
  hidden: {},
  show: { transition: { staggerChildren: 0.15 } },
}

export function ParallaxImage() {
  const { scrollY } = useScroll()
  const y = useTransform(scrollY, [0, 500], [0, 150])

  return (
    <motion.div style={{ y }}>
      <img src="your-image.jpg" alt="Parallax" />
    </motion.div>
  )
}

export default function Home() {
  const [profile, setProfile] = useState(null)
  const [counts, setCounts] = useState({
    papers: '0',
    projects: '0',
    datasets: '0',
    repos: '0',
  })
  const [featuredProjects, setFeaturedProjects] = useState([])
  const [cvUrl, setCvUrl] = useState('#')
  const [skillTags, setSkillTags] = useState([])

  useEffect(() => {
    const fetchHomeData = async () => {
      try {
        const [
          { data: profileData, error: profileError },
          { data: assetData, error: assetError },
          { count: paperCount, error: paperError },
          { count: projectCount, error: projectError },
          { data: projectsData, error: projectsError },
          { data: skillsData, error: skillsError },
        ] = await Promise.all([
          supabase
            .from('profile_settings')
            .select('*')
            .order('id', { ascending: true })
            .limit(1)
            .maybeSingle(),

          supabase
            .from('profile_assets')
            .select('*')
            .eq('asset_name', 'resume_pdf')
            .maybeSingle(),

          supabase.from('publications').select('*', { count: 'exact', head: true }),

          supabase.from('projects').select('*', { count: 'exact', head: true }),

          supabase
            .from('projects')
            .select('*')
            .order('id', { ascending: true })
            .range(0, 1),

          supabase
            .from('technical_skills')
            .select('*')
            .order('display_order', { ascending: true }),
        ])

        if (profileError) throw profileError
        if (assetError) throw assetError
        if (paperError) throw paperError
        if (projectError) throw projectError
        if (projectsError) throw projectsError
        if (skillsError) throw skillsError

        if (profileData) {
          setProfile(profileData)
          if (profileData.cv_url) setCvUrl(profileData.cv_url)

          setCounts({
            papers: `${profileData.papers_count ?? paperCount ?? 0}`,
            projects: `${profileData.projects_count ?? projectCount ?? 0}`,
            datasets: `${profileData.datasets_count ?? 0}`,
            repos: `${profileData.repos_count ?? 0}`,
          })
        } else {
          setCounts({
            papers: `${paperCount ?? 0}`,
            projects: `${projectCount ?? 0}`,
            datasets: '0',
            repos: '0',
          })
        }

        if (assetData?.file_url && !profileData?.cv_url) {
          setCvUrl(assetData.file_url)
        }

        if (projectsData) {
          setFeaturedProjects(projectsData)
        }

        if (skillsData) {
          setSkillTags(skillsData.map((item) => item.skill_name).filter(Boolean))
        }
      } catch (err) {
        console.error('Error streaming home dashboard data collections:', err)
      }
    }

    fetchHomeData()
  }, [])

  const fullName = profile?.full_name || 'Kanwar Muhammad Afaq'
  const shortName = profile?.short_name || 'Afaq'
  const tagline = profile?.hero_tagline || 'AI Researcher · NLP Engineer · Data Scientist'
  const subtitle =
    profile?.hero_subtitle ||
    'Researching the intersection of Natural Language Processing and deep learning — building tools for code-mixed Roman Urdu text and air quality forecasting with CNN, LSTM & GRU models.'
  const profileImage =
    profile?.profile_image_url ||
    'https://raw.githubusercontent.com/KanwarAfaq/kmafaq/refs/heads/main/src/images/afaq_profile.jpeg'

  const roleTags = tagline
    .split('·')
    .map((item) => item.trim())
    .filter(Boolean)

  const socialLinks = [
    profile?.github_url
      ? { icon: <FiGithub size={20} />, href: profile.github_url, label: 'GitHub' }
      : null,
    profile?.linkedin_url
      ? { icon: <FiLinkedin size={20} />, href: profile.linkedin_url, label: 'LinkedIn' }
      : null,
    profile?.email
      ? { icon: <FiMail size={20} />, href: `mailto:${profile.email}`, label: 'Email' }
      : null,
  ].filter(Boolean)

  const statItems = [
    { label: 'Research Papers', value: counts.papers, icon: <FiBookOpen size={22} /> },
    { label: 'ML Projects', value: counts.projects, icon: <FiCpu size={22} /> },
    { label: 'Datasets Built', value: counts.datasets, icon: <FiDatabase size={22} /> },
    { label: 'GitHub Repos', value: counts.repos, icon: <FiCode size={22} /> },
  ]

  return (
    <div className="flex flex-col">
      <section
        className="relative flex min-h-screen items-center justify-center overflow-hidden"
        style={{
          backgroundImage: 'url(https://images.unsplash.com/photo-1639322537228-f710d846310a?w=1800&q=90)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        <HeroParticles />
        <div className="absolute inset-0 bg-gradient-to-br from-black/80 via-black/60 to-black/40" />
        <div className="absolute inset-0 bg-gradient-to-t from-gray-950 via-transparent to-transparent" />

        <motion.div
          variants={stagger}
          initial="hidden"
          animate="show"
          className="relative z-10 mx-auto max-w-4xl px-4 text-center"
        >
          <motion.div variants={fadeUp} className="mb-8 flex justify-center">
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
          </motion.div>

          <motion.div variants={fadeUp} className="mb-4">
            <p className="mb-2 font-mono text-sm uppercase tracking-widest text-accent">
              Welcome to my portfolio
            </p>
            <h1 className="text-5xl font-black leading-tight text-white md:text-7xl">
              {fullName.replace(shortName, '').trim()}
              <span className="block text-accent">{shortName}</span>
            </h1>
          </motion.div>

          <motion.div variants={fadeUp} className="mb-6 flex flex-wrap justify-center gap-2">
            {(roleTags.length ? roleTags : ['AI Researcher', 'NLP Engineer', 'Data Scientist']).map(
              (role) => (
                <span
                  key={role}
                  className="rounded-full border border-white/20 bg-white/10 px-4 py-1.5 text-sm font-medium text-white backdrop-blur-md"
                >
                  {role}
                </span>
              )
            )}
          </motion.div>

          <motion.p
            variants={fadeUp}
            className="mx-auto mb-8 max-w-2xl text-lg leading-relaxed text-gray-300 md:text-xl"
          >
            {subtitle}
          </motion.p>

          <motion.div variants={fadeUp} className="mb-10 flex flex-wrap justify-center gap-4">
            <Link to="/projects" className="btn-accent">
              View Projects <FiArrowRight />
            </Link>

            <a
              href={cvUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-outline"
              style={{ borderColor: 'rgba(255,255,255,0.4)', color: 'white' }}
            >
              <FiDownload /> Download CV
            </a>
          </motion.div>

          {socialLinks.length > 0 && (
            <motion.div variants={fadeUp} className="flex justify-center gap-4">
              {socialLinks.map((s) => (
                <a
                  key={s.label}
                  href={s.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="rounded-xl border border-white/20 bg-white/10 p-3 text-white backdrop-blur-md transition-all duration-200 hover:border-accent hover:bg-accent"
                >
                  {s.icon}
                </a>
              ))}
            </motion.div>
          )}
        </motion.div>

        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ repeat: Infinity, duration: 2 }}
          className="absolute bottom-8 left-1/2 flex -translate-x-1/2 flex-col items-center gap-1 text-white/40"
        >
          <span className="text-xs uppercase tracking-widest">Scroll</span>
          <div className="h-8 w-px bg-white/20" />
        </motion.div>
      </section>

      <section className="bg-gray-50 px-4 py-16 dark:bg-gray-900">
        <div className="mx-auto grid max-w-5xl grid-cols-2 gap-6 md:grid-cols-4">
          {statItems.map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="group rounded-2xl border border-gray-200 bg-white p-6 text-center transition-all duration-300 hover:border-accent dark:border-gray-700 dark:bg-gray-800"
            >
              <div className="mb-3 flex justify-center text-accent transition-transform group-hover:scale-110">
                {stat.icon}
              </div>
              <div className="mb-1 text-3xl font-black text-gray-900 dark:text-white">
                {stat.value}
              </div>
              <div className="text-sm text-gray-500 dark:text-gray-400">{stat.label}</div>
            </motion.div>
          ))}
        </div>
      </section>

      {featuredProjects.length > 0 && (
        <section className="section-padding bg-white dark:bg-gray-950">
          <div className="mx-auto max-w-6xl">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="mb-12"
            >
              <h2 className="section-title">
                Featured <span className="text-accent">Projects</span>
              </h2>
              <p className="section-subtitle">Selected research and development work</p>
            </motion.div>

            <div className="mb-8 grid gap-6 md:grid-cols-2">
              {featuredProjects.map((p, i) => (
                <motion.div
                  key={p.id || i}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.15 }}
                  className="group relative flex flex-col overflow-hidden rounded-2xl border border-gray-200 bg-white transition-all duration-300 hover:border-accent hover:shadow-xl dark:border-gray-700 dark:bg-gray-800"
                >
                  <div className="h-48 overflow-hidden">
                    <img
                      src={p.image}
                      alt={p.title}
                      className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                  </div>
                  <div className="flex flex-1 flex-col p-6">
                    <h3 className="mb-2 text-xl font-bold text-gray-900 transition-colors group-hover:text-accent dark:text-white">
                      {p.title}
                    </h3>
                    <p className="mb-4 flex-1 text-sm leading-relaxed text-gray-500 dark:text-gray-400">
                      {p.desc_text || p.desc}
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {p.tags?.map((t) => (
                        <span key={t} className="tag-pill">
                          {t}
                        </span>
                      ))}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>

            <div className="text-center">
              <Link to="/projects" className="btn-accent">
                View All Projects <FiArrowRight />
              </Link>
            </div>
          </div>
        </section>
      )}

      <section
        className="relative overflow-hidden px-4 py-16"
        style={{
          backgroundImage: 'url(https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=1800&q=80)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        <div className="absolute inset-0 bg-black/75 backdrop-blur-sm" />
        <div className="relative z-10 mx-auto max-w-5xl text-center">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-10 text-3xl font-bold text-white md:text-4xl"
          >
            Technical <span className="text-accent">Skills</span>
          </motion.h2>

          <div className="flex flex-wrap justify-center gap-3">
            {(skillTags.length
              ? skillTags
              : [
                  'Python',
                  'TensorFlow',
                  'PyTorch',
                  'Scikit-learn',
                  'NLTK',
                  'spaCy',
                  'BERT / Transformers',
                  'CNN',
                  'LSTM',
                  'GRU',
                  'Pandas',
                  'NumPy',
                  'Matplotlib',
                  'Selenium',
                  'BeautifulSoup',
                  'FastAPI',
                  'React',
                  'Git / GitHub',
                  'LaTeX',
                  'SQL',
                ]
            ).map((skill, i) => (
              <motion.span
                key={skill}
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.03 }}
                className="cursor-default rounded-full border border-white/20 bg-white/10 px-4 py-2 text-sm font-medium text-white backdrop-blur-md transition-all hover:border-accent hover:bg-accent"
              >
                {skill}
              </motion.span>
            ))}
          </div>
        </div>
      </section>

      <section className="section-padding bg-gray-50 dark:bg-gray-900">
        <div className="mx-auto max-w-3xl text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="section-title">
              Let's <span className="text-accent">Connect</span>
            </h2>
            <p className="section-subtitle mx-auto">
              Open to research collaborations, academic discussions, and exciting AI/NLP projects.
            </p>
            <Link to="/contact" className="btn-accent">
              Get In Touch <FiArrowRight />
            </Link>
          </motion.div>
        </div>
      </section>
    </div>
  )
}