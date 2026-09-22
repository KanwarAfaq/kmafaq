export const SITE_URL = 'https://kmafaq.site'
export const AUTHOR_NAME = 'Kanwar Muhammad Afaq'
export const DEFAULT_IMAGE = SITE_URL + '/afaq-profile.jpeg'

const personSchema = {
  '@type': 'Person',
  '@id': SITE_URL + '/#person',
  name: AUTHOR_NAME,
  alternateName: 'K.M. AFAQ',
  url: SITE_URL + '/',
  image: DEFAULT_IMAGE,
  jobTitle: 'AI Researcher',
  description:
    'AI researcher working across natural language processing, machine learning, deep learning, and applied data science.',
  sameAs: [
    'https://github.com/KanwarAfaq',
    'https://linkedin.com/in/kanwarafaq',
    'https://scholar.google.com/citations?user=YXqrYw4AAAAJ',
  ],
  knowsAbout: [
    'Artificial Intelligence',
    'Natural Language Processing',
    'Machine Learning',
    'Deep Learning',
    'Roman Urdu',
    'Code-mixed language processing',
    'Air quality forecasting',
  ],
}

const websiteSchema = {
  '@type': 'WebSite',
  '@id': SITE_URL + '/#website',
  url: SITE_URL + '/',
  name: 'K.M. AFAQ',
  alternateName: AUTHOR_NAME,
  description:
    'Official portfolio of Kanwar Muhammad Afaq, featuring AI research, publications, projects, and technical writing.',
  inLanguage: 'en',
  creator: { '@id': SITE_URL + '/#person' },
}

const breadcrumbSchema = (path, label) => ({
  '@type': 'BreadcrumbList',
  '@id': SITE_URL + path + '#breadcrumb',
  itemListElement: [
    {
      '@type': 'ListItem',
      position: 1,
      name: 'Home',
      item: SITE_URL + '/',
    },
    {
      '@type': 'ListItem',
      position: 2,
      name: label,
      item: SITE_URL + path,
    },
  ],
})

const pageGraph = (path, label, page) => ({
  '@context': 'https://schema.org',
  '@graph': [page, breadcrumbSchema(path, label), websiteSchema, personSchema],
})

const collectionPage = (path, label, description) =>
  pageGraph(path, label, {
    '@type': 'CollectionPage',
    '@id': SITE_URL + path + '#collection',
    url: SITE_URL + path,
    name: label,
    description,
    about: { '@id': SITE_URL + '/#person' },
    isPartOf: { '@id': SITE_URL + '/#website' },
  })

export const PAGE_META = {
  '/': {
    title: 'Kanwar Muhammad Afaq | AI Researcher, NLP Engineer & Data Scientist',
    description:
      'Official portfolio of Kanwar Muhammad Afaq (K.M. AFAQ): AI research, NLP, machine learning, publications, projects, certifications, and technical writing.',
    jsonLd: {
      '@context': 'https://schema.org',
      '@graph': [websiteSchema, personSchema],
    },
  },
  '/about': {
    title: 'About Kanwar Muhammad Afaq | AI Researcher',
    description:
      'Learn about Kanwar Muhammad Afaq (K.M. AFAQ), his AI and NLP research interests, technical skills, experience, and research journey.',
    jsonLd: pageGraph('/about', 'About', {
      '@type': 'ProfilePage',
      '@id': SITE_URL + '/about#profile',
      url: SITE_URL + '/about',
      name: 'About Kanwar Muhammad Afaq',
      mainEntity: { '@id': SITE_URL + '/#person' },
      isPartOf: { '@id': SITE_URL + '/#website' },
    }),
  },
  '/projects': {
    title: 'AI & NLP Projects | K.M. AFAQ',
    description:
      'Explore AI, NLP, machine learning, automation, and data science projects developed by Kanwar Muhammad Afaq.',
    jsonLd: collectionPage(
      '/projects',
      'AI & NLP Projects',
      'AI, NLP, machine learning, automation, and data science projects by Kanwar Muhammad Afaq.'
    ),
  },
  '/publications': {
    title: 'Publications & Research | K.M. AFAQ',
    description:
      'Research publications and manuscripts by Kanwar Muhammad Afaq across NLP, code-mixed language processing, machine learning, and environmental forecasting.',
    jsonLd: collectionPage(
      '/publications',
      'Publications & Research',
      'Research publications and manuscripts by Kanwar Muhammad Afaq.'
    ),
  },
  '/certifications': {
    title: 'Certifications | K.M. AFAQ',
    description:
      'Technical certifications and professional learning completed by Kanwar Muhammad Afaq across AI, machine learning, data science, and engineering.',
    jsonLd: collectionPage(
      '/certifications',
      'Certifications',
      'Technical certifications and professional learning completed by Kanwar Muhammad Afaq.'
    ),
  },
  '/gallery': {
    title: 'Research & Professional Gallery | K.M. AFAQ',
    description:
      'A gallery of research, academic, professional, and project moments from Kanwar Muhammad Afaq.',
    jsonLd: collectionPage(
      '/gallery',
      'Research & Professional Gallery',
      'Research, academic, professional, and project moments from Kanwar Muhammad Afaq.'
    ),
  },
  '/blog': {
    title: 'AI, NLP & Machine Learning Blog | K.M. AFAQ',
    description:
      'Articles and research notes by Kanwar Muhammad Afaq on AI, NLP, machine learning, deep learning, data science, and applied research.',
    jsonLd: pageGraph('/blog', 'Blog', {
      '@type': 'Blog',
      '@id': SITE_URL + '/blog#blog',
      url: SITE_URL + '/blog',
      name: 'K.M. AFAQ Blog',
      author: { '@id': SITE_URL + '/#person' },
      isPartOf: { '@id': SITE_URL + '/#website' },
    }),
  },
  '/contact': {
    title: 'Contact Kanwar Muhammad Afaq | AI Research & Collaboration',
    description:
      'Contact Kanwar Muhammad Afaq for AI research collaboration, NLP projects, technical partnerships, and academic discussions.',
    jsonLd: pageGraph('/contact', 'Contact', {
      '@type': 'ContactPage',
      '@id': SITE_URL + '/contact#contact',
      url: SITE_URL + '/contact',
      name: 'Contact Kanwar Muhammad Afaq',
      mainEntity: { '@id': SITE_URL + '/#person' },
      isPartOf: { '@id': SITE_URL + '/#website' },
    }),
  },
  '/scholarships': {
    title: 'AI & NLP PhD Scholarships Tracker | K.M. AFAQ',
    description:
      'A curated tracker of active PhD scholarship and research opportunities related to AI, NLP, and machine learning.',
    jsonLd: collectionPage(
      '/scholarships',
      'AI & NLP PhD Scholarships Tracker',
      'A curated tracker of active AI, NLP, and machine learning PhD scholarship opportunities.'
    ),
  },
}
