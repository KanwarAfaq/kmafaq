import React, { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Search, ExternalLink, Calendar, MapPin, 
  DollarSign, FileText, Filter, Briefcase, X, AlertCircle, Sparkles
} from 'lucide-react';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseAnonKey);

// --- Skeleton Loader ---
const SkeletonCard = () => (
  <div className="bg-white/50 dark:bg-slate-900/50 rounded-3xl p-6 border border-slate-200/50 dark:border-slate-800/50 animate-pulse">
    <div className="h-6 w-3/4 bg-slate-200 dark:bg-slate-800 rounded-lg mb-4"></div>
    <div className="flex gap-2 mb-6">
      <div className="h-8 w-20 bg-slate-200 dark:bg-slate-800 rounded-full"></div>
      <div className="h-8 w-32 bg-slate-200 dark:bg-slate-800 rounded-full"></div>
    </div>
    <div className="h-10 w-full bg-slate-200 dark:bg-slate-800 rounded-xl"></div>
  </div>
);

// --- Date Parsing Engine ---
const getDeadlineInfo = (deadlineStr) => {
  if (!deadlineStr || deadlineStr.toLowerCase().includes('ongoing')) {
    return { status: 'safe', label: deadlineStr || 'Ongoing' };
  }
  
  const deadlineDate = new Date(deadlineStr);
  if (isNaN(deadlineDate.getTime())) {
    return { status: 'safe', label: deadlineStr }; // Fallback if Gemini gave a weird string
  }
  
  const today = new Date();
  const diffTime = deadlineDate - today;
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  
  if (diffDays < 0) return { status: 'passed', label: deadlineStr };
  if (diffDays <= 14) return { status: 'urgent', label: deadlineStr, daysLeft: diffDays };
  return { status: 'safe', label: deadlineStr };
};

