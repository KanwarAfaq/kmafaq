import { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { useTheme } from '../context/ThemeContext'
import { useSearch } from '../context/SearchContext'
import {
  FiSun, FiMoon, FiMenu, FiX, FiSearch
} from 'react-icons/fi'

const navLinks = [
  { label: 'Home',       path: '/' },
  { label: 'About',      path: '/about' },
  { label: 'Projects',   path: '/projects' },
  { label: 'Publications',   path: '/publications' },
{ label: 'Certifications', path: '/certifications' },
{ label: 'Gallery', path: '/p-gallery' },
  //{ label: 'Gallery',    path: '/gallery' },
  { label: 'Blog',       path: '/blog' },
  { label: 'Contact',    path: '/contact' },
  { label: '✦ All-in-One', path: '/all-in-one' },
  { label: 'Scholarships', path: '/scholarships' }
]

const themes = [
  { id: 'theme1', color: '#6366f1', label: 'Indigo' },
  { id: 'theme2', color: '#10b981', label: 'Emerald' },
  { id: 'theme3', color: '#f59e0b', label: 'Amber' },
]

export default function Navbar() {
  const { pathname } = useLocation()
  const { dark, toggleDark, colorTheme, setColorTheme } = useTheme()
  const { setOpen } = useSearch()
  const [menuOpen, setMenuOpen] = useState(false)

  return (
    <header className="sticky top-0 z-50 backdrop-blur-xl bg-white/80 dark:bg-gray-950/80 border-b border-gray-200 dark:border-gray-800 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 md:px-8 h-16 flex items-center justify-between">

        {/* Logo */}
        <Link to="/" className="flex items-center gap-2 group">
          <div className="w-9 h-9 rounded-xl bg-accent flex items-center justify-center text-white font-black text-sm group-hover:scale-110 transition-transform">
            KA
          </div>
          <span className="font-bold text-lg text-gray-900 dark:text-white hidden sm:block">
            K.M.<span className="text-accent">AFAQ</span>
          </span>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden lg:flex items-center gap-1">
          {navLinks.map(link => (
            <Link
              key={link.path}
              to={link.path}
              className={`px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200
                ${pathname === link.path
                  ? 'bg-accent text-white'
                  : 'text-gray-600 dark:text-gray-300 hover:text-accent hover:bg-gray-100 dark:hover:bg-gray-800'
                }`}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* Right Controls */}
        <div className="flex items-center gap-2">

          {/* Search Button */}
          <button
            onClick={() => setOpen(true)}
            className="p-2 rounded-lg text-gray-500 dark:text-gray-400 hover:text-accent hover:bg-gray-100 dark:hover:bg-gray-800 transition-all"
            title="Search"
          >
            <FiSearch size={18} />
          </button>

          {/* Theme Color Dots */}
          <div className="hidden sm:flex items-center gap-1.5 px-2">
            {themes.map(t => (
              <button
                key={t.id}
                onClick={() => setColorTheme(t.id)}
                title={t.label}
                className={`w-4 h-4 rounded-full transition-all duration-200 hover:scale-125
                  ${colorTheme === t.id ? 'ring-2 ring-offset-2 ring-offset-white dark:ring-offset-gray-950 scale-125' : ''}`}
                style={{ backgroundColor: t.color, ringColor: t.color }}
              />
            ))}
          </div>

          {/* Dark Mode Toggle */}
          <button
            onClick={toggleDark}
            className="p-2 rounded-lg text-gray-500 dark:text-gray-400 hover:text-accent hover:bg-gray-100 dark:hover:bg-gray-800 transition-all"
            title="Toggle dark mode"
          >
            {dark ? <FiSun size={18} /> : <FiMoon size={18} />}
          </button>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMenuOpen(m => !m)}
            className="lg:hidden p-2 rounded-lg text-gray-500 dark:text-gray-400 hover:text-accent hover:bg-gray-100 dark:hover:bg-gray-800 transition-all"
          >
            {menuOpen ? <FiX size={20} /> : <FiMenu size={20} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="lg:hidden border-t border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-950"
          >
            <div className="px-4 py-4 flex flex-col gap-1">
              {navLinks.map(link => (
                <Link
                  key={link.path}
                  to={link.path}
                  onClick={() => setMenuOpen(false)}
                  className={`px-4 py-2.5 rounded-lg text-sm font-medium transition-all
                    ${pathname === link.path
                      ? 'bg-accent text-white'
                      : 'text-gray-600 dark:text-gray-300 hover:text-accent hover:bg-gray-100 dark:hover:bg-gray-800'
                    }`}
                >
                  {link.label}
                </Link>
              ))}
              {/* Mobile Theme Switcher */}
              <div className="flex items-center gap-3 px-4 pt-3 border-t border-gray-200 dark:border-gray-800 mt-2">
                <span className="text-xs text-gray-500 dark:text-gray-400">Theme:</span>
                {themes.map(t => (
                  <button
                    key={t.id}
                    onClick={() => setColorTheme(t.id)}
                    title={t.label}
                    className={`w-5 h-5 rounded-full transition-all hover:scale-125
                      ${colorTheme === t.id ? 'ring-2 ring-offset-2 ring-offset-white dark:ring-offset-gray-950 scale-125' : ''}`}
                    style={{ backgroundColor: t.color }}
                  />
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  )
}