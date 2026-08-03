import { useEffect, useState } from 'react'
import {
  FiClock,
  FiPlus,
  FiSave,
  FiTrash2,
  FiRefreshCw,
  FiMapPin,
  FiType,
  FiFileText,
} from 'react-icons/fi'
import toast from 'react-hot-toast'
import AdminLayout from '../../components/admin/AdminLayout'
import AdminHeader from '../../components/admin/AdminHeader'
import {
  getProfileTimeline,
  createTimelineItem,
  updateTimelineItem,
  deleteTimelineItem,
} from '../../lib/profileApi'

const emptyItem = {
  year: '',
  title: '',
  place: '',
  desc: '',
  sort_order: 0,
}

function Field({ label, value, onChange, placeholder = '', textarea = false, type = 'text' }) {
  return (
    <label className="block">
      <span className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
        {label}
      </span>

      {textarea ? (
        <textarea
          value={value ?? ''}
          onChange={onChange}
          rows={4}
          placeholder={placeholder}
          className="w-full rounded-2xl border border-gray-200 bg-white px-4 py-3 text-sm text-gray-900 outline-none transition focus:border-accent dark:border-gray-700 dark:bg-gray-900 dark:text-white"
        />
      ) : (
        <input
          type={type}
          value={value ?? ''}
          onChange={onChange}
          placeholder={placeholder}
          className="w-full rounded-2xl border border-gray-200 bg-white px-4 py-3 text-sm text-gray-900 outline-none transition focus:border-accent dark:border-gray-700 dark:bg-gray-900 dark:text-white"
        />
      )}
    </label>
  )
}

