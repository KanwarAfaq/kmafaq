import { supabase } from './supabase'

const CLOUDINARY_CLOUD_NAME = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME
const CLOUDINARY_UPLOAD_PRESET = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET
const IMAGE_BUCKET = 'images' // kept in case you still use Supabase storage elsewhere

// ---------- Generic row helpers ----------

export async function getRows(table, orderBy = 'created_at', ascending = false) {
  const { data, error } = await supabase
    .from(table)
    .select('*')
    .order(orderBy, { ascending })
  if (error) throw error
  return data ?? []
}

export async function insertRow(table, payload) {
  const { data, error } = await supabase
    .from(table)
    .insert([payload])
    .select()
    .single()
  if (error) throw error
  return data
}

export async function patchRow(table, id, payload) {
  const { data, error } = await supabase
    .from(table)
    .update(payload)
    .eq('id', id)
    .select()
    .single()
  if (error) throw error
  return data
}

export async function removeRow(table, id) {
  const { error } = await supabase.from(table).delete().eq('id', id)
  if (error) throw error
}

export async function patchMany(table, updates) {
  for (const item of updates) {
    const { id, ...payload } = item
    const { error } = await supabase.from(table).update(payload).eq('id', id)
    if (error) throw error
  }
  return true
}

// ---------- Dashboard & specific lists ----------

export async function getDashboardCounts() {
  const [projectsRes, socialsRes] = await Promise.all([
    supabase.from('projects').select('id', { count: 'exact', head: true }),
    supabase.from('social_links').select('id', { count: 'exact', head: true }),
  ])
  if (projectsRes.error) throw projectsRes.error
  if (socialsRes.error) throw socialsRes.error
  return { projects: projectsRes.count ?? 0, socialLinks: socialsRes.count ?? 0 }
}

export async function listProjects() {
  const { data, error } = await supabase
    .from('projects')
    .select('*')
    .order('created_at', { ascending: false })
  if (error) throw error
  return data ?? []
}

export async function listSocialLinks() {
  const { data, error } = await supabase
    .from('social_links')
    .select('*')
    .order('id', { ascending: true })
  if (error) throw error
  return data ?? []
}

export async function createSocialLink(payload) {
  const { data, error } = await supabase
    .from('social_links')
    .insert([payload])
    .select()
    .single()
  if (error) throw error
  return data
}

export async function updateSocialLink(id, payload) {
  const { data, error } = await supabase
    .from('social_links')
    .update(payload)
    .eq('id', id)
    .select()
    .single()
  if (error) throw error
  return data
}

export async function deleteSocialLink(id) {
  const { error } = await supabase.from('social_links').delete().eq('id', id)
  if (error) throw error
}

// ---------- Project helpers ----------

export async function uploadProjectImage(file) {
  // Kept for backwards compatibility if something still calls this;
  // under the hood you can redirect it to Cloudinary as well.
  const ext = file.name.split('.').pop()
  const fileName = `${Date.now()}-${Math.random()
    .toString(36)
    .slice(2)}.${ext}`
  const filePath = `projects/${fileName}`

  const { error: uploadError } = await supabase.storage
    .from(IMAGE_BUCKET)
    .upload(filePath, file, { cacheControl: '3600', upsert: false })
  if (uploadError) throw uploadError

  const { data } = supabase.storage.from(IMAGE_BUCKET).getPublicUrl(filePath)
  return data.publicUrl
}

// ---------- Cloudinary uploads (main path) ----------

export async function uploadImage(file, folder = 'portfolio/misc') {
  if (!CLOUDINARY_CLOUD_NAME || !CLOUDINARY_UPLOAD_PRESET) {
    throw new Error('Cloudinary env vars missing (cloud name or upload preset)')
  }

  const uploadUrl = `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/auto/upload`

  const formData = new FormData()
  formData.append('file', file)
  formData.append('upload_preset', CLOUDINARY_UPLOAD_PRESET)
  formData.append('folder', folder)

  const res = await fetch(uploadUrl, {
    method: 'POST',
    body: formData,
  })

  if (!res.ok) {
    const text = await res.text().catch(() => '')
    console.error('Cloudinary upload failed:', res.status, text)
    throw new Error('Cloudinary upload failed')
  }

  const data = await res.json()
  // This is the URL we will store in Supabase
  return data.secure_url
}

