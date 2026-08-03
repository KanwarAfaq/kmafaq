import { useEffect, useMemo, useState } from 'react'
import { FiEye, FiSearch, FiX } from 'react-icons/fi'
import toast from 'react-hot-toast'
import AdminLayout from '../../components/admin/AdminLayout'
import AdminHeader from '../../components/admin/AdminHeader'
import AdminShellCard from '../../components/admin/AdminShellCard'
import StatPill from '../../components/admin/StatPill'
import ReactQuill from 'react-quill-new'
import 'react-quill-new/dist/quill.snow.css'
import { arrayToCsv, csvToArray, getRows, insertRow, patchRow, removeRow } from '../../lib/adminApi'

const emptyForm = { slug: '', title: '', date: '', read_time: '', excerpt: '', content: '', tags: '' }

// ── Dropdown preset arrays ──
const readTimeOptions = [
  '2 min read', '3 min read', '4 min read', '5 min read', 
  '6 min read', '7 min read', '8 min read', '10 min read', '12 min read'
]

const tagSuggestions = [
  'Natural Language Processing', 'NLP', 'BERT', 'Transformers', 'RoBERTa', 
  'Sentiment Analysis', 'Deep Learning', 'Machine Learning', 'Python', 
  'Air Quality', 'PM2.5', 'Time-Series', 'Data Automation', 'Web Scraping'
]

