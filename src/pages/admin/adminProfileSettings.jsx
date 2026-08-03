import { useEffect, useState } from 'react'
import { FiSave, FiRefreshCw, FiUser, FiImage, FiLink, FiMail, FiBarChart2 } from 'react-icons/fi'
import toast from 'react-hot-toast'
import AdminLayout from '../../components/admin/AdminLayout'
import AdminHeader from '../../components/admin/AdminHeader'
import { getProfileSettings, upsertProfileSettings } from '../../lib/profileApi'
import { uploadImage } from '../../lib/adminApi'

const initialState = {
  id: null,
  full_name: '',
  short_name: '',
  hero_tagline: '',
  hero_subtitle: '',
  about_title: 'About Me',
  about_subtitle: '',
  about_badge: '',
  bio_paragraph_1: '',
  bio_paragraph_2: '',
  bio_paragraph_3: '',
  profile_image_url: '',
  about_image_url: '',
  cv_url: '',
  email: '',
  location: '',
  github_url: '',
  linkedin_url: '',
  scholar_url: '',
  kaggle_url: '',
  papers_count: 0,
  projects_count: 0,
  datasets_count: 0,
  repos_count: 0,
  formspree_endpoint: '',
}

function Field({
  label,
  name,
  value,
  onChange,
  type = 'text',
  textarea = false,
  placeholder = '',
}) {
  return (
    <label className="block">
      <span className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
        {label}
      </span>
      {textarea ? (
        <textarea
          name={name}
          value={value || ''}
          onChange={onChange}
          rows={4}
          placeholder={placeholder}
          className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm text-gray-900 outline-none focus:border-accent dark:border-gray-700 dark:bg-gray-900 dark:text-white"
        />
      ) : (
        <input
          type={type}
          name={name}
          value={value || ''}
          onChange={onChange}
          placeholder={placeholder}
          className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm text-gray-900 outline-none focus:border-accent dark:border-gray-700 dark:bg-gray-900 dark:text-white"
        />
      )}
    </label>
  )
}

