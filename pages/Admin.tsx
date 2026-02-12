import React, { useState, useRef, useEffect, useLayoutEffect } from 'react';
import { LightBackground } from '../components/visuals/Backgrounds';
import { NEWS_ITEMS, DOCUMENTS_LIBRARY } from '../constants';
import { NewsItem, NewsType, Region, EntryType, DocumentItem, KeyCatalyst, KeyEvent } from '../types';
import { 
  LayoutDashboard, Database, MessageSquare, Plus, Save, 
  Trash2, Edit3, X, Search, FileText, 
  Settings, Zap, User, Filter, Calendar, CheckCircle2, Check, ChevronDown,
  Tag, Users, Shield, Mail, MoreHorizontal, ChevronRight, Briefcase,
  MoreVertical, Lock, Unlock, UserCheck, UserX, AlertCircle, Contact,
  Flag, BookOpen, Download, Upload, File, LayoutTemplate,
  Clock, Bell, BellOff, UserPlus, FolderOpen, Layers, UserPlus2, Flame, MapPin, Link as LinkIcon
} from 'lucide-react';
import { Badge } from '../components/ui/Badge';
import * as XLSX from 'xlsx';

type AdminTab = 'news' | 'events' | 'labels' | 'users' | 'portal' | 'library';
type NewsSubTab = 'all' | 'draft';
type UserRole = 'Admin' | 'User';
type UserStatus = 'Active' | 'Inactive' | 'Pending';

interface UserData {
    id: number;
    name: string;
    email: string;
    designation: string;
    department: string;
    role: UserRole;
    status: UserStatus;
    lastActive: string;
    groups: string[];
    requestedDate?: string;
}

// --- Constants for Mapping ---
const TYPE_SUBTYPE_MAPPING: Record<string, string[]> = {
  'Commercial': ['Licensing Agreement', 'M&A', 'Launch', 'Supply Agreement', 'Commercial Updates'],
  'Clinical': ['Trial Initiation', 'Trial Results', 'Trial Stop', 'Conference Data', 'Clinical Updates'],
  'Regulatory': ['Approval', 'Expedited Designation', 'Submission', 'Guidelines', 'Regulatory Updates'],
  'Partnership': ['Licensing Agreement', 'Collaboration', 'Joint Venture'],
  'Funding': ['Series A', 'Series B', 'Series C', 'IPO', 'Follow-on', 'Grant'],
  'Market Access': ['Reimbursement', 'Pricing', 'HTA'],
  'Technology': ['New Platform', 'Patent'],
  'Manufacturing': ['Facility', 'Capacity', 'Supply Chain'],
  'Supply': ['Isotope Supply', 'Logistics'],
  'Research': ['Pre-clinical Data', 'Publication'],
};

// --- Reusable Auto-Resizing Textarea ---
interface AutoResizeTextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {}

const AutoResizeTextarea: React.FC<AutoResizeTextareaProps> = (props) => {
    const textareaRef = useRef<HTMLTextAreaElement>(null);

    useEffect(() => {
        const textarea = textareaRef.current;
        if (textarea) {
            textarea.style.height = 'auto';
            textarea.style.height = `${textarea.scrollHeight}px`;
        }
    }, [props.value]);

    return (
        <textarea
            {...props}
            ref={textareaRef}
            rows={1}
            className={`${props.className} overflow-hidden resize-none transition-[height] duration-100 ease-out`}
        />
    );
};

// --- Reusable Component for Dynamic Selects ---
interface CreatableSelectProps {
    label: string;
    value: string;
    options: string[];
    onChange: (val: string) => void;
    onAddOption: (newOption: string) => void;
    placeholder?: string;
    required?: boolean;
}

const CreatableSelect: React.FC<CreatableSelectProps> = ({ label, value, options, onChange, onAddOption, placeholder, required }) => {
    const [isAdding, setIsAdding] = useState(false);
    const [newValue, setNewValue] = useState('');

    const handleSaveNew = () => {
        if (newValue.trim()) {
            onAddOption(newValue.trim());
            onChange(newValue.trim());
            setNewValue('');
            setIsAdding(false);
        }
    };

    return (
        <div>
            <label className="block text-sm font-medium text-gray-700 mb-1 flex justify-between items-center">
                <span>{label} {required && <span className="text-red-500">*</span>}</span>
                {!isAdding && (
                    <button 
                        type="button" 
                        onClick={() => setIsAdding(true)}
                        className="text-[10px] text-brand-cyan hover:text-brand-teal font-bold uppercase flex items-center gap-1"
                    >
                        <Plus size={10} /> Add New
                    </button>
                )}
            </label>
            
            {isAdding ? (
                <div className="flex gap-2 animate-[fadeIn_0.2s_ease-out]">
                    <input 
                        type="text" 
                        value={newValue}
                        onChange={(e) => setNewValue(e.target.value)}
                        placeholder={`New ${label}...`}
                        className="w-full p-2 border border-brand-cyan rounded-lg text-sm outline-none bg-white text-gray-900"
                        autoFocus
                    />
                    <button 
                        type="button" 
                        onClick={handleSaveNew}
                        className="p-2 bg-brand-cyan text-white rounded-lg hover:bg-brand-teal transition-colors"
                    >
                        <Check size={16} />
                    </button>
                    <button 
                        type="button" 
                        onClick={() => setIsAdding(false)}
                        className="p-2 bg-gray-100 text-gray-500 rounded-lg hover:bg-gray-200 transition-colors"
                    >
                        <X size={16} />
                    </button>
                </div>
            ) : (
                <div className="relative">
                    <select 
                        value={value || ''} 
                        onChange={e => onChange(e.target.value)}
                        className={`w-full p-2 border rounded-lg text-sm outline-none bg-white text-gray-900 appearance-none ${required && !value ? 'border-red-200 bg-red-50/20' : 'border-gray-200'}`}
                        required={required}
                    >
                        <option value="">Select...</option>
                        {options.map(opt => (
                            <option key={opt} value={opt}>{opt}</option>
                        ))}
                    </select>
                    <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                </div>
            )}
        </div>
    );
};

// --- Reusable Multi-Select Input ---
interface MultiSelectInputProps {
    label: string;
    values: string[];
    options: string[];
    onChange: (values: string[]) => void;
    onAddOption?: (newOption: string) => void;
    placeholder?: string;
    required?: boolean;
}

const MultiSelectInput: React.FC<MultiSelectInputProps> = ({ label, values, options, onChange, onAddOption, placeholder, required }) => {
    const [inputValue, setInputValue] = useState('');
    const [showSuggestions, setShowSuggestions] = useState(false);
    const [isAdding, setIsAdding] = useState(false);
    const [newOptionValue, setNewOptionValue] = useState('');
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        setInputValue(values.join(', '));
    }, [values]);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
                setShowSuggestions(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newVal = e.target.value;
        setInputValue(newVal);
        setShowSuggestions(true);
        onChange(newVal.split(',').map(s => s.trim()).filter(Boolean));
    };

    const handleSelectSuggestion = (suggestion: string) => {
        const currentSegments = inputValue.split(',').map(s => s.trim());
        currentSegments.pop();
        currentSegments.push(suggestion);
        const newValueString = currentSegments.join(', ') + ', ';
        setInputValue(newValueString);
        onChange(currentSegments);
        setShowSuggestions(false);
    };

    const handleSaveNewOption = () => {
        if (newOptionValue.trim() && onAddOption) {
            const val = newOptionValue.trim();
            onAddOption(val);
            if (!values.includes(val)) {
                onChange([...values, val]);
            }
            setNewOptionValue('');
            setIsAdding(false);
        }
    };

    const currentTyping = inputValue.split(',').pop()?.trim().toLowerCase() || '';
    const filteredOptions = currentTyping 
        ? options.filter(opt => opt.toLowerCase().includes(currentTyping) && !values.includes(opt))
        : [];

    return (
        <div className="relative" ref={containerRef}>
            <label className="block text-sm font-medium text-gray-700 mb-1 flex justify-between items-center">
                <span>{label} {required && <span className="text-red-500">*</span>}</span>
                {!isAdding && onAddOption && (
                    <button 
                        type="button" 
                        onClick={() => setIsAdding(true)}
                        className="text-[10px] text-brand-cyan hover:text-brand-teal font-bold uppercase flex items-center gap-1"
                    >
                        <Plus size={10} /> Add New
                    </button>
                )}
            </label>
            
            {isAdding ? (
                <div className="flex gap-2 animate-[fadeIn_0.2s_ease-out] mb-1">
                    <input 
                        type="text" 
                        value={newOptionValue}
                        onChange={(e) => setNewOptionValue(e.target.value)}
                        placeholder={`New ${label}...`}
                        className="w-full p-2 border border-brand-cyan rounded-lg text-sm outline-none bg-white text-gray-900"
                        autoFocus
                    />
                    <button 
                        type="button" 
                        onClick={handleSaveNewOption}
                        className="p-2 bg-brand-cyan text-white rounded-lg hover:bg-brand-teal transition-colors"
                    >
                        <Check size={16} />
                    </button>
                    <button 
                        type="button" 
                        onClick={() => setIsAdding(false)}
                        className="p-2 bg-gray-100 text-gray-500 rounded-lg hover:bg-gray-200 transition-colors"
                    >
                        <X size={16} />
                    </button>
                </div>
            ) : (
                <>
                    <input 
                        type="text" 
                        value={inputValue} 
                        onChange={handleChange}
                        onFocus={() => setShowSuggestions(true)}
                        className={`w-full p-2 border rounded-lg text-sm bg-white text-gray-900 ${required && values.length === 0 ? 'border-red-200 bg-red-50/20' : 'border-gray-200'}`}
                        placeholder={placeholder}
                    />
                    {showSuggestions && currentTyping && filteredOptions.length > 0 && (
                        <ul className="absolute z-50 w-full bg-white border border-gray-200 rounded-lg shadow-lg mt-1 max-h-48 overflow-y-auto">
                            {filteredOptions.map(opt => (
                                <li 
                                    key={opt} 
                                    onClick={() => handleSelectSuggestion(opt)}
                                    className="px-3 py-2 hover:bg-gray-50 cursor-pointer text-sm text-gray-700 hover:text-brand-cyan font-medium"
                                >
                                    {opt}
                                </li>
                            ))}
                        </ul>
                    )}
                </>
            )}
        </div>
    );
};

// --- Helper Component for Conditional Tooltips ---
const TruncatedText: React.FC<{ text: string; lines: number; className?: string }> = ({ text, lines, className }) => {
    const textRef = useRef<HTMLDivElement>(null);
    const [isTruncated, setIsTruncated] = useState(false);

    useLayoutEffect(() => {
        if (textRef.current) {
            const { scrollHeight, clientHeight } = textRef.current;
            setIsTruncated(scrollHeight > clientHeight);
        }
    }, [text, lines]);

    return (
        <div 
            ref={textRef} 
            className={className}
            title={isTruncated ? text : undefined}
            style={{ 
                display: '-webkit-box', 
                WebkitLineClamp: lines, 
                WebkitBoxOrient: 'vertical', 
                overflow: 'hidden' 
            }}
        >
            {text}
        </div>
    );
};


