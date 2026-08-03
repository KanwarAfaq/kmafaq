import { motion, AnimatePresence } from 'framer-motion';
import { FiX, FiChevronLeft, FiChevronRight } from 'react-icons/fi';

export default function GalleryModal({ activeImage, onClose, onNext, onPrev }) {
  if (!activeImage) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[999] bg-black/95 backdrop-blur-md flex items-center justify-center px-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.85, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.85, opacity: 0 }}
          className="relative max-w-4xl w-full"
          onClick={e => e.stopPropagation()}
        >
          {/* Close Button */}
          <button onClick={onClose} className="absolute -top-12 right-0 p-2 text-white/70 hover:text-white">
            <FiX size={28} />
          </button>

          {/* Image */}
          <img src={activeImage.image} alt={activeImage.title} className="w-full max-h-[70vh] object-contain rounded-2xl shadow-2xl" />

          {/* Caption */}
          <div className="mt-4 text-center">
            <h3 className="text-white text-xl font-bold mb-1">{activeImage.title}</h3>
            <p className="text-gray-400 text-sm max-w-xl mx-auto">{activeImage.description}</p>
          </div>

          {/* Navigation Controls */}
          <button onClick={onPrev} className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-14 p-3 text-white hidden md:block hover:text-accent">
            <FiChevronLeft size={32} />
          </button>
          <button onClick={onNext} className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-14 p-3 text-white hidden md:block hover:text-accent">
            <FiChevronRight size={32} />
          </button>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}