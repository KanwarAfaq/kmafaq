import { useEffect, useMemo, useState } from 'react'
import { openCloudinaryWidget } from '../../lib/cloudinaryWidget'
import { FiEdit2, FiExternalLink, FiGithub, FiPlus, FiSearch, FiStar, FiTrash2 } from 'react-icons/fi'
import toast from 'react-hot-toast'
import AdminLayout from '../../components/admin/AdminLayout'
import AdminHeader from '../../components/admin/AdminHeader'
import AdminEmptyState from '../../components/admin/AdminEmptyState'
import ProjectFormModal from '../../components/admin/ProjectFormModal'
import { createProject, deleteProject, listProjects, updateProject } from '../../lib/adminApi'
export default function ProjectsAdmin() {
  const [projects, setProjects] = useState([])
  const [search, setSearch] = useState('')
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [modalOpen, setModalOpen] = useState(false)
  const [editing, setEditing] = useState(null)
  async function loadProjects() {
    try { setLoading(true); const data = await listProjects(); setProjects(data) } catch (error) { toast.error(error.message || 'Failed to load projects') } finally { setLoading(false) }
  }
  useEffect(() => { loadProjects() }, [])
  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase()
    if (!q) return projects
    return projects.filter((item) => [item.title, item.category, item.desc_text, ...(item.tags || [])].filter(Boolean).join(' ').toLowerCase().includes(q))
  }, [projects, search])
  async function handleSubmit(payload) {
    try {
      setSaving(true)
      if (editing?.id) { await updateProject(editing.id, payload); toast.success('Project updated') }
      else { await createProject(payload); toast.success('Project created') }
      setModalOpen(false)
      setEditing(null)
      loadProjects()
    } catch (error) { toast.error(error.message || 'Failed to save project') } finally { setSaving(false) }
  }
  async function handleDelete(id) {
    const confirmed = window.confirm('Delete this project? This action cannot be undone.')
    if (!confirmed) return
    try { await deleteProject(id); toast.success('Project deleted'); loadProjects() } catch (error) { toast.error(error.message || 'Failed to delete project') }
  }
  return (
    <AdminLayout>
      <AdminHeader title="Projects" subtitle="Create, edit, feature, and upload project content." />
      <div className="space-y-6 px-5 py-6 lg:px-8">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between"><div className="relative w-full max-w-md"><FiSearch size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" /><input type="text" value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search projects..." className="w-full rounded-2xl border border-gray-200 bg-white py-3 pl-11 pr-4 text-sm outline-none transition-all focus:border-accent dark:border-gray-800 dark:bg-gray-900 dark:text-white" /></div><button type="button" onClick={() => { setEditing(null); setModalOpen(true) }} className="inline-flex items-center justify-center gap-2 rounded-2xl bg-accent px-4 py-3 text-sm font-medium text-white"><FiPlus size={16} />New project</button></div>
        {loading ? <div className="rounded-3xl border border-gray-200 bg-white p-8 text-sm text-gray-500 dark:border-gray-800 dark:bg-gray-900 dark:text-gray-400">Loading projects...</div> : filtered.length === 0 ? <AdminEmptyState title="No projects found" text="Create your first project or change the search term to see more results." action={<button type="button" onClick={() => { setEditing(null); setModalOpen(true) }} className="inline-flex items-center gap-2 rounded-2xl bg-accent px-4 py-3 text-sm font-medium text-white"><FiPlus size={16} />Create project</button>} /> : <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">{filtered.map((project) => <div key={project.id} className="overflow-hidden rounded-3xl border border-gray-200 bg-white shadow-sm dark:border-gray-800 dark:bg-gray-900"><div className="relative h-52 bg-gray-100 dark:bg-gray-950">{project.image ? <img src={project.image} alt={project.title} className="h-full w-full object-cover" /> : null}<div className="absolute left-3 top-3 flex gap-2"><span className="rounded-full bg-black/60 px-3 py-1 text-[11px] font-semibold text-white backdrop-blur">{project.category}</span>{project.featured ? <span className="inline-flex items-center gap-1 rounded-full bg-accent px-3 py-1 text-[11px] font-semibold text-white"><FiStar size={11} /> Featured</span> : null}</div></div><div className="space-y-4 p-5"><div><h3 className="text-lg font-semibold text-gray-900 dark:text-white">{project.title}</h3><p className="mt-2 line-clamp-3 text-sm leading-6 text-gray-500 dark:text-gray-400">{project.desc_text}</p></div><div className="flex flex-wrap gap-2">{(project.tags || []).map((tag) => <span key={tag} className="rounded-full bg-gray-100 px-2.5 py-1 text-[11px] font-medium text-gray-600 dark:bg-gray-950 dark:text-gray-300">{tag}</span>)}</div><div className="flex items-center gap-3 text-sm text-gray-500 dark:text-gray-400">{project.github ? <a href={project.github} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 hover:text-accent"><FiGithub size={14} /> GitHub</a> : null}{project.demo ? <a href={project.demo} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 hover:text-accent"><FiExternalLink size={14} /> Demo</a> : null}</div><div className="flex gap-3 border-t border-gray-200 pt-4 dark:border-gray-800"><button type="button" onClick={() => { setEditing(project); setModalOpen(true) }} className="inline-flex flex-1 items-center justify-center gap-2 rounded-2xl border border-gray-200 px-3 py-2.5 text-sm font-medium text-gray-700 dark:border-gray-800 dark:text-gray-300"><FiEdit2 size={15} /> Edit</button><button type="button" onClick={() => handleDelete(project.id)} className="inline-flex flex-1 items-center justify-center gap-2 rounded-2xl border border-red-200 px-3 py-2.5 text-sm font-medium text-red-500 dark:border-red-500/30"><FiTrash2 size={15} /> Delete</button></div></div></div>)}</div>}
      </div>
      <ProjectFormModal open={modalOpen} onClose={() => { setModalOpen(false); setEditing(null) }} onSubmit={handleSubmit} initialData={editing} loading={saving} />
    </AdminLayout>
  )
}
async function handleProjectImageUpload(project) {
  openCloudinaryWidget({
    folder: 'portfolio/projects',
    onSuccess: async (file) => {
      try {
        const { error } = await supabase
          .from('projects')
          .update({
            image: file.secure_url,
            cloudinary_public_id: file.public_id, // optional extra column
          })
          .eq('id', project.id)

        if (error) {
          console.error(error)
          toast.error(error.message || 'Failed to save project image')
        } else {
          toast.success('Project image updated')
          // Optionally refresh the projects list
          // await fetchProjects()
        }
      } catch (err) {
        console.error(err)
        toast.error('Unexpected error while updating project')
      }
    },
  })
}