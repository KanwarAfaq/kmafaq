import { lazy, Suspense } from 'react'
import { Navigate, Routes, Route, useLocation } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import GlobalSearch from './components/GlobalSearch'
import ScrollToTop from './components/ScrollToTop'
import CustomCursor from './components/CustomCursor'
import Seo, { DEFAULT_IMAGE, SITE_URL } from './components/Seo'
import Home from './pages/Home'

const About = lazy(() => import('./pages/About'))
const Projects = lazy(() => import('./pages/Projects'))
const Blog = lazy(() => import('./pages/Blog'))
const BlogPost = lazy(() => import('./pages/BlogPost'))
const Contact = lazy(() => import('./pages/Contact'))
const AllInOne = lazy(() => import('./pages/AllInOne'))
const Certifications = lazy(() => import('./pages/Certifications'))
const NotFound = lazy(() => import('./pages/NotFound'))
const Publications = lazy(() => import('./pages/Publications'))
const GallerySection = lazy(() => import('./components/GallerySection'))
const Login = lazy(() => import('./pages/admin/Login'))
const Dashboard = lazy(() => import('./pages/admin/Dashboard'))
const ProjectsAdmin = lazy(() => import('./pages/admin/ProjectsAdmin'))
const SocialLinksAdmin = lazy(() => import('./pages/admin/SocialLinksAdmin'))
const CertificationsAdmin = lazy(() => import('./pages/admin/CertificationsAdmin'))
const GraphNodesAdmin = lazy(() => import('./pages/admin/GraphNodesAdmin'))
const GraphEdgesAdmin = lazy(() => import('./pages/admin/GraphEdgesAdmin'))
const ProfileAssetsAdmin = lazy(() => import('./pages/admin/ProfileAssetsAdmin'))
const TechnicalSkillsAdmin = lazy(() => import('./pages/admin/TechnicalSkillsAdmin'))
const TestimonialsAdmin = lazy(() => import('./pages/admin/TestimonialsAdmin'))
const PublicationsAdminV3 = lazy(() => import('./pages/admin/PublicationsAdmin'))
const BlogsAdminV5 = lazy(() => import('./pages/admin/BlogsAdmin'))
const GalleryAdminV5 = lazy(() => import('./pages/admin/GalleryAdmin'))
const MessagesAdminV5 = lazy(() => import('./pages/admin/MessagesAdmin'))
const ProtectedRoute = lazy(() => import('./components/ProtectedRoute'))
const AdminProfileSettings = lazy(() => import('./pages/admin/adminProfileSettings'))
const AdminProfileTimeline = lazy(() => import('./pages/admin/adminProfileTimeline'))
const UpdatePassword = lazy(() => import('./pages/admin/UpdatePassword'))
const Scholarships = lazy(() => import('./pages/Scholarships'))

const personSchema = {
  '@type': 'Person',
  '@id': `${SITE_URL}/#person`,
  name: 'Kanwar Muhammad Afaq',
  alternateName: 'K.M. AFAQ',
  url: SITE_URL,
  image: DEFAULT_IMAGE,
  jobTitle: 'AI Researcher',
  description:
    'AI researcher working across natural language processing, machine learning, deep learning, and applied data science.',
  sameAs: [
    'https://github.com/KanwarAfaq',
    'https://linkedin.com/in/kanwarafaq',
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

const homeSchema = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'WebSite',
      '@id': `${SITE_URL}/#website`,
      url: `${SITE_URL}/`,
      name: 'K.M. AFAQ',
      description:
        'Official portfolio of Kanwar Muhammad Afaq, featuring AI research, publications, projects, and technical writing.',
      inLanguage: 'en',
      creator: { '@id': `${SITE_URL}/#person` },
    },
    personSchema,
  ],
}

const aboutSchema = {
  '@context': 'https://schema.org',
  '@type': 'ProfilePage',
  '@id': `${SITE_URL}/about#profile`,
  url: `${SITE_URL}/about`,
  mainEntity: personSchema,
}

const collectionSchema = (path, name, description) => ({
  '@context': 'https://schema.org',
  '@type': 'CollectionPage',
  '@id': `${SITE_URL}${path}#collection`,
  url: `${SITE_URL}${path}`,
  name,
  description,
  about: { '@id': `${SITE_URL}/#person` },
  isPartOf: { '@id': `${SITE_URL}/#website` },
})

