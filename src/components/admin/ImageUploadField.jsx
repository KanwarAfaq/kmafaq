import { useRef, useState } from 'react'
import { FiImage, FiUpload, FiX } from 'react-icons/fi'
import toast from 'react-hot-toast'
import { uploadProjectImage } from '../../lib/adminApi'
export default function ImageUploadField({ value, onChange }) {
  const inputRef = useRef(null)
  const [uploading, setUploading] = useState(false)
  async function handleFileChange(event) {
    const file = event.target.files?.[0]
    if (!file) return
    try {
      setUploading(true)
      const publicUrl = await uploadProjectImage(file)
      onChange(publicUrl)
      toast.success('Image uploaded successfully')
    } catch (error) {
      toast.error(error.message || 'Failed to upload image')
    } finally {
      setUploading(false)
      event.target.value = ''
    }
  }
  return (
    <div className="space-y-3">
      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Project image</label>
      <div className="flex flex-col gap-3 rounded-2xl border border-gray-200 bg-gray-50 p-4 dark:border-gray-800 dark:bg-gray-900">
        {value ? (
          <div className="relative overflow-hidden rounded-2xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-950">
            <img src={value} alt="Project preview" className="h-48 w-full object-cover" />
            <button type="button" onClick={() => onChange('')} className="absolute right-3 top-3 inline-flex h-9 w-9 items-center justify-center rounded-xl bg-black/60 text-white backdrop-blur"><FiX size={16} /></button>
          </div>
        ) : (
          <div className="flex h-40 items-center justify-center rounded-2xl border border-dashed border-gray-300 bg-white text-gray-400 dark:border-gray-700 dark:bg-gray-950"><div className="text-center"><FiImage size={28} className="mx-auto mb-2" /><p className="text-sm">No image selected</p></div></div>
        )}
        <div className="flex flex-col gap-3 sm:flex-row">
          <button type="button" onClick={() => inputRef.current?.click()} disabled={uploading} className="inline-flex items-center justify-center gap-2 rounded-2xl bg-accent px-4 py-3 text-sm font-medium text-white transition-all hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"><FiUpload size={16} />{uploading ? 'Uploading...' : 'Upload from device'}</button>
          <input type="url" value={value || ''} onChange={(e) => onChange(e.target.value)} placeholder="Or paste image URL" className="w-full rounded-2xl border border-gray-200 bg-white px-4 py-3 text-sm outline-none transition-all focus:border-accent dark:border-gray-800 dark:bg-gray-950 dark:text-white" />
        </div>
      </div>
      <input ref={inputRef} type="file" accept="image/*" className="hidden" onChange={handleFileChange} />
    </div>
  )
}
