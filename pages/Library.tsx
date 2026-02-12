
import React, { useState, useEffect } from 'react';
import { LightBackground } from '../components/visuals/Backgrounds';
import { DOCUMENTS_LIBRARY } from '../constants';
import { DocumentItem } from '../types';
import { 
  Search, Filter, Download, FileText, Eye, Lock, 
  Calendar, Tag, ChevronRight, X, ShieldAlert, Users,
  RotateCcw, ChevronsUpDown, Check
} from 'lucide-react';
import { Badge } from '../components/ui/Badge';

const Library: React.FC = () => {
  const [activeCategory, setActiveCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [previewDoc, setPreviewDoc] = useState<DocumentItem | null>(null);
  const [allDocuments, setAllDocuments] = useState<DocumentItem[]>([]);
  
  // Filter Modal State
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);
  const [filters, setFilters] = useState<{
      uploadedBy: string[];
      format: string[];
      author: string[];
      tags: string[];
  }>({
      uploadedBy: [],
      format: [],
      author: [],
      tags: []
  });
  const [dateRange, setDateRange] = useState({ start: '', end: '' });

  // Updated Categories strictly as requested
  const categories = ['All', 'Newsletter', 'Scientific Publication', 'Conference Coverage', 'Internal Report'];

  // Load documents from constant + local storage on mount
  useEffect(() => {
    const savedDocs = localStorage.getItem('uploadedDocuments');
    const parsedSavedDocs = savedDocs ? JSON.parse(savedDocs) : [];
    // Combine constant list and saved list
    // Note: In a real app we'd handle ID collision or sorting more robustly
    setAllDocuments([...DOCUMENTS_LIBRARY, ...parsedSavedDocs]);
  }, []);

  const toggleFilter = (category: keyof typeof filters, value: string) => {
      setFilters(prev => {
          const current = prev[category];
          const updated = current.includes(value) 
              ? current.filter(item => item !== value) 
              : [...current, value];
          return { ...prev, [category]: updated };
      });
  };

  const clearAllFilters = () => {
      setFilters({ uploadedBy: [], format: [], author: [], tags: [] });
      setDateRange({ start: '', end: '' });
  };

  const filteredDocs = allDocuments.filter(doc => {
    // 1. Category Tab Filter
    const matchesCategory = activeCategory === 'All' || doc.type === activeCategory;
    
    // 2. Text Search
    const matchesSearch = 
      doc.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      doc.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (Array.isArray(doc.author) ? doc.author.join(' ') : doc.author).toLowerCase().includes(searchQuery.toLowerCase());

    // 3. Modal Filters
    const matchesUploadedBy = filters.uploadedBy.length === 0 || filters.uploadedBy.includes(doc.uploadedBy);
    const matchesFormat = filters.format.length === 0 || filters.format.includes(doc.format);
    
    // Directly use doc.author as it's defined as string[] in DocumentItem interface
    const matchesAuthor = filters.author.length === 0 || filters.author.some(a => doc.author.includes(a));
    
    const matchesTags = filters.tags.length === 0 || filters.tags.some(t => doc.tags.includes(t));

    // 4. Date Range Filter
    const matchesDate = (!dateRange.start || new Date(doc.date) >= new Date(dateRange.start)) &&
                        (!dateRange.end || new Date(doc.date) <= new Date(dateRange.end));

    return matchesCategory && matchesSearch && matchesUploadedBy && matchesFormat && matchesAuthor && matchesTags && matchesDate;
  });

  // Extract unique options for filters from allDocuments with explicit Record typing to prevent indexing errors
  const uniqueOptions: Record<string, string[]> = {
      uploadedBy: Array.from(new Set(allDocuments.map(d => d.uploadedBy))).sort() as string[],
      format: Array.from(new Set(allDocuments.map(d => d.format))).sort() as string[],
      author: Array.from(new Set(allDocuments.flatMap(d => d.author))).sort() as string[],
      tags: Array.from(new Set(allDocuments.flatMap(d => d.tags))).sort() as string[]
  };

  return (
    <div className="min-h-screen pt-24 px-8 pb-8 font-sans bg-gray-50/50">
      <LightBackground />
      
      <div className="max-w-7xl mx-auto animate-[fadeIn_0.5s_ease-out]">
        
        {/* Confidentiality Banner (Standard in Pharma CI) */}
        <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 mb-8 flex items-center gap-3 text-amber-800 text-sm">
           <ShieldAlert size={16} />
           <span className="font-bold">INTERNAL USE ONLY:</span>
           <span>Documents contained in this library may contain material non-public information. Do not distribute externally.</span>
        </div>

        {/* Header Section */}
        <div className="mb-10 flex flex-col md:flex-row justify-between items-end gap-6">
           <div>
              <h1 className="text-4xl font-serif font-bold text-gray-900 mb-2">Document Repository</h1>
              <p className="text-gray-500 max-w-2xl">
                Centralized access to monthly intelligence briefs, scientific deep dives, and conference coverage decks.
              </p>
           </div>
        </div>

        {/* Toolbar */}
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-4 mb-8 flex flex-col lg:flex-row justify-between items-center gap-4">
           {/* Categories */}
           <div className="flex gap-2 overflow-x-auto w-full lg:w-auto pb-2 lg:pb-0 scrollbar-hide">
              {categories.map(cat => (
                 <button 
                    key={cat}
                    onClick={() => setActiveCategory(cat)}
                    className={`px-4 py-2 rounded-lg text-sm font-bold whitespace-nowrap transition-all ${
                       activeCategory === cat 
                       ? 'bg-gray-900 text-white shadow-md' 
                       : 'text-gray-500 hover:bg-gray-50 hover:text-gray-900'
                    }`}
                 >
                    {cat}
                 </button>
              ))}
           </div>

           {/* Search & Filter */}
           <div className="flex items-center gap-2 w-full lg:w-auto">
               <div className="relative w-full lg:w-80">
                  <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input 
                     type="text" 
                     placeholder="Search by title, tag, or author..." 
                     value={searchQuery}
                     onChange={(e) => setSearchQuery(e.target.value)}
                     className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-lg text-sm outline-none focus:border-brand-cyan focus:ring-1 focus:ring-brand-cyan transition-all bg-gray-50 focus:bg-white"
                  />
               </div>
               <button 
                  onClick={() => setIsFilterModalOpen(true)}
                  className={`p-2.5 rounded-lg border transition-all ${
                      Object.values(filters).some((arr: string[]) => arr.length > 0) || dateRange.start || dateRange.end
                      ? 'bg-brand-cyan text-white border-brand-cyan shadow-sm' 
                      : 'bg-white text-gray-500 border-gray-200 hover:border-brand-cyan hover:text-brand-cyan'
                  }`}
                  title="Filter Documents"
               >
                   <Filter size={16} />
               </button>
           </div>
        </div>

        {/* Document Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
           {filteredDocs.map(doc => (
              <div key={doc.id} className="group bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col overflow-hidden relative">
                 
                 {/* Visual Thumbnail Area */}
                 <div className="h-40 relative bg-gray-100 overflow-hidden cursor-pointer" onClick={() => setPreviewDoc(doc)}>
                    <img src={doc.thumbnailUrl || 'https://images.unsplash.com/photo-1565538420870-da58537bbf3d?auto=format&fit=crop&q=80&w=600'} alt={doc.title} className="w-full h-full object-cover opacity-90 group-hover:scale-105 transition-transform duration-700" />
                    
                    {/* Overlay Gradient */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-60"></div>
                    
                    {/* File Type Badge */}
                    <div className="absolute top-3 right-3">
                       <span className={`px-2 py-1 rounded text-[10px] font-bold uppercase tracking-wider shadow-sm ${
                          doc.format === 'PPT' ? 'bg-orange-100 text-orange-700' : 
                          doc.format === 'PDF' ? 'bg-red-100 text-red-700' : 
                          'bg-green-100 text-green-700'
                       }`}>
                          {doc.format}
                       </span>
                    </div>

                    {/* Quick Preview Button (Hover) */}
                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/20 backdrop-blur-[2px]">
                       <button className="bg-white text-gray-900 px-4 py-2 rounded-full text-xs font-bold shadow-lg flex items-center gap-2 transform translate-y-2 group-hover:translate-y-0 transition-transform">
                          <Eye size={14} /> Quick Look
                       </button>
                    </div>
                 </div>

                 {/* Content */}
                 <div className="p-5 flex-1 flex flex-col">
                    <div className="flex justify-between items-start mb-2">
                        <div className="text-[10px] font-bold uppercase tracking-wider text-brand-cyan mb-1">{doc.type}</div>
                    </div>
                    
                    <h3 className="font-serif font-bold text-gray-900 leading-tight mb-2 group-hover:text-brand-cyan transition-colors line-clamp-2">
                       {doc.title}
                    </h3>

                    <div className="flex items-center gap-3 text-xs text-gray-400 mb-4">
                       <span className="flex items-center gap-1"><Calendar size={12} /> {doc.date}</span>
                       <span className="flex items-center gap-1"><FileText size={12} /> {doc.fileSize}</span>
                    </div>

                    <div className="flex flex-wrap gap-1 mb-4 mt-auto">
                       {doc.tags.slice(0, 3).map(tag => (
                          <span key={tag} className="px-2 py-0.5 bg-gray-50 border border-gray-100 rounded text-[10px] text-gray-500">
                             #{tag}
                          </span>
                       ))}
                    </div>

                    <div className="pt-4 border-t border-gray-50 flex gap-2">
                       <button className="flex-1 bg-gray-900 text-white py-2 rounded-lg text-xs font-bold hover:bg-black transition-colors flex items-center justify-center gap-2 shadow-sm">
                          <Download size={14} /> Download
                       </button>
                    </div>
                 </div>
              </div>
           ))}
        </div>
        
        {filteredDocs.length === 0 && (
           <div className="text-center py-20">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4 text-gray-400">
                 <Search size={24} />
              </div>
              <h3 className="text-lg font-bold text-gray-900">No documents found</h3>
              <p className="text-gray-500">Try adjusting your filters or search query.</p>
           </div>
        )}

      </div>

      {/* Filter Modal */}
      {isFilterModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-[fadeIn_0.2s_ease-out]">
            <div className="bg-white rounded-xl shadow-2xl w-full max-w-md max-h-[85vh] flex flex-col overflow-hidden">
                <div className="p-4 border-b border-gray-100 flex justify-between items-center bg-gray-50">
                    <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                        <Filter size={18} /> Filter Documents
                    </h3>
                    <button onClick={() => setIsFilterModalOpen(false)} className="text-gray-400 hover:text-gray-600">
                        <X size={20} />
                    </button>
                </div>
                
                <div className="flex-1 overflow-y-auto p-4 custom-scrollbar space-y-6">
                    {/* Date Range Section */}
                    <div className="space-y-2">
                         <h4 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">Date Range</h4>
                         <div className="grid grid-cols-2 gap-3">
                             <div>
                                <label className="block text-[10px] text-gray-500 mb-1 font-semibold">Start Date</label>
                                <input 
                                    type="date" 
                                    value={dateRange.start} 
                                    onChange={(e) => setDateRange({...dateRange, start: e.target.value})}
                                    className="w-full p-2 border border-gray-200 rounded-lg text-xs bg-white text-gray-700 outline-none focus:border-brand-cyan"
                                />
                             </div>
                             <div>
                                <label className="block text-[10px] text-gray-500 mb-1 font-semibold">End Date</label>
                                <input 
                                    type="date" 
                                    value={dateRange.end} 
                                    onChange={(e) => setDateRange({...dateRange, end: e.target.value})}
                                    className="w-full p-2 border border-gray-200 rounded-lg text-xs bg-white text-gray-700 outline-none focus:border-brand-cyan"
                                />
                             </div>
                         </div>
                    </div>

                    {/* Filter Sections with explicit as const casting to ensure literal key types */}
                    {[
                        { key: 'uploadedBy', label: 'Uploaded By (Team)' },
                        { key: 'format', label: 'Format' },
                        { key: 'author', label: 'Authors' },
                        { key: 'tags', label: 'Tags' }
                    ].map((section) => (
                        <div key={section.key} className="space-y-2">
                            <h4 className="text-xs font-bold text-gray-400 uppercase tracking-widest">{section.label}</h4>
                            <div className="flex flex-wrap gap-2">
                                {(uniqueOptions[section.key] || []).map(option => {
                                    const filterKey = section.key as keyof typeof filters;
                                    const isSelected = filters[filterKey].includes(option);
                                    return (
                                        <button
                                            key={option}
                                            onClick={() => toggleFilter(filterKey, option)}
                                            className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-all ${
                                                isSelected 
                                                ? 'bg-brand-cyan text-white border-brand-cyan shadow-sm' 
                                                : 'bg-white text-gray-600 border-gray-200 hover:border-gray-300'
                                            }`}
                                        >
                                            {option}
                                        </button>
                                    );
                                })}
                            </div>
                        </div>
                    ))}
                </div>

                <div className="p-4 border-t border-gray-100 flex justify-between items-center bg-gray-50">
                    <button onClick={clearAllFilters} className="text-sm text-gray-500 hover:text-red-500 flex items-center gap-1">
                        <RotateCcw size={14} /> Clear All
                    </button>
                    <button onClick={() => setIsFilterModalOpen(false)} className="px-6 py-2 bg-brand-cyan text-white font-bold rounded-lg shadow-lg hover:bg-brand-teal transition-colors">
                        Apply Filters
                    </button>
                </div>
            </div>
        </div>
      )}

      {/* Quick Look Modal */}
      {previewDoc && (
         <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-[fadeIn_0.2s_ease-out]">
            <div className="bg-white rounded-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden shadow-2xl flex flex-col md:flex-row">
               
               {/* Preview Image / Left Col */}
               <div className="w-full md:w-1/3 bg-gray-100 relative">
                  <img src={previewDoc.thumbnailUrl || 'https://images.unsplash.com/photo-1565538420870-da58537bbf3d?auto=format&fit=crop&q=80&w=600'} alt="Preview" className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent flex flex-col justify-end p-6">
                     <Badge variant={previewDoc.format === 'PPT' ? 'orange' : 'default'} className="w-fit mb-2">{previewDoc.format}</Badge>
                     <h2 className="text-white font-serif font-bold text-xl leading-tight mb-2">{previewDoc.title}</h2>
                     <p className="text-gray-300 text-xs">{previewDoc.date} • {previewDoc.fileSize}</p>
                     <p className="text-gray-400 text-[10px] mt-1">
                        By: {Array.isArray(previewDoc.author) ? previewDoc.author.join(', ') : previewDoc.author}
                     </p>
                  </div>
               </div>

               {/* Details / Right Col */}
               <div className="flex-1 p-8 flex flex-col overflow-y-auto">
                  <div className="flex justify-between items-start mb-6">
                     <div>
                        <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">Document Type</h3>
                        <p className="font-bold text-gray-900">{previewDoc.type}</p>
                     </div>
                     <button onClick={() => setPreviewDoc(null)} className="p-2 hover:bg-gray-100 rounded-full text-gray-400 hover:text-gray-900">
                        <X size={20} />
                     </button>
                  </div>

                  <div className="mb-8">
                     <h3 className="text-sm font-bold text-gray-900 flex items-center gap-2 mb-3">
                        <FileText size={16} className="text-brand-cyan" /> Executive Summary
                     </h3>
                     <div className="bg-gray-50 p-5 rounded-xl text-sm text-gray-600 leading-relaxed border border-gray-100">
                        {previewDoc.executiveSummary}
                     </div>
                  </div>

                  <div className="mb-8">
                     <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3">Key Tags</h3>
                     <div className="flex flex-wrap gap-2">
                        {previewDoc.tags.map(tag => (
                           <span key={tag} className="px-3 py-1 bg-white border border-gray-200 rounded-full text-xs font-medium text-gray-600">
                              {tag}
                           </span>
                        ))}
                     </div>
                  </div>

                  <div className="mt-auto pt-6 border-t border-gray-100 flex gap-4">
                     <button className="flex-1 bg-brand-cyan text-white py-3 rounded-xl font-bold hover:bg-brand-teal transition-colors shadow-lg shadow-brand-cyan/20 flex items-center justify-center gap-2">
                        <Download size={18} /> Download Full Document
                     </button>
                     <button className="px-6 py-3 border border-gray-200 rounded-xl font-bold text-gray-600 hover:bg-gray-50 transition-colors">
                        Share
                     </button>
                  </div>
               </div>

            </div>
         </div>
      )}

      <style>{`
        .scrollbar-hide::-webkit-scrollbar {
            display: none;
        }
        .scrollbar-hide {
            -ms-overflow-style: none;
            scrollbar-width: none;
        }
        .custom-scrollbar::-webkit-scrollbar { width: 4px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background-color: #e2e8f0; border-radius: 20px; }
      `}</style>

    </div>
  );
};

export default Library;