const pageMeta = {
  '/': {
    title: 'Kanwar Muhammad Afaq | AI Researcher, NLP Engineer & Data Scientist',
    description:
      'Official portfolio of Kanwar Muhammad Afaq (K.M. AFAQ): AI research, NLP, machine learning, publications, projects, certifications, and technical writing.',
    jsonLd: homeSchema,
  },
  '/about': {
    title: 'About Kanwar Muhammad Afaq | AI Researcher',
    description:
      'Learn about Kanwar Muhammad Afaq (K.M. AFAQ), his AI and NLP research interests, technical skills, experience, and research journey.',
    jsonLd: aboutSchema,
  },
  '/projects': {
    title: 'AI & NLP Projects | K.M. AFAQ',
    description:
      'Explore AI, NLP, machine learning, automation, and data science projects developed by Kanwar Muhammad Afaq.',
    jsonLd: collectionSchema('/projects', 'AI & NLP Projects | K.M. AFAQ', 'AI, NLP, machine learning, automation, and data science projects by Kanwar Muhammad Afaq.'),
  },
  '/publications': {
    title: 'Publications & Research | K.M. AFAQ',
    description:
      'Research publications and manuscripts by Kanwar Muhammad Afaq across NLP, code-mixed language processing, machine learning, and environmental forecasting.',
    jsonLd: collectionSchema('/publications', 'Publications & Research | K.M. AFAQ', 'Research publications and manuscripts by Kanwar Muhammad Afaq.'),
  },
  '/certifications': {
    title: 'Certifications | K.M. AFAQ',
    description:
      'Technical certifications and professional learning completed by Kanwar Muhammad Afaq across AI, machine learning, data science, and engineering.',
    jsonLd: collectionSchema('/certifications', 'Certifications | K.M. AFAQ', 'Technical certifications and professional learning completed by Kanwar Muhammad Afaq.'),
  },
  '/gallery': {
    title: 'Research & Professional Gallery | K.M. AFAQ',
    description:
      'A gallery of research, academic, professional, and project moments from Kanwar Muhammad Afaq.',
    jsonLd: collectionSchema('/gallery', 'Research & Professional Gallery | K.M. AFAQ', 'Research, academic, professional, and project moments from Kanwar Muhammad Afaq.'),
  },
  '/blog': {
    title: 'AI, NLP & Machine Learning Blog | K.M. AFAQ',
    description:
      'Articles and research notes by Kanwar Muhammad Afaq on AI, NLP, machine learning, deep learning, data science, and applied research.',
    jsonLd: {
      '@context': 'https://schema.org',
      '@type': 'Blog',
      '@id': `${SITE_URL}/blog#blog`,
      url: `${SITE_URL}/blog`,
      name: 'K.M. AFAQ Blog',
      author: { '@id': `${SITE_URL}/#person` },
    },
  },
  '/contact': {
    title: 'Contact Kanwar Muhammad Afaq | AI Research & Collaboration',
    description:
      'Contact Kanwar Muhammad Afaq for AI research collaboration, NLP projects, technical partnerships, and academic discussions.',
    jsonLd: {
      '@context': 'https://schema.org',
      '@type': 'ContactPage',
      '@id': `${SITE_URL}/contact#contact`,
      url: `${SITE_URL}/contact`,
      name: 'Contact Kanwar Muhammad Afaq',
      mainEntity: { '@id': `${SITE_URL}/#person` },
      isPartOf: { '@id': `${SITE_URL}/#website` },
    },
  },
  '/scholarships': {
    title: 'AI & NLP PhD Scholarships Tracker | K.M. AFAQ',
    description:
      'A curated tracker of active PhD scholarship and research opportunities related to AI, NLP, and machine learning.',
    jsonLd: collectionSchema('/scholarships', 'AI & NLP PhD Scholarships Tracker | K.M. AFAQ', 'A curated tracker of active AI, NLP, and machine learning PhD scholarship opportunities.'),
  },
}

function RouteSeo({ pathname }) {
  const isPrivate = pathname.startsWith('/admin') || pathname === '/update-password'
  if (isPrivate) {
    return (
      <Seo
        title="Private Area | K.M. AFAQ"
        description="Private administration area."
        path={pathname}
        noindex
        nofollow
      />
    )
  }

  if (pathname === '/all-in-one') {
    return (
      <Seo
        title="All-in-One Portfolio | K.M. AFAQ"
        description="Combined portfolio view for K.M. AFAQ."
        path={pathname}
        noindex
      />
    )
  }

  if (pathname.startsWith('/blog/')) {
    return (
      <Seo
        title="Research Article | K.M. AFAQ"
        description="Research article by Kanwar Muhammad Afaq."
        path={pathname}
        type="article"
      />
    )
  }

  const meta = pageMeta[pathname]
  if (meta) return <Seo {...meta} path={pathname} />

  return (
    <Seo
      title="Page Not Found | K.M. AFAQ"
      description="The requested page could not be found."
      path={pathname}
      noindex
      nofollow
    />
  )
}

