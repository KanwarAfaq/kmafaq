const SITE_URL = 'https://kmafaq.site'

const STATIC_ROUTES = [
  '/',
  '/about',
  '/projects',
  '/publications',
  '/certifications',
  '/gallery',
  '/blog',
  '/contact',
  '/scholarships',
]

const escapeXml = (value) =>
  String(value)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&apos;')

const validDate = (value) => {
  if (!value) return null
  const date = new Date(value)
  return Number.isNaN(date.getTime()) ? null : date.toISOString()
}

async function queryBlogs(select) {
  const supabaseUrl = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL
  const anonKey = process.env.SUPABASE_ANON_KEY || process.env.VITE_SUPABASE_ANON_KEY
  if (!supabaseUrl || !anonKey) return []

  const endpoint = `${supabaseUrl.replace(/\/$/, '')}/rest/v1/blogs?select=${encodeURIComponent(select)}&slug=not.is.null&order=date.desc`
  const response = await fetch(endpoint, {
    headers: { apikey: anonKey, Authorization: `Bearer ${anonKey}`, Accept: 'application/json' },
  })
  if (!response.ok) throw new Error(`Blog sitemap query returned HTTP ${response.status}`)
  return response.json()
}

async function fetchBlogRoutes() {
  let rows
  try {
    rows = await queryBlogs('slug,date,updated_at')
  } catch {
    rows = await queryBlogs('slug,date')
  }
  const seen = new Set()

  return (Array.isArray(rows) ? rows : [])
    .map((row) => ({
      slug: String(row?.slug || '').trim(),
      lastmod: validDate(row?.updated_at || row?.date),
    }))
    .filter(({ slug }) => slug.length > 0)
    .filter(({ slug }) => {
      if (seen.has(slug)) return false
      seen.add(slug)
      return true
    })
    .map(({ slug, lastmod }) => ({
      path: `/blog/${encodeURIComponent(slug)}`,
      lastmod,
    }))
}

function buildXml(blogRoutes) {
  const entries = [
    ...STATIC_ROUTES.map((path) => ({ path, lastmod: null })),
    ...blogRoutes,
  ]

  const body = entries
    .map(({ path, lastmod }) => {
      const loc = escapeXml(new URL(path, SITE_URL).toString())
      const modified = lastmod
        ? `\n    <lastmod>${escapeXml(lastmod)}</lastmod>`
        : ''

      return `  <url>\n    <loc>${loc}</loc>${modified}\n  </url>`
    })
    .join('\n')

  return `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${body}\n</urlset>\n`
}

export default async function handler(req, res) {
  if (req.method !== 'GET' && req.method !== 'HEAD') {
    res.setHeader('Allow', 'GET, HEAD')
    return res.status(405).end()
  }

  let blogRoutes = []
  try {
    blogRoutes = await fetchBlogRoutes()
  } catch (error) {
    console.error('[sitemap] Falling back to static routes:', error)
  }

  const xml = buildXml(blogRoutes)

  res.setHeader('Content-Type', 'application/xml; charset=utf-8')
  res.setHeader('Cache-Control', 'public, s-maxage=900, stale-while-revalidate=86400')
  res.setHeader('X-Content-Type-Options', 'nosniff')
  res.status(200)

  if (req.method === 'HEAD') return res.end()
  return res.send(xml)
}