export default function Scholarships() {
  const [scholarships, setScholarships] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCountry, setSelectedCountry] = useState('All');
  const [activeItem, setActiveItem] = useState(null); // Controls the modal

  useEffect(() => {
    fetchScholarships();
  }, []);

  async function fetchScholarships() {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('phd_scholarships')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setScholarships(data || []);
    } catch (err) {
      console.error('Error fetching scholarships:', err.message);
    } finally {
      setLoading(false);
    }
  }

  const countries = ['All', 'Finland', 'UK', 'Australia', 'Denmark', 'Germany', 'Switzerland', 'Norway'];
  
  // Filter Logic: Remove passed deadlines, match search, match country
  const filteredScholarships = scholarships.filter(item => {
    const deadlineInfo = getDeadlineInfo(item.deadline);
    if (deadlineInfo.status === 'passed') return false; // Filter out expired

    const searchLower = searchQuery.toLowerCase();
    const matchesSearch = 
      item.title?.toLowerCase().includes(searchLower) ||
      item.institution?.toLowerCase().includes(searchLower);

    const matchesCountry = 
      selectedCountry === 'All' || 
      item.country?.toLowerCase() === selectedCountry.toLowerCase();

    return matchesSearch && matchesCountry;
  });

  return (
    <div className="relative min-h-screen bg-slate-50 dark:bg-[#0B0F19] text-slate-900 dark:text-slate-100 font-sans overflow-x-hidden pt-24 pb-20">
      
      <div className="absolute top-0 inset-x-0 h-[500px] bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-indigo-100/40 via-slate-50 to-slate-50 dark:from-indigo-900/20 dark:via-[#0B0F19] dark:to-[#0B0F19] pointer-events-none -z-10" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        
        {/* Header Section */}
        <div className="flex flex-col items-center text-center space-y-6 max-w-3xl mx-auto pt-8">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 ring-1 ring-inset ring-indigo-500/20">
            <Sparkles className="w-3.5 h-3.5" />
            Active Opportunities Only
          </div>
          <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight text-slate-900 dark:text-white leading-[1.1]">
            NLP & AI PhD
            <span className="block mt-2 text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-cyan-500 dark:from-indigo-400 dark:to-cyan-400">
              Tracker
            </span>
          </h1>
        </div>

        {/* Search & Filter Bar */}
        <div className="sticky top-20 z-20 backdrop-blur-xl bg-white/70 dark:bg-slate-900/60 p-3 rounded-2xl md:rounded-full shadow-sm ring-1 ring-slate-200/50 dark:ring-slate-700/50 flex flex-col md:flex-row gap-3 items-center justify-between">
          <div className="relative w-full md:w-[400px]">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search roles or institutions..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-11 pr-4 py-3 bg-transparent border-none rounded-full text-sm font-medium focus:outline-none focus:ring-0 placeholder:text-slate-400 dark:text-white"
            />
          </div>
          <div className="h-[1px] md:h-8 w-full md:w-[1px] bg-slate-200 dark:bg-slate-700/50" />
          <div className="flex items-center gap-2 overflow-x-auto w-full md:w-auto px-2 pb-2 md:pb-0 scrollbar-none snap-x">
            <Filter className="w-4 h-4 text-slate-400 mr-2 hidden sm:block shrink-0" />
            {countries.map((c) => (
              <button
                key={c}
                onClick={() => setSelectedCountry(c)}
                className={`snap-start px-4 py-2 rounded-full text-xs font-bold whitespace-nowrap transition-all ${
                  selectedCountry === c
                    ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-900 shadow-md'
                    : 'text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800'
                }`}
              >
                {c}
              </button>
            ))}
          </div>
        </div>

        {/* Cards Grid */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pt-4">
            {[1, 2, 3].map((i) => <SkeletonCard key={i} />)}
          </div>
        ) : filteredScholarships.length === 0 ? (
          <div className="text-center py-24 px-4 text-slate-500">No active positions match your criteria.</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pt-4">
            {filteredScholarships.map((item) => {
              const deadlineInfo = getDeadlineInfo(item.deadline);
              const isUrgent = deadlineInfo.status === 'urgent';

              return (
                <motion.div
                  layoutId={`card-${item.id}`}
                  onClick={() => setActiveItem(item)}
                  key={item.id}
                  className="group cursor-pointer relative flex flex-col justify-between bg-white dark:bg-[#111827] border border-slate-200 dark:border-slate-800 rounded-3xl p-6 hover:shadow-xl dark:hover:border-indigo-500/50 transition-all duration-300 hover:-translate-y-1"
                >
                  <div className="space-y-4">
                    {/* Title */}
                    <h3 className="font-bold text-lg text-slate-900 dark:text-slate-100 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 leading-snug">
                      {item.title}
                    </h3>

                    {/* Metadata Chips (Country, Salary, Deadline) */}
                    <div className="flex flex-col gap-2.5 items-start mt-4">
                      
                      <span className="inline-flex items-center gap-1.5 text-xs font-bold px-3 py-1.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                        <MapPin className="w-3.5 h-3.5" />
                        {item.country}
                      </span>

                      {item.salary_funding && (
                        <div className="inline-flex items-start gap-1.5 text-[12px] font-bold px-3 py-2 rounded-xl bg-emerald-50 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border border-emerald-200/60 dark:border-emerald-500/20 max-w-full">
                          <DollarSign className="w-4 h-4 shrink-0 mt-0.5" />
                          <span className="whitespace-normal break-words leading-tight">{item.salary_funding}</span>
                        </div>
                      )}

                      <div className={`inline-flex items-center gap-1.5 text-xs font-bold px-3 py-2 rounded-xl border w-full mt-2 transition-colors ${
                        isUrgent 
                          ? 'bg-red-50 dark:bg-red-950/30 text-red-600 dark:text-red-400 border-red-200 dark:border-red-900/50' 
                          : 'bg-slate-50 dark:bg-slate-800/50 text-slate-600 dark:text-slate-400 border-slate-200/50 dark:border-slate-700/50'
                      }`}>
                        {isUrgent ? <AlertCircle className="w-4 h-4" /> : <Calendar className="w-4 h-4" />}
                        <span className="truncate">
                          Deadline: {deadlineInfo.label} {isUrgent && `(in ${deadlineInfo.daysLeft} days!)`}
                        </span>
                      </div>
                    </div>
                  </div>
                  
                  {/* Visual hint to click */}
                  <div className="mt-6 text-xs font-semibold text-indigo-500 flex items-center justify-end opacity-0 group-hover:opacity-100 transition-opacity">
                    View Details &rarr;
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}
      </div>

      {/* --- Detailed View Modal --- */}
      <AnimatePresence>
        {activeItem && (
          <>
            {/* Modal Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setActiveItem(null)}
              className="fixed inset-0 z-50 bg-slate-900/40 dark:bg-black/60 backdrop-blur-sm"
            />
            
            {/* Modal Content */}
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none">
              <motion.div
                layoutId={`card-${activeItem.id}`}
                className="w-full max-w-2xl bg-white dark:bg-slate-900 rounded-[2rem] shadow-2xl overflow-hidden pointer-events-auto border border-slate-200 dark:border-slate-800 flex flex-col max-h-[90vh]"
              >
                {/* Modal Header */}
                <div className="flex justify-between items-start p-6 border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900 shrink-0">
                  <div className="pr-8">
                    <h2 className="text-2xl font-extrabold text-slate-900 dark:text-white leading-tight">
                      {activeItem.title}
                    </h2>
                    <p className="text-slate-500 dark:text-slate-400 font-medium mt-2 flex items-center gap-1.5">
                      <Briefcase className="w-4 h-4" />
                      {activeItem.institution} • {activeItem.country}
                    </p>
                  </div>
                  <button 
                    onClick={() => setActiveItem(null)}
                    className="p-2 bg-slate-100 dark:bg-slate-800 rounded-full text-slate-500 hover:text-slate-900 dark:hover:text-white transition-colors"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                {/* Modal Body (Scrollable) */}
                <div className="p-6 overflow-y-auto space-y-6">
                  
                  {/* Funding & Dates Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-100 dark:border-emerald-900/30">
                      <p className="text-xs font-bold text-emerald-600 dark:text-emerald-500 uppercase tracking-wider mb-1">Funding & Salary</p>
                      <p className="text-sm font-semibold text-slate-900 dark:text-emerald-100">{activeItem.salary_funding || 'Not specified'}</p>
                    </div>
                    
                    <div className="p-4 rounded-2xl bg-indigo-50 dark:bg-indigo-950/20 border border-indigo-100 dark:border-indigo-900/30">
                      <p className="text-xs font-bold text-indigo-600 dark:text-indigo-500 uppercase tracking-wider mb-1">Important Dates</p>
                      <p className="text-sm font-semibold text-slate-900 dark:text-indigo-100">Closes: {activeItem.deadline || 'Ongoing'}</p>
                      <p className="text-xs text-slate-500 dark:text-indigo-300 mt-1">Starts: {activeItem.start_date || 'TBD'}</p>
                    </div>
                  </div>

                  {/* Documents */}
                  {activeItem.documents_required && activeItem.documents_required.length > 0 && (
                    <div>
                      <h4 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2 mb-3">
                        <FileText className="w-4 h-4 text-indigo-500" />
                        Application Requirements
                      </h4>
                      <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        {activeItem.documents_required.map((doc, idx) => (
                          <li key={idx} className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-300 bg-slate-50 dark:bg-slate-800/50 p-2.5 rounded-lg border border-slate-100 dark:border-slate-800">
                            <div className="w-1.5 h-1.5 rounded-full bg-indigo-500 shrink-0" />
                            {doc}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* Strategic Fit */}
                  {activeItem.strategic_fit && (
                    <div className="p-5 rounded-2xl bg-slate-900 dark:bg-slate-800 text-white border border-slate-800 dark:border-slate-700">
                      <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Agent Analysis</h4>
                      <p className="text-sm font-medium leading-relaxed italic text-slate-200">"{activeItem.strategic_fit}"</p>
                    </div>
                  )}
                </div>

                {/* Modal Footer / Action */}
                <div className="p-6 border-t border-slate-100 dark:border-slate-800 shrink-0 bg-white dark:bg-slate-900">
                  <a
                    href={activeItem.direct_url || '#'}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full flex items-center justify-center gap-2 py-4 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold transition-colors shadow-lg shadow-indigo-500/20"
                  >
                    Go to Application Portal
                    <ExternalLink className="w-4 h-4" />
                  </a>
                </div>
              </motion.div>
            </div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}