export default function AdminProfileSettings() {
  const [form, setForm] = useState(initialState)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  const load = async () => {
    try {
      setLoading(true)
      const data = await getProfileSettings()
      if (data) setForm({ ...initialState, ...data })
    } catch (err) {
      toast.error(err.message || 'Failed to load profile settings')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    load()
  }, [])

  const onChange = (e) => {
    const { name, value } = e.target
    setForm((prev) => ({ ...prev, [name]: value }))
  }

  const onSubmit = async (e) => {
    e.preventDefault()
    try {
      setSaving(true)
      const saved = await upsertProfileSettings(form)
      setForm((prev) => ({ ...prev, ...saved }))
      toast.success('Profile settings saved')
    } catch (err) {
      toast.error(err.message || 'Failed to save profile settings')
    } finally {
      setSaving(false)
    }
  }

  const handleProfileImageFile = async (file) => {
    try {
      const url = await uploadImage(file, 'profile/images')
      setForm((prev) => ({ ...prev, profile_image_url: url }))
      toast.success('Profile image uploaded')
    } catch (err) {
      console.error(err)
      toast.error(err.message || 'Failed to upload profile image')
    }
  }

  const handleAboutImageFile = async (file) => {
    try {
      const url = await uploadImage(file, 'profile/about')
      setForm((prev) => ({ ...prev, about_image_url: url }))
      toast.success('About image uploaded')
    } catch (err) {
      console.error(err)
      toast.error(err.message || 'Failed to upload about image')
    }
  }

  const handleCvFile = async (file) => {
    try {
      const url = await uploadImage(file, 'profile/cv')
      setForm((prev) => ({ ...prev, cv_url: url }))
      toast.success('CV uploaded')
    } catch (err) {
      console.error(err)
      toast.error(err.message || 'Failed to upload CV')
    }
  }

  return (
    <AdminLayout>
      <AdminHeader
        title="Profile Settings"
        subtitle="Manage hero image, about content, stats, contact info, and social links."
      />

      <div className="space-y-6">
        <div className="mx-auto max-w-6xl">
          <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
            <div>
              <h1 className="text-3xl font-black text-gray-900 dark:text-white">
                Dynamic Profile Settings
              </h1>
              <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                Manage hero image, about content, stats, contact info, and social
                links.
              </p>
            </div>
            <button
              onClick={load}
              className="inline-flex items-center gap-2 rounded-xl border border-gray-200 px-4 py-2 text-sm text-gray-600 hover:border-accent hover:text-accent dark:border-gray-700 dark:text-gray-300"
            >
              <FiRefreshCw /> Refresh
            </button>
          </div>

          {loading ? (
            <div className="rounded-3xl border border-gray-200 bg-white p-8 text-gray-500 dark:border-gray-800 dark:bg-gray-900 dark:text-gray-400">
              Loading profile settings...
            </div>
          ) : (
            <form onSubmit={onSubmit} className="space-y-8">
              {/* Identity */}
              <section className="rounded-3xl border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-gray-900 md:p-8">
                <div className="mb-6 flex items-center gap-3">
                  <FiUser className="text-accent" />
                  <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                    Identity
                  </h2>
                </div>
                <div className="grid gap-5 md:grid-cols-2">
                  <Field
                    label="Full name"
                    name="full_name"
                    value={form.full_name}
                    onChange={onChange}
                  />
                  <Field
                    label="Short name"
                    name="short_name"
                    value={form.short_name}
                    onChange={onChange}
                  />
                  <Field
                    label="Hero tagline"
                    name="hero_tagline"
                    value={form.hero_tagline}
                    onChange={onChange}
                  />
                  <Field
                    label="Hero subtitle"
                    name="hero_subtitle"
                    value={form.hero_subtitle}
                    onChange={onChange}
                  />
                  <Field
                    label="About title"
                    name="about_title"
                    value={form.about_title}
                    onChange={onChange}
                  />
                  <Field
                    label="About subtitle"
                    name="about_subtitle"
                    value={form.about_subtitle}
                    onChange={onChange}
                  />
                  <Field
                    label="About badge"
                    name="about_badge"
                    value={form.about_badge}
                    onChange={onChange}
                  />
                  <div className="space-y-2">
                    <Field
                      label="CV URL"
                      name="cv_url"
                      value={form.cv_url}
                      onChange={onChange}
                    />
                    <label className="inline-flex cursor-pointer items-center gap-2 rounded-xl bg-accent px-4 py-2 text-xs font-medium text-white">
                      Upload CV (PDF)
                      <input
                        type="file"
                        accept="application/pdf"
                        className="hidden"
                        onChange={(e) =>
                          e.target.files?.[0] && handleCvFile(e.target.files[0])
                        }
                      />
                    </label>
                  </div>
                </div>
              </section>

              {/* Images and bio */}
              <section className="rounded-3xl border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-gray-900 md:p-8">
                <div className="mb-6 flex items-center gap-3">
                  <FiImage className="text-accent" />
                  <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                    Images and bio
                  </h2>
                </div>

                <div className="mb-5 grid gap-5 md:grid-cols-2">
                  <div className="space-y-2">
                    <Field
                      label="Profile image URL"
                      name="profile_image_url"
                      value={form.profile_image_url}
                      onChange={onChange}
                    />
                    <label className="inline-flex cursor-pointer items-center gap-2 rounded-xl bg-accent px-4 py-2 text-xs font-medium text-white">
                      Upload profile image
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={(e) =>
                          e.target.files?.[0] &&
                          handleProfileImageFile(e.target.files[0])
                        }
                      />
                    </label>
                  </div>

                  <div className="space-y-2">
                    <Field
                      label="About image URL"
                      name="about_image_url"
                      value={form.about_image_url}
                      onChange={onChange}
                    />
                    <label className="inline-flex cursor-pointer items-center gap-2 rounded-xl bg-accent px-4 py-2 text-xs font-medium text-white">
                      Upload about image
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={(e) =>
                          e.target.files?.[0] &&
                          handleAboutImageFile(e.target.files[0])
                        }
                      />
                    </label>
                  </div>
                </div>

                <div className="mb-5 grid gap-6 md:grid-cols-2">
                  <div className="rounded-2xl border border-gray-200 bg-gray-50 p-4 dark:border-gray-700 dark:bg-gray-800">
                    <p className="mb-3 text-xs uppercase tracking-widest text-gray-400">
                      Profile preview
                    </p>
                    {form.profile_image_url ? (
                      <img
                        src={form.profile_image_url}
                        alt="Profile preview"
                        className="h-32 w-32 rounded-2xl border border-gray-200 object-cover dark:border-gray-700"
                      />
                    ) : (
                      <div className="h-32 w-32 rounded-2xl bg-gray-200 dark:bg-gray-700" />
                    )}
                  </div>
                  <div className="rounded-2xl border border-gray-200 bg-gray-50 p-4 dark:border-gray-700 dark:bg-gray-800">
                    <p className="mb-3 text-xs uppercase tracking-widest text-gray-400">
                      About preview
                    </p>
                    {form.about_image_url ? (
                      <img
                        src={form.about_image_url}
                        alt="About preview"
                        className="h-32 w-32 rounded-2xl border border-gray-200 object-cover dark:border-gray-700"
                      />
                    ) : (
                      <div className="h-32 w-32 rounded-2xl bg-gray-200 dark:bg-gray-700" />
                    )}
                  </div>
                </div>

                <div className="space-y-5">
                  <Field
                    label="Bio paragraph 1"
                    name="bio_paragraph_1"
                    value={form.bio_paragraph_1}
                    onChange={onChange}
                    textarea
                  />
                  <Field
                    label="Bio paragraph 2"
                    name="bio_paragraph_2"
                    value={form.bio_paragraph_2}
                    onChange={onChange}
                    textarea
                  />
                  <Field
                    label="Bio paragraph 3"
                    name="bio_paragraph_3"
                    value={form.bio_paragraph_3}
                    onChange={onChange}
                    textarea
                  />
                </div>
              </section>

              {/* Contact */}
              <section className="rounded-3xl border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-gray-900 md:p-8">
                <div className="mb-6 flex items-center gap-3">
                  <FiMail className="text-accent" />
                  <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                    Contact
                  </h2>
                </div>
                <div className="grid gap-5 md:grid-cols-2">
                  <Field
                    label="Email"
                    name="email"
                    value={form.email}
                    onChange={onChange}
                  />
                  <Field
                    label="Location"
                    name="location"
                    value={form.location}
                    onChange={onChange}
                  />
                  <Field
                    label="Formspree endpoint"
                    name="formspree_endpoint"
                    value={form.formspree_endpoint}
                    onChange={onChange}
                  />
                </div>
              </section>

              {/* Social links */}
              <section className="rounded-3xl border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-gray-900 md:p-8">
                <div className="mb-6 flex items-center gap-3">
                  <FiLink className="text-accent" />
                  <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                    Social links
                  </h2>
                </div>
                <div className="grid gap-5 md:grid-cols-2">
                  <Field
                    label="GitHub URL"
                    name="github_url"
                    value={form.github_url}
                    onChange={onChange}
                  />
                  <Field
                    label="LinkedIn URL"
                    name="linkedin_url"
                    value={form.linkedin_url}
                    onChange={onChange}
                  />
                  <Field
                    label="Google Scholar URL"
                    name="scholar_url"
                    value={form.scholar_url}
                    onChange={onChange}
                  />
                  <Field
                    label="Kaggle URL"
                    name="kaggle_url"
                    value={form.kaggle_url}
                    onChange={onChange}
                  />
                </div>
              </section>

              {/* Stats */}
              <section className="rounded-3xl border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-gray-900 md:p-8">
                <div className="mb-6 flex items-center gap-3">
                  <FiBarChart2 className="text-accent" />
                  <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                    Stats
                  </h2>
                </div>
                <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
                  <Field
                    label="Research papers"
                    name="papers_count"
                    type="number"
                    value={form.papers_count}
                    onChange={onChange}
                  />
                  <Field
                    label="Projects"
                    name="projects_count"
                    type="number"
                    value={form.projects_count}
                    onChange={onChange}
                  />
                  <Field
                    label="Datasets"
                    name="datasets_count"
                    type="number"
                    value={form.datasets_count}
                    onChange={onChange}
                  />
                  <Field
                    label="GitHub repos"
                    name="repos_count"
                    type="number"
                    value={form.repos_count}
                    onChange={onChange}
                  />
                </div>
              </section>

              <div className="flex justify-end">
                <button
                  type="submit"
                  disabled={saving}
                  className="inline-flex items-center gap-2 rounded-xl bg-accent px-5 py-3 font-semibold text-white hover:opacity-90 disabled:opacity-60"
                >
                  <FiSave /> {saving ? 'Saving...' : 'Save profile settings'}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </AdminLayout>
  )
}