/**
 * Generic admin file upload helper.
 * Used by GenericResourceModal and other admin forms.
 * Internally uses Cloudinary (same as uploadImage) so everything is consistent.
 */
export async function uploadAdminFile(file, folder = 'general') {
  return uploadImage(file, folder)
}

export async function createProject(payload) {
  const { data, error } = await supabase
    .from('projects')
    .insert([payload])
    .select()
    .single()
  if (error) throw error
  return data
}

export async function updateProject(id, payload) {
  const { data, error } = await supabase
    .from('projects')
    .update(payload)
    .eq('id', id)
    .select()
    .single()
  if (error) throw error
  return data
}

export async function deleteProject(id) {
  const { error } = await supabase.from('projects').delete().eq('id', id)
  if (error) throw error
}

// ---------- Small utilities ----------

export function csvToArray(value) {
  return String(value || '')
    .split(',')
    .map((x) => x.trim())
    .filter(Boolean)
}

export function arrayToCsv(value) {
  return Array.isArray(value) ? value.join(', ') : ''
}

export function insertAroundSelection(textarea, before, after = '') {
  const start = textarea.selectionStart
  const end = textarea.selectionEnd
  const value = textarea.value
  const selected = value.slice(start, end)
  const next =
    value.slice(0, start) + before + selected + after + value.slice(end)
  const cursorStart = start + before.length
  const cursorEnd = cursorStart + selected.length
  return { next, cursorStart, cursorEnd }
}

// ---------- Graph helpers ----------

export async function fetchGraphNodes() {
  const { data, error } = await supabase
    .from('graph_nodes')
    .select('*')
    .order('created_at', { ascending: false })
  if (error) throw error
  return data ?? []
}

export async function fetchGraphEdges() {
  const { data, error } = await supabase
    .from('graph_edges')
    .select('*')
    .order('created_at', { ascending: false })
  if (error) throw error
  return data ?? []
}

export async function createGraphNode(payload) {
  const { data, error } = await supabase
    .from('graph_nodes')
    .insert([payload])
    .select()
    .single()
  if (error) throw error
  return data
}

export async function updateGraphNode(id, payload) {
  const { data, error } = await supabase
    .from('graph_nodes')
    .update(payload)
    .eq('id', id)
    .select()
    .single()
  if (error) throw error
  return data
}

export async function deleteGraphNode(id) {
  const { error } = await supabase.from('graph_nodes').delete().eq('id', id)
  if (error) throw error
}

export async function createGraphEdge(payload) {
  const { data, error } = await supabase
    .from('graph_edges')
    .insert([payload])
    .select()
    .single()
  if (error) throw error
  return data
}

export async function updateGraphEdge(id, payload) {
  const { data, error } = await supabase
    .from('graph_edges')
    .update(payload)
    .eq('id', id)
    .select()
    .single()
  if (error) throw error
  return data
}

export async function deleteGraphEdge(id) {
  const { error } = await supabase.from('graph_edges').delete().eq('id', id)
  if (error) throw error
}

// ---------- Markdown & misc ----------

