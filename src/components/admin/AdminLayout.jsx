import { useState } from 'react'
import { FiMenu, FiX } from 'react-icons/fi'
import AdminSidebar from './AdminSidebar'

export default function AdminLayout({ children }) {
  const [sidebarOpen, setSidebarOpen] = useState(false)

  return (
    <div className="min-h-screen bg-[#f8fafc] text-gray-900 dark:bg-gray-950 dark:text-white">
      <div className="flex min-h-screen">
        <div className="hidden xl:flex xl:w-[290px] xl:flex-col xl:border-r xl:border-gray-200 xl:bg-white xl:dark:border-gray-800 xl:dark:bg-gray-950">
          <AdminSidebar />
        </div>

        {sidebarOpen ? (
          <div className="fixed inset-0 z-50 xl:hidden">
            <button type="button" aria-label="Close sidebar overlay" onClick={() => setSidebarOpen(false)} className="absolute inset-0 bg-black/50 backdrop-blur-sm" />
            <div className="absolute left-0 top-0 h-full w-[88vw] max-w-[320px] border-r border-gray-200 bg-white shadow-2xl dark:border-gray-800 dark:bg-gray-950">
              <AdminSidebar onNavigate={() => setSidebarOpen(false)} />
            </div>
          </div>
        ) : null}

        <div className="flex min-w-0 flex-1 flex-col">
          <header className="sticky top-0 z-30 border-b border-gray-200 bg-white/90 backdrop-blur-xl dark:border-gray-800 dark:bg-gray-950/85">
            <div className="flex items-center justify-between gap-4 px-4 py-4 sm:px-6 xl:px-8">
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => setSidebarOpen((prev) => !prev)}
                  className="inline-flex h-11 w-11 items-center justify-center rounded-2xl border border-gray-200 bg-white text-gray-700 shadow-sm transition hover:bg-gray-50 xl:hidden dark:border-gray-800 dark:bg-gray-900 dark:text-gray-200 dark:hover:bg-gray-800"
                  aria-label={sidebarOpen ? 'Close menu' : 'Open menu'}
                >
                  {sidebarOpen ? <FiX size={20} /> : <FiMenu size={20} />}
                </button>
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.24em] text-gray-400">Admin workspace</p>
                  <h1 className="text-lg font-bold text-gray-900 dark:text-white">Portfolio CMS</h1>
                </div>
              </div>
              <div className="hidden sm:flex items-center gap-3 rounded-2xl border border-gray-200 bg-white px-4 py-2.5 text-sm text-gray-500 shadow-sm dark:border-gray-800 dark:bg-gray-900 dark:text-gray-400">
                Protected admin area
              </div>
            </div>
          </header>

          <main className="flex-1 overflow-x-hidden">
            <div className="mx-auto w-full max-w-[1700px]">{children}</div>
          </main>
        </div>
      </div>
    </div>
  )
}