export default function AdminProfileTimeline() {
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [savingId, setSavingId] = useState(null)
  const [creating, setCreating] = useState(false)

  const load = async () => {
    try {
      setLoading(true)
      const data = await getProfileTimeline()
      setItems(data || [])
    } catch (err) {
      toast.error(err.message || 'Failed to load timeline')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    load()
  }, [])

  const handleChange = (id, field, value) => {
    setItems((prev) =>
      prev.map((item) =>
        item.id === id
          ? {
              ...item,
              [field]: field === 'sort_order' ? Number(value) : value,
            }
          : item
      )
    )
  }

  const handleCreate = async () => {
    try {
      setCreating(true)
      const nextSort =
        items.length > 0 ? Math.max(...items.map((item) => Number(item.sort_order || 0))) + 1 : 1

      const created = await createTimelineItem({
        ...emptyItem,
        sort_order: nextSort,
      })

      setItems((prev) => [...prev, created].sort((a, b) => (a.sort_order || 0) - (b.sort_order || 0)))
      toast.success('Timeline item added')
    } catch (err) {
      toast.error(err.message || 'Failed to create timeline item')
    } finally {
      setCreating(false)
    }
  }

  const handleSave = async (item) => {
    try {
      setSavingId(item.id)
      const saved = await updateTimelineItem(item.id, {
        year: item.year,
        title: item.title,
        place: item.place,
        desc: item.desc,
        sort_order: Number(item.sort_order || 0),
      })

      setItems((prev) =>
        prev
          .map((entry) => (entry.id === item.id ? saved : entry))
          .sort((a, b) => (a.sort_order || 0) - (b.sort_order || 0))
      )

      toast.success('Timeline item saved')
    } catch (err) {
      toast.error(err.message || 'Failed to save timeline item')
    } finally {
      setSavingId(null)
    }
  }

  const handleDelete = async (id) => {
    const ok = window.confirm('Delete this timeline item?')
    if (!ok) return

    try {
      await deleteTimelineItem(id)
      setItems((prev) => prev.filter((item) => item.id !== id))
      toast.success('Timeline item deleted')
    } catch (err) {
      toast.error(err.message || 'Failed to delete timeline item')
    }
  }

  return (
    <AdminLayout>
      <AdminHeader
        title="Profile Timeline"
        subtitle="Manage research and career milestones from the profile_timeline table."
      />

      <div className="space-y-6">
        <div className="flex flex-wrap items-center justify-between gap-3 rounded-3xl border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-800 dark:bg-gray-950">
          <div>
            <h2 className="text-lg font-bold text-gray-900 dark:text-white">Timeline Entries</h2>
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              Each row maps to the timeline structure used in the About page: year, title, place, and description.
            </p>
          </div>

          <div className="flex gap-3">
            <button
              type="button"
              onClick={load}
              className="inline-flex items-center gap-2 rounded-2xl border border-gray-200 px-4 py-3 text-sm font-medium text-gray-600 transition hover:bg-gray-100 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-800"
            >
              <FiRefreshCw size={16} />
              Refresh
            </button>

            <button
              type="button"
              onClick={handleCreate}
              disabled={creating}
              className="inline-flex items-center gap-2 rounded-2xl bg-accent px-4 py-3 text-sm font-medium text-white transition hover:opacity-90 disabled:opacity-70"
            >
              <FiPlus size={16} />
              {creating ? 'Adding...' : 'Add Timeline Item'}
            </button>
          </div>
        </div>

        {loading ? (
          <div className="rounded-3xl border border-gray-200 bg-white p-6 text-sm text-gray-500 shadow-sm dark:border-gray-800 dark:bg-gray-950 dark:text-gray-400">
            Loading timeline...
          </div>
        ) : items.length === 0 ? (
          <div className="rounded-3xl border border-dashed border-gray-300 bg-gray-50 p-8 text-center dark:border-gray-700 dark:bg-gray-900">
            <FiClock className="mx-auto mb-3 text-accent" size={24} />
            <h3 className="text-base font-semibold text-gray-900 dark:text-white">No timeline items yet</h3>
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              Add your first academic or professional milestone.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {items.map((item) => (
              <div
                key={item.id}
                className="rounded-3xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-950"
              >
                <div className="mb-5 flex items-center justify-between gap-3">
                  <div>
                    <h3 className="text-base font-bold text-gray-900 dark:text-white">
                      Timeline Item #{item.id}
                    </h3>
                    <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                      Update the milestone content shown in your About page timeline.
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={() => handleDelete(item.id)}
                    className="inline-flex items-center gap-2 rounded-2xl border border-red-200 px-4 py-2.5 text-sm font-medium text-red-500 transition hover:bg-red-50 dark:border-red-900/40 dark:hover:bg-red-950/30"
                  >
                    <FiTrash2 size={16} />
                    Delete
                  </button>
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                  <Field
                    label="Year"
                    value={item.year}
                    onChange={(e) => handleChange(item.id, 'year', e.target.value)}
                    placeholder="2023 – Present"
                  />
                  <Field
                    label="Sort Order"
                    type="number"
                    value={item.sort_order}
                    onChange={(e) => handleChange(item.id, 'sort_order', e.target.value)}
                    placeholder="1"
                  />
                  <Field
                    label="Title"
                    value={item.title}
                    onChange={(e) => handleChange(item.id, 'title', e.target.value)}
                    placeholder="Doctoral Student & AI Researcher"
                  />
                  <Field
                    label="Place"
                    value={item.place}
                    onChange={(e) => handleChange(item.id, 'place', e.target.value)}
                    placeholder="Chang Gung University, Taiwan"
                  />
                  <div className="md:col-span-2">
                    <Field
                      label="Description"
                      textarea
                      value={item.desc}
                      onChange={(e) => handleChange(item.id, 'desc', e.target.value)}
                      placeholder="Describe the milestone..."
                    />
                  </div>
                </div>

                <div className="mt-5 flex justify-end">
                  <button
                    type="button"
                    onClick={() => handleSave(item)}
                    disabled={savingId === item.id}
                    className="inline-flex items-center gap-2 rounded-2xl bg-accent px-4 py-3 text-sm font-medium text-white transition hover:opacity-90 disabled:opacity-70"
                  >
                    <FiSave size={16} />
                    {savingId === item.id ? 'Saving...' : 'Save Item'}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </AdminLayout>
  )
}