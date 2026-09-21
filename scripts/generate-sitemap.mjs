import { mkdir, writeFile } from 'node:fs/promises'

const SITE_URL = 'https://kmafaq.site'
const staticRoutes = [
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

function validDate(value) {
  if (!value) return null
  const d = new Date(value)
  return Number.isNaN(d.getTime()) ? null : d.toISOString()
}

async function fetchBlogRoutes() {
  const supabaseUrl = process.env.VITE_SUPABASE_URL
  const anonKey = process.env.VITE_SUPABASE_ANON_KEY

  if (!supabaseUrl || !anonKey) {
    console.warn('[sitemap] Supabase env vars are unavailable; generating static routes only.')
    return []
  }

  try {
    const endpoint =
      `${supabaseUrl.replace(/\/$/, '')}/rest/v1/blogs?select=slug,date&slug=not.is.null&order=date.desc`
    const response = await fetch(endpoint, {
      headers: {
        apikey: anonKey,
        Authorization: `Bearer ${anonKey}`,
      },
    })

    if (!response.ok) {
      throw new Error(`Supabase returned HTTP ${response.status}`)
    }

    const rows = await response.json()
    return (Array.isArray(rows) ? rows : [])
      .filter((row) => row?.slug)
      .map((row) => ({
        path: `/blog/${encodeURIComponent(String(row.slug).trim())}`,
        lastmod: validDate(row.date),
      }))
  } catch (error) {
    console.warn('[sitemap] Blog routes could not be loaded:', error.message)
    return []
  }
}

const blogRoutes = await fetchBlogRoutes()
const entries = [
  ...staticRoutes.map((path) => ({ path, lastmod: null })),
  ...blogRoutes,
]

const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${entries
  .map(({ path, lastmod }) => {
    const loc = escapeXml(new URL(path, SITE_URL).toString())
    const modified = lastmod ? `\n    <lastmod>${escapeXml(lastmod)}</lastmod>` : ''
    return `  <url>\n    <loc>${loc}</loc>${modified}\n  </url>`
  })
  .join('\n')}
</urlset>
`

await mkdir('public', { recursive: true })
await writeFile('public/sitemap.xml', xml, 'utf8')
console.log(`[sitemap] Generated ${entries.length} URLs (${blogRoutes.length} blog posts).`)
