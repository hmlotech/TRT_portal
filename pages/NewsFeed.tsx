import React, { useState, useEffect, useRef } from 'react';
import { LightBackground } from '../components/visuals/Backgrounds';
import { Badge } from '../components/ui/Badge';
import { NEWS_ITEMS } from '../constants';
import { 
  Filter, Clock, Share2, ExternalLink, Zap, 
  Flame, Calendar, ChevronDown, ChevronUp, 
  Globe, Atom, Target,
  FileText, Building, TestTube, AlertTriangle,
  ChevronsUpDown, CalendarDays, Microscope,
  Layers, RotateCcw, Sparkles, User, Search, Download,
  GalleryVertical, Table, X, FileSpreadsheet, Flag, Settings
} from 'lucide-react';
import { ChatBot } from '../components/features/ChatBot';
import { NewsItem, NewsType, Region, KeyCatalyst, KeyEvent } from '../types';
import * as XLSX from 'xlsx';

// --- Types ---
type ViewMode = 'card' | 'table';

// --- Filter Configuration ---
const FILTER_CONFIG = {
  type: { label: 'News Type', icon: <Layers size={14} />, options: ['Commercial', 'Clinical', 'Regulatory', 'Partnership', 'Funding', 'Market Access', 'Technology', 'Manufacturing', 'Supply', 'Research'] },
  subType: { label: 'News Subtype', icon: <FileText size={14} />, options: ['Trial Initiation', 'Trial Results', 'Approval', 'Licensing Agreement', 'M&A', 'Series A', 'Series B', 'Series C', 'IPO', 'Patent', 'Conference Data', 'Guideline Update'] },
  isotope: { label: 'Isotope', icon: <Atom size={14} />, options: ['177Lu', '225Ac', '212Pb', '68Ga', '131I', '64Cu', '67Cu', '211At', '223Ra', '89Zr'] },
  isotopeType: { label: 'Isotope Type', icon: <Zap size={14} />, options: ['Alpha', 'Beta'] },
  target: { label: 'Target', icon: <Target size={14} />, options: ['PSMA', 'SSTR', 'FAP', 'GRPR', 'CD33', 'CD37', 'B7-H3', 'HER2', 'GPC3', 'CA9'] },
  tumorType: { label: 'Tumor Type', icon: <Microscope size={14} />, options: ['Prostate Cancer', 'Neuroendocrine Tumors', 'Glioblastoma', 'Lung Cancer', 'Breast Cancer', 'Pancreatic Cancer', 'Renal Cell Carcinoma', 'Lymphoma'] },
  assetFocus: { label: 'Asset Focus', icon: <TestTube size={14} />, options: ['Therapeutic', 'Diagnostic', 'Theranostic'] },
  region: { label: 'Region', icon: <Globe size={14} />, options: ['Global', 'North America', 'Europe', 'APAC', 'LATAM', 'MENA'] },
};

