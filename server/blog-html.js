import { AUTHOR_NAME, DEFAULT_IMAGE, SITE_URL } from '../src/config/seo.js'

const escape = value => String(value ?? '').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]))
const date = value => value && Number.isFinite(Date.parse(value)) ? new Date(value).toISOString() : undefined
const webUrl = value => {
  try { const url = new URL(value); return ['https:', 'http:'].includes(url.protocol) ? url.href : undefined } catch { return undefined }
}
export function renderBlogHtml(template, post, slug) {
  const canonical = `${SITE_URL}/blog/${encodeURIComponent(slug)}`
  const title = `${post.title} | K.M. AFAQ`
  const description = post.excerpt || `Research article by ${AUTHOR_NAME} about ${post.title || 'AI and machine learning'}.`
  const image = webUrl(post.image || post.cover_image) || DEFAULT_IMAGE
  const schema = {
    '@context': 'https://schema.org', '@type': 'BlogPosting', '@id': canonical+'#article',
    mainEntityOfPage: canonical, headline: post.title, description, image,
    datePublished: date(post.date), dateModified: date(post.updated_at || post.date),
    author: {'@type':'Person', name:AUTHOR_NAME, url:SITE_URL+'/about'},
    publisher: {'@type':'Person', name:AUTHOR_NAME, url:SITE_URL+'/'},
  }
  const head = [
    `<title>${escape(title)}</title>`,
    `<meta name="description" content="${escape(description)}">`,
    '<meta name="robots" content="index,follow,max-image-preview:large">',
    `<link rel="canonical" href="${escape(canonical)}">`,
    '<meta property="og:type" content="article">',
    ...Object.entries({title, description, url:canonical, image}).map(([key,value])=>`<meta property="og:${key}" content="${escape(value)}">`),
    '<meta name="twitter:card" content="summary_large_image">',
    ...Object.entries({title,description,image}).map(([key,value])=>`<meta name="twitter:${key}" content="${escape(value)}">`),
    `<script type="application/ld+json">${JSON.stringify(schema).replace(/</g,'\\u003c')}</script>`,
  ].join('\n')
  // Preserve the stored article's words; never execute HTML from the database.
  const paragraphs = String(post.content || '')
    .replace(/<(script|style)\b[^>]*>[\s\S]*?<\/\1>/gi, '')
    .replace(/<\/(p|div|h[1-6]|li)>|<br\s*\/?>/gi, '\n\n')
    .replace(/<[^>]*>/g, '').split(/\n\s*\n/).map(p=>p.trim()).filter(Boolean)
  const body = `<main data-seo-article="true"><article><h1>${escape(post.title)}</h1><p>${escape(description)}</p>${paragraphs.map(p=>`<p>${escape(p)}</p>`).join('')}<a href="/blog">All articles</a></article></main>`
  if (!template.includes('<!-- seo:start -->') || !template.includes('<div id="root"></div>')) throw new Error('Missing HTML template markers')
  return template.replace(/<!-- seo:start -->[\s\S]*?<!-- seo:end -->/, head)
    .replace(/<noscript>[\s\S]*?<\/noscript>/gi, '')
    .replace('<div id="root"></div>', `<div id="root">${body}</div>`)
}
