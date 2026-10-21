import { readFile } from 'node:fs/promises'
import { join } from 'node:path'
import { renderBlogHtml } from '../server/blog-html.js'

export default async function handler(req, res) {
  if (!['GET', 'HEAD'].includes(req.method)) {
    res.setHeader('Allow', 'GET, HEAD')
    return res.status(405).end()
  }
  const slug = req.query?.slug
  if (typeof slug !== 'string' || !slug.trim() || slug.includes('/')) {
    res.setHeader('X-Robots-Tag', 'noindex')
    return res.status(404).end('Article not found')
  }
  try {
    const origin = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL
    const key = process.env.SUPABASE_ANON_KEY || process.env.VITE_SUPABASE_ANON_KEY
    if (!origin || !key) throw new Error('Missing public database configuration')
    const endpoint = new URL('/rest/v1/blogs', origin)
    endpoint.searchParams.set('select', '*')
    endpoint.searchParams.set('slug', `eq.${slug}`)
    endpoint.searchParams.set('limit', '1')
    const response = await fetch(endpoint, {
      headers: {apikey:key, Authorization:`Bearer ${key}`},
      signal: AbortSignal.timeout(10000),
    })
    if (!response.ok) throw new Error(`Article query returned HTTP ${response.status}`)
    const rows = await response.json()
    if (!Array.isArray(rows)) throw new Error('Invalid article response')
    if (!rows.length) {
      res.setHeader('X-Robots-Tag', 'noindex, follow')
      res.setHeader('Cache-Control', 'no-store')
      res.setHeader('Content-Type', 'text/html; charset=utf-8')
      return res.status(404).end(req.method === 'HEAD' ? undefined : '<!doctype html><html lang="en"><head><title>Article not found | K.M. AFAQ</title><meta name="robots" content="noindex,follow"></head><body><h1>Article not found</h1><a href="/blog">Browse articles</a></body></html>')
    }
    const template = await readFile(join(process.cwd(), 'dist/index.html'), 'utf8')
    const html = renderBlogHtml(template, rows[0], slug)
    res.setHeader('Content-Type', 'text/html; charset=utf-8')
    res.setHeader('Cache-Control', 'public, s-maxage=300, stale-while-revalidate=3600')
    return res.status(200).end(req.method === 'HEAD' ? undefined : html)
  } catch (error) {
    console.error('[blog-page]', error.message)
    res.setHeader('Cache-Control', 'no-store')
    res.setHeader('Retry-After', '300')
    return res.status(503).end(req.method === 'HEAD' ? undefined : 'Article temporarily unavailable')
  }
}
