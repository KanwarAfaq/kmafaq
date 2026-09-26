import { NavLink } from 'react-router-dom'
import {
  FiBookOpen, FiBriefcase, FiFileText, FiGrid, FiHome, FiImage,
  FiMail, FiSearch, FiUser, FiAward,
} from 'react-icons/fi'
import { PUBLIC_NAV_SECTIONS } from '../config/navigation'
import { useSearch } from '../context/SearchContext'

const iconByPath = {
  '/': FiHome,
  '/about': FiUser,
  '/projects': FiGrid,
  '/publications': FiFileText,
  '/certifications': FiAward,
  '/gallery': FiImage,
  '/blog': FiBookOpen,
  '/scholarships': FiBriefcase,
  '/contact': FiMail,
}

function itemClasses(isActive) {
  return [
    'group flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all',
    isActive
      ? 'bg-accent text-white shadow-sm'
      : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900 dark:text-gray-300 dark:hover:bg-gray-800 dark:hover:text-white',
  ].join(' ')
}

export default function PublicSidebar() {
  const { setOpen, recentItems } = useSearch()

  return (
    <aside className="sticky top-16 hidden h-[calc(100vh-4rem)] w-[272px] shrink-0 border-r border-gray-200 bg-white/95 backdrop-blur-xl xl:flex xl:flex-col dark:border-gray-800 dark:bg-gray-950/95">
      <div className="border-b border-gray-200 p-4 dark:border-gray-800">
        <button type="button" onClick={() => setOpen(true)}
          className="flex w-full items-center gap-3 rounded-2xl border border-gray-200 bg-gray-50 px-3 py-3 text-left text-sm text-gray-500 transition hover:border-accent hover:text-accent dark:border-gray-800 dark:bg-gray-900 dark:text-gray-400">
          <FiSearch size={17} />
          <span className="flex-1">Search website</span>
          <kbd className="rounded-md border border-gray-200 bg-white px-1.5 py-0.5 text-[10px] text-gray-400 dark:border-gray-700 dark:bg-gray-950">⌘K</kbd>
        </button>
      </div>

      <div className="flex-1 overflow-y-auto px-3 py-5">
        <nav className="space-y-6" aria-label="Website sidebar">
          {PUBLIC_NAV_SECTIONS.map((section) => (
            <div key={section.title}>
              <p className="mb-2 px-3 text-[11px] font-semibold uppercase tracking-[0.2em] text-gray-400">{section.title}</p>
              <div className="space-y-1">
                {section.items.map((item) => {
                  const Icon = iconByPath[item.path] || FiGrid
                  return (
                    <NavLink key={item.path} to={item.path} end={item.path === '/'} className={({ isActive }) => itemClasses(isActive)}>
                      <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-gray-100/80 group-hover:bg-white dark:bg-gray-800 dark:group-hover:bg-gray-700">
                        <Icon size={16} />
                      </span>
                      <span className="truncate">{item.label}</span>
                    </NavLink>
                  )
                })}
              </div>
            </div>
          ))}
        </nav>

        {recentItems.length > 0 ? (
          <div className="mt-7 border-t border-gray-200 pt-5 dark:border-gray-800">
            <p className="mb-3 px-3 text-[11px] font-semibold uppercase tracking-[0.2em] text-gray-400">Latest</p>
            <div className="space-y-1">
              {recentItems.slice(0, 4).map((item) => (
                <NavLink key={item.path + item.title} to={item.path}
                  className="block rounded-xl px-3 py-2.5 transition hover:bg-gray-100 dark:hover:bg-gray-800">
                  <p className="line-clamp-2 text-xs font-semibold leading-5 text-gray-700 dark:text-gray-200">{item.title}</p>
                  <p className="mt-0.5 text-[10px] uppercase tracking-wide text-gray-400">{item.type}</p>
                </NavLink>
              ))}
            </div>
          </div>
        ) : null}
      </div>

      <div className="border-t border-gray-200 p-4 dark:border-gray-800">
        <div className="rounded-2xl bg-gray-50 px-4 py-3 dark:bg-gray-900">
          <p className="text-xs font-semibold text-gray-700 dark:text-gray-200">K.M. AFAQ</p>
          <p className="mt-1 text-xs leading-5 text-gray-500 dark:text-gray-400">AI research, NLP, machine learning and technical work.</p>
        </div>
      </div>
    </aside>
  )
}
