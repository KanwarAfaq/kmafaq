import { useEffect, useState } from 'react'
import { FiPlus, FiSave, FiX } from 'react-icons/fi'
const initialForm = { platform_name: '', profile_url: '', is_active: true }
export default function SocialLinkFormModal({ open, onClose, onSubmit, initialData, loading }) {
  const [form, setForm] = useState(initialForm)
  useEffect(() => {
    if (initialData) setForm({ platform_name: initialData.platform_name ?? '', profile_url: initialData.profile_url ?? '', is_active: initialData.is_active ?? true })
    else setForm(initialForm)
  }, [initialData, open])
  if (!open) return null
  function handleSubmit(e) { e.preventDefault(); onSubmit(form) }
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-4 py-6 backdrop-blur-sm">
      <div className="w-full max-w-2xl rounded-3xl border border-gray-200 bg-white shadow-2xl dark:border-gray-800 dark:bg-gray-950">
        <div className="flex items-center justify-between border-b border-gray-200 px-6 py-4 dark:border-gray-800"><div><h3 className="text-xl font-bold text-gray-900 dark:text-white">{initialData?.id ? 'Edit social link' : 'Create social link'}</h3><p className="mt-1 text-sm text-gray-500 dark:text-gray-400">Manage which social platforms appear on your website.</p></div><button type="button" onClick={onClose} className="inline-flex h-10 w-10 items-center justify-center rounded-2xl border border-gray-200 text-gray-500 dark:border-gray-800 dark:text-gray-300"><FiX size={18} /></button></div>
        <form onSubmit={handleSubmit} className="space-y-5 px-6 py-6">
          <div className="space-y-2"><label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Platform name</label><input type="text" required value={form.platform_name} onChange={(e) => setForm((prev) => ({ ...prev, platform_name: e.target.value }))} className="w-full rounded-2xl border border-gray-200 bg-white px-4 py-3 text-sm outline-none transition-all focus:border-accent dark:border-gray-800 dark:bg-gray-900 dark:text-white" /></div>
          <div className="space-y-2"><label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Profile URL</label><input type="url" required value={form.profile_url} onChange={(e) => setForm((prev) => ({ ...prev, profile_url: e.target.value }))} className="w-full rounded-2xl border border-gray-200 bg-white px-4 py-3 text-sm outline-none transition-all focus:border-accent dark:border-gray-800 dark:bg-gray-900 dark:text-white" /></div>
          <label className="inline-flex items-center gap-3 rounded-2xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm text-gray-700 dark:border-gray-800 dark:bg-gray-900 dark:text-gray-300"><input type="checkbox" checked={form.is_active} onChange={(e) => setForm((prev) => ({ ...prev, is_active: e.target.checked }))} className="h-4 w-4 rounded border-gray-300 text-accent focus:ring-accent" />Show this social link on the website</label>
          <div className="flex flex-col gap-3 border-t border-gray-200 pt-5 dark:border-gray-800 sm:flex-row sm:justify-end"><button type="button" onClick={onClose} className="inline-flex items-center justify-center gap-2 rounded-2xl border border-gray-200 px-4 py-3 text-sm font-medium text-gray-700 dark:border-gray-800 dark:text-gray-300"><FiX size={16} />Cancel</button><button type="submit" disabled={loading} className="inline-flex items-center justify-center gap-2 rounded-2xl bg-accent px-4 py-3 text-sm font-medium text-white disabled:cursor-not-allowed disabled:opacity-60">{initialData?.id ? <FiSave size={16} /> : <FiPlus size={16} />}{loading ? 'Saving...' : initialData?.id ? 'Save changes' : 'Create link'}</button></div>
        </form>
      </div>
    </div>
  )
}