export default function BlogsAdminV5() {
  const [rows, setRows] = useState([])
  const [selected, setSelected] = useState(null)
  const [view, setView] = useState('list') // 'list' or 'preview'
  const [open, setOpen] = useState(false)
  const [saving, setSaving] = useState(false)
  const [search, setSearch] = useState('')
  const [form, setForm] = useState(emptyForm)

  async function loadData() {
    try {
      const data = await getRows('blogs', 'created_at', false)
      setRows(data)
      if (!selected && data[0]) setSelected(data[0])
    } catch (error) {
      toast.error(error.message || 'Failed to load blogs')
    }
  }

  useEffect(() => { loadData() }, [])

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase()
    if (!q) return rows
    return rows.filter((item) => [item.title, item.slug, item.excerpt, ...(item.tags || [])].join(' ').toLowerCase().includes(q))
  }, [rows, search])

  function startCreate() { setForm(emptyForm); setOpen(true) }
  function startEdit(item) { setForm({ ...item, tags: arrayToCsv(item.tags) }); setOpen(true) }

  function handleTitleChange(value) {
    setForm((p) => {
      const generatedSlug = value
        .toLowerCase()
        .replace(/[^a-z0-9\s-]/g, '')
        .replace(/\s+/g, '-')
        .replace(/-+/g, '-')
        .trim();
      
      return { ...p, title: value, slug: p.id ? p.slug : generatedSlug }
    })
  }

  async function submit(e) {
    e.preventDefault()
    try {
      setSaving(true)
      
      const cleanTagsArray = typeof form.tags === 'string'
        ? form.tags
            .split(',')
            .map((item) => item.replace(/["'{}]/g, '').trim())
            .filter(Boolean)
        : csvToArray(form.tags);

      const payload = { ...form, tags: cleanTagsArray }
      if (form.id) {
        await patchRow('blogs', form.id, payload)
        toast.success('Blog updated')
      } else {
        await insertRow('blogs', payload)
        toast.success('Blog created')
      }
      setOpen(false)
      setForm(emptyForm)
      loadData()
    } catch (error) {
      toast.error(error.message || 'Failed to save blog')
    } finally {
      setSaving(false)
    }
  }

  async function handleDelete(id) {
    if (!window.confirm('Delete this blog post?')) return
    try {
      await removeRow('blogs', id)
      toast.success('Blog deleted')
      if (selected?.id === id) setSelected(null)
      loadData()
    } catch (error) {
      toast.error(error.message || 'Failed to delete blog')
    }
  }

  function handleOpenPreview(item) {
    setSelected(item)
    setView('preview')
  }

  return (
    <AdminLayout>
      <AdminHeader title="Blogs" subtitle="Rich text editor for blog posts." />

      {/* CONDITIONAL VIEW: FULL-SCREEN PREVIEW OR EDITORIAL LIST */}
      {view === 'preview' && selected ? (
        <div className="space-y-6 px-5 py-6 lg:px-8 max-w-4xl mx-auto w-full">
          <button
            type="button"
            onClick={() => setView('list')}
            className="flex items-center gap-2 rounded-2xl border border-gray-200 bg-white px-4 py-2.5 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 dark:border-gray-800 dark:bg-gray-900 dark:text-gray-200 dark:hover:bg-gray-800 transition-colors"
          >
            ← Back to library
          </button>

          <div className="bg-white dark:bg-gray-950 rounded-3xl border border-gray-200 dark:border-gray-800 p-6 md:p-10 space-y-6 shadow-xl">
            <div className="space-y-2">
              <p className="text-sm text-gray-500 font-mono">{selected.date} · {selected.read_time}</p>
              <h1 className="text-2xl md:text-4xl font-extrabold text-gray-900 dark:text-white break-words leading-tight">
                {selected.title}
              </h1>
              <p className="text-base text-gray-600 dark:text-gray-400 break-words">
                {selected.excerpt}
              </p>
            </div>

            <div className="flex flex-wrap gap-2">
              {(selected.tags || []).map((tag) => (
                <span key={tag} className="rounded-full bg-accent/10 px-3 py-1 text-xs font-medium text-accent">
                  {tag}
                </span>
              ))}
            </div>

            <hr className="border-gray-200 dark:border-gray-800" />

            {/* Fully Quarantined Scrollable Content Area */}
            <div className="w-full max-w-full overflow-x-auto">
              <article 
                className="prose prose-base max-w-none dark:prose-invert break-words prose-img:max-w-full prose-img:h-auto prose-table:w-full" 
                dangerouslySetInnerHTML={{ __html: selected.content || '' }} 
              />
            </div>
          </div>
        </div>
      ) : (
        /* STANDARD EDITORIAL LIST VIEW */
        <div className="space-y-6 px-5 py-6 lg:px-8">
          <div className="grid gap-4 md:grid-cols-3">
            <StatPill label="Posts" value={rows.length} />
            <StatPill label="Tagged" value={rows.filter((r) => (r.tags || []).length > 0).length} />
            <StatPill label="Total library" value={rows.length} />
          </div>

          <AdminShellCard
            title="Editorial library"
            subtitle="Search posts and open them inside the editor or view their full preview."
            actions={[
              <div key="search" className="relative min-w-[240px]">
                <FiSearch size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search posts" className="w-full rounded-2xl border border-gray-200 bg-white py-3 pl-11 pr-4 text-sm outline-none focus:border-accent dark:border-gray-800 dark:bg-gray-950 dark:text-white" />
              </div>,
              <button key="new" type="button" onClick={startCreate} className="rounded-2xl bg-accent px-4 py-3 text-sm font-medium text-white shadow-md hover:opacity-95 transition-opacity">New post</button>,
            ]}
          >
            <div className="space-y-4">
              {filtered.map((item) => (
                <div key={item.id} className="rounded-3xl border border-gray-200 bg-white p-5 transition-all dark:border-gray-800 dark:bg-gray-950 hover:shadow-md">
                  <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                    <div className="space-y-3">
                      <div className="flex flex-wrap gap-2 text-xs text-gray-500">
                        <span className="rounded-full bg-gray-100 px-3 py-1 dark:bg-gray-800">{item.date}</span>
                        <span className="rounded-full bg-gray-100 px-3 py-1 dark:bg-gray-800">{item.read_time}</span>
                        <span className="rounded-full bg-accent/10 px-3 py-1 text-accent font-medium">HTML</span>
                      </div>
                      <div>
                        <h4 className="text-lg font-semibold text-gray-900 dark:text-white break-words">{item.title}</h4>
                        <p className="mt-2 line-clamp-2 text-sm text-gray-600 dark:text-gray-400 break-words">{item.excerpt}</p>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {(item.tags || []).map((tag) => (
                          <span key={tag} className="rounded-full border border-gray-200 px-3 py-1 text-xs text-gray-600 dark:border-gray-700 dark:text-gray-300">
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>
                    <div className="flex flex-wrap gap-2 lg:justify-end items-center">
                      <button type="button" onClick={() => handleOpenPreview(item)} className="rounded-2xl border border-gray-200 px-4 py-2 text-sm font-medium hover:bg-gray-50 dark:border-gray-800 dark:hover:bg-gray-900 transition-colors">Preview</button>
                      <button type="button" onClick={() => startEdit(item)} className="rounded-2xl border border-gray-200 px-4 py-2 text-sm font-medium hover:bg-gray-50 dark:border-gray-800 dark:hover:bg-gray-900 transition-colors">Edit</button>
                      <button type="button" onClick={() => handleDelete(item.id)} className="rounded-2xl border border-red-200 px-4 py-2 text-sm font-medium text-red-500 hover:bg-red-50 dark:border-red-500/30 dark:hover:bg-red-950/30 transition-colors">Delete</button>
                    </div>
                  </div>
                </div>
              ))}
              {filtered.length === 0 && (
                <p className="text-sm text-gray-500 dark:text-gray-400 py-8 text-center">No blog posts found.</p>
              )}
            </div>
          </AdminShellCard>
        </div>
      )}

      {/* CREATE / EDIT MODAL */}
      {open ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-4 py-6 backdrop-blur-sm">
          <div className="max-h-[92vh] w-full max-w-7xl overflow-y-auto rounded-[32px] border border-gray-200 bg-white shadow-2xl dark:border-gray-800 dark:bg-gray-950">
            <div className="flex items-center justify-between border-b border-gray-200 px-6 py-5 dark:border-gray-800">
              <div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white">{form.id ? 'Edit post' : 'Create post'}</h3>
                <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">Use the visual editor to style your text.</p>
              </div>
              <button type="button" onClick={() => setOpen(false)} className="rounded-2xl border border-gray-200 p-3 dark:border-gray-800"><FiX size={18} /></button>
            </div>
            <form onSubmit={submit} className="space-y-5 px-6 py-6">
              <div className="grid gap-5 md:grid-cols-2">
                
                <input value={form.title} onChange={(e) => handleTitleChange(e.target.value)} placeholder="Post title" className="rounded-2xl border border-gray-200 px-4 py-3 text-sm md:col-span-2 dark:border-gray-800 dark:bg-gray-900 dark:text-white" required />
                
                <input value={form.slug} onChange={(e) => setForm((p) => ({ ...p, slug: e.target.value }))} placeholder="URL Slug (e.g. nlp-model-evaluation)" className="rounded-2xl border border-gray-200 px-4 py-3 text-sm dark:border-gray-800 dark:bg-gray-900 dark:text-white" required />
                
                <input type="date" value={form.date} onChange={(e) => setForm((p) => ({ ...p, date: e.target.value }))} className="rounded-2xl border border-gray-200 px-4 py-3 text-sm dark:border-gray-800 dark:bg-gray-900 dark:text-white w-full" required />
                
                <select value={form.read_time} onChange={(e) => setForm((p) => ({ ...p, read_time: e.target.value }))} className="rounded-2xl border border-gray-200 px-4 py-3 text-sm dark:border-gray-800 dark:bg-gray-900 dark:text-white w-full outline-none" required>
                  <option value="" disabled>-- Select Read Time --</option>
                  {readTimeOptions.map((opt) => (
                    <option key={opt} value={opt}>{opt}</option>
                  ))}
                </select>
                
                <div className="md:col-span-2 relative">
                  <input value={form.tags} list="blog-admin-tag-datalist" onChange={(e) => setForm((p) => ({ ...p, tags: e.target.value }))} placeholder="Tags (separated by commas: NLP, BERT, Python)" className="w-full rounded-2xl border border-gray-200 px-4 py-3 text-sm dark:border-gray-800 dark:bg-gray-900 dark:text-white" />
                  <datalist id="blog-admin-tag-datalist">
                    {tagSuggestions.map((tag) => (
                      <option key={tag} value={tag} />
                    ))}
                  </datalist>
                </div>

                <textarea rows="3" value={form.excerpt} onChange={(e) => setForm((p) => ({ ...p, excerpt: e.target.value }))} placeholder="Excerpt" className="rounded-2xl border border-gray-200 px-4 py-3 text-sm md:col-span-2 dark:border-gray-800 dark:bg-gray-900 dark:text-white" required />
                
                <div className="col-span-1 md:col-span-2 bg-white dark:bg-gray-900 rounded-2xl overflow-hidden border border-gray-200 dark:border-gray-800">
                  <ReactQuill 
                    theme="snow" 
                    value={form.content} 
                    onChange={(content) => {
                      setForm((p) => ({ ...p, content: content }))
                    }}
                    className="min-h-[300px]"
                    modules={{
                      toolbar: [
                        [{ 'header': [1, 2, 3, false] }],
                        ['bold', 'italic', 'underline', 'strike'],
                        [{ 'list': 'ordered'}, { 'list': 'bullet' }],
                        ['link', 'image'],
                        ['clean']
                      ]
                    }}
                  />
                </div>
              </div>
              
              <div className="flex justify-end gap-3 border-t border-gray-200 pt-5 dark:border-gray-800">
                <button type="button" onClick={() => setOpen(false)} className="rounded-2xl border border-gray-200 px-4 py-3 text-sm dark:border-gray-800">Cancel</button>
                <button type="submit" disabled={saving} className="rounded-2xl bg-accent px-4 py-3 text-sm font-medium text-white">{saving ? 'Saving...' : form.id ? 'Save changes' : 'Create post'}</button>
              </div>
            </form>
          </div>
        </div>
      ) : null}
    </AdminLayout>
  )
}