function RouteLoader() {
  return (
    <div className="flex min-h-[45vh] items-center justify-center bg-white text-gray-500 dark:bg-gray-950 dark:text-gray-400" role="status" aria-live="polite">
      <div className="flex items-center gap-3 text-sm">
        <span className="h-3 w-3 animate-pulse rounded-full bg-accent" aria-hidden="true" />
        Loading page…
      </div>
    </div>
  )
}

function AppContent() {
  const location = useLocation()
  const isAdminRoute = location.pathname.startsWith('/admin')
  const isPrivateRoute = isAdminRoute || location.pathname === '/update-password'

  return (
    <div className="min-h-screen flex flex-col bg-white transition-colors duration-300 dark:bg-gray-950">
      <RouteSeo pathname={location.pathname} />
      {!isPrivateRoute ? <CustomCursor /> : null}
      <Toaster
        position="bottom-right"
        toastOptions={{ style: { background: '#333', color: '#fff', borderRadius: '12px' } }}
      />
      <ScrollToTop />
      {!isPrivateRoute ? <GlobalSearch /> : null}
      {!isPrivateRoute ? <Navbar /> : null}
      <main className="flex-1">
        <Suspense fallback={<RouteLoader />}>
          <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/projects" element={<Projects />} />
          <Route path="/blog" element={<Blog />} />
          <Route path="/blog/:slug" element={<BlogPost />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/all-in-one" element={<AllInOne />} />
          <Route path="/publications" element={<Publications />} />
          <Route path="/certifications" element={<Certifications />} />
          <Route path="/gallery" element={<GallerySection />} />
          <Route path="/p-gallery" element={<Navigate to="/gallery" replace />} />
          <Route path="/admin/login" element={<Login />} />
          <Route path="/admin" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
          <Route path="/admin/projects" element={<ProtectedRoute><ProjectsAdmin /></ProtectedRoute>} />
          <Route path="/admin/social-links" element={<ProtectedRoute><SocialLinksAdmin /></ProtectedRoute>} />
          <Route path="/admin/blogs" element={<ProtectedRoute><BlogsAdminV5 /></ProtectedRoute>} />
          <Route path="/admin/publications" element={<ProtectedRoute><PublicationsAdminV3 /></ProtectedRoute>} />
          <Route path="/admin/gallery" element={<ProtectedRoute><GalleryAdminV5 /></ProtectedRoute>} />
          <Route path="/admin/messages" element={<ProtectedRoute><MessagesAdminV5 /></ProtectedRoute>} />
          <Route path="/admin/certifications" element={<ProtectedRoute><CertificationsAdmin /></ProtectedRoute>} />
          <Route path="/admin/graph-nodes" element={<ProtectedRoute><GraphNodesAdmin /></ProtectedRoute>} />
          <Route path="/admin/graph-edges" element={<ProtectedRoute><GraphEdgesAdmin /></ProtectedRoute>} />
          <Route path="/admin/profile-assets" element={<ProtectedRoute><ProfileAssetsAdmin /></ProtectedRoute>} />
          <Route path="/admin/technical-skills" element={<ProtectedRoute><TechnicalSkillsAdmin /></ProtectedRoute>} />
          <Route path="/admin/testimonials" element={<ProtectedRoute><TestimonialsAdmin /></ProtectedRoute>} />
          <Route path="/admin/profile-settings" element={<ProtectedRoute><AdminProfileSettings /></ProtectedRoute>} />
          <Route path="/admin/profile-timeline" element={<ProtectedRoute><AdminProfileTimeline /></ProtectedRoute>} />
          <Route path="/update-password" element={<UpdatePassword />} />
          <Route path="/scholarships" element={<Scholarships />} />
          <Route path="*" element={<NotFound />} />
          </Routes>
        </Suspense>
      </main>
      {!isPrivateRoute ? <Footer /> : null}
    </div>
  )
}

export default function App() {
  return <AppContent />
}
