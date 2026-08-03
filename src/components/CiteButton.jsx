import { FiCopy } from 'react-icons/fi';
import toast from 'react-hot-toast';
import { generateBibtex } from '../utils/citation';

export default function CiteButton({ paper }) {
  const handleCopy = () => {
    const bibtex = generateBibtex(paper);
    navigator.clipboard.writeText(bibtex);
    
    // Using your existing Toast system
    toast.success('BibTeX copied to clipboard!', {
      style: { background: '#22d3ee', color: '#000' }, // Matches your accent color
    });
  };

  return (
    <button 
      onClick={handleCopy}
      className="flex items-center gap-2 px-4 py-2 text-sm font-semibold text-accent border border-accent rounded-full hover:bg-accent hover:text-white transition-all duration-300"
    >
      <FiCopy size={16} /> Cite
    </button>
  );
}