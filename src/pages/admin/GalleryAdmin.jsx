import { useEffect, useMemo, useState } from 'react'
import {
  FiFolder,
  FiMoreVertical,
  FiImage,
  FiSearch,
  FiUpload,
  FiX,
} from 'react-icons/fi'
import toast from 'react-hot-toast'
import { openCloudinaryWidget } from '../../lib/cloudinaryWidget'
import AdminLayout from '../../components/admin/AdminLayout'
import AdminHeader from '../../components/admin/AdminHeader'
import AdminShellCard from '../../components/admin/AdminShellCard'
import StatPill from '../../components/admin/StatPill'
import {
  getRows,
  insertRow,
  patchMany,
  patchRow,
  removeRow,
  uploadImage,
} from '../../lib/adminApi'

const emptyForm = { name: '', folder: '', url: '', size: '', display_order: 0 }

export default function GalleryAdminV5() {
  const [rows, setRows] = useState([])
  const [dragId, setDragId] = useState(null)
  const [search, setSearch] = useState('')
  const [folder, setFolder] = useState('all')
  const [form, setForm] = useState(emptyForm)
  const [open, setOpen] = useState(false)
  const [saving, setSaving] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [savingOrder, setSavingOrder] = useState(false)

  async function loadData() {
    try {
      const data = await getRows('gallery', 'display_order', true)
      const normalized = data.map((item, index) => ({
        ...item,
        display_order: item.display_order ?? index,
      }))
      setRows(normalized)
    } catch (error) {
      toast.error(error.message || 'Failed to load gallery')
    }
  }

  useEffect(() => {
    loadData()
  }, [])

  const folders = useMemo(
    () => ['all', ...new Set(rows.map((r) => r.folder).filter(Boolean))],
    [rows]
  )

  const filtered = useMemo(
    () =>
      rows.filter((item) => {
        const okFolder = folder === 'all' || item.folder === folder
        const q = search.trim().toLowerCase()
        const okSearch =
          !q ||
          [item.name, item.folder, item.url]
            .join(' ')
            .toLowerCase()
            .includes(q)
        return okFolder && okSearch
      }),
    [rows, folder, search]
  )

  function startCreate() {
    setForm({ ...emptyForm, display_order: rows.length })
    setOpen(true)
  }

  function startEdit(item) {
    setForm({
      ...item,
      size: item.size ?? '',
      display_order: item.display_order ?? 0,
    })
    setOpen(true)
  }

  function reorderByIds(list, fromId, toId) {
    const next = [...list]
    const fromIndex = next.findIndex((x) => x.id === fromId)
    const toIndex = next.findIndex((x) => x.id === toId)
    if (fromIndex < 0 || toIndex < 0 || fromIndex === toIndex) return list
    const [moved] = next.splice(fromIndex, 1)
    next.splice(toIndex, 0, moved)
    return next.map((item, index) => ({ ...item, display_order: index }))
  }

  async function persistOrder() {
    try {
      setSavingOrder(true)
      await patchMany(
        'gallery',
        rows.map((item, index) => ({
          id: item.id,
          display_order: index,
        }))
      )
      toast.success('Gallery order saved')
      loadData()
    } catch (error) {
      toast.error(error.message || 'Failed to save order')
    } finally {
      setSavingOrder(false)
    }
  }

  // Existing Supabase storage-based upload
  async function onFileChange(file) {
    try {
      setUploading(true)
      const url = await uploadImage(file, `gallery/${form.folder || 'general'}`)
      setForm((prev) => ({ ...prev, url, size: file.size }))
      toast.success('Image uploaded')
    } catch (error) {
      toast.error(error.message || 'Upload failed')
    } finally {
      setUploading(false)
    }
  }

  // NEW: Cloudinary-based upload – updates form.url directly
  function handleCloudinaryUpload() {
    openCloudinaryWidget({
      folder: 'portfolio/gallery',
      onSuccess: (file) => {
        // file.secure_url is the Cloudinary URL
        setForm((prev) => ({
          ...prev,
          url: file.secure_url,
          size: file.bytes ?? prev.size,
        }))
        toast.success('Image uploaded via Cloudinary')
      },
    })
  }

  async function submit(e) {
    e.preventDefault()
    try {
      setSaving(true)
      const payload = {
        ...form,
        size: form.size ? Number(form.size) : null,
        display_order: Number(form.display_order || 0),
      }

      if (form.id) {
        await patchRow('gallery', form.id, payload)
        toast.success('Gallery item updated')
      } else {
        await insertRow('gallery', payload)
        toast.success('Gallery item created')
      }

      setOpen(false)
      setForm(emptyForm)
      loadData()
    } catch (error) {
      toast.error(error.message || 'Failed to save gallery item')
    } finally {
      setSaving(false)
    }
  }

  async function handleDelete(id) {
    if (!window.confirm('Delete this gallery item?')) return
    try {
      await removeRow('gallery', id)
      toast.success('Gallery item deleted')
      loadData()
    } catch (error) {
      toast.error(error.message || 'Failed to delete gallery item')
    }
  }

  return (
    <AdminLayout>
      <AdminHeader
        title="Gallery"
        subtitle="Drag-and-drop media sorting with visual cards and persistent ordering."
      />
      <div className="space-y-6 px-5 py-6 lg:px-8">
        <div className="grid gap-4 md:grid-cols-4">
          <StatPill label="Items" value={rows.length} />
          <StatPill label="Folders" value={folders.length - 1} />
          <StatPill label="Drag mode" value={dragId ? 'active' : 'idle'} />
          <StatPill
            label="Size"
            value={`${(
              rows.reduce(
                (a, r) => a + Number(r.size || 0),
                0
              ) /
              (1024 * 1024)
            ).toFixed(2)} MB`}
          />
        </div>

        <AdminShellCard
          title="Sortable media grid"
          subtitle="Drag a card onto another card to reorder the gallery, then save the sequence."
          actions={[
            <div key="search" className="relative min-w-[220px]">
              <FiSearch
                size={16}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
              />
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search media"
                className="w-full rounded-2xl border border-gray-200 bg-white py-3 pl-11 pr-4 text-sm outline-none focus:border-accent dark:border-gray-800 dark:bg-gray-950 dark:text-white"
              />
            </div>,
            <select
              key="folder"
              value={folder}
              onChange={(e) => setFolder(e.target.value)}
              className="rounded-2xl border border-gray-200 bg-white px-4 py-3 text-sm dark:border-gray-800 dark:bg-gray-950 dark:text-white"
            >
              {folders.map((item) => (
                <option key={item} value={item}>
                  {item}
                </option>
              ))}
            </select>,
            <button
              key="save-order"
              type="button"
              onClick={persistOrder}
              className="rounded-2xl border border-gray-200 px-4 py-3 text-sm font-medium dark:border-gray-800"
            >
              {savingOrder ? 'Saving order...' : 'Save order'}
            </button>,
            <button
              key="new"
              type="button"
              onClick={startCreate}
              className="rounded-2xl bg-accent px-4 py-3 text-sm font-medium text-white"
            >
              Add media
            </button>,
          ]}
        >
          <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
            {filtered.map((item) => (
              <div
                key={item.id}
                draggable
                onDragStart={() => setDragId(item.id)}
                onDragOver={(e) => e.preventDefault()}
                onDrop={() => {
                  if (dragId && dragId !== item.id) {
                    setRows((prev) => reorderByIds(prev, dragId, item.id))
                  }
                  setDragId(null)
                }}
                onDragEnd={() => setDragId(null)}
                className={`overflow-hidden rounded-[28px] border bg-white transition-all dark:bg-gray-950 ${
                  dragId === item.id
                    ? 'border-accent opacity-70 ring-2 ring-accent/30'
                    : 'border-gray-200 dark:border-gray-800'
                }`}
              >
                <div className="aspect-[4/3] bg-gray-100 dark:bg-gray-900">
                  {item.url ? (
                    <img
                      src={item.url}
                      alt={item.name || 'gallery item'}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <div className="flex h-full items-center justify-center text-gray-400">
                      <FiImage size={32} />
                    </div>
                  )}
                </div>
                <div className="space-y-3 p-4">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <h4 className="font-semibold text-gray-900 dark:text-white">
                        {item.name || 'Untitled asset'}
                      </h4>
                      <p className="mt-1 flex items-center gap-2 text-sm text-gray-500">
                        <FiFolder size={14} /> {item.folder || 'No folder'}
                      </p>
                    </div>
                    <span className="inline-flex items-center gap-1 rounded-full bg-gray-100 px-3 py-1 text-xs dark:bg-gray-800">
                      <FiMoreVertical size={12} /> {item.display_order}
                    </span>
                  </div>
                  <p className="truncate text-xs text-gray-400">{item.url}</p>
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <span className="text-xs text-gray-500">
                      {item.size
                        ? `${(item.size / 1024).toFixed(1)} KB`
                        : 'Unknown size'}
                    </span>
                    <div className="flex gap-2">
                      <button
                        type="button"
                        onClick={() => startEdit(item)}
                        className="rounded-2xl border border-gray-200 px-3 py-2 text-sm dark:border-gray-800"
                      >
                        Edit
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDelete(item.id)}
                        className="rounded-2xl border border-red-200 px-3 py-2 text-sm text-red-500 dark:border-red-500/30"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </AdminShellCard>
      </div>

      {open ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-4 py-6 backdrop-blur-sm">
          <div className="max-h-[92vh] w-full max-w-3xl overflow-y-auto rounded-[32px] border border-gray-200 bg-white shadow-2xl dark:border-gray-800 dark:bg-gray-950">
            <div className="flex items-center justify-between border-b border-gray-200 px-6 py-5 dark:border-gray-800">
              <div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                  {form.id ? 'Edit gallery item' : 'Add gallery item'}
                </h3>
                <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                  Upload an image and organize its public display order.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="rounded-2xl border border-gray-200 p-3 dark:border-gray-800"
              >
                <FiX size={18} />
              </button>
            </div>

            <form onSubmit={submit} className="space-y-5 px-6 py-6">
              <div className="space-y-4">
                <div className="aspect-[4/3] overflow-hidden rounded-[28px] border border-dashed border-gray-300 bg-gray-50 dark:border-gray-700 dark:bg-gray-900">
                  {form.url ? (
                    <img
                      src={form.url}
                      alt="preview"
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <div className="flex h-full flex-col items-center justify-center gap-3 text-gray-400">
                      <FiImage size={36} />
                      <p className="text-sm">No image selected</p>
                    </div>
                  )}
                </div>

                <div className="grid gap-5 md:grid-cols-2">
                  <input
                    value={form.name}
                    onChange={(e) =>
                      setForm((p) => ({ ...p, name: e.target.value }))
                    }
                    placeholder="Asset name"
                    className="rounded-2xl border border-gray-200 px-4 py-3 text-sm dark:border-gray-800 dark:bg-gray-900 dark:text-white"
                  />
                  <input
                    value={form.folder}
                    onChange={(e) =>
                      setForm((p) => ({ ...p, folder: e.target.value }))
                    }
                    placeholder="Folder"
                    className="rounded-2xl border border-gray-200 px-4 py-3 text-sm dark:border-gray-800 dark:bg-gray-900 dark:text-white"
                  />
                  <input
                    value={form.display_order}
                    onChange={(e) =>
                      setForm((p) => ({
                        ...p,
                        display_order: e.target.value,
                      }))
                    }
                    placeholder="Display order"
                    type="number"
                    className="rounded-2xl border border-gray-200 px-4 py-3 text-sm dark:border-gray-800 dark:bg-gray-900 dark:text-white"
                  />
                  <input
                    value={form.size}
                    onChange={(e) =>
                      setForm((p) => ({ ...p, size: e.target.value }))
                    }
                    placeholder="Size in bytes"
                    type="number"
                    className="rounded-2xl border border-gray-200 px-4 py-3 text-sm dark:border-gray-800 dark:bg-gray-900 dark:text-white"
                  />
                  <input
                    value={form.url}
                    onChange={(e) =>
                      setForm((p) => ({ ...p, url: e.target.value }))
                    }
                    placeholder="Image URL"
                    className="rounded-2xl border border-gray-200 px-4 py-3 text-sm dark:border-gray-800 dark:bg-gray-900 dark:text-white md:col-span-2"
                  />

                  {/* Existing file input (Supabase Storage) */}
                  <label className="inline-flex cursor-pointer items-center justify-center gap-2 rounded-2xl bg-accent px-4 py-3 text-sm font-medium text-white">
                    <FiUpload size={16} />{' '}
                    {uploading ? 'Uploading...' : 'Upload image'}
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) =>
                        e.target.files?.[0] && onFileChange(e.target.files[0])
                      }
                    />
                  </label>

                  
                </div>
              </div>

              <div className="flex justify-end gap-3 border-t border-gray-200 pt-5 dark:border-gray-800">
                <button
                  type="button"
                  onClick={() => setOpen(false)}
                  className="rounded-2xl border border-gray-200 px-4 py-3 text-sm dark:border-gray-800"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="rounded-2xl bg-accent px-4 py-3 text-sm font-medium text-white"
                >
                  {saving
                    ? 'Saving...'
                    : form.id
                    ? 'Save changes'
                    : 'Add media'}
                </button>
              </div>
            </form>
          </div>
        </div>
      ) : null}
    </AdminLayout>
  )
}