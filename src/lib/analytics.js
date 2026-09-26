export const GA_MEASUREMENT_ID = 'G-8V29LVQKPG'

export function trackPageView(path) {
  if (typeof window === 'undefined' || typeof window.gtag !== 'function') return
  window.gtag('event', 'page_view', {
    page_path: path,
    page_location: window.location.href,
    page_title: document.title,
  })
}

export function trackEvent(name, params = {}) {
  if (typeof window === 'undefined' || typeof window.gtag !== 'function') return
  window.gtag('event', name, params)
}
