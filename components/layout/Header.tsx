import React, { useState, useRef, useEffect } from 'react';
import { User, LogOut, Home, BookOpen } from 'lucide-react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { LogoutFeedbackModal } from '../features/LogoutFeedbackModal';

export const Header: React.FC = () => {
  const location = useLocation();
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

  const initiateLogout = () => {
    setIsDropdownOpen(false);
    setIsFeedbackOpen(true);
  };

  const confirmLogout = () => {
    setIsFeedbackOpen(false);
    navigate('/login');
  };

  return (
    <>
      <header className="fixed top-0 left-0 w-full h-20 bg-white border-b border-gray-100 z-30 flex items-center justify-between px-8">
         {/* Left: Logo */}
         <Link to="/home" className="flex flex-col items-center w-fit group">
            <div className="text-2xl font-serif font-bold tracking-tight text-gray-800 group-hover:opacity-80 transition-opacity leading-none">
               Targeted <span className="text-brand-cyan">Radionuclide Therapy</span>
            </div>
            <div className="flex gap-1.5 text-[0.6rem] leading-none font-sans font-semibold tracking-wider uppercase text-gray-500 mt-1.5 group-hover:text-brand-cyan/70 transition-colors select-none">
               <span>Competitive</span> <span>Intelligence</span> <span>Tracker</span>
            </div>
         </Link>

         {/* Center: Navigation - Absolute Centered */}
         <div className="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 hidden lg:flex gap-8 text-sm font-medium text-gray-600 items-center">
            <Link to="/home" className="hover:text-brand-cyan pb-1 border-b-2 border-transparent hover:border-brand-cyan transition-all" aria-label="Home">
               <Home size={18} />
            </Link>
            <Link to="/news-feed" className={`hover:text-brand-cyan pb-1 border-b-2 ${location.pathname === '/news-feed' ? 'border-brand-cyan text-brand-cyan' : 'border-transparent'}`}>News Feed</Link>
            <Link to="/analytics" className={`hover:text-brand-cyan pb-1 border-b-2 ${location.pathname === '/analytics' ? 'border-brand-cyan text-brand-cyan' : 'border-transparent'}`}>Analytics</Link>
            <Link to="/library" className={`hover:text-brand-cyan pb-1 border-b-2 ${location.pathname === '/library' ? 'border-brand-cyan text-brand-cyan' : 'border-transparent'}`}>Library</Link>
            <Link to="/trt-science" className={`hover:text-brand-cyan pb-1 border-b-2 ${location.pathname === '/trt-science' ? 'border-brand-cyan text-brand-cyan' : 'border-transparent'}`}>TRT Science</Link>
            <Link to="/admin" className={`hover:text-brand-cyan pb-1 border-b-2 ${location.pathname === '/admin' ? 'border-brand-cyan text-brand-cyan' : 'border-transparent'}`}>Admin</Link>
         </div>

         {/* Right: Actions */}
         <div className="flex items-center gap-4">
            <div className="relative" ref={dropdownRef}>
              <button 
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className="flex items-center gap-2 pl-2 pr-4 py-1.5 bg-gray-50 border border-gray-200 rounded-full hover:bg-gray-100 transition-colors focus:outline-none"
              >
                 <div className="w-7 h-7 bg-brand-teal text-white rounded-full flex items-center justify-center text-xs font-bold">JD</div>
                 <span className="text-sm font-medium text-gray-700 hidden md:block">John Doe</span>
              </button>

              {isDropdownOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-lg border border-gray-100 py-1 z-50 animate-[fadeIn_0.2s_ease-out]">
                  <Link 
                    to="/profile" 
                    onClick={() => setIsDropdownOpen(false)}
                    className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 hover:text-brand-cyan flex items-center gap-2 transition-colors"
                  >
                    <User size={16} /> My Profile
                  </Link>
                  <Link 
                    to="/help" 
                    onClick={() => setIsDropdownOpen(false)}
                    className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 hover:text-brand-cyan flex items-center gap-2 transition-colors"
                  >
                    <BookOpen size={16} /> Guide
                  </Link>
                  <div className="h-px bg-gray-100 my-1"></div>
                  <button 
                    onClick={initiateLogout}
                    className="w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50 flex items-center gap-2 transition-colors"
                  >
                    <LogOut size={16} /> Log Out
                  </button>
                </div>
              )}
            </div>
         </div>
      </header>

      {/* Logout Feedback Modal */}
      <LogoutFeedbackModal 
        isOpen={isFeedbackOpen}
        onClose={() => setIsFeedbackOpen(false)}
        onConfirmLogout={confirmLogout}
      />
    </>
  );
};