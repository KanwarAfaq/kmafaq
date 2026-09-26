const TABLES = [
  { table: 'projects', type: 'Project', path: () => '/projects' },
  { table: 'blogs', type: 'Blog', path: (row) => row.slug ? '/blog/' + encodeURIComponent(row.slug) : '/blog' },
  { table: 'publications', type: 'Publication', path: () => '/publications' },
  { table: 'certifications', type: 'Certification', path: () => '/certifications' },
  { table: 'gallery', type: 'Gallery', path: () => '/gallery' },
  { table: 'gallery_items', type: 'Gallery', path: () => '/gallery' },
  { table: 'technical_skills', type: 'Skill', path: () => '/about' },
  { table: 'profile_timeline', type: 'Timeline', path: () => '/about' },
  { table: 'testimonials', type: 'Testimonial', path: () => '/about' },
  { table: 'phd_scholarships', type: 'Scholarship', path: () => '/scholarships' },
]

const titleKeys = ['title', 'name', 'skill_name', 'institution', 'certificate_name', 'full_name', 'label', 'year']
const descKeys = ['excerpt','description','desc','desc_text','summary','journal','category','place','role','text_content','strategic_fit','country','salary_funding']

function stringify(value) {
  if (value == null) return ''
  if (typeof value === 'string' || typeof value === 'number' || typeof value === 'boolean') return String(value)
  if (Array.isArray(value)) return value.map(stringify).filter(Boolean).join(' ')
  if (typeof value === 'object') return Object.values(value).map(stringify).filter(Boolean).join(' ')
  return ''
}

function first(row, keys) {
  for (const key of keys) {
    const value = stringify(row?.[key]).trim()
    if (value) return value
  }
  return ''
}

function normalize(row, config) {
  return {
    title: first(row, titleKeys) || config.type,
    desc: first(row, descKeys),
    path: config.path(row),
    type: config.type,
    searchText: stringify(row),
    updatedAt: row?.updated_at || row?.created_at || row?.date || null,
  }
}

async function fetchTable(baseUrl, key, config) {
  const response = await fetch(`${baseUrl}/rest/v1/${config.table}?select=*&limit=500`, {
    headers: { apikey: key, Authorization: `Bearer ${key}`, Accept: 'application/json' },
  })
  if (!response.ok) return []
  const rows = await response.json()
  return (Array.isArray(rows) ? rows : []).map((row) => normalize(row, config))
}

export default async function handler(req, res) {
  if (req.method !== 'GET' && req.method !== 'HEAD') {
    res.setHeader('Allow', 'GET, HEAD')
    return res.status(405).end()
  }

  const url = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL
  const key = process.env.SUPABASE_ANON_KEY || process.env.VITE_SUPABASE_ANON_KEY

  if (!url || !key) {
    res.status(503)
    return res.json({ generatedAt: new Date().toISOString(), items: [], error: 'Public site index is not configured.' })
  }

  const baseUrl = url.replace(/\/$/, '')
  const settled = await Promise.allSettled(TABLES.map((config) => fetchTable(baseUrl, key, config)))
  const items = settled.flatMap((result) => result.status === 'fulfilled' ? result.value : [])

  res.setHeader('Content-Type', 'application/json; charset=utf-8')
  res.setHeader('Cache-Control', 'public, s-maxage=300, stale-while-revalidate=3600')
  res.setHeader('X-Robots-Tag', 'noindex, follow')
  res.status(200)
  if (req.method === 'HEAD') return res.end()
  return res.json({ generatedAt: new Date().toISOString(), source: 'live-public-website-data', itemCount: items.length, items })
}