const Admin: React.FC = () => {
  const [activeTab, setActiveTab] = useState<AdminTab>('news');
  const [notification, setNotification] = useState<{message: string, type: 'success' | 'error'} | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const bulkInputRef = useRef<HTMLInputElement>(null);
  const [isBulkModalOpen, setIsBulkModalOpen] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  
  const [options, setOptions] = useState({
      entryTypes: ['News', 'Publication', 'Internal CI'],
      types: ['Commercial', 'Clinical', 'Regulatory', 'Partnership', 'Funding', 'Technology', 'Manufacturing', 'Supply', 'Research', 'Market Access'],
      subTypes: [
          'Trial Initiation', 'Trial Results', 'Approval', 'Licensing Agreement', 'M&A', 'Series A', 'Series B', 'Series C', 'IPO', 'Patent', 'Expedited Designation', 'Reimbursement',
          'Launch', 'Supply Agreement', 'Commercial Updates', 'Trial Stop', 'Conference Data', 'Clinical Updates', 'Submission', 'Guidelines', 'Regulatory Updates',
          'Collaboration', 'Joint Venture', 'Series C', 'Follow-on', 'Grant', 'Pricing', 'HTA', 'New Platform', 'Facility', 'Capacity', 'Supply Chain',
          'Isotope Supply', 'Logistics', 'Pre-clinical Data', 'Publication'
      ], 
      regions: ['Global', 'North America', 'Europe', 'APAC', 'LATAM', 'MENA'],
      isotopes: ['177Lu', '225Ac', '212Pb', '68Ga', '131I', '64Cu', '223Ra'],
      isotopeTypes: ['Alpha', 'Beta'], 
      targets: ['PSMA', 'SSTR', 'FAP', 'GRPR', 'CD33', 'HER2', 'Novel'],
      tumorTypes: ['Prostate Cancer', 'Neuroendocrine Tumors', 'Glioblastoma', 'Lung Cancer', 'Breast Cancer', 'General Oncology'],
      assetFocus: ['Therapeutic', 'Diagnostic', 'Theranostic'],
      phases: ['Pre-clinical', 'Phase 1', 'Phase 1/2', 'Phase 2', 'Phase 3', 'Pre-registration', 'Approved'],
      companies: ['Novartis', 'Bayer', 'Telix', 'Lantheus', 'Fusion Pharma', 'RayzeBio', 'Curium', 'AstraZeneca', 'Eli Lilly', 'Bristol Myers Squibb'],
      assets: ['Pluvicto', 'Lutathera', 'Actinium-225', 'PNT2002', 'TLX591', 'FPI-2265'],
      trialIds: ['NCT05551234', 'NCT04689828', 'NCT03511664'],
      linesOfTherapy: ['Neoadjuvant', 'Adjuvant', '1L', '1L+', '2L', '2L+', '3L', '3L+', '4L', '4L+'],
      userGroups: ['All Users', 'Executive Leadership', 'Commercial Team', 'Medical Affairs'],
      uploadTeams: ['CI Team', 'Vendor Team', 'Medical Affairs', 'Strategy', 'Business Development', 'R&D', 'Manufacturing Strategy', 'Commercial'],
      docCategories: ['Newsletter', 'Scientific Publication', 'Conference Coverage', 'Internal Report'],
      authors: ['CI Team', 'Medical Affairs Team', 'Financial Analysis Team', 'Commercial Strategy', 'Supply Chain Unit', 'Dr. Emily Weiss'],
      tags: ['Market Share', 'Regulatory', 'Clinical Data', 'Supply Chain', 'Competitor', 'Strategy', 'Earnings']
  });

  const [activeLabelCategory, setActiveLabelCategory] = useState<keyof typeof options>('types');
  const [newLabelInput, setNewLabelInput] = useState('');

  const [catalysts, setCatalysts] = useState<KeyCatalyst[]>([]);
  const [events, setEvents] = useState<KeyEvent[]>([]);
  const [newCatalyst, setNewCatalyst] = useState<Partial<KeyCatalyst>>({});
  const [newEvent, setNewEvent] = useState<Partial<KeyEvent>>({});

  const [users, setUsers] = useState<UserData[]>([
      { id: 1, name: 'John Doe', email: 'john@biopharma.inc', designation: 'Senior Analyst', department: 'Competitive Intelligence', role: 'Admin', status: 'Active', lastActive: '2 min ago', groups: ['All Users', 'Commercial Team'] },
      { id: 2, name: 'Sarah Chen', email: 'sarah@biopharma.inc', designation: 'Medical Director', department: 'Medical Affairs', role: 'User', status: 'Active', lastActive: '1 day ago', groups: ['All Users', 'Medical Affairs'] },
      { id: 3, name: 'Mike Ross', email: 'mike@biopharma.inc', designation: 'Associate', department: 'Commercial', role: 'User', status: 'Inactive', lastActive: '1 week ago', groups: ['All Users'] },
      { id: 4, name: 'Emily Blunt', email: 'emily@biopharma.inc', designation: 'VP of Strategy', department: 'Corporate Strategy', role: 'User', status: 'Pending', lastActive: 'Never', groups: [], requestedDate: '2025-05-20' },
      { id: 5, name: 'David Kim', email: 'david.k@biopharma.inc', designation: 'Researcher', department: 'R&D', role: 'User', status: 'Pending', lastActive: 'Never', groups: [], requestedDate: '2025-05-21' },
  ]);
  const [userSubTab, setUserSubTab] = useState<'all' | 'pending' | 'groups'>('all');
  const [isInviteModalOpen, setIsInviteModalOpen] = useState(false);
  const [isEditUserModalOpen, setIsEditUserModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<UserData | null>(null);

  const [isGroupModalOpen, setIsGroupModalOpen] = useState(false);
  const [selectedGroupForEdit, setSelectedGroupForEdit] = useState<string | null>(null);
  const [newGroupInput, setNewGroupInput] = useState('');
  
  const [isAddToGroupModalOpen, setIsAddToGroupModalOpen] = useState(false);
  const [userForGroupAddition, setUserForGroupAddition] = useState<UserData | null>(null);

  const [isRejectModalOpen, setIsRejectModalOpen] = useState(false);
  const [userToReject, setUserToReject] = useState<UserData | null>(null);

  const [newsList, setNewsList] = useState<NewsItem[]>(() => {
      const saved = localStorage.getItem('newsData');
      return saved ? JSON.parse(saved) : NEWS_ITEMS;
  });
  const [newsSearch, setNewsSearch] = useState('');
  const [newsSubTab, setNewsSubTab] = useState<NewsSubTab>('all');
  const [isEditingNews, setIsEditingNews] = useState(false);
  const [currentNews, setCurrentNews] = useState<Partial<NewsItem>>({});

  const [documentsList, setDocumentsList] = useState<DocumentItem[]>([]); 
  const [isUploadingDoc, setIsUploadingDoc] = useState(false);
  const [currentDoc, setCurrentDoc] = useState<Partial<DocumentItem>>({});

  useEffect(() => {
    const savedDocs = localStorage.getItem('uploadedDocuments');
    const parsedSavedDocs = savedDocs ? JSON.parse(savedDocs) : [];
    setDocumentsList([...DOCUMENTS_LIBRARY, ...parsedSavedDocs]);

    const savedCatalysts = localStorage.getItem('adminCatalysts');
    if (savedCatalysts) setCatalysts(JSON.parse(savedCatalysts));
    else {
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
    if (savedEvents) setEvents(JSON.parse(savedEvents));
    else {
        setEvents([ 
            { id: '1', title: 'PeptiDream- FY2025 Earnings', date: '2026-02-16', location: 'Kawasaki, JP', url: 'https://www.peptidream.com/en/ir/calendar/' },
            { id: '2', title: 'TRP Summit US', date: '2026-02-24', location: 'Boston, MA', url: 'https://targeted-radiopharma-target-selection-drug-design.com/?utm_source=internal&utm_medium=event' },
            { id: '3', title: 'Molecular Partners - FY2025 Earnings', date: '2026-03-13', location: 'Zurich, CH', url: 'https://investors.molecularpartners.com/events/event-details/fourth-quarter-and-full-year-2025-resu' }
        ]);
    }
  }, []);

  const [homeHero, setHomeHero] = useState({
    title: 'Targeted Radionuclide Therapy Intelligence.',
    subtitle: 'TRT CI Tracker is a web portal designed specifically for company employees. Tracker enables users to read, analyze and download CI information related to TRT developments including clinical developments, manufacturing, supply chain and other market updates.'
  });
  
  const [tickerItems, setTickerItems] = useState([
    { id: 1, type: 'BREAKING', text: 'AstraZeneca announces licensing deal for Ac-225 radiopharmaceutical', color: 'text-brand-green' },
    { id: 2, type: 'DATA', text: 'New Curium Pb-212 clinical trial begins, targeting glioblastoma', color: 'text-brand-cyan' },
    { id: 3, type: 'SCIENCE', text: '81 radiotherapeutic trials now recruiting patients', color: 'text-brand-teal' },
  ]);
  const [isTickerModalOpen, setIsTickerModalOpen] = useState(false);

  const showNotification = (message: string, type: 'success' | 'error' = 'success') => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 3000);
  };

  const handleAddCatalyst = () => {
    if (!newCatalyst.title || (!newCatalyst.date && !newCatalyst.quarter)) {
        showNotification('Title and Date or Quarter are required', 'error');
        return;
    }
    const colors = ['bg-brand-cyan', 'bg-brand-green', 'bg-brand-teal', 'bg-purple-500', 'bg-orange-500'];
    const randomColor = colors[Math.floor(Math.random() * colors.length)];
    const item: KeyCatalyst = {
        id: Date.now().toString(),
        title: newCatalyst.title!,
        date: newCatalyst.date,
        quarter: newCatalyst.quarter,
        url: newCatalyst.url,
        color: randomColor
    };
    const updated = [item, ...catalysts];
    setCatalysts(updated);
    localStorage.setItem('adminCatalysts', JSON.stringify(updated));
    setNewCatalyst({});
    showNotification('Catalyst added');
  };

  const handleDeleteCatalyst = (id: string) => {
    if(confirm('Delete this catalyst?')) {
        const updated = catalysts.filter(c => c.id !== id);
        setCatalysts(updated);
        localStorage.setItem('adminCatalysts', JSON.stringify(updated));
        showNotification('Catalyst removed');
    }
  };

  const handleAddEvent = () => {
    if (!newEvent.title || !newEvent.date || !newEvent.location) {
        showNotification('Title, Date, and Location are required', 'error');
        return;
    }
    const item: KeyEvent = {
        id: Date.now().toString(),
        title: newEvent.title!,
        date: newEvent.date!,
        location: newEvent.location!,
        url: newEvent.url
    };
    const updated = [item, ...events];
    setEvents(updated);
    localStorage.setItem('adminEvents', JSON.stringify(updated));
    setNewEvent({});
    showNotification('Event added');
  };

  const handleDeleteEvent = (id: string) => {
    if(confirm('Delete this event?')) {
        const updated = events.filter(e => e.id !== id);
        setEvents(updated);
        localStorage.setItem('adminEvents', JSON.stringify(updated));
        showNotification('Event removed');
    }
  };

  const updateOptionsFromBulk = (newItems: NewsItem[]) => {
      const newOptions = { ...options };
      let changed = false;
      const checkAndAdd = (category: keyof typeof options, value: string | undefined) => {
          if (!value || value.trim() === '') return;
          if (!newOptions[category].includes(value)) {
              // @ts-ignore 
              newOptions[category] = [...newOptions[category], value];
              changed = true;
          }
      };
      const checkAndAddArray = (category: keyof typeof options, values: string[] | undefined) => {
          if (!values || values.length === 0) return;
          values.forEach(v => {
              if (v && v.trim() !== '' && !newOptions[category].includes(v)) {
                  // @ts-ignore
                  newOptions[category] = [...newOptions[category], v];
                  changed = true;
              }
          });
      };
      newItems.forEach(item => {
          checkAndAdd('entryTypes', item.entryType);
          checkAndAdd('types', item.type);
          checkAndAdd('subTypes', item.subType);
          checkAndAdd('regions', item.region);
          checkAndAdd('targets', item.target);
          checkAndAdd('tumorTypes', item.tumorType);
          checkAndAdd('isotopes', item.isotope);
          // @ts-ignore
          checkAndAdd('isotopeTypes', item.isotopeType);
          // @ts-ignore
          checkAndAdd('assetFocus', item.assetFocus);
          checkAndAdd('phases', item.phase);
          checkAndAdd('linesOfTherapy', item.lineOfTherapy);
          checkAndAddArray('companies', item.companies);
          checkAndAddArray('assets', item.assets);
      });
      if (changed) {
          setOptions(newOptions);
      }
  };

  const downloadTemplate = () => {
      const headers = [{
          'Date': '2024-05-20', 'Entry Type': 'News', 'Type': 'Commercial', 'Sub-Type': 'M&A',
          'Title': 'Example Title', 'Summary': 'Summary...', 'CI Note': 'Note...', 'Companies': 'Novartis',
          'Assets': 'Pluvicto', 'Target': 'PSMA', 'Tumor Type': 'Prostate Cancer', 'Isotope': '177Lu',
          'Isotope Type': 'Beta', 'Asset Focus': 'Therapeutic', 'Region': 'Global', 'Phase': 'Phase 3',
          'Line of Therapy': '1L', 'Source Name': 'Press Release', 'Source URL': 'https://example.com', 'Priority': 'Key'
      }];
      const ws = XLSX.utils.json_to_sheet(headers);
      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, "Bulk Upload Template");
      XLSX.writeFile(wb, "TRT_News_Bulk_Template.xlsx");
  };

  const handleBulkUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (!file) return;
      setUploadProgress(10);
      const reader = new FileReader();
      reader.onload = (evt) => {
          setUploadProgress(40);
          setTimeout(() => {
              try {
                  const bstr = evt.target?.result;
                  const wb = XLSX.read(bstr, { type: 'binary', cellDates: true });
                  setUploadProgress(60);
                  const wsname = wb.SheetNames[0];
                  const ws = wb.Sheets[wsname];
                  const data = XLSX.utils.sheet_to_json(ws);
                  setUploadProgress(80);
                  const newNewsItems: NewsItem[] = data.map((row: any, index: number) => {
                      let parsedDate = new Date().toISOString().split('T')[0];
                      if (row['Date']) {
                          const dateObj = new Date(row['Date']);
                          if (!isNaN(dateObj.getTime())) {
                              const year = dateObj.getFullYear();
                              const month = String(dateObj.getMonth() + 1).padStart(2, '0');
                              const day = String(dateObj.getDate()).padStart(2, '0');
                              parsedDate = `${year}-${month}-${day}`;
                          }
                      }
                      return {
                          id: (Date.now() + index).toString(),
                          date: parsedDate,
                          entryType: (row['Entry Type'] || 'News') as EntryType,
                          type: (row['Type'] || 'Commercial') as NewsType,
                          subType: row['Sub-Type'] || '',
                          title: row['Title'] || 'Untitled',
                          summary: row['Summary'] || '',
                          ciNote: row['CI Note'] || '',
                          companies: row['Companies'] ? row['Companies'].toString().split(',').map((s: string) => s.trim()) : [],
                          assets: row['Assets'] ? row['Assets'].toString().split(',').map((s: string) => s.trim()) : [],
                          target: row['Target'] || '',
                          tumorType: row['Tumor Type'] || '',
                          isotope: row['Isotope'] || '',
                          isotopeType: row['Isotope Type'],
                          assetFocus: row['Asset Focus'],
                          region: (row['Region'] || 'Global') as Region,
                          phase: row['Phase'] || '',
                          lineOfTherapy: row['Line of Therapy'] || '',
                          sourceName: row['Source Name'] || '',
                          sourceUrl: row['Source URL'] || '',
                          priority: row['Priority'] === 'Key' ? 'Key' : 'Other',
                          isHumanReviewed: true,
                          aiSummary: false,
                          isBreaking: false,
                          reviewer: 'Bulk Upload'
                      };
                  });
                  if (newNewsItems.length > 0) {
                      setNewsList(prev => {
                          const updated = [...newNewsItems, ...prev];
                          localStorage.setItem('newsData', JSON.stringify(updated));
                          return updated;
                      });
                      updateOptionsFromBulk(newNewsItems);
                      setUploadProgress(100);
                      setTimeout(() => {
                          setIsBulkModalOpen(false);
                          setUploadProgress(0);
                          showNotification(`Successfully imported ${newNewsItems.length} entries`);
                      }, 600);
                  } else {
                      setUploadProgress(0);
                      showNotification('No valid data found in file', 'error');
                  }
              } catch (error) {
                  console.error('Upload Error', error);
                  setUploadProgress(0);
                  showNotification('Failed to process file. Check format.', 'error');
              }
          }, 800);
      };
      reader.readAsBinaryString(file);
      if (e.target) e.target.value = '';
  };

  const handleInviteUser = (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      const formData = new FormData(e.currentTarget);
      const newUser: UserData = {
          id: Date.now(),
          name: formData.get('name') as string,
          email: formData.get('email') as string,
          designation: formData.get('designation') as string,
          department: formData.get('department') as string,
          role: formData.get('role') as UserRole,
          status: 'Active',
          lastActive: 'Just now',
          groups: ['All Users'],
          requestedDate: new Date().toISOString().split('T')[0]
      };
      setUsers([...users, newUser]);
      setIsInviteModalOpen(false);
      showNotification('User invited successfully');
  };

  const handleDeleteUser = (id: number) => {
      if (confirm('Are you sure you want to delete this user? This action cannot be undone.')) {
          setUsers(users.filter(u => u.id !== id));
          showNotification('User deleted');
      }
  };

  const openEditUser = (user: UserData) => {
      setEditingUser(user);
      setIsEditUserModalOpen(true);
  };

  const handleSaveUserChanges = () => {
      if (editingUser) {
          setUsers(users.map(u => u.id === editingUser.id ? editingUser : u));
          setIsEditUserModalOpen(false);
          setEditingUser(null);
          showNotification('User rights updated');
      }
  };

  const handleApproveUser = (user: UserData) => {
      setUsers(users.map(u => u.id === user.id ? { ...u, status: 'Active', groups: ['All Users'] } : u));
      showNotification(`Approved access for ${user.name}`);
  };

  const initiateReject = (user: UserData) => {
      setUserToReject(user);
      setIsRejectModalOpen(true);
  };

  const confirmReject = (notify: boolean) => {
      if (!userToReject) return;
      setUsers(users.filter(u => u.id !== userToReject.id));
      setIsRejectModalOpen(false);
      setUserToReject(null);
      showNotification(notify ? `Rejected ${userToReject.name} (Notification sent)` : `Rejected ${userToReject.name} silently`);
  };

  const handleCreateGroup = () => {
      if (newGroupInput.trim()) {
          if (!options.userGroups.includes(newGroupInput.trim())) {
              setOptions(prev => ({ ...prev, userGroups: [...prev.userGroups, newGroupInput.trim()] }));
              showNotification(`Group "${newGroupInput.trim()}" created`);
              setNewGroupInput('');
          }
      }
  };

  const handleDeleteGroup = (groupName: string) => {
      if (confirm(`Are you sure you want to delete the group "${groupName}"? Users will not be deleted, only their association with this group.`)) {
          setOptions(prev => ({ ...prev, userGroups: prev.userGroups.filter(g => g !== groupName) }));
          setUsers(prev => prev.map(u => ({ ...u, groups: u.groups.filter(g => g !== groupName) })));
          showNotification('Group deleted');
      }
  };

  const openGroupModal = (groupName: string) => {
      setSelectedGroupForEdit(groupName);
      setMemberSearch('');
      setIsGroupModalOpen(true);
  };

  const toggleUserInGroup = (userId: number, groupName: string) => {
      setUsers(prev => prev.map(u => {
          if (u.id === userId) {
              const hasGroup = u.groups.includes(groupName);
              return {
                  ...u,
                  groups: hasGroup ? u.groups.filter(g => g !== groupName) : [...u.groups, groupName]
              };
          }
          return u;
      }));
  };

  const addOption = (category: keyof typeof options, newOption: string) => {
      if (!options[category].includes(newOption)) {
        setOptions(prev => ({
            ...prev,
            [category]: [...prev[category], newOption]
        }));
        showNotification(`${newOption} added to ${String(category)}`);
      }
  };

  const removeOption = (category: keyof typeof options, optionToRemove: string) => {
      if(confirm(`Remove "${optionToRemove}" from ${String(category)}?`)) {
          setOptions(prev => ({
              ...prev,
              [category]: prev[category].filter(opt => opt !== optionToRemove)
          }));
          showNotification('Label removed');
      }
  };

  const handleEditNews = (item: NewsItem) => {
    setCurrentNews(item);
    setIsEditingNews(true);
  };

  const handleAddNews = () => {
    setCurrentNews({
      id: Date.now().toString(),
      date: new Date().toISOString().split('T')[0],
      isHumanReviewed: true,
      entryType: 'News',
      type: 'Commercial',
      region: 'Global',
      isBreaking: false,
      priority: 'Other',
      aiSummary: false,
      reviewer: 'John Doe',
      companies: [],
      assets: []
    });
    setIsEditingNews(true);
  };

  const handleDeleteNews = (id: string) => {
    if (confirm('Are you sure you want to delete this item?')) {
      const updatedList = newsList.filter(item => item.id !== id);
      setNewsList(updatedList);
      localStorage.setItem('newsData', JSON.stringify(updatedList));
      showNotification('Item deleted successfully');
    }
  };

  const handleSaveNews = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentNews.title || !currentNews.date || !currentNews.entryType || !currentNews.type || 
        !currentNews.subType || !currentNews.companies?.length || !currentNews.target || 
        !currentNews.tumorType || !currentNews.assetFocus || !currentNews.region || 
        !currentNews.sourceName || !currentNews.sourceUrl) {
        showNotification('Please fill in all compulsory fields marked with *', 'error');
        return;
    }
    const itemToSave = { 
        ...currentNews,
        reviewer: currentNews.reviewer || 'John Doe'
    };
    
    const updatedList = itemToSave.id && newsList.find(n => n.id === itemToSave.id)
       ? newsList.map(n => n.id === itemToSave.id ? itemToSave as NewsItem : n)
       : [itemToSave as NewsItem, ...newsList];

    setNewsList(updatedList);
    localStorage.setItem('newsData', JSON.stringify(updatedList));

    if (itemToSave.isBreaking && itemToSave.breakingText) {
        const newTickerItem = {
            id: Date.now(),
            type: (itemToSave.type || 'BREAKING').toUpperCase(),
            text: itemToSave.breakingText,
            color: 'text-brand-green'
        };
        setTickerItems(prev => [newTickerItem, ...prev]);
        showNotification('News saved & added to Live Ticker');
    } else {
        showNotification('News saved successfully');
    }
    setIsEditingNews(false);
  };

  const handleUploadClick = () => {
      setCurrentDoc({
          id: '',
          date: new Date().toISOString().split('T')[0],
          format: 'PDF', 
          fileSize: '0 MB',
          uploadedBy: 'CI Team',
          userGroup: 'All Users',
          tags: [],
          author: []
      });
      setIsUploadingDoc(true);
  };

  const handleEditLibraryDoc = (doc: DocumentItem) => {
      setCurrentDoc({ ...doc });
      setIsUploadingDoc(true);
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
      if (e.target.files && e.target.files[0]) {
          const file = e.target.files[0];
          let fmt = 'PDF';
          if (file.name.match(/\.(ppt|pptx)$/i)) fmt = 'PPT';
          else if (file.name.match(/\.(doc|docx)$/i)) fmt = 'DOCX';
          else if (file.name.match(/\.(xls|xlsx)$/i)) fmt = 'XLSX';
          
          const sizeVal = (file.size / (1024 * 1024)).toFixed(2);
          
          setCurrentDoc(prev => ({
              ...prev,
              format: fmt,
              fileSize: `${sizeVal} MB`,
              title: prev.title ? prev.title : file.name.replace(/\.[^/.]+$/, "")
          }));
      }
  };

  const handleSaveDoc = (e: React.FormEvent) => {
      e.preventDefault();
      if (!currentDoc.title || !currentDoc.uploadedBy || !currentDoc.userGroup || !currentDoc.type) {
          showNotification('Please fill in required fields', 'error');
          return;
      }
      const docToSave = {
          ...currentDoc,
          author: currentDoc.author && currentDoc.author.length > 0 ? currentDoc.author : [currentDoc.uploadedBy || 'System'],
          thumbnailUrl: currentDoc.thumbnailUrl || 'https://images.unsplash.com/photo-1565538420870-da58537bbf3d?auto=format&fit=crop&q=80&w=600'
      } as DocumentItem;

      if (!docToSave.id) {
          docToSave.id = Date.now().toString();
          setDocumentsList(prev => [docToSave, ...prev]);
          const savedDocs = localStorage.getItem('uploadedDocuments');
          const parsedSavedDocs = savedDocs ? JSON.parse(savedDocs) : [];
          const updatedDocs = [docToSave, ...parsedSavedDocs];
          localStorage.setItem('uploadedDocuments', JSON.stringify(updatedDocs));
          showNotification('Document uploaded successfully & synced to Library');
      } else {
          setDocumentsList(prev => prev.map(d => d.id === docToSave.id ? docToSave : d));
          const savedDocs = localStorage.getItem('uploadedDocuments');
          if (savedDocs) {
              const parsed = JSON.parse(savedDocs);
              const index = parsed.findIndex((d: DocumentItem) => d.id === docToSave.id);
              if (index !== -1) {
                  parsed[index] = docToSave;
                  localStorage.setItem('uploadedDocuments', JSON.stringify(parsed));
              }
          }
          showNotification('Document updated successfully');
      }
      setIsUploadingDoc(false);
  };

  const handleDeleteDocFromForm = () => {
      if (!currentDoc.id) return;
      if(confirm('Are you sure you want to delete this document?')) {
          const id = currentDoc.id;
          setDocumentsList(prev => prev.filter(d => d.id !== id));
          const savedDocs = localStorage.getItem('uploadedDocuments');
          if (savedDocs) {
              const parsed = JSON.parse(savedDocs);
              const updated = parsed.filter((d: DocumentItem) => d.id !== id);
              localStorage.setItem('uploadedDocuments', JSON.stringify(updated));
          }
          setIsUploadingDoc(false);
          showNotification('Document removed');
      }
  };

  const handleUpdateHome = () => {
      showNotification('Home page configuration updated');
  };

  const filteredNews = newsList.filter(item => {
    const matchesSearch = item.title.toLowerCase().includes(newsSearch.toLowerCase()) || 
                          item.summary.toLowerCase().includes(newsSearch.toLowerCase());
    return matchesSearch;
  });

  const labelCategories: { key: keyof typeof options; label: string; icon: React.ReactNode }[] = [
      { key: 'entryTypes', label: 'Entry Types', icon: <Database size={14} /> },
      { key: 'types', label: 'News Types', icon: <Database size={14} /> },
      { key: 'subTypes', label: 'Sub-Types', icon: <FileText size={14} /> },
      { key: 'companies', label: 'Companies', icon: <Briefcase size={14} /> },
      { key: 'assets', label: 'Assets', icon: <Tag size={14} /> },
      { key: 'targets', label: 'Targets', icon: <CheckCircle2 size={14} /> },
      { key: 'tumorTypes', label: 'Tumor Types', icon: <MessageSquare size={14} /> },
      { key: 'linesOfTherapy', label: 'Lines of Therapy', icon: <Settings size={14} /> },
      { key: 'isotopes', label: 'Isotopes', icon: <Zap size={14} /> },
      { key: 'isotopeTypes', label: 'Isotope Types', icon: <Filter size={14} /> },
      { key: 'phases', label: 'Phases', icon: <Settings size={14} /> },
      { key: 'trialIds', label: 'Trial IDs', icon: <Search size={14} /> },
      { key: 'assetFocus', label: 'Asset Focus', icon: <Tag size={14} /> },
      { key: 'regions', label: 'Regions', icon: <Filter size={14} /> },
      { key: 'userGroups', label: 'User Groups', icon: <Users size={14} /> },
      { key: 'uploadTeams', label: 'Upload Teams', icon: <Upload size={14} /> },
      { key: 'docCategories', label: 'Doc Categories', icon: <BookOpen size={14} /> },
      { key: 'authors', label: 'Authors', icon: <User size={14} /> },
      { key: 'tags', label: 'Tags', icon: <Tag size={14} /> },
  ];

  const getSubTypesForType = (type: string | undefined): string[] => {
      if (!type) return options.subTypes;
      const mapped = TYPE_SUBTYPE_MAPPING[type];
      if (mapped) {
          return mapped;
      }
      return options.subTypes; 
  };

  const combinedAuthorOptions = Array.from(new Set([...options.authors, ...users.map(u => u.name)]));

  const getDocCategoryStyle = (category: string) => {
      const cat = category.toLowerCase();
      if (cat.includes('conference')) return 'bg-purple-100 text-purple-700 border border-purple-200';
      if (cat.includes('internal')) return 'bg-blue-100 text-blue-700 border border-blue-200';
      if (cat.includes('scientific') || cat.includes('publication')) return 'bg-green-100 text-green-700 border border-green-200';
      if (cat.includes('newsletter')) return 'bg-orange-100 text-orange-700 border border-orange-200';
      return 'bg-gray-100 text-gray-700 border border-gray-200';
  };

  return (
    <div className="min-h-screen pt-24 px-8 pb-8 font-sans bg-gray-50/50">
      <LightBackground />
      {notification && (
        <div className="fixed top-24 right-8 z-50 animate-[fadeIn_0.3s_ease-out]">
            <div className={`flex items-center gap-3 px-4 py-3 rounded-lg shadow-lg border ${
                notification.type === 'success' ? 'bg-white border-green-100 text-green-800' : 'bg-white border-red-100 text-red-800'
            }`}>
                {notification.type === 'success' ? <CheckCircle2 size={18} className="text-green-500" /> : <X size={18} className="text-red-500" />}
                <span className="text-sm font-medium">{notification.message}</span>
            </div>
        </div>
      )}
      
      <div className="max-w-7xl mx-auto">
        <div className="flex gap-6 border-b border-gray-200 mb-6 overflow-x-auto">
            {['news', 'events', 'library', 'labels', 'users', 'portal'].map(tab => (
                <button key={tab} onClick={() => setActiveTab(tab as AdminTab)} className={`pb-3 px-2 text-sm font-medium flex items-center gap-2 transition-all whitespace-nowrap ${activeTab === tab ? 'border-b-2 border-brand-cyan text-brand-cyan' : 'text-gray-500 hover:text-gray-800'}`}>
                    {tab === 'news' && <><Database size={16} /> News Database</>}
                    {tab === 'events' && <><Calendar size={16} /> Catalysts & Events</>}
                    {tab === 'library' && <><BookOpen size={16} /> Library</>}
                    {tab === 'labels' && <><Tag size={16} /> Labels</>}
                    {tab === 'users' && <><Users size={16} /> User Management</>}
                    {tab === 'portal' && <><Settings size={16} /> Portal Settings</>}
                </button>
            ))}
        </div>

        <div className="animate-[fadeIn_0.3s_ease-out]">
            {activeTab === 'news' && (
                <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden flex flex-col h-[600px]">
                    <div className="p-4 border-b border-gray-100 flex justify-between items-center bg-gray-50">
                        <div className="flex items-center gap-4">
                             <h2 className="text-lg font-bold text-gray-900">Intelligence Database</h2>
                             <div className="relative">
                                 <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                                 <input type="text" placeholder="Search entries..." value={newsSearch} onChange={(e) => setNewsSearch(e.target.value)} className="pl-9 pr-3 py-1.5 border border-gray-200 rounded-lg text-sm bg-white focus:border-brand-cyan outline-none" />
                             </div>
                        </div>
                        <button onClick={handleAddNews} className="flex items-center gap-2 px-4 py-2 bg-gray-900 text-white text-sm font-bold rounded-lg hover:bg-black transition-colors"><Plus size={16} /> Add Entry</button>
                    </div>
                    <div className="flex-1 overflow-auto">
                        <table className="w-full text-left border-collapse">
                            <thead className="bg-gray-50 border-b border-gray-100 sticky top-0 z-10">
                                <tr>
                                    <th className="px-6 py-3 text-xs font-bold text-gray-500 uppercase">Date</th>
                                    <th className="px-6 py-3 text-xs font-bold text-gray-500 uppercase">Type</th>
                                    <th className="px-6 py-3 text-xs font-bold text-gray-500 uppercase">Title</th>
                                    <th className="px-6 py-3 text-xs font-bold text-gray-500 uppercase text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-50">
                                {filteredNews.map(item => (
                                    <tr key={item.id} className="hover:bg-gray-50 transition-colors">
                                        <td className="px-6 py-3 text-sm text-gray-600 font-mono">{item.date}</td>
                                        <td className="px-6 py-3"><Badge variant="default">{item.type}</Badge></td>
                                        <td className="px-6 py-3 text-sm font-medium text-gray-900 line-clamp-1">{item.title}</td>
                                        <td className="px-6 py-3 text-right">
                                            <div className="flex justify-end gap-2">
                                                <button onClick={() => handleEditNews(item)} className="p-1.5 text-gray-400 hover:text-brand-cyan hover:bg-gray-100 rounded"><Edit3 size={14} /></button>
                                                <button onClick={() => handleDeleteNews(item.id)} className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded"><Trash2 size={14} /></button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}
            
            {activeTab === 'events' && (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6 flex flex-col h-full">
                        <div className="flex items-center gap-3 mb-6 pb-4 border-b border-gray-100">
                            <div className="p-2 bg-orange-100 rounded-lg text-orange-600"><Flame size={20} /></div>
                            <div><h2 className="text-lg font-bold text-gray-900">Key Catalysts</h2><p className="text-xs text-gray-500">Manage high-impact upcoming milestones.</p></div>
                        </div>
                        <div className="mb-8 bg-gray-50 rounded-xl p-4 border border-gray-200">
                            <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3">Add New Catalyst</h3>
                            <div className="space-y-3">
                                <input type="text" placeholder="Catalyst Title *" value={newCatalyst.title || ''} onChange={(e) => setNewCatalyst({...newCatalyst, title: e.target.value})} className="w-full p-2 border border-gray-200 rounded-lg text-sm outline-none focus:border-brand-cyan" />
                                <div className="grid grid-cols-2 gap-3">
                                    <input type="text" placeholder="Date (e.g. Jun 15)" value={newCatalyst.date || ''} onChange={(e) => setNewCatalyst({...newCatalyst, date: e.target.value})} className="w-full p-2 border border-gray-200 rounded-lg text-sm outline-none focus:border-brand-cyan" />
                                    <input type="text" placeholder="Or Quarter (e.g. Q3 2025)" value={newCatalyst.quarter || ''} onChange={(e) => setNewCatalyst({...newCatalyst, quarter: e.target.value})} className="w-full p-2 border border-gray-200 rounded-lg text-sm outline-none focus:border-brand-cyan" />
                                </div>
                                <div className="flex gap-3">
                                    <input type="text" placeholder="URL (Optional)" value={newCatalyst.url || ''} onChange={(e) => setNewCatalyst({...newCatalyst, url: e.target.value})} className="flex-1 p-2 border border-gray-200 rounded-lg text-sm outline-none focus:border-brand-cyan" />
                                    <button onClick={handleAddCatalyst} className="px-4 py-2 bg-gray-900 text-white rounded-lg text-xs font-bold hover:bg-black transition-colors">Add</button>
                                </div>
                            </div>
                        </div>
                        <div className="flex-1 overflow-y-auto custom-scrollbar space-y-2">
                            {catalysts.map((cat) => (
                                <div key={cat.id} className="flex items-center justify-between p-3 bg-white border border-gray-100 rounded-lg hover:border-gray-200 transition-colors group">
                                    <div className="flex items-start gap-3">
                                        <div className={`w-3 h-3 rounded-full mt-1.5 flex-shrink-0 ${cat.color}`}></div>
                                        <div>
                                            <p className="text-sm font-bold text-gray-800 line-clamp-1">{cat.title}</p>
                                            <div className="flex items-center gap-2 text-xs text-gray-500"><span>{cat.date || cat.quarter}</span>{cat.url && <a href={cat.url} target="_blank" rel="noreferrer" className="text-brand-cyan hover:underline flex items-center gap-0.5"><LinkIcon size={10} /> Link</a>}</div>
                                        </div>
                                    </div>
                                    <button onClick={() => handleDeleteCatalyst(cat.id)} className="text-gray-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"><Trash2 size={14} /></button>
                                </div>
                            ))}
                        </div>
                    </div>
                    <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6 flex flex-col h-full">
                        <div className="flex items-center gap-3 mb-6 pb-4 border-b border-gray-100">
                            <div className="p-2 bg-blue-100 rounded-lg text-blue-600"><Calendar size={20} /></div>
                            <div><h2 className="text-lg font-bold text-gray-900">Events Calendar</h2><p className="text-xs text-gray-500">Manage conferences and key meetings.</p></div>
                        </div>
                        <div className="mb-8 bg-gray-50 rounded-xl p-4 border border-gray-200">
                            <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3">Add New Event</h3>
                            <div className="space-y-3">
                                <input type="text" placeholder="Event Title *" value={newEvent.title || ''} onChange={(e) => setNewEvent({...newEvent, title: e.target.value})} className="w-full p-2 border border-gray-200 rounded-lg text-sm outline-none focus:border-brand-cyan" />
                                <div className="grid grid-cols-2 gap-3">
                                    <input type="date" value={newEvent.date || ''} onChange={(e) => setNewEvent({...newEvent, date: e.target.value})} className="w-full p-2 border border-gray-200 rounded-lg text-sm outline-none focus:border-brand-cyan" />
                                    <input type="text" placeholder="Location *" value={newEvent.location || ''} onChange={(e) => setNewEvent({...newEvent, location: e.target.value})} className="w-full p-2 border border-gray-200 rounded-lg text-sm outline-none focus:border-brand-cyan" />
                                </div>
                                <div className="flex gap-3">
                                    <input type="text" placeholder="URL (Optional)" value={newEvent.url || ''} onChange={(e) => setNewEvent({...newEvent, url: e.target.value})} className="flex-1 p-2 border border-gray-200 rounded-lg text-sm outline-none focus:border-brand-cyan" />
                                    <button onClick={handleAddEvent} className="px-4 py-2 bg-gray-900 text-white rounded-lg text-xs font-bold hover:bg-black transition-colors">Add</button>
                                </div>
                            </div>
                        </div>
                        <div className="flex-1 overflow-y-auto custom-scrollbar space-y-2">
                            {events.map((evt) => (
                                <div key={evt.id} className="flex items-center justify-between p-3 bg-white border border-gray-100 rounded-lg hover:border-gray-200 transition-colors group">
                                    <div className="flex items-start gap-3">
                                        <div className="flex flex-col items-center justify-center w-10 h-10 bg-gray-50 rounded-lg border border-gray-200 text-gray-500 font-bold text-xs flex-shrink-0">
                                            <span className="uppercase text-[9px]">{new Date(evt.date).toLocaleString('default', { month: 'short' })}</span>
                                            <span>{new Date(evt.date).getDate()}</span>
                                        </div>
                                        <div>
                                            <p className="text-sm font-bold text-gray-800 line-clamp-1">{evt.title}</p>
                                            <div className="flex items-center gap-3 text-xs text-gray-500 mt-0.5">
                                                <span className="flex items-center gap-1"><MapPin size={10} /> {evt.location}</span>
                                                {evt.url && <a href={evt.url} target="_blank" rel="noreferrer" className="text-brand-cyan hover:underline flex items-center gap-0.5"><LinkIcon size={10} /> Link</a>}
                                            </div>
                                        </div>
                                    </div>
                                    <button onClick={() => handleDeleteEvent(evt.id)} className="text-gray-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"><Trash2 size={14} /></button>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            )}

            {activeTab === 'library' && (
                <>
                {isUploadingDoc ? (
                    <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-8">
                        <div className="flex justify-between items-center mb-6 pb-6 border-b border-gray-100">
                            <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2"><Upload size={20} className="text-brand-cyan" /> {currentDoc.id ? 'Edit Document' : 'Upload New Document'}</h2>
                            <button onClick={() => setIsUploadingDoc(false)} className="p-2 hover:bg-gray-100 rounded-full text-gray-400 hover:text-red-500"><X size={20} /></button>
                        </div>
                        <form onSubmit={handleSaveDoc} className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                            <div className="space-y-6 lg:col-span-2">
                                <CreatableSelect label="Upload By (Team)" value={currentDoc.uploadedBy || ''} options={options.uploadTeams} onChange={(val) => setCurrentDoc({...currentDoc, uploadedBy: val})} onAddOption={(val) => addOption('uploadTeams', val)} placeholder="Select Uploader..." required />
                                <div onClick={() => fileInputRef.current?.click()} className="border-2 border-dashed border-gray-200 rounded-xl p-8 flex flex-col items-center justify-center text-center hover:border-brand-cyan hover:bg-brand-cyan/5 transition-all cursor-pointer group">
                                    <input type="file" ref={fileInputRef} className="hidden" accept=".pdf,.ppt,.pptx,.doc,.docx,.xls,.xlsx" onChange={handleFileSelect} />
                                    {currentDoc.fileSize && currentDoc.fileSize !== '0 MB' ? (
                                        <div className="animate-[fadeIn_0.3s_ease-out]">
                                            <div className="w-12 h-12 bg-green-50 text-green-600 rounded-full flex items-center justify-center mb-3 mx-auto"><Check size={24} /></div>
                                            <p className="text-sm font-bold text-gray-900 break-all">{currentDoc.title}.{currentDoc.format?.toLowerCase()}</p>
                                        </div>
                                    ) : (
                                        <>
                                            <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mb-3 group-hover:bg-brand-cyan/20 group-hover:text-brand-cyan transition-colors"><File size={24} className="text-gray-400 group-hover:text-brand-cyan" /></div>
                                            <p className="text-sm font-bold text-gray-900">Click to upload file</p>
                                        </>
                                    )}
                                </div>
                                <div><label className="block text-sm font-medium text-gray-700 mb-1">Document Title <span className="text-red-500">*</span></label><input type="text" value={currentDoc.title || ''} onChange={e => setCurrentDoc({...currentDoc, title: e.target.value})} className="w-full p-2 border border-gray-200 rounded-lg text-sm bg-white text-gray-900" required /></div>
                                <div><label className="block text-sm font-medium text-gray-700 mb-1">Executive Summary</label><AutoResizeTextarea value={currentDoc.executiveSummary || ''} onChange={e => setCurrentDoc({...currentDoc, executiveSummary: e.target.value})} className="w-full p-2 border border-gray-200 rounded-lg text-sm outline-none min-h-[8rem] bg-white text-gray-900" /></div>
                            </div>
                            <div className="space-y-4">
                                <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Metadata</h3>
                                <div><label className="block text-sm font-medium text-gray-700 mb-1">Date</label><input type="date" value={currentDoc.date || ''} onChange={e => setCurrentDoc({...currentDoc, date: e.target.value})} className="w-full p-2 border border-gray-200 rounded-lg text-sm bg-white text-gray-900 outline-none focus:border-brand-cyan" /></div>
                                <CreatableSelect label="User Group Access" value={currentDoc.userGroup || ''} options={options.userGroups} onChange={(val) => setCurrentDoc({...currentDoc, userGroup: val})} onAddOption={(val) => addOption('userGroups', val)} placeholder="Select Access Group..." required />
                                <CreatableSelect label="Document Category" value={currentDoc.type || ''} options={options.docCategories} onChange={(val) => setCurrentDoc({...currentDoc, type: val})} onAddOption={(val) => addOption('docCategories', val)} placeholder="Select..." required />
                                <MultiSelectInput label="Authors" values={currentDoc.author || []} options={combinedAuthorOptions} onChange={(vals) => setCurrentDoc({...currentDoc, author: vals})} onAddOption={(val) => addOption('authors', val)} placeholder="Add authors..." />
                                <MultiSelectInput label="Tags" values={currentDoc.tags || []} options={options.tags} onChange={(vals) => setCurrentDoc({...currentDoc, tags: vals})} onAddOption={(val) => addOption('tags', val)} placeholder="Add tags..." />
                            </div>
                            <div className="col-span-1 lg:col-span-3 pt-6 flex justify-end gap-3 border-t border-gray-100 mt-4">
                                {currentDoc.id && (<button type="button" onClick={handleDeleteDocFromForm} className="px-4 py-2 text-sm font-medium text-red-600 hover:bg-red-50 rounded-lg transition-colors mr-auto">Delete Document</button>)}
                                <button type="button" onClick={() => setIsUploadingDoc(false)} className="px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">Cancel</button>
                                <button type="submit" className="px-6 py-2 text-sm font-bold text-white bg-brand-cyan hover:bg-brand-teal rounded-lg shadow-lg shadow-brand-cyan/20 transition-all flex items-center gap-2"><Save size={16} /> Save Document</button>
                            </div>
                        </form>
                    </div>
                ) : (
                    <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
                        <div className="p-4 border-b border-gray-100 bg-gray-50 flex justify-between items-center">
                            <div><h2 className="text-xl font-bold text-gray-900 mb-1">Document Library</h2><p className="text-sm text-gray-500">View and manage uploaded files.</p></div>
                            <button onClick={handleUploadClick} className="flex items-center justify-center gap-2 px-4 py-2 bg-gray-900 text-white text-sm font-medium rounded-lg hover:bg-black transition-colors"><Plus size={16} /> Upload New</button>
                        </div>
                        <div className="overflow-x-auto">
                            <table className="w-full text-left border-collapse">
                                <thead><tr className="bg-gray-50 border-b border-gray-100 text-xs font-bold text-gray-500 uppercase tracking-wider"><th className="px-6 py-4">Document</th><th className="px-6 py-4">Category</th><th className="px-6 py-4">Date</th><th className="px-6 py-4">Uploaded By</th><th className="px-6 py-4 text-right">Actions</th></tr></thead>
                                <tbody className="divide-y divide-gray-50">{documentsList.map((doc) => (<tr key={doc.id} className="hover:bg-gray-50 transition-colors"><td className="px-6 py-4"><div className="flex items-center gap-3"><div className={`w-10 h-10 rounded-lg flex items-center justify-center text-xs font-bold border ${doc.format === 'PPT' ? 'bg-orange-50 border-orange-100 text-orange-700' : 'bg-red-50 border-red-100 text-red-700'}`}>{doc.format}</div><div><div className="text-sm font-bold text-gray-900 line-clamp-1">{doc.title}</div><div className="text-xs text-gray-500">{doc.fileSize}</div></div></div></td><td className="px-6 py-4"><span className={`inline-flex px-2 py-1 rounded text-xs font-bold ${getDocCategoryStyle(doc.type)}`}>{doc.type}</span></td><td className="px-6 py-4 text-xs text-gray-500 font-mono">{doc.date}</td><td className="px-6 py-4 text-xs text-gray-500 font-medium">{doc.uploadedBy}</td><td className="px-6 py-4 text-right"><button onClick={() => handleEditLibraryDoc(doc)} className="flex items-center gap-1 text-xs font-medium text-gray-500 hover:text-brand-cyan hover:bg-gray-100 px-2 py-1 rounded transition-colors ml-auto"><Edit3 size={14} /> Edit</button></td></tr>))}</tbody>
                            </table>
                        </div>
                    </div>
                )}
                </>
            )}

            {activeTab === 'labels' && (
                <div className="grid grid-cols-12 gap-8 h-[calc(100vh-200px)]">
                    <div className="col-span-3 bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden flex flex-col">
                        <div className="p-4 border-b border-gray-100 bg-gray-50"><h3 className="font-bold text-gray-900 text-sm uppercase tracking-wide">Classifications</h3></div>
                        <div className="flex-1 overflow-y-auto p-2 space-y-1">
                            {labelCategories.map(cat => (
                                <button key={cat.key} onClick={() => setActiveLabelCategory(cat.key)} className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-sm transition-colors ${activeLabelCategory === cat.key ? 'bg-brand-cyan/10 text-brand-cyan font-bold' : 'text-gray-600 hover:bg-gray-50'}`}>
                                    <div className="flex items-center gap-3">{cat.icon}{cat.label}</div><span className="text-xs bg-gray-100 px-1.5 py-0.5 rounded text-gray-500 font-mono">{options[cat.key].length}</span>
                                </button>
                            ))}
                        </div>
                    </div>
                    <div className="col-span-9 bg-white rounded-xl border border-gray-100 shadow-sm flex flex-col">
                         <div className="p-6 border-b border-gray-100 flex justify-between items-center">
                             <div><h2 className="text-xl font-bold text-gray-900 mb-1">Manage {labelCategories.find(c => c.key === activeLabelCategory)?.label}</h2><p className="text-sm text-gray-500">Add or remove standardized labels for this category.</p></div>
                             <div className="flex gap-2"><input type="text" value={newLabelInput} onChange={(e) => setNewLabelInput(e.target.value)} placeholder="Add new..." className="w-64 border border-gray-200 bg-white text-gray-900 rounded-lg px-3 py-2 text-sm outline-none focus:border-brand-cyan" /><button onClick={() => { addOption(activeLabelCategory, newLabelInput); setNewLabelInput(''); }} disabled={!newLabelInput.trim()} className="flex items-center justify-center gap-2 px-4 py-2 bg-gray-900 text-white text-sm font-medium rounded-lg hover:bg-black transition-colors disabled:opacity-50"><Plus size={16} /> Add</button></div>
                         </div>
                         <div className="p-6 flex-1 overflow-y-auto">
                             <div className="flex flex-wrap gap-2">
                                 {options[activeLabelCategory].sort().map(item => (
                                     <div key={item} className="flex items-center gap-2 px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg group hover:border-brand-cyan/30 hover:bg-brand-cyan/5 transition-all">
                                         <span className="text-sm font-medium text-gray-700 group-hover:text-gray-900">{item}</span>
                                         <button onClick={() => removeOption(activeLabelCategory, item)} className="text-gray-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"><X size={14} /></button>
                                     </div>
                                 ))}
                             </div>
                         </div>
                    </div>
                </div>
            )}

            {activeTab === 'users' && (
                <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden min-h-[600px] flex flex-col">
                    <div className="p-6 border-b border-gray-100 flex flex-col md:flex-row justify-end items-start md:items-center gap-4 bg-gray-50/50">
                        <div className="flex items-center gap-2 bg-gray-200/50 p-1 rounded-lg mr-auto">
                            <button onClick={() => setUserSubTab('all')} className={`px-4 py-2 text-sm font-medium rounded-md transition-all ${userSubTab === 'all' ? 'bg-white text-gray-900 shadow-sm font-bold' : 'text-gray-500 hover:text-gray-900'}`}>All Users</button>
                            <button onClick={() => setUserSubTab('pending')} className={`px-4 py-2 text-sm font-medium rounded-md transition-all flex items-center gap-2 ${userSubTab === 'pending' ? 'bg-white text-gray-900 shadow-sm font-bold' : 'text-gray-500 hover:text-gray-900'}`}>Pending {users.filter(u => u.status === 'Pending').length > 0 && <span className="w-5 h-5 rounded-full bg-red-500 text-white text-[10px] flex items-center justify-center font-bold">{users.filter(u => u.status === 'Pending').length}</span>}</button>
                            <button onClick={() => setUserSubTab('groups')} className={`px-4 py-2 text-sm font-medium rounded-md transition-all ${userSubTab === 'groups' ? 'bg-white text-gray-900 shadow-sm font-bold' : 'text-gray-500 hover:text-gray-900'}`}>User Groups</button>
                        </div>
                        <button onClick={() => setIsInviteModalOpen(true)} className="flex items-center gap-2 px-4 py-2 bg-gray-900 text-white text-sm font-bold rounded-lg hover:bg-black transition-colors shadow-md"><UserPlus size={16} /> Invite User</button>
                    </div>
                    <div className="flex-1 p-0">
                        {userSubTab === 'all' && (
                            <div className="overflow-x-auto">
                                <table className="w-full text-left">
                                    <thead className="bg-gray-50 border-b border-gray-100"><tr><th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase">User</th><th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase">Role</th><th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase">Status</th><th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase text-right">Actions</th></tr></thead>
                                    <tbody className="divide-y divide-gray-50">{users.filter(u => u.status !== 'Pending').map(user => (<tr key={user.id} className="hover:bg-gray-50 transition-colors"><td className="px-6 py-4"><div className="flex items-center gap-3"><div className="w-9 h-9 rounded-full bg-gray-100 text-gray-600 flex items-center justify-center font-bold text-sm border border-gray-200">{user.name.charAt(0)}</div><div><div className="text-sm font-bold text-gray-900">{user.name}</div><div className="text-xs text-gray-500">{user.email}</div></div></div></td><td className="px-6 py-4"><div className={`flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider ${user.role === 'Admin' ? 'text-purple-600' : 'text-blue-600'}`}><Shield size={14} /> {user.role}</div></td><td className="px-6 py-4"><span className={`inline-flex px-2 py-1 rounded-full text-xs font-bold ${user.status === 'Active' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}>{user.status}</span></td><td className="px-6 py-4 text-right"><div className="flex items-center justify-end gap-2"><button onClick={() => openEditUser(user)} className="p-1.5 text-gray-400 hover:text-brand-cyan hover:bg-gray-100 rounded transition-colors"><Edit3 size={14} /></button><button onClick={() => handleDeleteUser(user.id)} className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded transition-colors"><Trash2 size={14} /></button></div></td></tr>))}</tbody>
                                </table>
                            </div>
                        )}
                        {userSubTab === 'pending' && (
                            <div className="overflow-x-auto">
                                <table className="w-full text-left">
                                    <thead className="bg-gray-50 border-b border-gray-100"><tr><th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase">User</th><th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase">Requested</th><th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase text-right">Actions</th></tr></thead>
                                    <tbody className="divide-y divide-gray-50">{users.filter(u => u.status === 'Pending').map(user => (<tr key={user.id} className="hover:bg-gray-50 transition-colors"><td className="px-6 py-4"><div><div className="text-sm font-bold text-gray-900">{user.name}</div><div className="text-xs text-gray-500">{user.email}</div></div></td><td className="px-6 py-4 text-sm text-gray-500">{user.requestedDate}</td><td className="px-6 py-4 text-right"><div className="flex items-center justify-end gap-2"><button onClick={() => handleApproveUser(user)} className="px-3 py-1 bg-green-500 text-white text-xs font-bold rounded-lg hover:bg-green-600 transition-colors">Approve</button><button onClick={() => initiateReject(user)} className="px-3 py-1 bg-red-100 text-red-600 text-xs font-bold rounded-lg hover:bg-red-200 transition-colors">Reject</button></div></td></tr>))}</tbody>
                                </table>
                            </div>
                        )}
                        {userSubTab === 'groups' && (
                            <div className="p-6">
                                <div className="flex gap-4 mb-6"><input type="text" value={newGroupInput} onChange={(e) => setNewGroupInput(e.target.value)} placeholder="New Group Name..." className="flex-1 p-2 border border-gray-200 rounded-lg text-sm outline-none focus:border-brand-cyan" /><button onClick={handleCreateGroup} className="px-4 py-2 bg-gray-900 text-white text-sm font-bold rounded-lg hover:bg-black transition-colors">Create Group</button></div>
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">{options.userGroups.map(group => (<div key={group} className="p-4 border border-gray-200 rounded-xl hover:border-brand-cyan/30 hover:bg-brand-cyan/5 transition-all group relative bg-white"><div className="flex justify-between items-start mb-2"><h4 className="font-bold text-gray-900">{group}</h4>{group !== 'All Users' && (<button onClick={() => handleDeleteGroup(group)} className="text-gray-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"><X size={14} /></button>)}</div><p className="text-xs text-gray-500 mb-4">{users.filter(u => u.groups.includes(group)).length} Members</p><button onClick={() => openGroupModal(group)} className="w-full py-1.5 text-xs font-medium text-brand-cyan bg-white border border-brand-cyan rounded-lg hover:bg-brand-cyan hover:text-white transition-colors">Manage Members</button></div>))}</div>
                            </div>
                        )}
                    </div>
                </div>
            )}
            
            {activeTab === 'portal' && (
                <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-8">
                    <h2 className="text-xl font-bold text-gray-900 mb-6">Portal Configuration</h2>
                    <div className="space-y-8">
                        <div>
                            <h3 className="text-sm font-bold text-gray-900 mb-4 uppercase tracking-wide">Home Hero Section</h3>
                            <div className="grid grid-cols-1 gap-4">
                                <div><label className="block text-xs font-bold text-gray-500 mb-1">Hero Title</label><input type="text" value={homeHero.title} onChange={(e) => setHomeHero({...homeHero, title: e.target.value})} className="w-full p-2 border border-gray-200 rounded-lg text-sm" /></div>
                                <div><label className="block text-xs font-bold text-gray-500 mb-1">Hero Subtitle</label><textarea value={homeHero.subtitle} onChange={(e) => setHomeHero({...homeHero, subtitle: e.target.value})} className="w-full p-2 border border-gray-200 rounded-lg text-sm h-24 resize-none" /></div>
                                <button onClick={handleUpdateHome} className="w-fit px-4 py-2 bg-gray-900 text-white text-sm font-bold rounded-lg">Update Home Content</button>
                            </div>
                        </div>
                         <div className="pt-8 border-t border-gray-100">
                             <h3 className="text-sm font-bold text-gray-900 mb-4 uppercase tracking-wide flex items-center gap-2"><LayoutTemplate size={16} /> Bulk Data Import</h3>
                             <p className="text-sm text-gray-500 mb-4">Upload historical data via Excel/CSV. This will append to the existing database.</p>
                             <div className="flex gap-4">
                                 <button onClick={downloadTemplate} className="px-4 py-2 border border-gray-200 text-gray-700 rounded-lg text-sm font-bold hover:bg-gray-50 flex items-center gap-2"><Download size={16} /> Download Template</button>
                                 <button onClick={() => setIsBulkModalOpen(true)} className="px-4 py-2 bg-brand-cyan text-white rounded-lg text-sm font-bold hover:bg-brand-teal flex items-center gap-2 shadow-lg shadow-brand-cyan/20"><Upload size={16} /> Import Excel</button>
                             </div>
                         </div>
                    </div>
                </div>
            )}
        </div>
      </div>

      {isInviteModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-[fadeIn_0.2s_ease-out]">
              <div className="bg-white rounded-xl shadow-2xl w-full max-w-md p-6">
                  <h3 className="text-lg font-bold text-gray-900 mb-4">Invite New User</h3>
                  <form onSubmit={handleInviteUser} className="space-y-4">
                      <input name="name" type="text" placeholder="Full Name" required className="w-full p-2 border border-gray-200 rounded-lg text-sm" />
                      <input name="email" type="email" placeholder="Email Address" required className="w-full p-2 border border-gray-200 rounded-lg text-sm" />
                      <div className="grid grid-cols-2 gap-4">
                          <input name="designation" type="text" placeholder="Designation" required className="w-full p-2 border border-gray-200 rounded-lg text-sm" />
                          <input name="department" type="text" placeholder="Department" required className="w-full p-2 border border-gray-200 rounded-lg text-sm" />
                      </div>
                      <select name="role" className="w-full p-2 border border-gray-200 rounded-lg text-sm"><option value="User">User</option><option value="Admin">Admin</option></select>
                      <div className="flex justify-end gap-3 pt-4"><button type="button" onClick={() => setIsInviteModalOpen(false)} className="px-4 py-2 text-gray-500 hover:bg-gray-100 rounded-lg text-sm font-medium">Cancel</button><button type="submit" className="px-4 py-2 bg-brand-cyan text-white rounded-lg text-sm font-bold hover:bg-brand-teal">Send Invite</button></div>
                  </form>
              </div>
          </div>
      )}

      {isEditingNews && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-[fadeIn_0.2s_ease-out]">
             <div className="bg-white rounded-xl shadow-2xl w-full max-w-4xl max-h-[90vh] flex flex-col overflow-hidden">
                 <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50">
                     <h3 className="text-lg font-bold text-gray-900">{currentNews.id ? 'Edit Intelligence Entry' : 'Add New Intelligence'}</h3>
                     <button onClick={() => setIsEditingNews(false)} className="text-gray-400 hover:text-gray-600"><X size={20} /></button>
                 </div>
                 <div className="flex-1 overflow-y-auto p-6 custom-scrollbar">
                     <form id="newsForm" onSubmit={handleSaveNews} className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <div><label className="block text-xs font-bold text-gray-500 uppercase mb-1">Date *</label><input type="date" value={currentNews.date} onChange={e => setCurrentNews({...currentNews, date: e.target.value})} className="w-full p-2 border border-gray-200 rounded-lg text-sm" required /></div>
                            <div><CreatableSelect label="Entry Type" value={currentNews.entryType || ''} options={options.entryTypes} onChange={v => setCurrentNews({...currentNews, entryType: v as EntryType})} onAddOption={v => addOption('entryTypes', v)} required /></div>
                             <div><CreatableSelect label="News Type" value={currentNews.type || ''} options={options.types} onChange={v => setCurrentNews({...currentNews, type: v as NewsType, subType: ''})} onAddOption={v => addOption('types', v)} required /></div>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                             <div><CreatableSelect label="Sub-Type" value={currentNews.subType || ''} options={getSubTypesForType(currentNews.type)} onChange={v => setCurrentNews({...currentNews, subType: v})} onAddOption={v => addOption('subTypes', v)} required /></div>
                            <div className="md:col-span-3"><label className="block text-xs font-bold text-gray-500 uppercase mb-1">Title *</label><input type="text" value={currentNews.title} onChange={e => setCurrentNews({...currentNews, title: e.target.value})} className="w-full p-2 border border-gray-200 rounded-lg text-sm font-bold" required /></div>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div><label className="block text-xs font-bold text-gray-500 uppercase mb-1">Summary</label><textarea value={currentNews.summary} onChange={e => setCurrentNews({...currentNews, summary: e.target.value})} className="w-full p-2 border border-gray-200 rounded-lg text-sm h-32 resize-none" /></div>
                            <div><label className="block text-xs font-bold text-amber-600 uppercase mb-1">CI Note (Internal)</label><textarea value={currentNews.ciNote} onChange={e => setCurrentNews({...currentNews, ciNote: e.target.value})} className="w-full p-2 border border-amber-200 bg-amber-50 rounded-lg text-sm h-32 resize-none" /></div>
                        </div>
                        <div className="p-4 bg-gray-50 rounded-xl border border-gray-200 space-y-4">
                            <h4 className="text-xs font-bold text-gray-400 uppercase tracking-widest">Classification Tags</h4>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                <MultiSelectInput label="Companies *" values={currentNews.companies || []} options={options.companies} onChange={v => setCurrentNews({...currentNews, companies: v})} onAddOption={v => addOption('companies', v)} required />
                                <MultiSelectInput label="Assets" values={currentNews.assets || []} options={options.assets} onChange={v => setCurrentNews({...currentNews, assets: v})} onAddOption={v => addOption('assets', v)} />
                                <CreatableSelect label="Target *" value={currentNews.target || ''} options={options.targets} onChange={v => setCurrentNews({...currentNews, target: v})} onAddOption={v => addOption('targets', v)} required />
                                <CreatableSelect label="Tumor Type *" value={currentNews.tumorType || ''} options={options.tumorTypes} onChange={v => setCurrentNews({...currentNews, tumorType: v})} onAddOption={v => addOption('tumorTypes', v)} required />
                                <CreatableSelect label="Isotope" value={currentNews.isotope || ''} options={options.isotopes} onChange={v => setCurrentNews({...currentNews, isotope: v})} onAddOption={v => addOption('isotopes', v)} />
                                <CreatableSelect label="Asset Focus *" value={currentNews.assetFocus || ''} options={options.assetFocus} onChange={v => setCurrentNews({...currentNews, assetFocus: v})} onAddOption={v => addOption('assetFocus', v)} required />
                                <CreatableSelect label="Region *" value={currentNews.region || ''} options={options.regions} onChange={v => setCurrentNews({...currentNews, region: v as Region})} onAddOption={v => addOption('regions', v)} required />
                                <CreatableSelect label="Phase" value={currentNews.phase || ''} options={options.phases} onChange={v => setCurrentNews({...currentNews, phase: v})} onAddOption={v => addOption('phases', v)} />
                                <CreatableSelect label="Line of Therapy" value={currentNews.lineOfTherapy || ''} options={options.linesOfTherapy} onChange={v => setCurrentNews({...currentNews, lineOfTherapy: v})} onAddOption={v => addOption('linesOfTherapy', v)} />
                                <div><label className="block text-xs font-bold text-gray-500 uppercase mb-1">Trial ID</label><input type="text" value={currentNews.trialId || ''} onChange={e => setCurrentNews({...currentNews, trialId: e.target.value})} className="w-full p-2 border border-gray-200 rounded-lg text-sm" placeholder="e.g. NCT12345678" /></div>
                            </div>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-end">
                            <div><label className="block text-xs font-bold text-gray-500 uppercase mb-1">Source Name *</label><input type="text" value={currentNews.sourceName || ''} onChange={e => setCurrentNews({...currentNews, sourceName: e.target.value})} className="w-full p-2 border border-gray-200 rounded-lg text-sm" required /></div>
                            <div><label className="block text-xs font-bold text-gray-500 uppercase mb-1">Source URL *</label><input type="url" value={currentNews.sourceUrl || ''} onChange={e => setCurrentNews({...currentNews, sourceUrl: e.target.value})} className="w-full p-2 border border-gray-200 rounded-lg text-sm" required /></div>
                            <div className="flex items-center gap-4">
                                <label className="flex items-center gap-2 cursor-pointer bg-gray-50 px-3 py-2 rounded-lg border border-gray-200"><input type="checkbox" checked={currentNews.priority === 'Key'} onChange={e => setCurrentNews({...currentNews, priority: e.target.checked ? 'Key' : 'Other'})} className="rounded text-brand-cyan" /><span className="text-sm font-bold text-gray-700">Key Priority</span></label>
                                <label className="flex items-center gap-2 cursor-pointer bg-red-50 px-3 py-2 rounded-lg border border-red-100"><input type="checkbox" checked={currentNews.isBreaking} onChange={e => setCurrentNews({...currentNews, isBreaking: e.target.checked})} className="rounded text-red-500" /><span className="text-sm font-bold text-red-600">Breaking News</span></label>
                            </div>
                        </div>
                        {currentNews.isBreaking && (<div className="p-4 bg-red-50 rounded-xl border border-red-100 animate-[fadeIn_0.3s_ease-out]"><label className="block text-xs font-bold text-red-500 uppercase mb-1">Breaking Ticker Text (Short)</label><input type="text" value={currentNews.breakingText || ''} onChange={e => setCurrentNews({...currentNews, breakingText: e.target.value})} className="w-full p-2 border border-red-200 rounded-lg text-sm text-red-900 bg-white" placeholder="Text to scroll on ticker..." /></div>)}
                     </form>
                 </div>
                 <div className="p-4 border-t border-gray-100 bg-gray-50 flex justify-end gap-3">
                     {currentNews.id && (<button type="button" onClick={() => { setIsEditingNews(false); handleDeleteNews(currentNews.id!); }} className="mr-auto text-red-500 hover:text-red-700 text-sm font-bold px-4 py-2 hover:bg-red-50 rounded-lg">Delete Entry</button>)}
                     <button type="button" onClick={() => setIsEditingNews(false)} className="px-6 py-2 text-gray-600 hover:bg-gray-200 rounded-lg text-sm font-bold">Cancel</button>
                     <button type="submit" form="newsForm" className="px-6 py-2 bg-brand-cyan text-white rounded-lg text-sm font-bold hover:bg-brand-teal shadow-lg shadow-brand-cyan/20">Save Entry</button>
                 </div>
             </div>
          </div>
      )}

      {isBulkModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-[fadeIn_0.2s_ease-out]">
              <div className="bg-white rounded-xl shadow-2xl w-full max-w-lg p-8">
                  <h3 className="text-xl font-bold text-gray-900 mb-2">Import Intelligence Data</h3>
                  <p className="text-gray-500 text-sm mb-6">Upload an Excel (.xlsx) file matching the template structure.</p>
                  <div onClick={() => bulkInputRef.current?.click()} className="border-2 border-dashed border-gray-300 rounded-xl p-10 flex flex-col items-center justify-center text-center hover:border-brand-cyan hover:bg-brand-cyan/5 transition-all cursor-pointer">
                      <input type="file" ref={bulkInputRef} className="hidden" accept=".xlsx, .xls" onChange={handleBulkUpload} />
                      <Upload size={32} className="text-gray-400 mb-3" />
                      <p className="text-sm font-bold text-gray-700">Click to upload Excel file</p>
                  </div>
                  {uploadProgress > 0 && (<div className="mt-6"><div className="flex justify-between text-xs font-bold text-gray-500 mb-1"><span>Processing...</span><span>{uploadProgress}%</span></div><div className="w-full bg-gray-100 rounded-full h-2 overflow-hidden"><div className="bg-brand-cyan h-full transition-all duration-300" style={{ width: `${uploadProgress}%` }}></div></div></div>)}
                  <div className="flex justify-end gap-3 mt-8"><button onClick={() => setIsBulkModalOpen(false)} className="px-4 py-2 text-gray-500 hover:bg-gray-100 rounded-lg text-sm font-medium">Cancel</button></div>
              </div>
          </div>
      )}
      
      {isGroupModalOpen && selectedGroupForEdit && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-[fadeIn_0.2s_ease-out]">
              <div className="bg-white rounded-xl shadow-2xl w-full max-w-md p-6">
                  <div className="flex justify-between items-center mb-4"><h3 className="text-lg font-bold text-gray-900">Manage: {selectedGroupForEdit}</h3><button onClick={() => setIsGroupModalOpen(false)}><X size={20} className="text-gray-400 hover:text-gray-600" /></button></div>
                  <input type="text" placeholder="Search members..." value={memberSearch} onChange={e => setMemberSearch(e.target.value)} className="w-full p-2 border border-gray-200 rounded-lg text-sm mb-4 outline-none focus:border-brand-cyan" />
                  <div className="max-h-60 overflow-y-auto space-y-2">
                      {users.filter(u => u.name.toLowerCase().includes(memberSearch.toLowerCase())).map(u => (
                          <div key={u.id} onClick={() => toggleUserInGroup(u.id, selectedGroupForEdit)} className="flex items-center justify-between p-2 hover:bg-gray-50 rounded cursor-pointer">
                              <span className="text-sm text-gray-700">{u.name}</span>
                              {u.groups.includes(selectedGroupForEdit) ? <CheckCircle2 size={16} className="text-brand-cyan" /> : <div className="w-4 h-4 border border-gray-300 rounded-full"></div>}
                          </div>
                      ))}
                  </div>
              </div>
          </div>
      )}

      {isEditUserModalOpen && editingUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-[fadeIn_0.2s_ease-out]">
            <div className="bg-white rounded-xl shadow-2xl w-full max-w-md p-6">
                <h3 className="text-lg font-bold text-gray-900 mb-4">Edit User: {editingUser.name}</h3>
                <div className="space-y-4">
                    <div><label className="block text-xs font-bold text-gray-500 uppercase mb-1">Role</label><select value={editingUser.role} onChange={e => setEditingUser({...editingUser, role: e.target.value as UserRole})} className="w-full p-2 border border-gray-200 rounded-lg text-sm"><option value="User">User</option><option value="Admin">Admin</option></select></div>
                    <div><label className="block text-xs font-bold text-gray-500 uppercase mb-1">Status</label><select value={editingUser.status} onChange={e => setEditingUser({...editingUser, status: e.target.value as UserStatus})} className="w-full p-2 border border-gray-200 rounded-lg text-sm"><option value="Active">Active</option><option value="Inactive">Inactive</option><option value="Pending">Pending</option></select></div>
                    <div className="flex justify-end gap-3 pt-4"><button onClick={() => setIsEditUserModalOpen(false)} className="px-4 py-2 text-gray-500 hover:bg-gray-100 rounded-lg text-sm font-medium">Cancel</button><button onClick={handleSaveUserChanges} className="px-4 py-2 bg-brand-cyan text-white rounded-lg text-sm font-bold hover:bg-brand-teal">Save Changes</button></div>
                </div>
            </div>
        </div>
      )}
      
      {isRejectModalOpen && userToReject && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-[fadeIn_0.2s_ease-out]">
              <div className="bg-white rounded-xl shadow-2xl w-full max-w-sm p-6 text-center">
                  <div className="w-12 h-12 bg-red-100 text-red-500 rounded-full flex items-center justify-center mx-auto mb-4"><AlertCircle size={24} /></div>
                  <h3 className="text-lg font-bold text-gray-900 mb-2">Reject Access?</h3>
                  <p className="text-sm text-gray-500 mb-6">Are you sure you want to reject {userToReject.name}? You can choose to notify them or reject silently.</p>
                  <div className="flex flex-col gap-2">
                      <button onClick={() => confirmReject(true)} className="w-full py-2 bg-red-500 text-white rounded-lg font-bold hover:bg-red-600 transition-colors">Reject & Notify User</button>
                      <button onClick={() => confirmReject(false)} className="w-full py-2 bg-gray-100 text-gray-700 rounded-lg font-bold hover:bg-gray-200 transition-colors">Reject Silently</button>
                      <button onClick={() => setIsRejectModalOpen(false)} className="w-full py-2 text-gray-400 hover:text-gray-600 font-medium text-sm">Cancel</button>
                  </div>
              </div>
          </div>
      )}
    </div>
  );
};

export default Admin;