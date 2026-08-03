import { supabase } from './supabase'

const IMAGE_BUCKET = 'images'

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
  const { data, error } = await supabase.from('projects').select('*').order('created_at', { ascending: false })
  if (error) throw error
  return data ?? []
}
export async function listSocialLinks() {
  const { data, error } = await supabase.from('social_links').select('*').order('id', { ascending: true })
  if (error) throw error
  return data ?? []
}
export async function createSocialLink(payload) {
  const { data, error } = await supabase.from('social_links').insert([payload]).select().single()
  if (error) throw error
  return data
}

export async function updateSocialLink(id, payload) {
  const { data, error } = await supabase.from('social_links').update(payload).eq('id', id).select().single()
  if (error) throw error
  return data
}

export async function deleteSocialLink(id) {
  const { error } = await supabase.from('social_links').delete().eq('id', id)
  if (error) throw error
}
export async function uploadProjectImage(file) {
  const ext = file.name.split('.').pop()
  const fileName = `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`
  const filePath = `projects/${fileName}`
  const { error: uploadError } = await supabase.storage.from(IMAGE_BUCKET).upload(filePath, file, { cacheControl: '3600', upsert: false })
  if (uploadError) throw uploadError
  const { data } = supabase.storage.from(IMAGE_BUCKET).getPublicUrl(filePath)
  return data.publicUrl
}
export async function createProject(payload) {
  const { data, error } = await supabase.from('projects').insert([payload]).select().single()
  if (error) throw error
  return data
}
export async function updateProject(id, payload) {
  const { data, error } = await supabase.from('projects').update(payload).eq('id', id).select().single()
  if (error) throw error
  return data
}

export async function deleteProject(id) {
  const { error } = await supabase.from('projects').delete().eq('id', id)
  if (error) throw error
}
export async function listRows(table, orderBy = 'id', ascending = false) {
  const { data, error } = await supabase.from(table).select('*').order(orderBy, { ascending })
  if (error) throw error
  return data ?? []
}

export async function createRow(table, payload) {
  const { data, error } = await supabase.from(table).insert([payload]).select().single()
  if (error) throw error
  return data
}

export async function updateRow(table, id, payload) {
  const { data, error } = await supabase.from(table).update(payload).eq('id', id).select().single()
  if (error) throw error
  return data
}

export async function deleteRow(table, id) {
  const { error } = await supabase.from(table).delete().eq('id', id)
  if (error) throw error
}

export async function uploadAdminFile(file, folder = 'general') {
  const ext = file.name.split('.').pop()
  const fileName = `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`
  const filePath = `${folder}/${fileName}`
  const { error } = await supabase.storage.from(IMAGE_BUCKET).upload(filePath, file, { cacheControl: '3600', upsert: false })
  if (error) throw error
  const { data } = supabase.storage.from(IMAGE_BUCKET).getPublicUrl(filePath)
  return data.publicUrl
}

export const tableConfigs = {
  blogs: { label: 'Blogs', orderBy: 'created_at', ascending: false, arrayFields: ['tags'] },
  certifications: { label: 'Certifications', orderBy: 'created_at', ascending: false, arrayFields: ['skills'] },
  gallery: { label: 'Gallery', orderBy: 'created_at', ascending: false, fileFields: ['url'] },
  graph_nodes: { label: 'Graph Nodes', orderBy: 'group_id', ascending: true, pk: 'id', immutablePk: false },
  graph_edges: { label: 'Graph Edges', orderBy: 'id', ascending: false },
  messages: { label: 'Messages', orderBy: 'created_at', ascending: false, readOnlyCreate: true },
  profile_assets: { label: 'Profile Assets', orderBy: 'updated_at', ascending: false, fileFields: ['file_url'] },
  publications: { label: 'Publications', orderBy: 'created_at', ascending: false, arrayFields: ['tags'] },
  technical_skills: { label: 'Technical Skills', orderBy: 'display_order', ascending: true },
  testimonials: { label: 'Testimonials', orderBy: 'created_at', ascending: false, fileFields: ['image', 'avatar'] },
}
