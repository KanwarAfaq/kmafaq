import { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { useTheme } from '../context/ThemeContext'
import { useSearch } from '../context/SearchContext'
import { PUBLIC_NAV_ITEMS } from '../config/navigation'
import { FiSun, FiMoon, FiMenu, FiX, FiSearch } from 'react-icons/fi'

const HEADER_NAV_PATHS = ['/', '/about', '/projects', '/publications', '/blog', '/all-in-one']

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
    <header className="sticky top-0 z-50 border-b border-gray-200 bg-white/85 backdrop-blur-xl transition-colors duration-300 dark:border-gray-800 dark:bg-gray-950/85">
      <div className="mx-auto flex h-16 max-w-[1600px] items-center justify-between gap-3 px-4 md:px-6">
        <Link to="/" className="group flex shrink-0 items-center gap-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-accent text-sm font-black text-white transition-transform group-hover:scale-105">KA</div>
          <span className="hidden text-lg font-bold text-gray-900 sm:block dark:text-white">K.M.<span className="text-accent">AFAQ</span></span>
        </Link>

        <button type="button" onClick={() => setOpen(true)}
          className="hidden min-w-0 flex-1 items-center gap-3 rounded-2xl border border-gray-200 bg-gray-50 px-4 py-2.5 text-left text-sm text-gray-500 transition-all hover:border-accent hover:bg-white hover:text-gray-700 md:flex md:max-w-xl dark:border-gray-800 dark:bg-gray-900 dark:text-gray-400 dark:hover:bg-gray-900 dark:hover:text-gray-200"
          aria-label="Search the complete website">
          <FiSearch size={17} className="shrink-0" />
          <span className="truncate">Search the complete website…</span>
          <kbd className="ml-auto hidden rounded-md border border-gray-200 bg-white px-2 py-0.5 text-[10px] text-gray-400 lg:inline dark:border-gray-700 dark:bg-gray-950">Ctrl K</kbd>
        </button>

        <nav className="hidden items-center gap-1 2xl:flex" aria-label="Primary navigation">
          {PUBLIC_NAV_ITEMS.filter((link) => HEADER_NAV_PATHS.includes(link.path)).map((link) => (
            <Link key={link.path} to={link.path} aria-current={pathname === link.path ? 'page' : undefined}
              className={`rounded-lg px-2.5 py-2 text-sm font-medium transition-all ${pathname === link.path
                ? 'bg-accent text-white'
                : 'text-gray-600 hover:bg-gray-100 hover:text-accent dark:text-gray-300 dark:hover:bg-gray-800'}`}>
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="flex shrink-0 items-center gap-1.5">
          <button type="button" aria-label="Open site search" onClick={() => setOpen(true)}
            className="rounded-lg p-2 text-gray-500 transition-all hover:bg-gray-100 hover:text-accent md:hidden dark:text-gray-400 dark:hover:bg-gray-800">
            <FiSearch size={18} />
          </button>

          <div className="hidden items-center gap-1.5 px-1 sm:flex">
            {themes.map((theme) => (
              <button key={theme.id} type="button" onClick={() => setColorTheme(theme.id)}
                aria-label={`Use ${theme.label} color theme`} aria-pressed={colorTheme === theme.id}
                className={`h-4 w-4 rounded-full transition-all hover:scale-125 ${colorTheme === theme.id
                  ? 'scale-125 ring-2 ring-offset-2 ring-offset-white dark:ring-offset-gray-950' : ''}`}
                style={{ backgroundColor: theme.color }} />
            ))}
          </div>

          <button type="button" aria-label={dark ? 'Switch to light mode' : 'Switch to dark mode'} onClick={toggleDark}
            className="rounded-lg p-2 text-gray-500 transition-all hover:bg-gray-100 hover:text-accent dark:text-gray-400 dark:hover:bg-gray-800">
            {dark ? <FiSun size={18} /> : <FiMoon size={18} />}
          </button>

          <button type="button" aria-label={menuOpen ? 'Close navigation menu' : 'Open navigation menu'}
            aria-expanded={menuOpen} onClick={() => setMenuOpen((value) => !value)}
            className="rounded-lg p-2 text-gray-500 transition-all hover:bg-gray-100 hover:text-accent xl:hidden dark:text-gray-400 dark:hover:bg-gray-800">
            {menuOpen ? <FiX size={20} /> : <FiMenu size={20} />}
          </button>
        </div>
      </div>

      <AnimatePresence>
        {menuOpen && (
          <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }}
            className="border-t border-gray-200 bg-white xl:hidden dark:border-gray-800 dark:bg-gray-950">
            <nav className="grid grid-cols-1 gap-1 px-4 py-4 sm:grid-cols-2" aria-label="Mobile navigation">
              {PUBLIC_NAV_ITEMS.map((link) => (
                <Link key={link.path} to={link.path} onClick={() => setMenuOpen(false)}
                  aria-current={pathname === link.path ? 'page' : undefined}
                  className={`rounded-xl px-4 py-2.5 text-sm font-medium transition-all ${pathname === link.path
                    ? 'bg-accent text-white'
                    : 'text-gray-600 hover:bg-gray-100 hover:text-accent dark:text-gray-300 dark:hover:bg-gray-800'}`}>
                  {link.label}
                </Link>
              ))}
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  )
}
