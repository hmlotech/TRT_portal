import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { DarkBackground } from '../components/visuals/Backgrounds';
import { Activity, Zap, User, LogOut, Home as HomeIcon, Mail, TrendingUp, AlertCircle, Database, Layers, ArrowUpRight, BookOpen } from 'lucide-react';
import { LogoutFeedbackModal } from '../components/features/LogoutFeedbackModal';

const Home: React.FC = () => {
  const navigate = useNavigate();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isFeedbackOpen, setIsFeedbackOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // In a real app, this would come from a Context or API. 
  // For this demo, we're displaying the default state that matches Admin settings.
  const contactInfo = {
    name: "John Doe",
    role: "Sr. Manager CI",
    email: "john.doe@biopharma.inc",
    avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
  };

  const tickerContent = [
    { type: 'BREAKING', label: 'BREAKING', text: 'AstraZeneca announces licensing deal for Ac-225 radiopharmaceutical', color: 'text-brand-green' },
    { type: 'DATA', label: 'DATA', text: 'New Curium Pb-212 clinical trial begins, targeting glioblastoma', color: 'text-brand-cyan' },
    { type: 'SCIENCE', label: 'SCIENCE', text: '81 radiotherapeutic trials now recruiting patients', color: 'text-brand-teal' },
    { type: 'REGULATORY', label: 'BREAKING', text: 'FDA prioritizes Lu-177 radioligand for expedited review', color: 'text-brand-green' },
    { type: 'MARKET', label: 'MARKET', text: 'Fusion Pharma stock up 5% on funding news', color: 'text-orange-400' }
  ];

  const handleLogoutClick = () => {
      setIsDropdownOpen(false);
      setIsFeedbackOpen(true);
  };

  const confirmLogout = () => {
      setIsFeedbackOpen(false);
      navigate('/login');
  };

  return (
    <div className="relative h-screen text-white overflow-hidden bg-dark-bg selection:bg-brand-cyan/30">
      <DarkBackground />
      
      {/* Header - Aligned EXACTLY with Header.tsx (h-20, px-8, justify-between) */}
      <header className="fixed top-0 w-full h-20 z-20 px-8 flex justify-between items-center border-b border-white/5 bg-dark-bg/80 backdrop-blur-md">
         {/* Logo Section - Aligned with Header.tsx */}
         <div className="flex flex-col items-center w-fit group cursor-default">
             <div className="text-2xl font-serif font-bold tracking-tight text-white/90 leading-none">
                Targeted <span className="text-brand-cyan drop-shadow-[0_0_8px_rgba(1,190,255,0.6)]">Radionuclide Therapy</span>
             </div>
             <div className="flex gap-1.5 text-[0.6rem] leading-none font-sans font-semibold tracking-wider uppercase text-brand-cyan/70 mt-1.5 select-none">
                <span>Competitive</span> <span>Intelligence</span> <span>Tracker</span>
             </div>
         </div>

         {/* Navigation Links - Absolute Centered */}
         <div className="hidden lg:flex items-center gap-8 absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2">
            <Link to="/home" className="text-brand-cyan hover:text-white transition-colors border-b-2 border-brand-cyan pb-1" aria-label="Home">
                <HomeIcon size={18} />
            </Link>
            <Link to="/news-feed" className="text-sm font-medium text-gray-400 hover:text-white transition-colors pb-1 border-b-2 border-transparent hover:border-white/20">News Feed</Link>
            <Link to="/analytics" className="text-sm font-medium text-gray-400 hover:text-white transition-colors pb-1 border-b-2 border-transparent hover:border-white/20">Analytics</Link>
            <Link to="/library" className="text-sm font-medium text-gray-400 hover:text-white transition-colors pb-1 border-b-2 border-transparent hover:border-white/20">Library</Link>
            <Link to="/trt-science" className="text-sm font-medium text-gray-400 hover:text-white transition-colors pb-1 border-b-2 border-transparent hover:border-white/20">TRT Science</Link>
            <Link to="/admin" className="text-sm font-medium text-gray-400 hover:text-white transition-colors pb-1 border-b-2 border-transparent hover:border-white/20">Admin</Link>
         </div>

         {/* Profile Section - Aligned with Header.tsx */}
         <div className="flex items-center gap-4">
             <div className="relative" ref={dropdownRef}>
                 <button 
                     onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                     className="flex items-center gap-2 pl-2 pr-4 py-1.5 bg-white/5 border border-white/10 rounded-full hover:bg-white/10 transition-colors group focus:outline-none"
                 >
                     <div className="w-7 h-7 bg-brand-teal text-white rounded-full flex items-center justify-center text-xs font-bold shadow-lg shadow-brand-teal/20">JD</div>
                     <span className="text-sm font-medium text-gray-300 group-hover:text-white hidden md:block transition-colors">John Doe</span>
                 </button>

                 {isDropdownOpen && (
                     <div className="absolute right-0 mt-2 w-48 bg-dark-deep border border-gray-700 rounded-xl shadow-xl py-1 z-50 animate-[fadeIn_0.2s_ease-out]">
                          <Link 
                            to="/profile" 
                            onClick={() => setIsDropdownOpen(false)}
                            className="w-full px-4 py-2 text-left text-sm text-gray-300 hover:bg-white/5 hover:text-white flex items-center gap-2 transition-colors"
                          >
                            <User size={16} /> My Profile
                          </Link>
                          <Link 
                            to="/help" 
                            onClick={() => setIsDropdownOpen(false)}
                            className="w-full px-4 py-2 text-left text-sm text-gray-300 hover:bg-white/5 hover:text-white flex items-center gap-2 transition-colors"
                          >
                            <BookOpen size={16} /> Guide
                          </Link>
                          <div className="h-px bg-gray-700 my-1"></div>
                          <button 
                            onClick={handleLogoutClick}
                            className="w-full px-4 py-2 text-left text-sm text-red-400 hover:bg-red-500/10 flex items-center gap-2 transition-colors"
                          >
                            <LogOut size={16} /> Log Out
                          </button>
                     </div>
                 )}
             </div>
         </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-8 h-full flex flex-col justify-center relative z-10 pt-20 pb-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center w-full">
           
           {/* Left: Text */}
           <div className="space-y-8 animate-[fadeInUp_1s_ease-out] relative z-20">
              
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-serif leading-[1.05] tracking-tight">
                 Targeted <br/>
                 <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-green via-brand-cyan to-brand-teal animate-[shimmer_3s_linear_infinite] bg-[length:200%_auto] whitespace-nowrap">
                   Radionuclide Therapy
                 </span>
              </h1>
              <p className="text-sm text-gray-400 max-w-xl leading-relaxed font-light text-justify border-l-2 border-white/10 pl-4">
                 TRT CI Tracker is a web portal designed specifically for company employees. Tracker enables users to read, analyze and download CI information related to TRT developments including clinical developments, manufacturing, supply chain and other market updates.
              </p>

              {/* Contact Section - Modern Atomic Design */}
              <div className="mt-8 pt-8 border-t border-white/5 flex items-center gap-5 group w-fit">
                  <div className="relative">
                      {/* Animated Glow Behind Avatar */}
                      <div className="absolute -inset-1 bg-gradient-to-r from-brand-cyan to-brand-teal rounded-full blur opacity-40 group-hover:opacity-75 transition duration-500"></div>
                      
                      {/* Avatar Container */}
                      <div className="relative w-14 h-14 rounded-full p-[2px] bg-gradient-to-br from-brand-cyan to-transparent">
                          <img 
                            src={contactInfo.avatar} 
                            alt={contactInfo.name} 
                            className="w-full h-full rounded-full object-cover border-2 border-dark-bg"
                          />
                      </div>
                  </div>

                  <div className="flex flex-col">
                      <span className="text-[10px] font-bold uppercase tracking-widest text-brand-cyan mb-0.5">Contact</span>
                      <h3 className="text-lg font-serif font-bold text-white leading-none mb-1">{contactInfo.name}</h3>
                      <div className="flex items-center gap-2 text-sm text-gray-400 font-light">
                          <span>{contactInfo.role}</span>
                          <a href={`mailto:${contactInfo.email}`} className="flex items-center justify-center w-6 h-6 rounded-full bg-white/5 hover:bg-brand-cyan hover:text-white transition-all text-brand-cyan">
                              <Mail size={12} />
                          </a>
                      </div>
                  </div>
              </div>
           </div>

           {/* Right: Futuristic Dashboard */}
           <div className="relative hidden lg:block h-full min-h-[500px] w-full max-w-[600px] mx-auto">
              
              {/* Layer 1: Brilliant Dark Atomic Background */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[140%] h-[140%] pointer-events-none z-0">
                   <svg className="w-full h-full opacity-100" viewBox="0 0 800 800" xmlns="http://www.w3.org/2000/svg">
                      <defs>
                         <filter id="brilliant-glow" filterUnits="userSpaceOnUse">
                            <feGaussianBlur stdDeviation="4" result="coloredBlur"/>
                            <feGaussianBlur stdDeviation="10" result="softBlur"/>
                            <feMerge>
                               <feMergeNode in="softBlur"/>
                               <feMergeNode in="coloredBlur"/>
                               <feMergeNode in="SourceGraphic"/>
                            </feMerge>
                         </filter>
                         <radialGradient id="coreGradient" cx="50%" cy="50%" r="50%">
                            <stop offset="0%" stopColor="#01BEFF" stopOpacity="0.8"/>
                            <stop offset="60%" stopColor="#01BEFF" stopOpacity="0.1"/>
                            <stop offset="100%" stopColor="#01BEFF" stopOpacity="0"/>
                         </radialGradient>
                      </defs>

                      <g transform="translate(400, 400)">
                          {/* Core Glow */}
                          <circle r="80" fill="url(#coreGradient)" className="animate-pulse" />
                          <circle r="15" fill="#fff" fillOpacity="0.9" filter="url(#brilliant-glow)">
                               <animate attributeName="r" values="15;18;15" dur="3s" repeatCount="indefinite" />
                          </circle>

                          {/* Complex Orbits */}
                          {[0, 60, 120].map((angle, i) => (
                              <g key={i} transform={`rotate(${angle})`}>
                                 <ellipse rx="300" ry="80" fill="none" stroke={i === 0 ? '#01BEFF' : i === 1 ? '#5ED500' : '#4DB6AC'} strokeWidth="1" strokeOpacity="0.3" />
                                 {/* Trail */}
                                 <path d="M-300,0 A300,80 0 0,1 300,0" fill="none" stroke={i === 0 ? '#01BEFF' : i === 1 ? '#5ED500' : '#4DB6AC'} strokeWidth="3" strokeOpacity="0.1" strokeLinecap="round" />
                                 
                                 {/* Particle */}
                                 <circle r="5" fill={i === 0 ? '#01BEFF' : i === 1 ? '#5ED500' : '#4DB6AC'} filter="url(#brilliant-glow)">
                                    <animateMotion dur={`${15 + i * 5}s`} repeatCount="indefinite" path="M-300,0 A300,80 0 1 1 300,0 A300,80 0 1 1 -300,0" />
                                 </circle>
                              </g>
                          ))}
                          
                          {/* Outer Dashed Ring */}
                          <circle r="380" fill="none" stroke="#fff" strokeWidth="1" strokeOpacity="0.1" strokeDasharray="10 20" className="animate-[spin_60s_linear_infinite]" />
                      </g>
                   </svg>
              </div>

              {/* Layer 2: Dashboard Grid */}
              <div className="relative z-10 grid grid-cols-2 gap-4 h-full content-center">
                 
                 {/* Card 1: Clinical Velocity (Span 2) */}
                 <div className="col-span-2 bg-dark-deep/60 backdrop-blur-2xl border border-white/10 rounded-2xl p-5 shadow-2xl hover:border-brand-cyan/30 transition-all duration-500 group">
                    <div className="flex justify-between items-center mb-4">
                       <h3 className="text-gray-200 font-medium flex items-center gap-2">
                          <Activity size={16} className="text-brand-green" /> Clinical Velocity
                       </h3>
                       <span className="text-xs font-bold bg-white/10 px-2 py-0.5 rounded text-gray-300">81 Active</span>
                    </div>
                    
                    <div className="grid grid-cols-3 gap-2">
                        {[
                           { label: 'Phase 1', count: 32, pct: '40%', color: 'bg-brand-cyan' },
                           { label: 'Phase 2', count: 41, pct: '50%', color: 'bg-brand-teal' },
                           { label: 'Phase 3', count: 8, pct: '10%', color: 'bg-brand-green' }
                        ].map((ph, i) => (
                           <div key={i} className="bg-black/20 rounded-lg p-2 text-center border border-white/5">
                              <div className="text-xs text-gray-500 mb-1">{ph.label}</div>
                              <div className="text-lg font-bold text-white mb-1">{ph.count}</div>
                              <div className="h-1 w-full bg-gray-700 rounded-full overflow-hidden">
                                 <div className={`h-full ${ph.color}`} style={{ width: ph.pct }}></div>
                              </div>
                           </div>
                        ))}
                    </div>
                 </div>

                 {/* Card 2: Market Flow */}
                 <div className="bg-dark-deep/60 backdrop-blur-2xl border border-white/10 rounded-2xl p-5 shadow-2xl hover:border-brand-teal/30 transition-all duration-500">
                    <h3 className="text-gray-400 text-xs font-bold uppercase tracking-wider mb-2 flex items-center gap-2">
                       <Layers size={12} /> Deal Volume
                    </h3>
                    <div className="flex items-baseline gap-2 mb-2">
                       <span className="text-3xl font-serif font-bold text-white">$2.4B</span>
                       <span className="text-xs text-brand-green flex items-center">
                          <ArrowUpRight size={10} /> 15%
                       </span>
                    </div>
                    <div className="text-xs text-gray-500">YTD Biopharma Capital</div>
                 </div>

                 {/* Card 3: Regulatory Watch */}
                 <div className="bg-dark-deep/60 backdrop-blur-2xl border border-white/10 rounded-2xl p-5 shadow-2xl hover:border-brand-cyan/30 transition-all duration-500">
                    <h3 className="text-gray-400 text-xs font-bold uppercase tracking-wider mb-2 flex items-center gap-2">
                       <AlertCircle size={12} /> Regulatory
                    </h3>
                    <div className="mb-2">
                       <div className="text-xl font-bold text-white leading-tight">FDA Priority</div>
                       <div className="text-xs text-brand-cyan">Review: Aug 4</div>
                    </div>
                    <div className="w-full bg-gray-700/50 h-1.5 rounded-full overflow-hidden">
                       <div className="h-full bg-gradient-to-r from-brand-cyan to-white w-3/4 animate-pulse"></div>
                    </div>
                 </div>

                 {/* Card 4: Supply Chain Monitor (Span 2) */}
                 <div className="col-span-2 bg-dark-deep/60 backdrop-blur-2xl border border-white/10 rounded-2xl p-4 shadow-2xl hover:border-brand-green/30 transition-all duration-500 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                       <div className="p-2 bg-brand-green/10 rounded-lg text-brand-green">
                          <Database size={18} />
                       </div>
                       <div>
                          <div className="text-sm font-bold text-white">Supply Chain Monitor</div>
                          <div className="text-xs text-gray-500">Isotope Availability Index</div>
                       </div>
                    </div>
                    <div className="flex gap-4">
                       <div className="text-right">
                          <div className="text-[10px] text-gray-400 font-mono">Lu-177</div>
                          <div className="text-xs font-bold text-brand-green">Stable</div>
                       </div>
                       <div className="h-8 w-px bg-white/10"></div>
                       <div className="text-right">
                          <div className="text-[10px] text-gray-400 font-mono">Ac-225</div>
                          <div className="text-xs font-bold text-orange-400">Scarce</div>
                       </div>
                    </div>
                 </div>

              </div>
           </div>
        </div>
      </main>

      {/* Ticker Footer */}
      <footer className="fixed bottom-0 w-full bg-dark-deep/90 border-t border-white/5 backdrop-blur-md z-20 h-12 flex items-center">
         {/* Updated to Breaking News with opaque background */}
         <div className="flex items-center px-6 border-r border-white/10 h-full bg-dark-deep z-30 shadow-lg shadow-black/20 flex-shrink-0">
            <span className="text-xs font-bold text-brand-cyan uppercase tracking-wider whitespace-nowrap">BREAKING</span>
         </div>
         
         <div className="flex-1 overflow-hidden h-full flex items-center relative">
             {/* Edge Fades for Smoothness */}
             <div className="absolute left-0 top-0 bottom-0 w-8 bg-gradient-to-r from-dark-deep to-transparent z-20 pointer-events-none"></div>
             <div className="absolute right-0 top-0 bottom-0 w-8 bg-gradient-to-l from-dark-deep to-transparent z-20 pointer-events-none"></div>

             {/* Scrolling Track */}
             <div className="flex items-center whitespace-nowrap animate-[ticker_60s_linear_infinite] hover:[animation-play-state:paused]">
                {/* Original Set */}
                {tickerContent.map((item, i) => (
                   <span key={i} className="mx-8 text-sm text-gray-300 flex items-center gap-2">
                      <span className={`${item.color} font-bold`}>{item.label}:</span> 
                      {item.text}
                   </span>
                ))}
                {/* Duplicate Set for Seamless Loop */}
                {tickerContent.map((item, i) => (
                   <span key={`dup-${i}`} className="mx-8 text-sm text-gray-300 flex items-center gap-2">
                      <span className={`${item.color} font-bold`}>{item.label}:</span> 
                      {item.text}
                   </span>
                ))}
             </div>
         </div>
         
         <style>{`
           @keyframes ticker {
             0% { transform: translate3d(0, 0, 0); }
             100% { transform: translate3d(-50%, 0, 0); }
           }
         `}</style>
      </footer>

      {/* Logout Feedback Modal */}
      <LogoutFeedbackModal 
        isOpen={isFeedbackOpen}
        onClose={() => setIsFeedbackOpen(false)}
        onConfirmLogout={confirmLogout}
      />
    </div>
  );
};

export default Home;