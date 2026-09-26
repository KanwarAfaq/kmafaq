export const PUBLIC_NAV_SECTIONS = [
  {
    title: 'Explore',
    items: [
      { label: 'Home', path: '/', keywords: ['portfolio', 'researcher', 'home'] },
      { label: 'About', path: '/about', keywords: ['profile', 'background', 'skills', 'experience'] },
      { label: 'Projects', path: '/projects', keywords: ['projects', 'machine learning', 'nlp', 'ai'] },
      { label: 'Publications', path: '/publications', keywords: ['papers', 'research', 'publications'] },
    ],
  },
  {
    title: 'Resources',
    items: [
      { label: 'Certifications', path: '/certifications', keywords: ['certificates', 'courses'] },
      { label: 'Gallery', path: '/gallery', keywords: ['photos', 'events', 'gallery'] },
      { label: 'Blog', path: '/blog', keywords: ['articles', 'notes', 'blog'] },
      { label: 'All-in-One', path: '/all-in-one', keywords: ['combined', 'portfolio', 'overview'] },
      { label: 'Scholarships', path: '/scholarships', keywords: ['phd', 'funding', 'opportunities'] },
      { label: 'Contact', path: '/contact', keywords: ['email', 'collaboration', 'contact'] },
    ],
  },
]

export const PUBLIC_NAV_ITEMS = PUBLIC_NAV_SECTIONS.flatMap((section) => section.items)

export const SEARCH_STATIC_PAGES = [
  ...PUBLIC_NAV_ITEMS.map((item) => ({
    title: item.label,
    desc: item.keywords.join(' · '),
    path: item.path,
    type: 'Page',
    searchText: [item.label, item.path, ...item.keywords].join(' '),
  })),
]
