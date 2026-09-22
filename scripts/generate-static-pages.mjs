import { mkdir, readFile, writeFile } from 'node:fs/promises'
import { dirname, join } from 'node:path'
import { AUTHOR_NAME, DEFAULT_IMAGE, PAGE_META, SITE_URL } from '../src/config/seo.js'

const START = '<!-- seo:start -->'
const END = '<!-- seo:end -->'
const NOSCRIPT_START = '<!-- noscript:start -->'
const NOSCRIPT_END = '<!-- noscript:end -->'
const ROBOTS = 'index,follow,max-image-preview:large,max-snippet:-1,max-video-preview:-1'

const escapeHtml = (value) =>
  String(value)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#39;')

const safeJson = (value) => JSON.stringify(value).replaceAll('<', '\\u003c')

function renderSeo(pathname, meta) {
  const canonical = new URL(pathname, SITE_URL).toString()
  const title = escapeHtml(meta.title)
  const description = escapeHtml(meta.description)
  const image = DEFAULT_IMAGE

  return [
    START,
    '    <title>' + title + '</title>',
    '    <meta name="description" content="' + description + '" />',
    '    <meta name="author" content="' + escapeHtml(AUTHOR_NAME) + '" />',
    '    <meta name="robots" content="' + ROBOTS + '" />',
    '    <meta name="googlebot" content="' + ROBOTS + '" />',
    '    <link rel="canonical" href="' + escapeHtml(canonical) + '" />',
    '    <meta property="og:site_name" content="K.M. AFAQ" />',
    '    <meta property="og:locale" content="en_US" />',
    '    <meta property="og:type" content="website" />',
    '    <meta property="og:title" content="' + title + '" />',
    '    <meta property="og:description" content="' + description + '" />',
    '    <meta property="og:url" content="' + escapeHtml(canonical) + '" />',
    '    <meta property="og:image" content="' + escapeHtml(image) + '" />',
    '    <meta property="og:image:alt" content="Kanwar Muhammad Afaq — AI Researcher" />',
    '    <meta name="twitter:card" content="summary_large_image" />',
    '    <meta name="twitter:title" content="' + title + '" />',
    '    <meta name="twitter:description" content="' + description + '" />',
    '    <meta name="twitter:image" content="' + escapeHtml(image) + '" />',
    '    <meta name="twitter:image:alt" content="Kanwar Muhammad Afaq — AI Researcher" />',
    '    <script type="application/ld+json">' + safeJson(meta.jsonLd) + '</script>',
    '    ' + END,
  ].join('\n')
}

function injectSeo(html, seoBlock) {
  const start = html.indexOf(START)
  const end = html.indexOf(END)
  if (start === -1 || end === -1 || end < start) {
    throw new Error('SEO markers are missing from dist/index.html')
  }
  return html.slice(0, start) + seoBlock + html.slice(end + END.length)
}

function renderNoscript(meta) {
  return [
    NOSCRIPT_START,
    '      <main style="max-width:760px;margin:48px auto;padding:0 20px;font-family:Arial,sans-serif;line-height:1.6">',
    '        <h1>' + escapeHtml(meta.title) + '</h1>',
    '        <p>' + escapeHtml(meta.description) + '</p>',
    '        <p><a href="/about">About</a> · <a href="/projects">Projects</a> · <a href="/publications">Publications</a> · <a href="/gallery">Gallery</a> · <a href="/blog">Blog</a> · <a href="/contact">Contact</a></p>',
    '      </main>',
    '      ' + NOSCRIPT_END,
  ].join('\n')
}

function injectNoscript(html, block) {
  const start = html.indexOf(NOSCRIPT_START)
  const end = html.indexOf(NOSCRIPT_END)
  if (start === -1 || end === -1 || end < start) {
    throw new Error('Noscript markers are missing from dist/index.html')
  }
  return html.slice(0, start) + block + html.slice(end + NOSCRIPT_END.length)
}

const source = await readFile('dist/index.html', 'utf8')

for (const [pathname, meta] of Object.entries(PAGE_META)) {
  const html = injectNoscript(
    injectSeo(source, renderSeo(pathname, meta)),
    renderNoscript(meta)
  )
  const destination =
    pathname === '/' ? 'dist/index.html' : join('dist', pathname.slice(1), 'index.html')

  await mkdir(dirname(destination), { recursive: true })
  await writeFile(destination, html, 'utf8')
}

console.log('[seo] Generated server-visible metadata for ' + Object.keys(PAGE_META).length + ' public routes.')
