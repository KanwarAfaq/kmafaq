import { Navigate, Routes, Route, useLocation } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import GlobalSearch from './components/GlobalSearch'
import ScrollToTop from './components/ScrollToTop'
import CustomCursor from './components/CustomCursor'
import Seo, { SITE_URL } from './components/Seo'
import Home from './pages/Home'
import About from './pages/About'
import Projects from './pages/Projects'
import Blog from './pages/Blog'
import BlogPost from './pages/BlogPost'
import Contact from './pages/Contact'
import AllInOne from './pages/AllInOne'
import Certifications from './pages/Certifications'
import NotFound from './pages/NotFound'
import Publications from './pages/Publications'
import GallerySection from './components/GallerySection'
import Login from './pages/admin/Login'
import Dashboard from './pages/admin/Dashboard'
import ProjectsAdmin from './pages/admin/ProjectsAdmin'
import SocialLinksAdmin from './pages/admin/SocialLinksAdmin'
import CertificationsAdmin from './pages/admin/CertificationsAdmin'
import GraphNodesAdmin from './pages/admin/GraphNodesAdmin'
import GraphEdgesAdmin from './pages/admin/GraphEdgesAdmin'
import ProfileAssetsAdmin from './pages/admin/ProfileAssetsAdmin'
import TechnicalSkillsAdmin from './pages/admin/TechnicalSkillsAdmin'
import TestimonialsAdmin from './pages/admin/TestimonialsAdmin'
import PublicationsAdminV3 from './pages/admin/PublicationsAdmin'
import BlogsAdminV5 from './pages/admin/BlogsAdmin'
import GalleryAdminV5 from './pages/admin/GalleryAdmin'
import MessagesAdminV5 from './pages/admin/MessagesAdmin'
import ProtectedRoute from './components/ProtectedRoute'
import AdminProfileSettings from './pages/admin/adminProfileSettings'
import AdminProfileTimeline from './pages/admin/adminProfileTimeline'
import UpdatePassword from './pages/admin/UpdatePassword'
import Scholarships from './pages/Scholarships'

const personSchema = {
  '@type': 'Person',
  '@id': `${SITE_URL}/#person`,
  name: 'Kanwar Muhammad Afaq',
  alternateName: 'K.M. AFAQ',
  url: SITE_URL,
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
  },
  '/publications': {
    title: 'Publications & Research | K.M. AFAQ',
    description:
      'Research publications and manuscripts by Kanwar Muhammad Afaq across NLP, code-mixed language processing, machine learning, and environmental forecasting.',
  },
  '/certifications': {
    title: 'Certifications | K.M. AFAQ',
    description:
      'Technical certifications and professional learning completed by Kanwar Muhammad Afaq across AI, machine learning, data science, and engineering.',
  },
  '/gallery': {
    title: 'Research & Professional Gallery | K.M. AFAQ',
    description:
      'A gallery of research, academic, professional, and project moments from Kanwar Muhammad Afaq.',
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
  },
  '/scholarships': {
    title: 'AI & NLP PhD Scholarships Tracker | K.M. AFAQ',
    description:
      'A curated tracker of active PhD scholarship and research opportunities related to AI, NLP, and machine learning.',
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

function AppContent() {
  const location = useLocation()
  const isAdminRoute = location.pathname.startsWith('/admin')

  return (
    <div className="min-h-screen flex flex-col bg-white transition-colors duration-300 dark:bg-gray-950">
      <RouteSeo pathname={location.pathname} />
      {!isAdminRoute ? <CustomCursor /> : null}
      <Toaster
        position="bottom-right"
        toastOptions={{ style: { background: '#333', color: '#fff', borderRadius: '12px' } }}
      />
      <ScrollToTop />
      {!isAdminRoute ? <GlobalSearch /> : null}
      {!isAdminRoute ? <Navbar /> : null}
      <main className="flex-1">
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
      </main>
      {!isAdminRoute ? <Footer /> : null}
    </div>
  )
}

export default function App() {
  return <AppContent />
}
