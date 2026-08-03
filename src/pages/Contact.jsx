import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import {
  FiMail, FiMapPin, FiGithub, FiLinkedin,
  FiSend, FiExternalLink, FiCopy, FiCheckCircle
} from 'react-icons/fi'
import { SiGooglescholar, SiKaggle } from 'react-icons/si'
import { supabase } from '../lib/supabase'
import toast from 'react-hot-toast'

export default function Contact() {
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' })
  const [status, setStatus] = useState('idle') // idle | loading
  const [copied, setCopied] = useState(false)
  const [dbSocials, setDbSocials] = useState([])

  // Stream active links directly from your Supabase cloud table on mount
  useEffect(() => {
    const fetchContactSocials = async () => {
      const { data } = await supabase
        .from('social_links')
        .select('*')
        .eq('is_active', true);
      if (data) setDbSocials(data);
    };
    fetchContactSocials();
  }, []);

  const handleChange = e =>
    setForm(f => ({ ...f, [e.target.name]: e.target.value }))

  /* ── Submit Logic with Dual Sync ── */
  const handleSubmit = async (e) => {
    e.preventDefault()
    setStatus('loading')
    const toastId = toast.loading('Sending message...')

    try {
      // Parallel secure archive logging into Supabase table
      await supabase.from('messages').insert([form]);

      // Submit via Formspree endpoint handler
      const res = await fetch('https://formspree.io/f/mbdegovd', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify(form),
      })
      
      if (res.ok) {
        setStatus('idle')
        setForm({ name: '', email: '', subject: '', message: '' })
        toast.success('Message sent successfully!', { id: toastId })
      } else {
        setStatus('idle')
        toast.error('Failed to send message. Please try again.', { id: toastId })
      }
    } catch {
      setStatus('idle')
      toast.error('Network error. Check your connection.', { id: toastId })
    }
  }

  /* ── Copy Email Logic ── */
  const copyEmail = () => {
    navigator.clipboard.writeText('kmafaq786@email.com') 
    setCopied(true)
    toast.success('Email copied to clipboard!')
    setTimeout(() => setCopied(false), 2000)
  }

  // Initial local fallbacks to display instantly while Supabase resolves
  const defaultSocials = [
    { platform_name: 'GitHub', profile_url: 'https://github.com/KanwarAfaq' },
    { platform_name: 'LinkedIn', profile_url: 'https://linkedin.com/in/kanwarafaq' },
    { platform_name: 'Google Scholar', profile_url: 'https://scholar.google.com' },
    { platform_name: 'Kaggle', profile_url: 'https://www.kaggle.com' }
  ];

  const activeSocials = dbSocials.length > 0 ? dbSocials : defaultSocials;

  return (
    <div>
      {/* ── Banner ── */}
      <section
        className="relative h-64 md:h-80 flex items-center justify-center"
        style={{
          backgroundImage: 'url(https://images.unsplash.com/photo-1516387938699-a93567ec168e?w=1600&q=80)',
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
            Get In Touch
          </p>
          <h1 className="text-4xl md:text-6xl font-black text-white">
            Contact <span className="text-accent">Me</span>
          </h1>
        </motion.div>
      </section>

      {/* ── Main Content ── */}
      <section className="section-padding bg-white dark:bg-gray-950">
        <div className="max-w-6xl mx-auto grid lg:grid-cols-2 gap-12">

          {/* ── Left: Info ── */}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Let's <span className="text-accent">Connect</span>
            </h2>
            <p className="text-gray-500 dark:text-gray-400 leading-relaxed mb-8 text-lg">
              I'm open to research collaborations, academic discussions,
              consulting on NLP or deep learning projects, and exciting
              opportunities in AI. Feel free to reach out — I usually
              respond within 24–48 hours.
            </p>

            {/* Location */}
            <div className="flex items-center gap-3 mb-8 p-4 bg-gray-50 dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700">
              <div className="p-3 bg-accent/10 rounded-xl text-accent">
                <FiMapPin size={20} />
              </div>
              <div>
                <p className="text-xs text-gray-400 uppercase tracking-widest font-medium">Location</p>
                <p className="font-semibold text-gray-900 dark:text-white">
                  Taoyuan, Taiwan 🇹🇼
                </p>
              </div>
            </div>

            {/* Copy Email Button */}
            <button
              onClick={copyEmail}
              className="flex items-center gap-4 w-full p-4 mb-3 bg-gray-50 dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 hover:border-accent transition-all duration-300 group hover:shadow-md"
            >
              <div className="p-2.5 bg-white dark:bg-gray-700 rounded-xl text-gray-500 dark:text-gray-400 group-hover:text-accent transition-colors shadow-sm">
                {copied ? <FiCheckCircle size={20} className="text-green-500" /> : <FiMail size={20} />}
              </div>
              <div className="flex-1 text-left min-w-0">
                <p className="text-xs text-gray-400 uppercase tracking-widest font-medium">Direct Email</p>
                <p className="font-semibold text-gray-900 dark:text-white text-sm truncate">
                  kmafaq786@email.com
                </p>
              </div>
              <div className="text-gray-400 group-hover:text-accent transition-colors">
                 {copied ? <span className="text-xs font-bold text-green-500">Copied!</span> : <FiCopy size={16} />}
              </div>
            </button>

            {/* Dynamic Social Links List Layout */}
            <div className="space-y-3">
              {activeSocials.map((s, i) => {
                const key = s.platform_name.toLowerCase().trim();
                
                let currentIcon = <FiExternalLink size={20} />;
                if (key.includes('github')) currentIcon = <FiGithub size={20} />;
                if (key.includes('linkedin')) currentIcon = <FiLinkedin size={20} />;
                if (key.includes('scholar')) currentIcon = <SiGooglescholar size={20} />;
                if (key.includes('kaggle')) currentIcon = <SiKaggle size={20} />;
                if (key.includes('email') || key.includes('mail')) currentIcon = <FiMail size={20} />;

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
                    className="flex items-center gap-4 p-4 rounded-2xl bg-gray-50 dark:bg-gray-800 
                      border border-gray-200 dark:border-gray-700 hover:border-accent 
                      transition-all duration-300 group hover:shadow-md hover:text-accent"
                  >
                    <div className="p-2.5 bg-white dark:bg-gray-700 rounded-xl text-gray-500 dark:text-gray-400 group-hover:text-accent transition-colors shadow-sm">
                      {currentIcon}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs text-gray-400 uppercase tracking-widest font-medium">
                        {s.platform_name}
                      </p>
                      <p className="font-semibold text-gray-900 dark:text-white text-sm truncate">
                        {s.profile_url.replace(/^https?:\/\/(www\.)?/, '')}
                      </p>
                    </div>
                    <FiExternalLink
                      size={14}
                      className="text-gray-300 dark:text-gray-600 group-hover:text-accent transition-colors flex-shrink-0"
                    />
                  </motion.a>
                );
              })}
            </div>
          </motion.div>

          {/* ── Right: Form ── */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <div className="bg-gray-50 dark:bg-gray-800 rounded-3xl p-6 md:p-8 border border-gray-200 dark:border-gray-700">
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-6">
                Send a Message
              </h3>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                      Full Name <span className="text-red-400">*</span>
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={form.name}
                      onChange={handleChange}
                      required
                      placeholder="Your name"
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-400 outline-none focus:border-accent transition-all text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                      Email <span className="text-red-400">*</span>
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={form.email}
                      onChange={handleChange}
                      required
                      placeholder="your@email.com"
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-400 outline-none focus:border-accent transition-all text-sm"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                    Subject <span className="text-red-400">*</span>
                  </label>
                  <input
                    type="text"
                    name="subject"
                    value={form.subject}
                    onChange={handleChange}
                    required
                    placeholder="Research collaboration, project inquiry..."
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-400 outline-none focus:border-accent transition-all text-sm"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                    Message <span className="text-red-400">*</span>
                  </label>
                  <textarea
                    name="message"
                    value={form.message}
                    onChange={handleChange}
                    required
                    rows={5}
                    placeholder="Tell me about your project, research idea, or question..."
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-400 outline-none focus:border-accent transition-all text-sm resize-none"
                  />
                </div>

                <button
                  type="submit"
                  disabled={status === 'loading'}
                  className="btn-accent flex items-center justify-center gap-2 w-full disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  {status === 'loading' ? (
                    <>
                      <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                      </svg>
                      Sending...
                    </>
                  ) : (
                    <><FiSend size={16} /> Send Message</>
                  )}
                </button>

                <p className="text-xs text-gray-400 text-center">
                  Your message is logged and handled securely via Formspree.
                </p>
              </form>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  )
}