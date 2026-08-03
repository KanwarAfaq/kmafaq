import { useEffect, useMemo, useState } from 'react'
import { FiPlus, FiSave, FiX, FiImage } from 'react-icons/fi'
import ImageUploadField from './ImageUploadField'
import { openCloudinaryWidget } from '../../lib/cloudinaryWidget' // adjust path if needed

const initialForm = {
  title: '',
  desc_text: '',
  image: '',
  github: '',
  demo: '',
  category: '',
  featured: false,
  tags: '',
}

// Predefined lists for academic and development portfolios
const categoryOptions = [
  'Natural Language Processing',
  'Air Quality Prediction',
  'Data Collection & Automation',
  'Full Stack Development'
]

const tagSuggestions = [
  'Python', 'NLP', 'BERT', 'Transformers', 'RoBERTa', 'Deep Learning', 
  'CNN', 'LSTM', 'GRU', 'Time-Series', 'Web Scraping', 'Dataset', 
  'React', 'Tailwind CSS', 'Supabase', 'FastAPI', 'Cloudinary'
]

export default function ProjectFormModal({
  open,
  onClose,
  onSubmit,
  initialData,
  loading,
}) {
  const [form, setForm] = useState(initialForm)

  const isEdit = useMemo(() => Boolean(initialData?.id), [initialData])

  useEffect(() => {
    if (initialData) {
      setForm({
        title: initialData.title ?? '',
        desc_text: initialData.desc_text ?? '',
        image: initialData.image ?? '',
        github: initialData.github ?? '',
        demo: initialData.demo ?? '',
        category: initialData.category ?? '',
        featured: initialData.featured ?? false,
        tags: Array.isArray(initialData.tags)
          ? initialData.tags.join(', ')
          : '',
      })
    } else {
      setForm(initialForm)
    }
  }, [initialData, open])

  if (!open) return null

  function handleChange(field, value) {
    setForm((prev) => ({ ...prev, [field]: value }))
  }

  function handleSubmit(e) {
    e.preventDefault()
    onSubmit({
      ...form,
      tags: form.tags
        .split(',')
        .map((item) => item.trim())
        .filter(Boolean),
    })
  }

  function handleProjectImageUpload() {
    openCloudinaryWidget({
      folder: 'portfolio/projects',
      onSuccess: (file) => {
        handleChange('image', file.secure_url)
      },
    })
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-4 py-6 backdrop-blur-sm">
      <div className="max-h-[92vh] w-full max-w-4xl overflow-y-auto rounded-3xl border border-gray-200 bg-white shadow-2xl dark:border-gray-800 dark:bg-gray-950">
        <div className="flex items-center justify-between border-b border-gray-200 px-6 py-4 dark:border-gray-800">
          <div>
            <h3 className="text-xl font-bold text-gray-900 dark:text-white">
              {isEdit ? 'Edit project' : 'Create project'}
            </h3>
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              Manage portfolio projects with images, tags, and links.
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="inline-flex h-10 w-10 items-center justify-center rounded-2xl border border-gray-200 text-gray-500 dark:border-gray-800 dark:text-gray-300"
          >
            <FiX size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6 px-6 py-6">
          <div className="grid gap-5 md:grid-cols-2">
            <div className="space-y-2 md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Title
              </label>
              <input
                type="text"
                required
                value={form.title}
                onChange={(e) => handleChange('title', e.target.value)}
                className="w-full rounded-2xl border border-gray-200 bg-white px-4 py-3 text-sm outline-none transition-all focus:border-accent dark:border-gray-800 dark:bg-gray-900 dark:text-white"
              />
            </div>

            <div className="space-y-2 md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Description
              </label>
              <textarea
                required
                rows={5}
                value={form.desc_text}
                onChange={(e) => handleChange('desc_text', e.target.value)}
                className="w-full rounded-2xl border border-gray-200 bg-white px-4 py-3 text-sm outline-none transition-all focus:border-accent dark:border-gray-800 dark:bg-gray-900 dark:text-white"
              />
            </div>

            {/* ── SEARCHABLE/CREATABLE CATEGORY DROPDOWN ── */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Category
              </label>
              <div className="relative">
                <input
                  type="text"
                  required
                  list="project-category-options"
                  value={form.category}
                  placeholder="Select or type a custom category..."
                  onChange={(e) => handleChange('category', e.target.value)}
                  className="w-full rounded-2xl border border-gray-200 bg-white px-4 py-3 text-sm outline-none transition-all focus:border-accent dark:border-gray-800 dark:bg-gray-900 dark:text-white"
                />
                <datalist id="project-category-options">
                  {categoryOptions.map((cat) => (
                    <option key={cat} value={cat} />
                  ))}
                </datalist>
              </div>
            </div>

            {/* ── TAGS FIELD WITH AUTOCOMPLETE SUGGESTIONS ── */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Tags (Separated by commas)
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={form.tags}
                  list="project-tag-suggestions"
                  onChange={(e) => handleChange('tags', e.target.value)}
                  placeholder="e.g., NLP, BERT, Python"
                  className="w-full rounded-2xl border border-gray-200 bg-white px-4 py-3 text-sm outline-none transition-all focus:border-accent dark:border-gray-800 dark:bg-gray-900 dark:text-white"
                />
                <datalist id="project-tag-suggestions">
                  {tagSuggestions.map((tag) => (
                    <option key={tag} value={tag} />
                  ))}
                </datalist>
              </div>
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                GitHub URL
              </label>
              <input
                type="url"
                required
                value={form.github}
                onChange={(e) => handleChange('github', e.target.value)}
                className="w-full rounded-2xl border border-gray-200 bg-white px-4 py-3 text-sm outline-none transition-all focus:border-accent dark:border-gray-800 dark:bg-gray-900 dark:text-white"
              />
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Demo URL
              </label>
              <input
                type="url"
                value={form.demo}
                onChange={(e) => handleChange('demo', e.target.value)}
                className="w-full rounded-2xl border border-gray-200 bg-white px-4 py-3 text-sm outline-none transition-all focus:border-accent dark:border-gray-800 dark:bg-gray-900 dark:text-white"
              />
            </div>

            <div className="md:col-span-2 space-y-3">
              <ImageUploadField
                value={form.image}
                onChange={(val) => handleChange('image', val)}
              />

              
            </div>

            <div className="md:col-span-2">
              <label className="inline-flex items-center gap-3 rounded-2xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm text-gray-700 dark:border-gray-800 dark:bg-gray-900 dark:text-gray-300">
                <input
                  type="checkbox"
                  checked={form.featured}
                  onChange={(e) => handleChange('featured', e.target.checked)}
                  className="h-4 w-4 rounded border-gray-300 text-accent focus:ring-accent"
                />
                Mark as featured project
              </label>
            </div>
          </div>

          <div className="flex flex-col gap-3 border-t border-gray-200 pt-5 dark:border-gray-800 sm:flex-row sm:justify-end">
            <button
              type="button"
              onClick={onClose}
              className="inline-flex items-center justify-center gap-2 rounded-2xl border border-gray-200 px-4 py-3 text-sm font-medium text-gray-700 dark:border-gray-800 dark:text-gray-300"
            >
              <FiX size={16} />
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="inline-flex items-center justify-center gap-2 rounded-2xl bg-accent px-4 py-3 text-sm font-medium text-white disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isEdit ? <FiSave size={16} /> : <FiPlus size={16} />}
              {loading
                ? 'Saving...'
                : isEdit
                ? 'Save changes'
                : 'Create project'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}