const FilterPanel: React.FC<{
    filters: { [key: string]: string[] };
    dateRange: { start: string; end: string };
    expandedSections: { [key: string]: boolean };
    toggleFilter: (cat: string, val: string) => void;
    toggleSection: (sec: string) => void;
    toggleAllSections: () => void;
    clearAllFilters: () => void;
    clearFilterCategory: (cat: string) => void;
    clearDateFilter: () => void;
    setDateRange: React.Dispatch<React.SetStateAction<{ start: string; end: string }>>;
}> = ({ 
    filters, dateRange, expandedSections, 
    toggleFilter, toggleSection, toggleAllSections, 
    clearAllFilters, clearFilterCategory, clearDateFilter, setDateRange 
}) => {
    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between mb-2 pb-4 border-b border-gray-100">
                 <div className="flex items-center gap-2 text-gray-800 font-serif font-semibold">
                    <Filter size={18} />
                    <span>Refine</span>
                 </div>
                 <div className="flex items-center gap-1">
                     <button onClick={clearAllFilters} className="p-1.5 hover:bg-gray-100 rounded-lg text-gray-400 hover:text-red-500 transition-colors" title="Clear All Filters"><RotateCcw size={16} /></button>
                     <button onClick={toggleAllSections} className="p-1.5 hover:bg-gray-100 rounded-lg text-gray-500 hover:text-brand-cyan transition-colors" title="Toggle All"><ChevronsUpDown size={16} /></button>
                 </div>
            </div>
            <div className="space-y-3">
                 {Object.entries(FILTER_CONFIG).map(([key, config]) => (
                    <div key={key} className="border border-gray-100 rounded-lg overflow-hidden bg-white shadow-sm">
                       <div onClick={() => toggleSection(key)} className={`w-full flex items-center justify-between p-3 text-sm font-medium transition-colors cursor-pointer select-none ${expandedSections[key] ? 'bg-gray-50 text-brand-cyan' : 'bg-white text-gray-700 hover:bg-gray-50'}`}>
                          <div className="flex items-center gap-2"><span className="text-gray-400">{config.icon}</span><span>{config.label}</span>{filters[key].length > 0 && (<span className="ml-2 px-1.5 py-0.5 bg-brand-cyan text-white text-[10px] rounded-full font-bold">{filters[key].length}</span>)}</div>
                          <div className="flex items-center gap-2">{filters[key].length > 0 && (<button onClick={(e) => { e.stopPropagation(); clearFilterCategory(key); }} className="p-1 hover:bg-red-50 text-gray-400 hover:text-red-500 rounded transition-colors"><RotateCcw size={12} /></button>)}{expandedSections[key] ? <ChevronUp size={14} /> : <ChevronDown size={14} />}</div>
                       </div>
                       {expandedSections[key] && (
                          <div className="p-3 bg-gray-50/50 border-t border-gray-100 space-y-2 animate-[fadeIn_0.2s_ease-out]">
                             {config.options.map(option => {
                                const isSelected = filters[key].includes(option);
                                return (
                                    <label key={option} className={`flex items-center gap-3 cursor-pointer p-2 rounded-md transition-all ${isSelected ? 'bg-slate-800 text-white shadow-md transform scale-[1.02]' : 'hover:bg-white text-gray-600'}`}>
                                       <div className={`w-4 h-4 rounded border flex items-center justify-center flex-shrink-0 transition-all ${isSelected ? 'bg-brand-cyan border-brand-cyan' : 'border-gray-300 bg-white'}`}><input type="checkbox" className="hidden" onChange={() => toggleFilter(key, option)} checked={isSelected} />{isSelected && <div className="w-1.5 h-1.5 bg-white rounded-full"></div>}</div>
                                       <span className={`text-xs ${isSelected ? 'font-semibold' : ''}`}>{option}</span>
                                    </label>
                                );
                             })}
                          </div>
                       )}
                    </div>
                 ))}
                 <div className="border border-gray-100 rounded-lg overflow-hidden bg-white shadow-sm">
                    <div onClick={() => toggleSection('date')} className={`w-full flex items-center justify-between p-3 text-sm font-medium transition-colors cursor-pointer select-none ${expandedSections['date'] ? 'bg-gray-50 text-brand-cyan' : 'bg-white text-gray-700 hover:bg-gray-50'}`}><div className="flex items-center gap-2"><span className="text-gray-400"><CalendarDays size={14} /></span><span>Date Range</span></div><div className="flex items-center gap-2">{(dateRange.start || dateRange.end) && (<button onClick={(e) => { e.stopPropagation(); clearDateFilter(); }} className="p-1 hover:bg-red-50 text-gray-400 hover:text-red-500 rounded transition-colors"><RotateCcw size={12} /></button>)}{expandedSections['date'] ? <ChevronUp size={14} /> : <ChevronDown size={14} />}</div></div>
                    {expandedSections['date'] && (<div className="p-3 bg-gray-50/50 border-t border-gray-100 space-y-3 animate-[fadeIn_0.2s_ease-out]"><div><label className="block text-[10px] font-bold text-gray-400 uppercase mb-1">From</label><input type="date" value={dateRange.start} onChange={(e) => setDateRange(prev => ({ ...prev, start: e.target.value }))} className="w-full text-xs p-2 rounded border text-gray-900 bg-white" /></div><div><label className="block text-[10px] font-bold text-gray-400 uppercase mb-1">To</label><input type="date" value={dateRange.end} onChange={(e) => setDateRange(prev => ({ ...prev, end: e.target.value }))} className="w-full text-xs p-2 rounded border text-gray-900 bg-white" /></div></div>)}
                 </div>
            </div>
        </div>
    );
};

