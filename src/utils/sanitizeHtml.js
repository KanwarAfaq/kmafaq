const ALLOWED_TAGS = new Set([
  'a', 'b', 'blockquote', 'br', 'code', 'del', 'div', 'em', 'h1', 'h2', 'h3',
  'h4', 'h5', 'h6', 'hr', 'i', 'img', 'li', 'ol', 'p', 'pre', 's', 'span',
  'strong', 'sub', 'sup', 'table', 'tbody', 'td', 'th', 'thead', 'tr', 'u', 'ul',
])

const GLOBAL_ATTRIBUTES = new Set(['class', 'title'])
const TAG_ATTRIBUTES = {
  a: new Set(['href', 'target', 'rel']),
  img: new Set(['src', 'alt', 'title', 'width', 'height', 'loading', 'decoding']),
  td: new Set(['colspan', 'rowspan']),
  th: new Set(['colspan', 'rowspan', 'scope']),
}

function isSafeUrl(value, { image = false } = {}) {
  const trimmed = String(value || '').trim()
  if (!trimmed) return false
  if (image && /^data:image\/(?:png|jpe?g|gif|webp);base64,/i.test(trimmed)) return true
  try {
    const url = new URL(trimmed, window.location.origin)
    if (image) return ['http:', 'https:'].includes(url.protocol)
    return ['http:', 'https:', 'mailto:', 'tel:'].includes(url.protocol)
  } catch {
    return false
  }
}

export function sanitizeHtml(value) {
  const html = String(value || '')
  if (!html || typeof window === 'undefined' || typeof DOMParser === 'undefined') return html
  const doc = new DOMParser().parseFromString(`<div id="sanitized-root">${html}</div>`, 'text/html')
  const root = doc.getElementById('sanitized-root')
  if (!root) return ''
  const elements = [...root.querySelectorAll('*')]
  elements.forEach((element) => {
    const tag = element.tagName.toLowerCase()
    if (!ALLOWED_TAGS.has(tag)) { element.replaceWith(...element.childNodes); return }
    const allowedForTag = TAG_ATTRIBUTES[tag] || new Set()
    ;[...element.attributes].forEach((attribute) => {
      const name = attribute.name.toLowerCase()
      const allowed = GLOBAL_ATTRIBUTES.has(name) || allowedForTag.has(name)
      if (!allowed || name.startsWith('on') || name === 'style') element.removeAttribute(attribute.name)
    })
    if (tag === 'a') {
      const href = element.getAttribute('href')
      if (!isSafeUrl(href)) element.removeAttribute('href')
      if (element.getAttribute('target') === '_blank') element.setAttribute('rel', 'noopener noreferrer')
    }
    if (tag === 'img') {
      const src = element.getAttribute('src')
      if (!isSafeUrl(src, { image: true })) element.removeAttribute('src')
      if (!element.getAttribute('alt')) element.setAttribute('alt', '')
      element.setAttribute('loading', 'lazy')
      element.setAttribute('decoding', 'async')
    }
  })
  return root.innerHTML
}
