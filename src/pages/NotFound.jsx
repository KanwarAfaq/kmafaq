import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { FiArrowLeft } from 'react-icons/fi'

export default function NotFound() {
  return (
    <div className="min-h-[80vh] flex flex-col items-center justify-center px-4 text-center">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="text-8xl md:text-9xl font-black text-accent mb-4 tracking-tighter">
          404
        </h1>
        <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
          Connection Lost
        </h2>
        <p className="text-gray-500 dark:text-gray-400 mb-8 max-w-md mx-auto text-lg leading-relaxed">
          Whoops! This page got lost in the latent space 🤖. Kanwar's research files and project data must be stored at a different endpoint.
        </p>
        <Link to="/" className="btn-accent inline-flex items-center justify-center gap-2">
          <FiArrowLeft size={18} /> Return to Base
        </Link>
      </motion.div>
    </div>
  )
}