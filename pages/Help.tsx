import React from 'react';
import { Link } from 'react-router-dom';
import { DarkBackground } from '../components/visuals/Backgrounds';
import { ArrowLeft, Home, Activity, BarChart2, BookOpen, Settings, Zap, Shield, Search, Mail } from 'lucide-react';

const Help: React.FC = () => {
  return (
    <div className="relative min-h-screen text-white bg-dark-bg selection:bg-brand-cyan/30">
      <DarkBackground />
      
      {/* Header Navigation */}
      <header className="fixed top-0 w-full h-20 z-20 px-8 flex items-center border-b border-white/5 bg-dark-bg/80 backdrop-blur-md">
        <Link to="/home" className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors group">
            <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" />
            <span className="text-sm font-medium">Back to Home</span>
        </Link>
      </header>

      <div className="container mx-auto px-8 pt-32 pb-20 max-w-5xl animate-[fadeIn_0.5s_ease-out]">
        
        {/* Hero Section */}
        <div className="text-center mb-16">
            <h1 className="text-4xl md:text-5xl font-serif font-bold mb-4">Portal Guide</h1>
            <p className="text-gray-400 max-w-2xl mx-auto text-lg font-light">
                Comprehensive documentation for navigating the Targeted Radionuclide Therapy (TRT) Competitive Intelligence Tracker.
            </p>
        </div>

        {/* Feature Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
            
            {/* News Feed Card */}
            <div className="bg-dark-deep/60 backdrop-blur-md border border-white/10 rounded-2xl p-6 hover:border-brand-cyan/30 transition-all duration-300">
                <div className="w-10 h-10 rounded-lg bg-brand-cyan/10 flex items-center justify-center text-brand-cyan mb-4">
                    <Activity size={20} />
                </div>
                <h3 className="text-xl font-bold mb-2">Live News Feed</h3>
                <p className="text-sm text-gray-400 leading-relaxed mb-4">
                    Real-time aggregation of clinical, commercial, and regulatory updates.
                </p>
                <ul className="text-xs text-gray-500 space-y-2">
                    <li className="flex items-center gap-2"><Zap size={10} className="text-brand-green" /> Filter by Isotope (Lu-177, Ac-225)</li>
                    <li className="flex items-center gap-2"><Zap size={10} className="text-brand-green" /> Search by Competitor or Asset</li>
                    <li className="flex items-center gap-2"><Zap size={10} className="text-brand-green" /> Download Excel Reports</li>
                </ul>
            </div>

            {/* Analytics Card */}
            <div className="bg-dark-deep/60 backdrop-blur-md border border-white/10 rounded-2xl p-6 hover:border-brand-teal/30 transition-all duration-300">
                <div className="w-10 h-10 rounded-lg bg-brand-teal/10 flex items-center justify-center text-brand-teal mb-4">
                    <BarChart2 size={20} />
                </div>
                <h3 className="text-xl font-bold mb-2">Market Analytics</h3>
                <p className="text-sm text-gray-400 leading-relaxed mb-4">
                    Visualized data trends including deal volume, clinical velocity, and supply chain status.
                </p>
                <ul className="text-xs text-gray-500 space-y-2">
                    <li className="flex items-center gap-2"><Zap size={10} className="text-brand-green" /> Interactive Charts</li>
                    <li className="flex items-center gap-2"><Zap size={10} className="text-brand-green" /> Monthly KPI Summaries</li>
                </ul>
            </div>

            {/* Science Card */}
            <div className="bg-dark-deep/60 backdrop-blur-md border border-white/10 rounded-2xl p-6 hover:border-brand-green/30 transition-all duration-300">
                <div className="w-10 h-10 rounded-lg bg-brand-green/10 flex items-center justify-center text-brand-green mb-4">
                    <BookOpen size={20} />
                </div>
                <h3 className="text-xl font-bold mb-2">Scientific Library</h3>
                <p className="text-sm text-gray-400 leading-relaxed mb-4">
                    Deep dives into mechanism of action, key publications, and clinical trial designs.
                </p>
                <ul className="text-xs text-gray-500 space-y-2">
                    <li className="flex items-center gap-2"><Zap size={10} className="text-brand-green" /> Visual Abstracts</li>
                    <li className="flex items-center gap-2"><Zap size={10} className="text-brand-green" /> Educational Modules</li>
                </ul>
            </div>
        </div>

        {/* Detailed Flow */}
        <div className="bg-dark-deep/40 backdrop-blur-sm border border-white/5 rounded-3xl p-8 md:p-12">
            <h2 className="text-2xl font-serif font-bold mb-8 text-center">Data Architecture Flow</h2>
            
            <div className="relative">
                {/* Connecting Line */}
                <div className="absolute left-4 md:left-1/2 top-0 bottom-0 w-0.5 bg-gradient-to-b from-brand-cyan via-brand-teal to-brand-green opacity-30"></div>

                {/* Step 1 */}
                <div className="relative flex flex-col md:flex-row items-center gap-8 mb-12">
                    <div className="flex-1 md:text-right order-2 md:order-1">
                        <h4 className="text-lg font-bold text-brand-cyan mb-2">Ingestion</h4>
                        <p className="text-sm text-gray-400">Automated scrapers collect data from ClinicalTrials.gov, PubMed, and SEC filings. Raw data is normalized.</p>
                    </div>
                    <div className="w-8 h-8 rounded-full bg-dark-bg border-2 border-brand-cyan z-10 flex items-center justify-center text-xs font-bold order-1 md:order-2 shrink-0">1</div>
                    <div className="flex-1 order-3 opacity-50 hidden md:block"></div>
                </div>

                {/* Step 2 */}
                <div className="relative flex flex-col md:flex-row items-center gap-8 mb-12">
                    <div className="flex-1 order-3 md:order-1 opacity-50 hidden md:block"></div>
                    <div className="w-8 h-8 rounded-full bg-dark-bg border-2 border-brand-teal z-10 flex items-center justify-center text-xs font-bold order-1 md:order-2 shrink-0">2</div>
                    <div className="flex-1 order-2 md:order-3">
                         <h4 className="text-lg font-bold text-brand-teal mb-2">Processing & Analysis</h4>
                         <p className="text-sm text-gray-400">Human analysts verify key signals. AI models generate summaries and extract key entities (drugs, companies).</p>
                    </div>
                </div>

                {/* Step 3 */}
                <div className="relative flex flex-col md:flex-row items-center gap-8">
                    <div className="flex-1 md:text-right order-2 md:order-1">
                        <h4 className="text-lg font-bold text-brand-green mb-2">Visualization</h4>
                        <p className="text-sm text-gray-400">Verified intelligence is published to the live dashboard, feeding the ticker and analytics modules instantaneously.</p>
                    </div>
                    <div className="w-8 h-8 rounded-full bg-dark-bg border-2 border-brand-green z-10 flex items-center justify-center text-xs font-bold order-1 md:order-2 shrink-0">3</div>
                    <div className="flex-1 order-3 opacity-50 hidden md:block"></div>
                </div>
            </div>
        </div>

        {/* Footer Help */}
        <div className="mt-16 text-center border-t border-white/5 pt-8">
            <h3 className="text-lg font-bold mb-2">Need Technical Support?</h3>
            <p className="text-gray-400 text-sm mb-4">Contact the IT Helpdesk for access issues or bug reports.</p>
            <a href="mailto:support@biopharma.inc" className="inline-flex items-center gap-2 text-brand-cyan hover:text-white transition-colors text-sm font-medium">
                <Mail size={16} /> support@biopharma.inc
            </a>
        </div>

      </div>
    </div>
  );
};

export default Help;