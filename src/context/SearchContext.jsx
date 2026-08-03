import { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

const SearchContext = createContext();

export const SearchProvider = ({ children }) => {
  const [query, setQuery] = useState('');
  const [open, setOpen] = useState(false);
  const [searchData, setSearchData] = useState([]);
  const [results, setResults] = useState([]);

  useEffect(() => {
    const buildSearchIndex = async () => {
      try {
        // 1. Static Pages Array
        const pages = [
          { title: 'Home', desc: 'Main landing page', path: '/', type: 'Page' },
          { title: 'About', desc: 'My background and skills', path: '/about', type: 'Page' },
          { title: 'Projects', desc: 'Research and development projects', path: '/projects', type: 'Page' },
          { title: 'Gallery', desc: 'Visual showcase', path: '/p-gallery', type: 'Page' },
          { title: 'Blog', desc: 'Articles and notes', path: '/blog', type: 'Page' },
          { title: 'Contact', desc: 'Get in touch', path: '/contact', type: 'Page' },
          { title: 'All-in-One', desc: 'Single page view', path: '/all-in-one', type: 'Page' },
        ];

        // 2. Fetch Live Projects from Supabase
        const { data: projects } = await supabase.from('projects').select('title, desc_text, id');
        const projectItems = (projects || []).map(p => ({
          title: p.title,
          desc: p.desc_text,
          path: '/projects', 
          type: 'Project'
        }));

        // 3. Fetch Live Blogs from Supabase
        const { data: blogs } = await supabase.from('blogs').select('title, excerpt, slug');
        const blogItems = (blogs || []).map(b => ({
          title: b.title,
          desc: b.excerpt,
          path: `/blog/${b.slug}`,
          type: 'Blog'
        }));

        // Combine everything into a single searchable array
        setSearchData([...pages, ...projectItems, ...blogItems]);
      } catch (err) {
        console.error("Failed to build global search index:", err);
      }
    };

    buildSearchIndex();
  }, []);

  // Filter logic whenever the user types in the search bar
  useEffect(() => {
    if (!query.trim()) {
      setResults([]);
      return;
    }
    
    const q = query.toLowerCase();
    const filtered = searchData.filter(item => 
      item.title?.toLowerCase().includes(q) || 
      item.desc?.toLowerCase().includes(q) ||
      item.type?.toLowerCase().includes(q)
    );
    
    setResults(filtered);
  }, [query, searchData]);

  return (
    <SearchContext.Provider value={{ query, setQuery, open, setOpen, results }}>
      {children}
    </SearchContext.Provider>
  );
};

export const useSearch = () => useContext(SearchContext);