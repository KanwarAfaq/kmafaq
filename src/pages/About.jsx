import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { FiDownload, FiMail, FiAward, FiBookOpen, FiCode, FiCpu } from 'react-icons/fi'
import { Link } from 'react-router-dom'
import { supabase } from '../lib/supabase'

import TestimonialCarousel from '../components/testimonials/TestimonialCarousel'
import TestimonialFlipGrid from '../components/testimonials/TestimonialFlipGrid'
import TestimonialFluidGrid from '../components/testimonials/TestimonialFluidGrid'
import SkillChart from '../components/SkillChart'

const fadeUp = (delay = 0) => ({
  hidden: { opacity: 0, y: 30 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6, delay } },
})

const timelineIcons = [FiCpu, FiCode, FiBookOpen, FiAward]

export default function About() {
  const [profile, setProfile] = useState(null)
  const [timelineItems, setTimelineItems] = useState([])
  const [dbTestimonials, setDbTestimonials] = useState([])
  const [cvUrl, setCvUrl] = useState('#')
  const [dbSkills, setDbSkills] = useState([])

  useEffect(() => {
    const fetchAboutData = async () => {
      try {
        const [
          { data: profileData, error: profileError },
          { data: assetData, error: assetError },
          { data: timelineData, error: timelineError },
          { data: testData, error: testimonialsError },
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

          supabase
            .from('profile_timeline')
            .select('*')
            .order('sort_order', { ascending: true })
            .order('id', { ascending: true }),

          supabase
            .from('testimonials')
            .select('*')
            .order('id', { ascending: true }),

          supabase
            .from('technical_skills')
            .select('*')
            .order('display_order', { ascending: true }),
        ])

        if (profileError) throw profileError
        if (assetError) throw assetError
        if (timelineError) throw timelineError
        if (testimonialsError) throw testimonialsError
        if (skillsError) throw skillsError

        if (profileData) {
          setProfile(profileData)
          if (profileData.cv_url) setCvUrl(profileData.cv_url)
        }

        if (assetData?.file_url && !profileData?.cv_url) {
          setCvUrl(assetData.file_url)
        }

        if (timelineData) {
          setTimelineItems(timelineData)
        }

        if (testData) {
          const mappedTestimonials = testData.map((item) => ({
            ...item,
            photo: item.image,
            text: item.text_content,
            title: item.role,
          }))
          setDbTestimonials(mappedTestimonials)
        }

        if (skillsData) {
          const groups = skillsData.reduce((acc, curr) => {
            if (!acc[curr.category]) acc[curr.category] = []
            acc[curr.category].push(curr.skill_name)
            return acc
          }, {})

          setDbSkills(
            Object.keys(groups).map((cat) => ({
              category: cat,
              items: groups[cat],
            }))
          )
        }
      } catch (err) {
        console.error('Error loading about page data:', err)
      }
    }

    fetchAboutData()
  }, [])

  const fullName = profile?.full_name || 'Kanwar Muhammad Afaq'
  const shortName = profile?.short_name || 'Afaq'
  const aboutTitle = profile?.about_title || 'About'
  const aboutBadge = profile?.about_badge || 'Get to know me'
  const heroTagline = profile?.hero_tagline || 'K.M. AFAQ — AI Researcher · NLP Engineer · Data Scientist'
  const aboutImage =
    profile?.about_image_url ||
    profile?.profile_image_url ||
    'https://raw.githubusercontent.com/KanwarAfaq/kmafaq/refs/heads/main/src/images/afaq1.jpeg'

  return (
    <div>
      <section
        className="relative flex h-64 items-center justify-center md:h-80"
        style={{
          backgroundImage: 'url(https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=1600&q=80)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        <div className="absolute inset-0 bg-black/70" />
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className="relative z-10 px-4 text-center"
        >
          <p className="mb-3 font-mono text-sm uppercase tracking-widest text-accent">
            {aboutBadge}
          </p>
          <h1 className="text-4xl font-black text-white md:text-6xl">
            {aboutTitle} <span className="text-accent">Me</span>
          </h1>
        </motion.div>
      </section>

      <section className="section-padding bg-white dark:bg-gray-950">
        <div className="mx-auto grid max-w-6xl items-center gap-12 lg:grid-cols-2">
          <motion.div
            variants={fadeUp(0)}
            initial="hidden"
            whileInView="show"
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
                {aboutBadge || 'AI Researcher'}
              </div>

              <div className="absolute -left-4 -top-4 -z-10 h-full w-full rounded-3xl border-2 border-accent/30" />
            </div>
          </motion.div>

          <motion.div
            variants={fadeUp(0.2)}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
          >
            <h2 className="mb-2 text-3xl font-bold text-gray-900 dark:text-white md:text-4xl">
              {fullName.replace(shortName, '').trim()}{' '}
              <span className="text-accent">{shortName}</span>
            </h2>

            <p className="mb-6 font-mono text-sm tracking-wide text-accent">
              {heroTagline}
            </p>

            <div className="mb-8 space-y-4 leading-relaxed text-gray-600 dark:text-gray-300">
              {profile?.bio_paragraph_1 && <p>{profile.bio_paragraph_1}</p>}
              {profile?.bio_paragraph_2 && <p>{profile.bio_paragraph_2}</p>}
              {profile?.bio_paragraph_3 && <p>{profile.bio_paragraph_3}</p>}

              {!profile?.bio_paragraph_1 && !profile?.bio_paragraph_2 && !profile?.bio_paragraph_3 && (
                <>
                  <p>
                    I am an AI researcher focusing on Natural Language Processing for
                    low-resource and code-mixed linguistics—specifically Roman Urdu–English datasets.
                  </p>
                  <p>
                    On the applied machine learning side, I design multi-layered time-series forecasting
                    networks using hybrid CNN, LSTM, and GRU architectures.
                  </p>
                  <p>
                    Beyond mathematical modeling, I engineer highly technical data automation suites
                    that bridge raw data processing with visual analytical systems.
                  </p>
                </>
              )}
            </div>

            <div className="flex flex-wrap gap-4">
              <a
                href={cvUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-accent"
              >
                <FiDownload /> Download CV
              </a>

              <Link to="/contact" className="btn-outline">
                <FiMail /> Contact Me
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      <section
        className="section-padding relative"
        style={{
          backgroundImage: 'url(https://images.unsplash.com/photo-1518770660439-4636190af475?w=1600&q=80)',
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
              Technical <span className="text-accent">Skills</span>
            </h2>
            <p className="mx-auto max-w-2xl text-lg text-gray-400">
              Tools and technologies I use across research and development
            </p>
          </motion.div>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {dbSkills.map((group, i) => (
              <motion.div
                key={group.category}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="glass-dark rounded-2xl p-6"
              >
                <h3 className="mb-4 text-sm font-bold uppercase tracking-widest text-accent">
                  {group.category}
                </h3>
                <div className="flex flex-wrap gap-2">
                  {group.items.map((item) => (
                    <span
                      key={item}
                      className="cursor-default rounded-full border border-white/20 bg-white/10 px-3 py-1 text-xs text-white transition-all hover:border-accent hover:bg-accent"
                    >
                      {item}
                    </span>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="section-padding bg-gray-50 dark:bg-gray-900">
        <div className="mx-auto max-w-4xl">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-12 text-center"
          >
            <h2 className="section-title">
              My <span className="text-accent">Journey</span>
            </h2>
            <p className="section-subtitle mx-auto">
              Research and development milestones
            </p>
          </motion.div>

          <div className="relative">
            <div className="absolute bottom-0 left-6 top-0 w-px -translate-x-1/2 bg-gray-200 dark:bg-gray-700 md:left-1/2" />

            <div className="space-y-10">
              {timelineItems.map((item, i) => {
                const Icon = timelineIcons[i % timelineIcons.length]

                return (
                  <motion.div
                    key={item.id || i}
                    initial={{ opacity: 0, x: i % 2 === 0 ? -40 : 40 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, delay: i * 0.1 }}
                    className={`relative flex gap-6 md:gap-0 ${
                      i % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'
                    }`}
                  >
                    <div
                      className={`ml-12 flex-1 md:ml-0 ${
                        i % 2 === 0 ? 'md:pr-12 md:text-right' : 'md:pl-12'
                      }`}
                    >
                      <div className="rounded-2xl border border-gray-200 bg-white p-6 transition-all duration-300 hover:border-accent hover:shadow-lg dark:border-gray-700 dark:bg-gray-800">
                        <span className="font-mono text-xs uppercase tracking-widest text-accent">
                          {item.year}
                        </span>
                        <h3 className="mb-1 mt-1 text-lg font-bold text-gray-900 dark:text-white">
                          {item.title}
                        </h3>
                        <p className="mb-3 text-sm font-medium text-gray-500 dark:text-gray-400">
                          {item.place}
                        </p>
                        <p className="text-sm leading-relaxed text-gray-600 dark:text-gray-300">
                          {item.desc}
                        </p>
                      </div>
                    </div>

                    <div className="absolute left-0 top-6 z-10 flex h-12 w-12 -translate-x-1/2 items-center justify-center rounded-full border-4 border-white bg-accent text-white shadow-lg dark:border-gray-900 md:left-1/2">
                      <Icon size={16} />
                    </div>

                    <div className="hidden flex-1 md:block" />
                  </motion.div>
                )
              })}
            </div>
          </div>
        </div>
      </section>

      {dbTestimonials.length > 0 && (
        <section className="overflow-hidden border-t border-gray-800 bg-gray-950 px-4 py-16 md:px-8 lg:px-16">
          <div className="mx-auto max-w-6xl space-y-20">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center"
            >
              <h2 className="mb-2 text-3xl font-bold text-white md:text-4xl">
                Colleague <span className="text-accent">Recommendations</span>
              </h2>
              <p className="mx-auto text-gray-400">
                Feedback from professors and research collaborators
              </p>
            </motion.div>

            <div>
              <TestimonialCarousel items={dbTestimonials} />
            </div>

            <div className="border-t border-gray-800 pt-10">
              <TestimonialFlipGrid items={dbTestimonials} />
            </div>

            <div className="border-t border-gray-800 pt-10">
              <TestimonialFluidGrid items={dbTestimonials} />
            </div>
          </div>
        </section>
      )}

      <section className="border-t border-gray-200 bg-gray-50 py-20 dark:border-gray-800 dark:bg-gray-900">
        <div className="mx-auto max-w-6xl">
          <SkillChart />
        </div>
      </section>
    </div>
  )
}