const ActionButton: React.FC<{ onClick: () => void; icon: React.ReactNode; label: string; active?: boolean }> = ({ onClick, icon, label, active }) => (
    <button onClick={onClick} className={`group relative p-2 rounded-lg transition-all duration-200 ${active ? 'bg-gray-100 text-brand-cyan shadow-sm' : 'text-gray-400 hover:text-gray-900 hover:bg-gray-50'}`}>{icon}<span className="absolute top-full right-0 mt-2 whitespace-nowrap bg-gray-900 text-white text-[10px] font-bold py-1 px-2 rounded opacity-0 group-hover:opacity-100 transition-all duration-200 translate-y-[-5px] group-hover:translate-y-0 pointer-events-none z-50 shadow-xl">{label}<span className="absolute bottom-full right-3 border-4 border-transparent border-b-gray-900"></span></span></button>
);

const TableTooltip: React.FC<{ text: string }> = ({ text }) => {
    const textRef = useRef<HTMLDivElement>(null);
    const [isOverflowing, setIsOverflowing] = useState(false);
    useEffect(() => { const check = () => { const el = textRef.current; if (el) setIsOverflowing(el.scrollHeight > el.clientHeight || el.scrollWidth > el.clientWidth); }; check(); window.addEventListener('resize', check); return () => window.removeEventListener('resize', check); }, [text]);
    return (<div className="group relative w-full h-full flex items-center"><div ref={textRef} className="line-clamp-3 text-ellipsis overflow-hidden break-words w-full">{text}</div>{isOverflowing && (<div className="absolute left-1/2 -translate-x-1/2 bottom-full mb-2 w-64 bg-gray-900 text-white text-xs p-3 rounded-lg shadow-xl opacity-0 group-hover:opacity-100 transition-opacity z-50 leading-relaxed font-normal text-left">{text}<div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-gray-900"></div></div>)}</div>);
};

const NewsFeed: React.FC = () => {
  const [viewMode, setViewMode] = useState<ViewMode>('card');
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);
  const [filters, setFilters] = useState<{ [key: string]: string[] }>({ type: [], subType: [], isotope: [], isotopeType: [], target: [], tumorType: [], assetFocus: [], region: [] });
  const [dateRange, setDateRange] = useState({ start: '', end: '' });
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [currentDate, setCurrentDate] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [expandedSections, setExpandedSections] = useState<{ [key: string]: boolean }>({ type: false, subType: false, isotope: false, isotopeType: false, target: false, tumorType: false, assetFocus: false, region: false, date: false });

  // News Items State (initialized from localStorage or constant)
  const [newsItems, setNewsItems] = useState<NewsItem[]>([]);

  // Load catalysts and events from localStorage
  const [catalysts, setCatalysts] = useState<KeyCatalyst[]>([]);
  const [events, setEvents] = useState<KeyEvent[]>([]);

  const searchContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const now = new Date();
    const timeString = now.toLocaleString('en-US', { month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit' });
    setCurrentDate(`${timeString} ET`);

    // Load News Data from localStorage
    const savedNews = localStorage.getItem('newsData');
    if (savedNews) {
        setNewsItems(JSON.parse(savedNews));
    } else {
        setNewsItems(NEWS_ITEMS);
    }

    // Load dynamic data from Admin page persistence
    const savedCatalysts = localStorage.getItem('adminCatalysts');
    if (savedCatalysts) {
        setCatalysts(JSON.parse(savedCatalysts));
    } else {
        setCatalysts([ 
            { 
                id: '1', 
                title: 'Pluvicto® (mHSPC): Approval in US, JP & CN', 
                date: 'H2 2026', 
                color: 'bg-purple-500', 
                url: 'https://www.novartis.com/news/media-releases/novartis-delivered-high-single-digit-sales-growth-achieved-40-core-margin-and-further-advanced-pipeline-2025' 
            }, 
            { 
                id: '2', 
                title: 'Telix - trial initiations: 225Ac-TLX592 (Ph I AlphaPRO trial-mCRPC)', 
                date: '2026', 
                color: 'bg-brand-cyan', 
                url: 'https://telixpharma.com/news-views/telix-achieves-fy-2025-guidance-with-us804m-a1-2b-revenue-accelerates-growth-with-gozellix-launch/' 
            }, 
            { 
                id: '3', 
                title: 'Rina-S®: Launch in ovarian cancer', 
                date: '2027', 
                color: 'bg-brand-green', 
                url: 'https://ir.genmab.com/static-files/b69402a8-52d1-463e-93c1-45e223764aae' 
            } 
        ]);
    }

    const savedEvents = localStorage.getItem('adminEvents');
    if (savedEvents) {
        setEvents(JSON.parse(savedEvents));
    } else {
        setEvents([ 
            { id: '1', title: 'PeptiDream- FY2025 Earnings', date: '2026-02-16', location: 'Kawasaki, JP', url: 'https://www.peptidream.com/en/ir/calendar/' },
            { id: '2', title: 'TRP Summit US', date: '2026-02-24', location: 'Boston, MA', url: 'https://targeted-radiopharma-target-selection-drug-design.com/?utm_source=internal&utm_medium=event' },
            { id: '3', title: 'Molecular Partners - FY2025 Earnings', date: '2026-03-13', location: 'Zurich, CH', url: 'https://investors.molecularpartners.com/events/event-details/fourth-quarter-and-full-year-2025-resu' }
        ]);
    }

    const handleClickOutside = (event: MouseEvent) => { if (searchContainerRef.current && !searchContainerRef.current.contains(event.target as Node)) setIsSearchOpen(false); };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const toggleFilter = (category: string, value: string) => { setFilters(prev => { const current = prev[category]; const updated = current.includes(value) ? current.filter(item => item !== value) : [...current, value]; return { ...prev, [category]: updated }; }); };
  const clearAllFilters = () => { setFilters({ type: [], subType: [], isotope: [], isotopeType: [], target: [], tumorType: [], assetFocus: [], region: [] }); setDateRange({ start: '', end: '' }); setSearchTerm(''); };
  const clearFilterCategory = (category: string) => setFilters(prev => ({ ...prev, [category]: [] }));
  const clearDateFilter = () => setDateRange({ start: '', end: '' });
  const toggleSection = (section: string) => setExpandedSections(prev => ({ ...prev, [section]: !prev[section] }));
  const toggleAllSections = () => { const allOpen = Object.values(expandedSections).every(Boolean); setExpandedSections(Object.keys(expandedSections).reduce((acc, key) => ({ ...acc, [key]: !allOpen }), {})); };

  const getFilteredNews = () => {
    return newsItems.filter(item => {
      if (searchTerm) {
          const s = searchTerm.toLowerCase();
          if (!item.title.toLowerCase().includes(s) && !item.summary.toLowerCase().includes(s) && !item.companies?.some(c => c.toLowerCase().includes(s)) && !item.assets?.some(a => a.toLowerCase().includes(s))) return false;
      }
      if ((dateRange.start && new Date(item.date) < new Date(dateRange.start)) || (dateRange.end && new Date(item.date) > new Date(dateRange.end))) return false;
      const check = (cat: string, val?: string | string[]) => { if (filters[cat].length === 0) return true; if (!val) return false; return Array.isArray(val) ? val.some(v => filters[cat].includes(v)) : filters[cat].includes(val); };
      return check('type', item.type) && check('subType', item.subType) && check('isotope', item.isotope) && check('isotopeType', item.isotopeType) && check('target', item.target) && check('tumorType', item.tumorType) && check('assetFocus', item.assetFocus) && check('region', item.region);
    });
  };

  const filteredNews = getFilteredNews();
  const filteredCount = filteredNews.length;

  const handleDownload = () => {
    const exportData = filteredNews.map(item => ({ ID: item.id, Date: item.date, Type: item.type, Title: item.title, Summary: item.summary, Source: item.sourceName || '', Companies: item.companies?.join(', ') || '', Assets: item.assets?.join(', ') || '', TumorType: item.tumorType || '', Target: item.target || '', Isotope: item.isotope || '', Region: item.region || '' }));
    const ws = XLSX.utils.json_to_sheet(exportData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Intelligence Feed");
    XLSX.writeFile(wb, `TRT_Intelligence_${new Date().toISOString().slice(0,10)}.xlsx`);
  };

  return (
    <div className="min-h-screen pt-24 px-8 pb-8 font-sans">
      <LightBackground />
      {/* Passing dynamic newsItems to ChatBot ensuring it sees bulk uploaded data */}
      <ChatBot contextData={newsItems} />

      <div className="flex items-center justify-between mb-6 h-10 gap-4">
          <div className="flex items-center gap-3"><h1 className="text-3xl font-serif font-bold text-gray-900">News Feed</h1><span className="px-1.5 py-0.5 rounded-md bg-gray-900 text-white text-[10px] font-bold shadow-sm min-w-fit text-center transition-all">{filteredCount}</span><div className="hidden md:flex text-[10px] text-gray-400 font-medium items-center gap-1.5 bg-white px-3 py-1.5 rounded-full border border-gray-100 shadow-sm whitespace-nowrap ml-2"><span className="relative flex h-1.5 w-1.5"><span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span><span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-green-500"></span></span>Updated: {currentDate}</div></div>
          <div className="flex items-center gap-3"><div ref={searchContainerRef} className={`flex items-center bg-white border border-gray-200 rounded-lg transition-all duration-300 ease-in-out ${isSearchOpen || searchTerm ? 'w-64 px-2 py-1.5 shadow-sm' : 'w-9 h-9 justify-center border-transparent hover:bg-gray-50'}`}><Search size={16} className={`text-gray-500 cursor-pointer flex-shrink-0 ${isSearchOpen || searchTerm ? '' : 'hover:text-brand-cyan'}`} onClick={() => setIsSearchOpen(!isSearchOpen)} /><input type="text" placeholder="Search..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className={`ml-2 bg-transparent border-none outline-none text-xs w-full text-gray-700 placeholder-gray-400 ${isSearchOpen || searchTerm ? 'block' : 'hidden'}`} autoFocus={isSearchOpen} />{searchTerm && <button onClick={() => setSearchTerm('')} className="text-gray-400 hover:text-red-500"><X size={12} /></button>}</div>{viewMode === 'table' && (<ActionButton onClick={() => setIsFilterModalOpen(true)} icon={<Filter size={16} />} label="Filter Data" />)}<ActionButton onClick={handleDownload} icon={<Download size={16} />} label="Download News" /><div className="flex items-center bg-white border border-gray-200 rounded-lg p-0.5 shadow-sm h-9"><ActionButton onClick={() => setViewMode('card')} icon={<GalleryVertical size={16} />} label="Card View" active={viewMode === 'card'} /><div className="w-px h-4 bg-gray-200 mx-0.5"></div><ActionButton onClick={() => setViewMode('table')} icon={<Table size={16} />} label="Table View" active={viewMode === 'table'} /></div></div>
       </div>
      
      <div className="flex flex-col lg:flex-row gap-8">
        {viewMode === 'card' && (<aside className="hidden lg:block w-60 flex-shrink-0 space-y-6"><div className="bg-white rounded-xl border border-gray-100 shadow-sm p-4 sticky top-24 overflow-y-auto max-h-[calc(100vh-8rem)] custom-scrollbar"><FilterPanel filters={filters} dateRange={dateRange} expandedSections={expandedSections} toggleFilter={toggleFilter} toggleSection={toggleSection} toggleAllSections={toggleAllSections} clearAllFilters={clearAllFilters} clearFilterCategory={clearFilterCategory} clearDateFilter={clearDateFilter} setDateRange={setDateRange} /></div></aside>)}
        <main className={`flex-1 min-w-0 ${viewMode === 'table' ? 'w-full' : ''}`}><div className="space-y-5">{filteredCount === 0 ? (<div className="text-center py-20 bg-white rounded-xl border border-gray-100"><p className="text-gray-400">No signals found.</p></div>) : viewMode === 'card' ? (filteredNews.map((item) => <NewsCard key={item.id} item={item} />)) : (<div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden flex flex-col h-[calc(100vh-12rem)]"><div className="overflow-y-auto custom-scrollbar flex-1 relative"><table className="w-full text-left border-collapse table-fixed"><thead className="sticky top-0 z-20"><tr className="bg-sky-50/95 backdrop-blur-md border-y border-sky-100 shadow-[0_1px_3px_rgba(0,0,0,0.05)] text-[10px] font-bold text-gray-600 uppercase tracking-wider"><th className="px-3 py-4 w-[8%]">Date</th><th className="px-3 py-4 w-[8%]">Type</th><th className="px-3 py-4 w-[15%]">Title</th><th className="px-3 py-4 w-[23%]">Summary</th><th className="px-3 py-4 w-[10%]">Company</th><th className="px-3 py-4 w-[8%]">Asset</th><th className="px-3 py-4 w-[8%]">Indication</th><th className="px-3 py-4 w-[6%]">Isotope</th><th className="px-3 py-4 w-[6%]">Target</th><th className="px-3 py-4 w-[8%]">Region</th></tr></thead><tbody className="divide-y divide-gray-50 text-xs text-gray-700">{filteredNews.map((item) => { const isKey = item.priority === 'Key'; return (<tr key={item.id} className="h-[5.5rem] transition-all border-b border-gray-50 last:border-b-0 hover:bg-gray-50"><td className="px-3 py-2 font-mono text-gray-500 align-middle relative">{isKey && (<div className="absolute left-0 top-3 bottom-3 w-1.5 bg-emerald-500 rounded-r shadow-sm"></div>)}<span className={isKey ? "font-bold text-gray-900 ml-1.5" : ""}>{item.date}</span></td><td className="px-3 py-2 align-middle"><Badge variant={item.type === 'Partnership' ? 'info' : item.type === 'Funding' ? 'success' : item.type === 'Clinical' ? 'default' : 'purple'} className="text-[9px] px-1.5">{item.type}</Badge></td><td className="px-3 py-2 font-bold text-gray-900 align-middle leading-snug"><TableTooltip text={item.title} /></td><td className="px-3 py-2 text-gray-500 align-middle leading-relaxed"><TableTooltip text={item.summary} /></td><td className="px-3 py-2 align-middle font-medium"><TableTooltip text={item.companies?.join(', ') || '--'} /></td><td className="px-3 py-2 align-middle font-medium text-brand-cyan"><TableTooltip text={item.assets?.join(', ') || '--'} /></td><td className="px-3 py-2 align-middle"><TableTooltip text={item.tumorType || '--'} /></td><td className="px-3 py-2 align-middle"><TableTooltip text={item.isotope || '--'} /></td><td className="px-3 py-2 align-middle"><TableTooltip text={item.target || '--'} /></td><td className="px-3 py-2 align-middle"><TableTooltip text={item.region} /></td></tr>); })}</tbody></table></div></div>)}</div><div className="flex justify-center mt-10"><button className="px-6 py-2.5 bg-white border border-gray-200 rounded-full text-sm font-medium text-gray-500 hover:text-gray-900 hover:border-gray-400 transition-all shadow-sm">Load More History</button></div></main>
        {viewMode === 'card' && (
            <aside className="hidden lg:block w-80 flex-shrink-0 relative animate-[fadeIn_0.5s_ease-out]">
                <div className="sticky top-24 z-10 space-y-6">
                    <div className="bg-slate-800 rounded-xl border border-slate-700 shadow-lg p-6">
                        <div className="flex items-center gap-2 mb-6"><div className="p-1.5 bg-orange-500/10 text-orange-400 rounded-lg"><Flame size={16} className="animate-pulse" /></div><h3 className="font-serif font-bold text-lg text-white">Key Catalysts</h3></div>
                        <div className="flex flex-col gap-6 relative max-h-64 overflow-y-auto pr-2 custom-scrollbar-dark pb-2">
                            <div className="absolute left-[14px] top-2 bottom-2 w-0.5 bg-slate-700"></div>
                            {catalysts.map((c, i) => (
                                <div key={c.id} className="relative flex items-start gap-3 group z-10">
                                    <div className="w-[30px] flex-shrink-0 flex justify-center pt-1.5">{i === 0 && <div className={`absolute w-3 h-3 rounded-full ${c.color} animate-ping opacity-75`}></div>}<div className={`w-3 h-3 rounded-full border-2 border-slate-800 shadow-sm z-20 relative ${c.color} group-hover:scale-110 transition-transform`}></div></div>
                                    <div><p className="text-xs text-brand-cyan mb-0.5 font-medium mt-1">{c.date || c.quarter}</p>{c.url ? (<a href={c.url} target="_blank" rel="noreferrer" className="text-sm font-medium text-gray-300 group-hover:text-white transition-colors flex items-center gap-1.5">{c.title}<ExternalLink size={10} className="text-gray-500 group-hover:text-brand-cyan" /></a>) : (<p className="text-sm font-medium text-gray-300">{c.title}</p>)}</div>
                                </div>
                            ))}
                        </div>
                    </div>
                    <div className="bg-white rounded-xl border border-gray-100 shadow-xl p-6">
                        <div className="flex items-center gap-2 mb-6"><div className="p-1.5 bg-blue-50 text-blue-500 rounded-lg"><Calendar size={18} /></div><h3 className="font-serif font-bold text-lg text-gray-900">Events</h3></div>
                        <div className="space-y-4 max-h-64 overflow-y-auto pr-2 custom-scrollbar">
                            {events.map((e) => {
                                const [month, day] = (e.date || 'TBD TBD').split('-').length > 1 ? [new Date(e.date).toLocaleString('default', { month: 'short' }), new Date(e.date).getDate()] : ['TBD', '??'];
                                return (
                                <div key={e.id} className="flex gap-3 group p-2 rounded-lg hover:bg-gray-50 transition-colors -mx-2">
                                    <div className="flex flex-col items-center justify-center w-10 h-10 bg-gray-100 rounded-lg group-hover:bg-brand-cyan/10 group-hover:text-brand-cyan transition-colors flex-shrink-0"><span className="text-[10px] font-bold uppercase">{month}</span><span className="text-sm font-bold">{day}</span></div>
                                    <div>{e.url ? (<a href={e.url} target="_blank" rel="noreferrer" className="text-sm font-bold text-gray-800 group-hover:text-brand-cyan transition-colors mb-0.5 flex items-center gap-1.5">{e.title}<ExternalLink size={10} className="text-gray-400 group-hover:text-brand-cyan" /></a>) : (<p className="text-sm font-bold text-gray-800 mb-0.5">{e.title}</p>)}<p className="text-xs text-gray-400">{e.location}</p></div>
                                </div>
                            )})}
                        </div>
                    </div>
                </div>
            </aside>
        )}
      </div>

      {isFilterModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-[fadeIn_0.2s_ease-out]">
              <div className="bg-white rounded-xl shadow-2xl w-full max-w-md max-h-[85vh] flex flex-col overflow-hidden"><div className="p-4 border-b bg-gray-50 flex justify-between items-center"><h3 className="text-lg font-bold text-gray-900">Filter Intelligence</h3><button onClick={() => setIsFilterModalOpen(false)} className="text-gray-400 hover:text-gray-600"><X size={20} /></button></div><div className="flex-1 overflow-y-auto p-4 custom-scrollbar"><FilterPanel filters={filters} dateRange={dateRange} expandedSections={expandedSections} toggleFilter={toggleFilter} toggleSection={toggleSection} toggleAllSections={toggleAllSections} clearAllFilters={clearAllFilters} clearFilterCategory={clearFilterCategory} clearDateFilter={clearDateFilter} setDateRange={setDateRange} /></div><div className="p-4 border-t flex justify-end"><button onClick={() => setIsFilterModalOpen(false)} className="px-6 py-2 bg-brand-cyan text-white font-bold rounded-lg shadow-lg">Apply Filters</button></div></div>
          </div>
      )}
      <style>{`.custom-scrollbar::-webkit-scrollbar { width: 4px; } .custom-scrollbar::-webkit-scrollbar-track { background: transparent; } .custom-scrollbar::-webkit-scrollbar-thumb { background-color: #e2e8f0; border-radius: 20px; } .custom-scrollbar-dark::-webkit-scrollbar { width: 4px; } .custom-scrollbar-dark::-webkit-scrollbar-track { background: transparent; } .custom-scrollbar-dark::-webkit-scrollbar-thumb { background-color: #64748b; border-radius: 20px; }`}</style>
    </div>
  );
};

const NewsCard: React.FC<{ item: NewsItem }> = ({ item }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const isKey = item.priority === 'Key';
  return (
    <div className={`relative bg-white rounded-xl border transition-all duration-300 overflow-hidden group ${isExpanded ? 'shadow-lg' : 'shadow-sm hover:shadow-md'} ${isKey ? 'border-emerald-600/20 shadow-[0_8px_30px_rgba(77,182,172,0.12)]' : 'border-gray-100 hover:border-gray-200'}`}>
       {isKey && (<div className="absolute bottom-0 left-0 right-0 h-28 pointer-events-none overflow-hidden z-0"><div className="absolute inset-0 bg-gradient-to-t from-brand-teal/10 via-brand-teal/5 to-transparent"></div><div className="absolute inset-0 opacity-30" style={{ backgroundImage: 'radial-gradient(circle, #4DB6AC 1.5px, transparent 1.5px)', backgroundSize: '24px 24px', maskImage: 'linear-gradient(to top, black, transparent)', WebkitMaskImage: 'linear-gradient(to top, black, transparent)' }}></div></div>)}
       <div className="p-6 cursor-pointer relative z-10" onClick={() => setIsExpanded(!isExpanded)}><div className="flex justify-between items-start mb-3"><div className="flex items-center gap-3"><Badge variant={item.type === 'Partnership' ? 'info' : item.type === 'Funding' ? 'success' : item.type === 'Clinical' ? 'default' : 'purple'}>{item.type}</Badge>{item.assets && item.assets.length > 0 && <span className="text-xs font-semibold text-gray-500 flex items-center gap-1 uppercase tracking-wider"><TestTube size={10} /> {item.assets.join(', ')}</span>}</div><div className="flex items-center gap-3">{item.aiSummary && <div className="flex items-center gap-1 text-[10px] text-brand-cyan bg-brand-cyan/5 px-2 py-0.5 rounded-full font-bold border border-brand-cyan/10"><Sparkles size={10} /> AI Summary</div>}{item.isHumanReviewed && <div className="flex items-center gap-1 text-[10px] text-green-600 bg-green-50 px-2 py-0.5 rounded-full font-bold border border-green-100"><User size={10} /> Verified</div>}<div className="text-xs text-gray-400 flex items-center gap-1"><Clock size={12} /> {item.date}</div></div></div><h3 className={`text-xl font-bold mb-3 leading-snug transition-colors pr-8 ${isKey ? 'text-gray-900 group-hover:text-brand-teal' : 'text-gray-900 group-hover:text-brand-cyan'}`}>{item.title}</h3><div className="flex flex-wrap gap-2 mb-4">{item.isotope && <div className="flex items-center gap-1 px-2 py-1 rounded border border-gray-200 bg-gray-50 text-xs font-semibold text-gray-700"><Atom size={12} className="text-brand-green" /> {item.isotope}</div>}{item.target && <div className="flex items-center gap-1 px-2 py-1 rounded border border-gray-200 bg-gray-50 text-xs font-semibold text-gray-700"><Target size={12} className="text-brand-cyan" /> {item.target}</div>}{item.tumorType && <div className="flex items-center gap-1 px-2 py-1 rounded border border-gray-200 bg-gray-50 text-xs font-semibold text-gray-700"><Microscope size={12} className="text-orange-400" /> {item.tumorType}</div>}</div><div className="relative"><p className={`text-sm text-gray-600 leading-relaxed border-l-2 pl-4 py-1 ${isKey ? 'border-brand-teal/40' : 'border-brand-cyan/20'}`}>{item.summary}</p></div></div>
       {isExpanded && (<div className="px-6 pb-6 pt-0 animate-[fadeIn_0.3s_ease-out] relative z-10"><div className="border-t border-gray-100 my-4"></div>{item.ciNote && (<div className="bg-amber-50 border border-amber-100 rounded-lg p-4 mb-5 flex gap-3"><div className="mt-0.5"><AlertTriangle size={16} className="text-amber-500" /></div><div><h4 className="text-xs font-bold text-amber-800 uppercase mb-1">CI Note</h4><p className="text-sm text-amber-900 leading-relaxed">{item.ciNote}</p></div></div>)}<div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm"><div className="space-y-3">{item.companies && <div className="flex items-start gap-2"><Building size={14} className="text-gray-400 mt-0.5" /><div><span className="block text-xs text-gray-500 font-semibold uppercase">Companies</span><div className="flex flex-wrap gap-1 mt-1">{item.companies.map(c => <span key={c} className="bg-gray-100 text-gray-700 px-1.5 py-0.5 rounded text-xs">{c}</span>)}</div></div></div>}</div><div className="space-y-3">{item.region && <div className="flex items-start gap-2"><Globe size={14} className="text-gray-400 mt-0.5" /><div><span className="block text-xs text-gray-500 font-semibold uppercase">Region</span><span className="text-gray-800 font-medium">{item.region}</span></div></div>}</div></div><div className="flex items-center justify-between mt-6 pt-4 border-t border-gray-50"><div className="flex items-center gap-2">{item.sourceUrl && <a href={item.sourceUrl} target="_blank" rel="noreferrer" className="text-xs font-medium text-brand-cyan hover:underline flex items-center gap-1">{item.sourceName || 'Read Source'} <ExternalLink size={10} /></a>}</div><div className="flex gap-2"><button className="p-2 text-gray-400 hover:bg-gray-100 rounded-full hover:text-brand-cyan transition-colors"><Share2 size={16} /></button></div></div></div>)}
       <div className="flex justify-center -mt-3 pb-2 opacity-0 group-hover:opacity-100 relative z-10"><div className="bg-white border border-gray-200 rounded-full p-1 shadow-sm">{isExpanded ? <ChevronUp size={12} className="text-gray-400" /> : <ChevronDown size={12} className="text-gray-400" />}</div></div>
    </div>
  );
};

export default NewsFeed;