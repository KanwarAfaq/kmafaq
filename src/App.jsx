import { Routes, Route, useLocation } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import GlobalSearch from './components/GlobalSearch'
import ScrollToTop from './components/ScrollToTop'
import CustomCursor from './components/CustomCursor'
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
import AdminProfileSettings from './pages/admin/adminProfileSettings';
import AdminProfileTimeline from './pages/admin/adminProfileTimeline';
import UpdatePassword from './pages/admin/UpdatePassword'


function AppContent() {
  const location = useLocation()
  const isAdminRoute = location.pathname.startsWith('/admin')
  return (
    <div className="min-h-screen flex flex-col bg-white transition-colors duration-300 dark:bg-gray-950">
      {!isAdminRoute ? <CustomCursor /> : null}
      <Toaster position="bottom-right" toastOptions={{ style: { background: '#333', color: '#fff', borderRadius: '12px' } }} />
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
          <Route path="/p-gallery" element={<GallerySection />} />
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
