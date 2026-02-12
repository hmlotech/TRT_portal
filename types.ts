
export type NewsType = string; 
// Previously strict union: 'Commercial' | 'Clinical' ... (Relaxed for Admin extensibility)

export type Region = string;
// Previously strict union: 'Global' | 'North America' ...

export type EntryType = 'News' | 'Publication' | 'Internal CI';

export interface NewsItem {
  id: string;
  // --- Front Page: Y ---
  date: string;
  entryType: EntryType; // New per JSON
  type: NewsType;
  title: string;
  summary: string;
  tumorType?: string; // Renamed from indication
  target?: string; // PSMA, B7-H3
  isotope?: string; // 177Lu, 225Ac
  region: Region;
  sourceUrl?: string;
  aiSummary: boolean; // New JSON requirement (Y/N)
  isHumanReviewed: boolean;
  
  // --- Front Page: N (Subscriber/Detail View) ---
  subType?: string; // Trial stop, launch, approval etc.
  ciNote?: string; // Implication on client business
  breakingText?: string; // Specific text for the Live Ticker
  comment?: string; // Admin comments (Internal)
  companies?: string[]; // Companies involved
  assets?: string[]; // Assets discussed
  lineOfTherapy?: string; // New per JSON (1L, 2L etc)
  assetFocus?: string; // 'Therapeutic' | 'Diagnostic' | 'Theranostic'
  isotopeType?: string; // 'Alpha' | 'Beta'
  phase?: string; // Phase 1-4
  trialId?: string; // NCT Number
  sourceName?: string;
  isBreaking?: boolean; // Legacy/Visual flair
  
  // --- Priority ---
  priority?: 'Key' | 'Other'; // Updated per request
  reviewer?: string; // Name of the reviewer/analyst
}

export interface KeyCatalyst {
  id: string;
  title: string;
  date?: string;
  quarter?: string;
  url?: string;
  color: string;
}

export interface KeyEvent {
  id: string;
  title: string;
  date: string;
  location: string;
  url?: string;
}

export interface KPI {
  label: string;
  value: string;
  change: string;
  trend: 'up' | 'down' | 'neutral';
}

export interface ChartData {
  name: string;
  value: number;
  color: string;
}

export interface Publication {
  id: string;
  category: string;
  title: string;
  description?: string;
}

export interface SignalData {
  date: string;
  lutetium: number;
  actinium: number;
  lead: number;
}

// --- NEW SCIENCE INTERFACES ---

export interface ScienceTopic {
  id: string;
  title: string;
  shortDesc: string;
  imageUrl: string;
  color: string; // Tailwind class for gradients
  sections: {
    heading: string;
    content: string; // Markdown-like text
    keyPoints?: string[];
  }[];
}

export interface ScientificPublication {
  id: string;
  title: string;
  authors: string;
  journal: string;
  date: string;
  category: 'Clinical' | 'Pre-clinical' | 'Review' | 'Market';
  doi: string;
  abstract: string;
  visualSummary: {
    objective: string;
    design: string;
    results: {
      label: string;
      value: string;
      description: string;
      isPositive: boolean;
    }[];
    conclusion: string;
  };
  marketImplication: string; // The "So What" for the business
}

// --- NEWSLETTER / LIBRARY INTERFACES ---

export interface DocumentItem {
  id: string;
  title: string;
  type: string; // Relaxed from union to string to allow 'Internal Report' etc.
  date: string;
  format: string; // Relaxed to string for DOCX, XLSX
  fileSize: string;
  author: string[]; // Changed to array for multiple authors
  uploadedBy: string; // Team responsible for upload
  tags: string[];
  userGroup: string; // Replaces isRestricted boolean with specific group access
  thumbnailUrl?: string; // For PPT slide preview
  executiveSummary: string;
}
