import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

import {
  FiExternalLink,
  FiAward,
  FiCalendar,
  FiHash,
  FiCheckCircle,
  FiFileText,
} from 'react-icons/fi'
import { supabase } from '../lib/supabase'

export default function Certifications() {
  const [active, setActive] = useState('All')
  const [dbCerts, setDbCerts] = useState([])

  useEffect(() => {
    const fetchCertifications = async () => {
      const { data, error } = await supabase
        .from('certifications')
        .select('*')
        .order('id', { ascending: true })
      if (error) {
        console.error('Error pulling database credentials:', error)
      } else if (data) {
        setDbCerts(data)
      }
    }

    fetchCertifications()
  }, [])

  // Helper utility function to parse any mixed data structure safely into a string array
  const getCleanSkillsArray = (skillsData) => {
    if (Array.isArray(skillsData)) return skillsData;
    if (typeof skillsData === 'string') {
      return skillsData.split(',').map(s => s.trim()).filter(Boolean);
    }
    return [];
  }

  const dynamicCategories = ['All', ...new Set(dbCerts.map((c) => c.category))].filter(Boolean)

  const filtered =
    active === 'All' ? dbCerts : dbCerts.filter((c) => c.category === active)

  const totalSkills = [...new Set(dbCerts.flatMap((c) => getCleanSkillsArray(c.skills)))].length
  const issuers = [...new Set(dbCerts.map((c) => c.issuer?.split('/')[0].trim()))].length

  return (
    <div id="aio-certs" className="scroll-mt-12">
      <section
        className="relative flex h-64 items-center justify-center md:h-80"
        style={{
          backgroundImage:
            'url(https://images.unsplash.com/photo-1523289333742-be1143f6b766?w=1600&q=80)',
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
            Credentials & Learning
          </p>
          <h1 className="text-4xl font-black text-white md:text-6xl">
            My <span className="text-accent">Certifications</span>
          </h1>
        </motion.div>
      </section>

      <section className="border-b border-gray-100 bg-white px-4 py-10 dark:border-gray-800 dark:bg-gray-950 md:px-8 lg:px-16">
        <div className="mx-auto grid max-w-6xl grid-cols-2 gap-4 md:grid-cols-4">
          {[
            { label: 'Total Certificates', value: dbCerts.length, icon: '🎓' },
            { label: 'Trusted Issuers', value: issuers, icon: '🏛️' },
            {
              label: 'Categories',
              value: Math.max(0, dynamicCategories.length - 1),
              icon: '📚',
            },
            { label: 'Skills Covered', value: totalSkills, icon: '⚡' },
          ].map((stat, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="group rounded-2xl border border-gray-200 bg-gray-50 p-5 text-center transition-all duration-300 hover:border-accent dark:border-gray-700 dark:bg-gray-800"
            >
              <div className="mb-2 text-2xl">{stat.icon}</div>
              <div className="mb-1 text-3xl font-black text-accent">{stat.value}</div>
              <div className="text-xs font-medium text-gray-500 dark:text-gray-400">
                {stat.label}
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      <section className="border-b border-gray-100 bg-white px-4 py-8 dark:border-gray-800 dark:bg-gray-950 md:px-8 lg:px-16">
        <div className="mx-auto flex max-w-6xl flex-wrap justify-center gap-2">
          {dynamicCategories.map((cat) => {
            const count =
              cat === 'All'
                ? dbCerts.length
                : dbCerts.filter((c) => c.category === cat).length

            return (
              <button
                key={cat}
                onClick={() => setActive(cat)}
                className={`rounded-xl px-4 py-2 text-sm font-medium transition-all duration-200 ${
                  active === cat
                    ? 'scale-105 bg-accent text-white shadow-lg'
                    : 'bg-gray-100 text-gray-600 hover:text-accent dark:bg-gray-800 dark:text-gray-300'
                }`}
              >
                {cat}
                <span
                  className={`ml-2 rounded-full px-1.5 py-0.5 text-xs ${
                    active === cat
                      ? 'bg-white/20 text-white'
                      : 'bg-gray-200 text-gray-500 dark:bg-gray-700 dark:text-gray-400'
                  }`}
                >
                  {count}
                </span>
              </button>
            )
          })}
        </div>
      </section>

      <section className="section-padding bg-gray-50 dark:bg-gray-900">
        <div className="mx-auto max-w-6xl">
          <p className="mb-6 text-center text-sm text-gray-400 dark:text-gray-500">
            Showing <strong className="text-accent">{filtered.length}</strong> of{' '}
            {dbCerts.length} certifications
          </p>

          <motion.div layout className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            <AnimatePresence>
              {filtered.map((cert, i) => {
                const currentSkills = getCleanSkillsArray(cert.skills);
                
                return (
                  <motion.div
                    key={cert.id || i}
                    layout
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    transition={{ duration: 0.3, delay: i * 0.06 }}
                    className="group flex flex-col overflow-hidden rounded-2xl border border-gray-200 bg-white transition-all duration-300 hover:border-accent hover:shadow-xl dark:border-gray-700 dark:bg-gray-800"
                  >
                    <div
                      className="h-1.5 w-full transition-all duration-300 group-hover:h-2"
                      style={{ backgroundColor: cert.color }}
                    />

                    <div className="flex flex-1 flex-col p-6">
                      <div className="mb-5 flex items-start justify-between">
                        <div
                          className="flex h-12 w-12 items-center justify-center rounded-2xl text-white shadow-lg transition-transform duration-300 group-hover:scale-110"
                          style={{ backgroundColor: cert.color }}
                        >
                          <FiAward size={22} />
                        </div>
                        <span
                          className="rounded-full px-3 py-1 text-xs font-semibold"
                          style={{
                            backgroundColor: cert.color + '20',
                            color: cert.color,
                          }}
                        >
                          {cert.category}
                        </span>
                      </div>

                      <h3 className="mb-1 flex-1 text-base font-bold leading-snug text-gray-900 transition-colors group-hover:text-accent dark:text-white md:text-lg">
                        {cert.title}
                      </h3>

                      <p
                        className="mb-4 text-sm font-semibold"
                        style={{ color: cert.color }}
                      >
                        {cert.issuer}
                      </p>

                      <div className="mb-5 space-y-2">
                        <div className="flex items-center gap-2 text-xs text-gray-400 dark:text-gray-500">
                          <FiCalendar size={12} className="flex-shrink-0" />
                          <span>
                            Issued:{' '}
                            <strong className="text-gray-600 dark:text-gray-300">
                              {cert.date}
                            </strong>
                          </span>
                        </div>
                        <div className="flex items-center gap-2 text-xs text-gray-400 dark:text-gray-500">
                          <FiHash size={12} className="flex-shrink-0" />
                          <span className="truncate font-mono">{cert.credential_id}</span>
                        </div>
                      </div>

                      {/* ── CARD SKILL INJECTION CRASH REPAIR ── */}
                      <div className="mb-6 flex flex-wrap gap-1.5">
                        {currentSkills.map((s) => (
                          <span
                            key={s}
                            className="rounded-full border px-2.5 py-1 text-xs font-medium transition-all"
                            style={{
                              backgroundColor: cert.color + '12',
                              color: cert.color,
                              borderColor: cert.color + '35',
                            }}
                          >
                            {s}
                          </span>
                        ))}
                      </div>

                      <div className="mt-auto flex flex-col gap-3">
                        {cert.verify_url && (
                          <a
                            href={cert.verify_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex w-full items-center justify-center gap-2 rounded-xl border-2 py-2.5 text-sm font-semibold transition-all duration-200"
                            style={{
                              borderColor: cert.color,
                              color: cert.color,
                            }}
                            onMouseEnter={(e) => {
                              e.currentTarget.style.backgroundColor = cert.color
                              e.currentTarget.style.color = 'white'
                            }}
                            onMouseLeave={(e) => {
                              e.currentTarget.style.backgroundColor = 'transparent'
                              e.currentTarget.style.color = cert.color
                            }}
                          >
                            <FiCheckCircle size={15} />
                            Verify Certificate
                            <FiExternalLink size={13} className="opacity-70" />
                          </a>
                        )}

                        {cert.pdf_url && (
                          <a
                            href={cert.pdf_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex w-full items-center justify-center gap-2 rounded-xl bg-gray-900 py-2.5 text-sm font-semibold text-white transition-all duration-200 hover:opacity-90 dark:bg-white dark:text-gray-900"
                          >
                            <FiFileText size={15} />
                            View PDF
                            <FiExternalLink size={13} className="opacity-70" />
                          </a>
                        )}
                      </div>
                    </div>
                  </motion.div>
                )
              })}
            </AnimatePresence>
          </motion.div>
        </div>
      </section>

      <section className="section-padding bg-white dark:bg-gray-950">
        <div className="mx-auto max-w-3xl">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-12 text-center"
          >
            <h2 className="section-title">
              Learning <span className="text-accent">Timeline</span>
            </h2>
            <p className="section-subtitle mx-auto">
              Chronological view of all certifications earned
            </p>
          </motion.div>

          <div className="relative">
            <div className="absolute bottom-0 left-6 top-0 w-0.5 bg-gray-200 dark:bg-gray-700" />

            <div className="space-y-5">
              {[...filtered]
                .sort((a, b) => new Date('01 ' + b.date) - new Date('01 ' + a.date))
                .map((cert, i) => {
                  const timelineSkills = getCleanSkillsArray(cert.skills);

                  return (
                    <motion.div
                      key={cert.id || i}
                      initial={{ opacity: 0, x: -30 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: i * 0.08, duration: 0.5 }}
                      className="relative flex gap-6"
                    >
                      <div
                        className="absolute left-0 top-5 z-10 h-4 w-4 flex-shrink-0 -translate-x-[7px] rounded-full border-2 border-white shadow-md transition-transform duration-300 hover:scale-125 dark:border-gray-950"
                        style={{ backgroundColor: cert.color }}
                      />

                      <div className="group ml-10 flex-1">
                        <div className="rounded-2xl border border-gray-200 bg-white p-5 transition-all duration-300 hover:border-accent hover:shadow-lg dark:border-gray-700 dark:bg-gray-800">
                          <div className="flex flex-wrap items-start justify-between gap-3">
                            <div className="min-w-0 flex-1">
                              <span
                                className="mb-2 inline-block rounded-full px-2.5 py-1 text-xs font-semibold"
                                style={{
                                  backgroundColor: cert.color + '20',
                                  color: cert.color,
                                }}
                              >
                                {cert.category}
                              </span>

                              <h4 className="text-sm font-bold leading-snug text-gray-900 transition-colors group-hover:text-accent dark:text-white md:text-base">
                                {cert.title}
                              </h4>

                              <p
                                className="mt-1 text-xs font-semibold"
                                style={{ color: cert.color }}
                              >
                                {cert.issuer}
                              </p>

                              {cert.pdf_url && (
                                <a
                                  href={cert.pdf_url}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="mt-3 inline-flex items-center gap-2 text-xs font-semibold text-accent hover:underline"
                                >
                                  <FiFileText size={13} />
                                  Open PDF
                                  <FiExternalLink size={12} />
                                </a>
                              )}
                            </div>

                            <div className="flex flex-shrink-0 items-center gap-1.5 whitespace-nowrap rounded-xl bg-gray-50 px-3 py-1.5 text-xs text-gray-400 dark:bg-gray-700">
                              <FiCalendar size={11} />
                              {cert.date}
                            </div>
                          </div>

                          {/* ── TIMELINE SKILL DECK REPAIR ── */}
                          <div className="mt-3 flex flex-wrap gap-1.5">
                            {timelineSkills.slice(0, 3).map((s) => (
                              <span
                                key={s}
                                className="rounded-full border px-2.5 py-1 text-xs font-medium"
                                style={{
                                  backgroundColor: cert.color + '12',
                                  color: cert.color,
                                  borderColor: cert.color + '35',
                                }}
                              >
                                {s}
                              </span>
                            ))}
                            {timelineSkills.length > 3 && (
                              <span
                                className="rounded-full border px-2.5 py-1 text-xs font-medium"
                                style={{
                                  backgroundColor: cert.color + '12',
                                  color: cert.color,
                                  borderColor: cert.color + '35',
                                }}
                              >
                                +{timelineSkills.length - 3} more
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  )
                })}
            </div>
          </div>
        </div>
      </section>

      <section
        className="section-padding relative"
        style={{
          backgroundImage:
            'url(https://images.unsplash.com/photo-1518770660439-4636190af475?w=1600&q=80)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" />
        <div className="relative z-10 mx-auto max-w-5xl">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-12 text-center"
          >
            <h2 className="mb-3 text-3xl font-bold text-white md:text-4xl">
              Skills <span className="text-accent">Covered</span>
            </h2>
            <p className="mx-auto max-w-xl text-gray-400">
              All skills and technologies covered across every certification
            </p>
          </motion.div>

          {/* ── FOOTER SKILLS GRID REPAIR ── */}
          <div className="flex flex-wrap justify-center gap-3">
            {[...new Set(dbCerts.flatMap((c) => getCleanSkillsArray(c.skills)))].map((skill, i) => {
              const cert =
                dbCerts.find((c) => getCleanSkillsArray(c.skills).includes(skill)) || { color: '#8B5CF6' }

              return (
                <motion.span
                  key={skill}
                  initial={{ opacity: 0, scale: 0.8 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.03 }}
                  className="cursor-default rounded-full border px-4 py-2 text-sm font-medium transition-all duration-200 hover:scale-110"
                  style={{
                    backgroundColor: cert.color + '20',
                    color: cert.color,
                    borderColor: cert.color + '40',
                  }}
                >
                  {skill}
                </motion.span>
              )
            })}
          </div>
        </div>
      </section>

      <section className="section-padding bg-white dark:bg-gray-950">
        <div className="mx-auto max-w-2xl">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="rounded-3xl border border-gray-200 bg-white p-8 text-center transition-all duration-300 hover:border-accent hover:shadow-xl dark:border-gray-700 dark:bg-gray-800 md:p-12"
          >
            <div className="mb-6 flex justify-center gap-3">
              {dbCerts.slice(0, 4).map((cert, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, scale: 0 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  className="flex h-12 w-12 items-center justify-center rounded-2xl text-white shadow-lg"
                  style={{ backgroundColor: cert.color }}
                >
                  <FiAward size={20} />
                </motion.div>
              ))}
            </div>

            <h3 className="mb-3 text-2xl font-bold text-gray-900 dark:text-white md:text-3xl">
              Verify on <span className="text-accent">LinkedIn</span>
            </h3>
            <p className="mb-6 text-sm leading-relaxed text-gray-500 dark:text-gray-400 md:text-base">
              All certifications are verified and listed on my LinkedIn profile
              with official credential IDs and issuer verification links.
            </p>

            <div className="flex flex-wrap justify-center gap-4">
              <a
                href="https://linkedin.com/in/kanwarafaq"
                target="_blank"
                rel="noopener noreferrer"
                className="btn-accent"
              >
                <FiExternalLink size={16} />
                View LinkedIn Profile
              </a>
              <a
                href="https://github.com/KanwarAfaq"
                target="_blank"
                rel="noopener noreferrer"
                className="btn-outline"
              >
                <FiExternalLink size={16} />
                View GitHub Profile
              </a>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  )
}