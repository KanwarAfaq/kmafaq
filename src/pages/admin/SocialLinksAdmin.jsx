import { useEffect, useMemo, useState } from 'react'
import { FiEdit2, FiPlus, FiSearch, FiTrash2 } from 'react-icons/fi'
import toast from 'react-hot-toast'
import AdminLayout from '../../components/admin/AdminLayout'
import AdminHeader from '../../components/admin/AdminHeader'
import AdminEmptyState from '../../components/admin/AdminEmptyState'
import SocialLinkFormModal from '../../components/admin/SocialLinkFormModal'
import { createSocialLink, deleteSocialLink, listSocialLinks, updateSocialLink } from '../../lib/adminApi'
export default function SocialLinksAdmin() {
  const [links, setLinks] = useState([])
  const [search, setSearch] = useState('')
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [modalOpen, setModalOpen] = useState(false)
  const [editing, setEditing] = useState(null)
  async function loadLinks() {
    try { setLoading(true); const data = await listSocialLinks(); setLinks(data) } catch (error) { toast.error(error.message || 'Failed to load social links') } finally { setLoading(false) }
  }
  useEffect(() => { loadLinks() }, [])
  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase()
    if (!q) return links
    return links.filter((item) => `${item.platform_name} ${item.profile_url}`.toLowerCase().includes(q))
  }, [links, search])
  async function handleSubmit(payload) {
    try {
      setSaving(true)
      if (editing?.id) { await updateSocialLink(editing.id, payload); toast.success('Social link updated') }
      else { await createSocialLink(payload); toast.success('Social link created') }
      setModalOpen(false)
      setEditing(null)
      loadLinks()
    } catch (error) { toast.error(error.message || 'Failed to save social link') } finally { setSaving(false) }
  }
  async function handleDelete(id) {
    const confirmed = window.confirm('Delete this social link?')
    if (!confirmed) return
    try { await deleteSocialLink(id); toast.success('Social link deleted'); loadLinks() } catch (error) { toast.error(error.message || 'Failed to delete social link') }
  }
  return (
    <AdminLayout>
      <AdminHeader title="Social Links" subtitle="Manage the social platforms shown across your portfolio." />
      <div className="space-y-6 px-5 py-6 lg:px-8">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between"><div className="relative w-full max-w-md"><FiSearch size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" /><input type="text" value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search social links..." className="w-full rounded-2xl border border-gray-200 bg-white py-3 pl-11 pr-4 text-sm outline-none transition-all focus:border-accent dark:border-gray-800 dark:bg-gray-900 dark:text-white" /></div><button type="button" onClick={() => { setEditing(null); setModalOpen(true) }} className="inline-flex items-center justify-center gap-2 rounded-2xl bg-accent px-4 py-3 text-sm font-medium text-white"><FiPlus size={16} />New social link</button></div>
        {loading ? <div className="rounded-3xl border border-gray-200 bg-white p-8 text-sm text-gray-500 dark:border-gray-800 dark:bg-gray-900 dark:text-gray-400">Loading social links...</div> : filtered.length === 0 ? <AdminEmptyState title="No social links found" text="Add the platforms you want to show on your portfolio footer and contact sections." action={<button type="button" onClick={() => { setEditing(null); setModalOpen(true) }} className="inline-flex items-center gap-2 rounded-2xl bg-accent px-4 py-3 text-sm font-medium text-white"><FiPlus size={16} />Create social link</button>} /> : <div className="overflow-hidden rounded-3xl border border-gray-200 bg-white shadow-sm dark:border-gray-800 dark:bg-gray-900"><div className="overflow-x-auto"><table className="min-w-full divide-y divide-gray-200 dark:divide-gray-800"><thead className="bg-gray-50 dark:bg-gray-950"><tr><th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">Platform</th><th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">URL</th><th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">Status</th><th className="px-5 py-4 text-right text-xs font-semibold uppercase tracking-wider text-gray-500">Actions</th></tr></thead><tbody className="divide-y divide-gray-200 dark:divide-gray-800">{filtered.map((item) => <tr key={item.id}><td className="px-5 py-4 text-sm font-medium text-gray-900 dark:text-white">{item.platform_name}</td><td className="px-5 py-4 text-sm text-gray-500 dark:text-gray-400"><a href={item.profile_url} target="_blank" rel="noreferrer" className="hover:text-accent hover:underline">{item.profile_url}</a></td><td className="px-5 py-4"><span className={`rounded-full px-2.5 py-1 text-[11px] font-semibold ${item.is_active ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-300' : 'bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-300'}`}>{item.is_active ? 'Active' : 'Hidden'}</span></td><td className="px-5 py-4"><div className="flex justify-end gap-2"><button type="button" onClick={() => { setEditing(item); setModalOpen(true) }} className="inline-flex items-center gap-2 rounded-2xl border border-gray-200 px-3 py-2 text-sm font-medium text-gray-700 dark:border-gray-800 dark:text-gray-300"><FiEdit2 size={14} /> Edit</button><button type="button" onClick={() => handleDelete(item.id)} className="inline-flex items-center gap-2 rounded-2xl border border-red-200 px-3 py-2 text-sm font-medium text-red-500 dark:border-red-500/30"><FiTrash2 size={14} /> Delete</button></div></td></tr>)}</tbody></table></div></div>}
      </div>
      <SocialLinkFormModal open={modalOpen} onClose={() => { setModalOpen(false); setEditing(null) }} onSubmit={handleSubmit} initialData={editing} loading={saving} />
    </AdminLayout>
  )
}
