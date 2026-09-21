import { Helmet } from 'react-helmet-async'

export const SITE_URL = 'https://kmafaq.site'
export const DEFAULT_IMAGE =
  'https://raw.githubusercontent.com/KanwarAfaq/kmafaq/refs/heads/main/src/images/afaq_profile.jpeg'

export default function Seo({
  title = 'Kanwar Muhammad Afaq | AI Researcher',
  description = 'Official portfolio of Kanwar Muhammad Afaq (K.M. AFAQ), covering AI research, natural language processing, machine learning, publications, projects, and technical work.',
  path = '/',
  image = DEFAULT_IMAGE,
  type = 'website',
  noindex = false,
  nofollow = false,
  jsonLd = null,
}) {
  const canonical = path ? new URL(path, SITE_URL).toString() : null
  const robots = [
    noindex ? 'noindex' : 'index',
    nofollow ? 'nofollow' : 'follow',
    'max-image-preview:large',
    'max-snippet:-1',
    'max-video-preview:-1',
  ].join(',')

  return (
    <Helmet>
      <title>{title}</title>
      <meta name="description" content={description} />
      <meta name="robots" content={robots} />
      <meta name="googlebot" content={robots} />

      {canonical ? <link rel="canonical" href={canonical} /> : null}

      <meta property="og:site_name" content="K.M. AFAQ" />
      <meta property="og:type" content={type} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      {canonical ? <meta property="og:url" content={canonical} /> : null}
      {image ? <meta property="og:image" content={image} /> : null}

      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      {image ? <meta name="twitter:image" content={image} /> : null}

      {jsonLd ? (
        <script type="application/ld+json">{JSON.stringify(jsonLd)}</script>
      ) : null}
    </Helmet>
  )
}
