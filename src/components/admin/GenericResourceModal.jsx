import { useEffect, useState } from 'react'
import { FiFileText, FiPlus, FiSave, FiUpload, FiX } from 'react-icons/fi'
import toast from 'react-hot-toast'
import { tableConfigs, uploadImage } from '../../lib/adminApi'

export default function GenericResourceModal({
  open,
  onClose,
  onSubmit,
  initialData,
  loading,
  title,
  table,
  fields,
}) {
  const config = tableConfigs[table] || {}
  const [form, setForm] = useState({})
  const [uploadingField, setUploadingField] = useState('')

  useEffect(() => {
    const next = {}
    fields.forEach((field) => {
      const value = initialData?.[field.name]
      if (field.type === 'array') next[field.name] = Array.isArray(value) ? value.join(', ') : ''
      else if (field.type === 'boolean') next[field.name] = Boolean(value)
      else next[field.name] = value ?? ''
    })
    setForm(next)
  }, [fields, initialData, open])

  if (!open) return null

  function setValue(name, value) {
    setForm((prev) => ({ ...prev, [name]: value }))
  }

  async function handleUpload(field, file) {
    const fieldName = field.name
    try {
      setUploadingField(fieldName)

      const folder =
        field.folder || `${table}/${fieldName}` || 'portfolio/misc'

      const url = await uploadImage(file, folder)
      setValue(fieldName, url)
      toast.success('File uploaded successfully')
    } catch (error) {
      console.error(error)
      toast.error(error.message || 'Upload failed')
    } finally {
      setUploadingField('')
    }
  }

  function submit(e) {
    e.preventDefault()
    const payload = {}
    fields.forEach((field) => {
      const value = form[field.name]
      if (field.type === 'array') {
        payload[field.name] = String(value || '')
          .split(',')
          .map((x) => x.trim())
          .filter(Boolean)
      } else {
        payload[field.name] = value
      }
    })
    onSubmit(payload)
  }

  function isPdfField(field) {
    return field.accept?.includes('pdf') || field.name.toLowerCase().includes('pdf')
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-4 py-6 backdrop-blur-sm">
      <div className="max-h-[92vh] w-full max-w-4xl overflow-y-auto rounded-3xl border border-gray-200 bg-white shadow-2xl dark:border-gray-800 dark:bg-gray-950">
        <div className="flex items-center justify-between border-b border-gray-200 px-6 py-4 dark:border-gray-800">
          <div>
            <h3 className="text-xl font-bold text-gray-900 dark:text-white">
              {initialData ? `Edit ${title.slice(0, -1)}` : `Create ${title.slice(0, -1)}`}
            </h3>
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              Manage {title.toLowerCase()} from your admin panel.
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

        <form onSubmit={submit} className="space-y-5 px-6 py-6">
          <div className="grid gap-5 md:grid-cols-2">
            {fields.map((field) => (
              <div
                key={field.name}
                className={field.full ? 'md:col-span-2 space-y-2' : 'space-y-2'}
              >
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  {field.label || field.name}
                </label>

                {field.type === 'textarea' ? (
                  <textarea
                    rows={field.rows || 5}
                    required={field.required}
                    value={form[field.name] ?? ''}
                    onChange={(e) => setValue(field.name, e.target.value)}
                    className="w-full rounded-2xl border border-gray-200 bg-white px-4 py-3 text-sm outline-none transition-all focus:border-accent dark:border-gray-800 dark:bg-gray-900 dark:text-white"
                  />
                ) : field.type === 'boolean' ? (
                  <label className="inline-flex items-center gap-3 rounded-2xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm text-gray-700 dark:border-gray-800 dark:bg-gray-900 dark:text-gray-300">
                    <input
                      type="checkbox"
                      checked={Boolean(form[field.name])}
                      onChange={(e) => setValue(field.name, e.target.checked)}
                    />
                    {field.checkboxLabel || `Enable ${field.label || field.name}`}
                  </label>
                ) : field.type === 'file' ? (
                  <div className="space-y-3 rounded-2xl border border-gray-200 bg-gray-50 p-4 dark:border-gray-800 dark:bg-gray-900">
                    {form[field.name] ? (
                      isPdfField(field) ? (
                        <a
                          href={form[field.name]}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-3 rounded-2xl border border-dashed border-gray-300 bg-white px-4 py-4 text-sm text-gray-700 hover:border-accent hover:text-accent dark:border-gray-700 dark:bg-gray-950 dark:text-gray-300"
                        >
                          <FiFileText size={20} />
                          <span className="truncate">PDF uploaded — click to preview</span>
                        </a>
                      ) : (
                        <img
                          src={form[field.name]}
                          alt={field.name}
                          className="h-44 w-full rounded-2xl object-cover"
                        />
                      )
                    ) : null}

                    <div className="flex flex-col gap-3 sm:flex-row">
                      <label className="inline-flex cursor-pointer items-center justify-center gap-2 rounded-2xl bg-accent px-4 py-3 text-sm font-medium text-white">
                        <FiUpload size={16} />
                        {uploadingField === field.name ? 'Uploading...' : 'Upload file'}
                        <input
                          type="file"
                          className="hidden"
                          accept={field.accept || 'image/*'}
                          onChange={(e) =>
                            e.target.files?.[0] &&
                            handleUpload(field, e.target.files[0])
                          }
                        />
                      </label>

                      <input
                        type="url"
                        value={form[field.name] ?? ''}
                        onChange={(e) => setValue(field.name, e.target.value)}
                        placeholder="Paste public file URL"
                        className="w-full rounded-2xl border border-gray-200 bg-white px-4 py-3 text-sm outline-none transition-all focus:border-accent dark:border-gray-800 dark:bg-gray-950 dark:text-white"
                      />
                    </div>
                  </div>
                ) : field.type === 'select' ? (
                  <select
                    required={field.required}
                    value={form[field.name] ?? ''}
                    onChange={(e) => setValue(field.name, e.target.value)}
                    className="w-full rounded-2xl border border-gray-200 bg-white px-4 py-3 text-sm outline-none transition-all focus:border-accent dark:border-gray-800 dark:bg-gray-900 dark:text-white"
                  >
                    <option value="">Select {field.label || field.name}</option>
                    {(field.options || []).map((option) => (
                      <option
                        key={typeof option === 'string' ? option : option.value}
                        value={typeof option === 'string' ? option : option.value}
                      >
                        {typeof option === 'string' ? option : option.label}
                      </option>
                    ))}
                  </select>
                ) : field.type === 'creatable-select' ? (
                  <div className="relative">
                    <input
                      type="text"
                      list={`${field.name}-datalist-options`}
                      required={field.required}
                      value={form[field.name] ?? ''}
                      placeholder={field.placeholder || `Select or type a custom ${field.label || field.name}...`}
                      onChange={(e) => setValue(field.name, e.target.value)}
                      className="w-full rounded-2xl border border-gray-200 bg-white px-4 py-3 text-sm outline-none transition-all focus:border-accent dark:border-gray-800 dark:bg-gray-900 dark:text-white"
                    />
                    <datalist id={`${field.name}-datalist-options`}>
                      {(field.options || []).map((option) => {
                        const optValue = typeof option === 'string' ? option : option.value;
                        return <option key={optValue} value={optValue} />;
                      })}
                    </datalist>
                  </div>
                ) : (
                  <input
                    // Strictly determines the specific input rendering token type
                    type={field.inputType ? field.inputType : (field.type === 'number' ? 'number' : 'text')}
                    required={field.required}
                    value={form[field.name] ?? ''}
                    placeholder={field.placeholder || ''}
                    onChange={(e) =>
                      setValue(
                        field.name,
                        field.type === 'number' ? Number(e.target.value) : e.target.value
                      )
                    }
                    className="w-full rounded-2xl border border-gray-200 bg-white px-4 py-3 text-sm outline-none transition-all focus:border-accent dark:border-gray-800 dark:bg-gray-900 dark:text-white"
                  />
                )}
              </div>
            ))}
          </div>

          <div className="flex flex-col gap-3 border-t border-gray-200 pt-5 dark:border-gray-800 sm:flex-row sm:justify-end">
            <button
              type="button"
              onClick={onClose}
              className="inline-flex items-center justify-center gap-2 rounded-2xl border border-gray-200 px-4 py-3 text-sm font-medium text-gray-700 dark:border-gray-800 dark:text-gray-300"
            >
              <FiX size={16} /> Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="inline-flex items-center justify-center gap-2 rounded-2xl bg-accent px-4 py-3 text-sm font-medium text-white disabled:cursor-not-allowed disabled:opacity-60"
            >
              {initialData ? <FiSave size={16} /> : <FiPlus size={16} />}
              {loading ? 'Saving...' : initialData ? 'Save changes' : 'Create'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}