export function renderMarkdown(md = '') {
  const esc = (s) =>
    String(s)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
  let html = esc(md)
  html = html.replace(/^### (.*)$/gm, '<h3>$1</h3>')
  html = html.replace(/^## (.*)$/gm, '<h2>$1</h2>')
  html = html.replace(/^# (.*)$/gm, '<h1>$1</h1>')
  html = html.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
  html = html.replace(/\*(.*?)\*/g, '<em>$1</em>')
  html = html.replace(/`([^`]+)`/g, '<code>$1</code>')
  html = html.replace(
    /\[(.*?)\]\((https?:\/\/[^\s)]+)\)/g,
    '<a href="$2" target="_blank" rel="noreferrer">$1</a>',
  )
  html = html.replace(/^- (.*)$/gm, '<li>$1</li>')
  html = html.replace(/(<li>.*<\/li>)/gs, '<ul>$1</ul>')
  html = html
    .split(/\n\n+/)
    .map((block) => {
      if (/^<h\d|^<ul>|^<li>|^<pre>|^<blockquote>/.test(block)) return block
      return `<p>${block.replace(/\n/g, '<br/>')}</p>`
    })
    .join('')
  return html
}

export function formatMessageStatus(status) {
  return String(status || 'new').replace(/_/g, ' ')
}

// ---------- Generic CRUD helpers used by AdminResourcePage ----------

export async function listRows(table, orderBy = 'id', ascending = false) {
  const { data, error } = await supabase
    .from(table)
    .select('*')
    .order(orderBy, { ascending })
  if (error) throw error
  return data ?? []
}

export async function createRow(table, payload) {
  const { data, error } = await supabase
    .from(table)
    .insert([payload])
    .select()
    .single()
  if (error) throw error
  return data
}

export async function updateRow(table, id, payload) {
  const { data, error } = await supabase
    .from(table)
    .update(payload)
    .eq('id', id)
    .select()
    .single()
  if (error) throw error
  return data
}

export async function deleteRow(table, id) {
  const { error } = await supabase.from(table).delete().eq('id', id)
  if (error) throw error
}
// Add these to src/lib/adminApi.js if they aren't already exported
export async function listPublications() {
  const { data, error } = await supabase
    .from('publications')
    .select('*')
    .order('year', { ascending: false })
  if (error) throw error
  return data || []
}

export async function listBlogs() {
  const { data, error } = await supabase
    .from('blogs')
    .select('*')
    .order('created_at', { ascending: false })
  if (error) throw error
  return data || []
}

export async function listGallery() {
  const { data, error } = await supabase
    .from('gallery')
    .select('*')
    .order('created_at', { ascending: false })
  if (error) throw error
  return data || []
}
export async function listCertifications() {
  const { data, error } = await supabase.from('certifications').select('*')
  if (error) throw error
  return data || []
}

export async function listTechnicalSkills() {
  const { data, error } = await supabase.from('technical_skills').select('*') // or your specific skills table name
  if (error) throw error
  return data || []
}

export async function listTestimonials() {
  const { data, error } = await supabase.from('testimonials').select('*')
  if (error) throw error
  return data || []
}

export async function listMessages() {
  const { data, error } = await supabase.from('messages').select('*').order('created_at', { ascending: false })
  if (error) throw error
  return data || []
}
// ---------- Table configs ----------

export const tableConfigs = {
  blogs: {
    label: 'Blogs',
    orderBy: 'created_at',
    ascending: false,
    arrayFields: ['tags'],
  },
certifications: {
  label: 'Certifications',
  orderBy: 'created_at',
  ascending: false,
  arrayFields: ['skills'],
  fileFields: ['pdf_url'],
},
  gallery: {
    label: 'Gallery',
    orderBy: 'created_at',
    ascending: false,
    fileFields: ['url'],
  },
  graph_nodes: {
    label: 'Graph Nodes',
    orderBy: 'group_id',
    ascending: true,
    pk: 'id',
    immutablePk: false,
  },
  graph_edges: {
    label: 'Graph Edges',
    orderBy: 'id',
    ascending: false,
  },
  messages: {
    label: 'Messages',
    orderBy: 'created_at',
    ascending: false,
    readOnlyCreate: true,
  },
  profile_assets: {
    label: 'Profile Assets',
    orderBy: 'updated_at',
    ascending: false,
    fileFields: ['file_url'],
  },
  publications: {
    label: 'Publications',
    orderBy: 'created_at',
    ascending: false,
    arrayFields: ['tags'],
    fileFields: ['pdf_url'], // mark PDF URL as a file field
  },
  technical_skills: {
    label: 'Technical Skills',
    orderBy: 'display_order',
    ascending: true,
  },
  testimonials: {
    label: 'Testimonials',
    orderBy: 'created_at',
    ascending: false,
    fileFields: ['image', 'avatar'],
  },
}