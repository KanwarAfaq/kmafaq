import { useEffect, useMemo, useState } from 'react'
import { FiArchive, FiClock, FiFilter, FiInbox, FiMail, FiSearch } from 'react-icons/fi'
import toast from 'react-hot-toast'
import AdminLayout from '../../components/admin/AdminLayout'
import AdminHeader from '../../components/admin/AdminHeader'
import AdminShellCard from '../../components/admin/AdminShellCard'
import StatPill from '../../components/admin/StatPill'
import { formatMessageStatus, getRows, patchRow, removeRow } from '../../lib/adminApi'

const STATUS_OPTIONS = ['all', 'new', 'in_progress', 'replied', 'archived']

export default function MessagesAdminV5() {
  const [rows, setRows] = useState([])
  const [selected, setSelected] = useState(null)
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [updating, setUpdating] = useState(false)

  async function loadData() {
    try {
      const data = await getRows('messages', 'created_at', false)
      setRows(data.map((item) => ({ ...item, status: item.status || 'new' })))
      if (!selected && data[0]) setSelected({ ...data[0], status: data[0].status || 'new' })
    } catch (error) {
      toast.error(error.message || 'Failed to load messages')
    }
  }

  useEffect(() => { loadData() }, [])

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase()
    return rows.filter((item) => {
      const matchesStatus = statusFilter === 'all' || item.status === statusFilter
      const haystack = [item.name, item.email, item.subject, item.message].join(' ').toLowerCase()
      const matchesSearch = !q || haystack.includes(q)
      return matchesStatus && matchesSearch
    })
  }, [rows, search, statusFilter])

  async function updateStatus(message, status) {
    try {
      setUpdating(true)
      await patchRow('messages', message.id, { status })
      toast.success('Message status updated')
      setRows((prev) => prev.map((item) => item.id === message.id ? { ...item, status } : item))
      if (selected?.id === message.id) setSelected((prev) => ({ ...prev, status }))
    } catch (error) {
      toast.error(error.message || 'Failed to update status')
    } finally {
      setUpdating(false)
    }
  }

  async function handleDelete(id) {
    if (!window.confirm('Delete this message?')) return
    try {
      await removeRow('messages', id)
      toast.success('Message deleted')
      setRows((prev) => prev.filter((item) => item.id !== id))
      if (selected?.id === id) setSelected(null)
    } catch (error) {
      toast.error(error.message || 'Failed to delete message')
    }
  }

  const stats = {
    total: rows.length,
    fresh: rows.filter((r) => r.status === 'new').length,
    active: rows.filter((r) => r.status === 'in_progress').length,
    closed: rows.filter((r) => r.status === 'replied' || r.status === 'archived').length,
  }

  return (
    <AdminLayout>
      <AdminHeader title="Messages" subtitle="Inbox workflow with search, status filters, and response tracking." />
      <div className="space-y-6 px-5 py-6 lg:px-8">
        <div className="grid gap-4 md:grid-cols-4">
          <StatPill label="Total" value={stats.total} />
          <StatPill label="New" value={stats.fresh} />
          <StatPill label="In progress" value={stats.active} />
          <StatPill label="Closed" value={stats.closed} />
        </div>

        <div className="grid gap-6 xl:grid-cols-[1.05fr_0.95fr]">
          <AdminShellCard
            title="Inbox"
            subtitle="Filter messages by workflow state and open the details panel."
            actions={[
              <div key="search" className="relative min-w-[220px]">
                <FiSearch size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search inbox" className="w-full rounded-2xl border border-gray-200 bg-white py-3 pl-11 pr-4 text-sm outline-none focus:border-accent dark:border-gray-800 dark:bg-gray-950 dark:text-white" />
              </div>,
              <div key="filter" className="inline-flex items-center gap-2 rounded-2xl border border-gray-200 px-4 py-3 text-sm dark:border-gray-800">
                <FiFilter size={16} />
                <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className="bg-transparent outline-none dark:text-white">
                  {STATUS_OPTIONS.map((status) => <option key={status} value={status}>{formatMessageStatus(status)}</option>)}
                </select>
              </div>,
            ]}
          >
            <div className="space-y-4">
              {filtered.map((item) => (
                <button key={item.id} type="button" onClick={() => setSelected(item)} className={`w-full rounded-[28px] border p-5 text-left transition ${selected?.id === item.id ? 'border-accent bg-accent/5' : 'border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-950'}`}>
                  <div className="flex items-start justify-between gap-4">
                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-2 text-xs text-gray-500">
                        <span className="rounded-full bg-gray-100 px-3 py-1 dark:bg-gray-800">{item.created_at ? new Date(item.created_at).toLocaleString() : 'Unknown date'}</span>
                        <span className="rounded-full bg-accent/10 px-3 py-1 text-accent capitalize">{formatMessageStatus(item.status)}</span>
                      </div>
                      <h4 className="mt-3 text-lg font-semibold text-gray-900 dark:text-white">{item.subject || 'No subject'}</h4>
                      <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">{item.name} · {item.email}</p>
                      <p className="mt-3 line-clamp-2 text-sm text-gray-600 dark:text-gray-300">{item.message}</p>
                    </div>
                    <FiMail size={18} className="shrink-0 text-gray-400" />
                  </div>
                </button>
              ))}
            </div>
          </AdminShellCard>

          <AdminShellCard title="Message detail" subtitle="Review the message and move it through your response workflow.">
            {selected ? (
              <div className="space-y-5">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="inline-flex items-center gap-2 rounded-full bg-gray-100 px-3 py-1 text-xs text-gray-600 dark:bg-gray-800 dark:text-gray-300"><FiInbox size={12} /> {selected.email}</span>
                  <span className="inline-flex items-center gap-2 rounded-full bg-accent/10 px-3 py-1 text-xs text-accent"><FiClock size={12} /> {formatMessageStatus(selected.status)}</span>
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-gray-900 dark:text-white">{selected.subject || 'No subject'}</h3>
                  <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">From {selected.name || 'Unknown sender'}</p>
                </div>
                <div className="rounded-[28px] border border-gray-200 bg-gray-50 p-5 dark:border-gray-800 dark:bg-gray-950">
                  <p className="whitespace-pre-wrap text-sm leading-7 text-gray-700 dark:text-gray-300">{selected.message || 'No message body provided.'}</p>
                </div>
                <div className="grid gap-3 sm:grid-cols-2">
                  {STATUS_OPTIONS.filter((x) => x !== 'all').map((status) => (
                    <button key={status} type="button" disabled={updating} onClick={() => updateStatus(selected, status)} className={`rounded-2xl border px-4 py-3 text-sm font-medium transition ${selected.status === status ? 'border-accent bg-accent text-white' : 'border-gray-200 dark:border-gray-800'}`}>
                      Set as {formatMessageStatus(status)}
                    </button>
                  ))}
                </div>
                <div className="flex justify-end gap-3 border-t border-gray-200 pt-5 dark:border-gray-800">
                  <button type="button" onClick={() => handleDelete(selected.id)} className="inline-flex items-center gap-2 rounded-2xl border border-red-200 px-4 py-3 text-sm font-medium text-red-500 dark:border-red-500/30"><FiArchive size={16} /> Delete message</button>
                  <a href={`mailto:${selected.email}?subject=${encodeURIComponent(selected.subject || 'Regarding your message')}`} className="rounded-2xl bg-accent px-4 py-3 text-sm font-medium text-white">Reply by email</a>
                </div>
              </div>
            ) : <p className="text-sm text-gray-500 dark:text-gray-400">Select a message to review it here.</p>}
          </AdminShellCard>
        </div>
      </div>
    </AdminLayout>
  )
}
