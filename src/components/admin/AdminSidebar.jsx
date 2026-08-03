import { NavLink } from 'react-router-dom'
import {
  FiAward, FiBookOpen, FiCode, FiFolder, FiGrid, FiHome, FiImage,
  FiLayers, FiLink, FiMail, FiMessageSquare, FiShare2, FiStar,
  FiUser, FiClock
} from 'react-icons/fi'

const sections = [
  { title: 'Overview', items: [{ label: 'Dashboard', to: '/admin', icon: FiHome, end: true }] },
  {
    title: 'Content',
    items: [
      { label: 'Projects', to: '/admin/projects', icon: FiFolder },
      { label: 'Blogs', to: '/admin/blogs', icon: FiBookOpen },
      { label: 'Publications', to: '/admin/publications', icon: FiLayers },
      { label: 'Certifications', to: '/admin/certifications', icon: FiAward },
      { label: 'Technical Skills', to: '/admin/technical-skills', icon: FiCode },
      { label: 'Testimonials', to: '/admin/testimonials', icon: FiStar },
      { label: 'Profile Settings', to: '/admin/profile-settings', icon: FiUser },
      { label: 'Profile Timeline', to: '/admin/profile-timeline', icon: FiClock },
    ],
  },
  {
    title: 'Media',
    items: [
      { label: 'Gallery', to: '/admin/gallery', icon: FiImage },
      { label: 'Profile Assets', to: '/admin/profile-assets', icon: FiUser },
    ],
  },
  {
    title: 'Connections',
    items: [
      { label: 'Social Links', to: '/admin/social-links', icon: FiLink },
      { label: 'Messages', to: '/admin/messages', icon: FiMail },
    ],
  },
  {
    title: 'Graph',
    items: [
      { label: 'Graph Nodes', to: '/admin/graph-nodes', icon: FiGrid },
      { label: 'Graph Edges', to: '/admin/graph-edges', icon: FiShare2 },
    ],
  },
]

function navClasses(isActive) {
  return [
    'group flex w-full items-center gap-3 rounded-2xl px-4 py-3 text-sm font-medium transition-all duration-200',
    isActive
      ? 'bg-accent text-white shadow-sm'
      : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900 dark:text-gray-300 dark:hover:bg-gray-800 dark:hover:text-white',
  ].join(' ')
}

export default function AdminSidebar({ onNavigate }) {
  return (
    <aside className="flex h-full w-full max-w-[280px] flex-col border-r border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-950">
      <div className="border-b border-gray-200 px-6 py-5 dark:border-gray-800">
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-accent text-white shadow-sm">
            <FiMessageSquare size={20} />
          </div>
          <div>
            <h2 className="text-base font-bold text-gray-900 dark:text-white">Admin Panel</h2>
            <p className="text-xs text-gray-500 dark:text-gray-400">Portfolio management</p>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-4 py-5">
        <nav className="space-y-6">
          {sections.map((section) => (
            <div key={section.title}>
              <p className="mb-3 px-3 text-[11px] font-semibold uppercase tracking-[0.22em] text-gray-400">{section.title}</p>
              <div className="space-y-1.5">
                {section.items.map((item) => {
                  const Icon = item.icon
                  return (
                    <NavLink key={item.to} to={item.to} end={item.end} onClick={onNavigate} className={({ isActive }) => navClasses(isActive)}>
                      {({ isActive }) => (
                        <>
                          <span className={[
                            'flex h-9 w-9 items-center justify-center rounded-xl transition-all',
                            isActive ? 'bg-white/15 text-white' : 'bg-gray-100 text-gray-500 group-hover:bg-white dark:bg-gray-800 dark:text-gray-300',
                          ].join(' ')}>
                            <Icon size={18} />
                          </span>
                          <span className="truncate">{item.label}</span>
                        </>
                      )}
                    </NavLink>
                  )
                })}
              </div>
            </div>
          ))}
        </nav>
      </div>

      <div className="border-t border-gray-200 px-4 py-4 dark:border-gray-800">
        <div className="rounded-2xl bg-gray-50 px-4 py-3 dark:bg-gray-900">
          <p className="text-xs font-medium text-gray-500 dark:text-gray-400">Admin routes</p>
          <p className="mt-1 text-sm text-gray-700 dark:text-gray-300">Manage content, media, inbox, and research data.</p>
        </div>
      </div>
    </aside>
  )
}
