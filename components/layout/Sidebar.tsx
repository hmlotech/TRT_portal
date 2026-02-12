import React, { useState } from 'react';
import { Home, Activity, BarChart2, BookOpen, Database, Settings, LogOut, Search, Library } from 'lucide-react';
import { useLocation, Link, useNavigate } from 'react-router-dom';
import { LogoutFeedbackModal } from '../features/LogoutFeedbackModal';

export const Sidebar: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [isFeedbackOpen, setIsFeedbackOpen] = useState(false);
  
  const isActive = (path: string) => location.pathname === path;

  const navItems = [
    { icon: Home, label: 'Home', path: '/home' },
    { icon: Activity, label: 'Live Feed', path: '/news-feed' },
    { icon: BarChart2, label: 'Analytics', path: '/analytics' },
    { icon: Library, label: 'Library', path: '/library' },
    { icon: Database, label: 'Markets', path: '/tracker' }, 
    { icon: BookOpen, label: 'Science', path: '/trt-science' },
  ];

  const handleLogoutClick = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsFeedbackOpen(true);
  };

  const confirmLogout = () => {
    setIsFeedbackOpen(false);
    navigate('/login');
  };

  return (
    <>
      <div className="fixed left-0 top-0 h-full w-20 bg-white border-r border-gray-100 flex flex-col items-center py-6 z-40 shadow-[4px_0_24px_rgba(0,0,0,0.02)]">
        <div className="mb-10 w-10 h-10 rounded-xl bg-gradient-to-br from-brand-green to-brand-cyan flex items-center justify-center shadow-lg shadow-brand-cyan/20 cursor-pointer hover:scale-105 transition-transform duration-300">
           <div className="w-4 h-4 bg-white rounded-full opacity-90 shadow-inner" />
        </div>

        <nav className="flex-1 w-full flex flex-col items-center gap-6">
          {navItems.map((item) => (
            <Link 
              key={item.path} 
              to={item.path}
              className={`p-3 rounded-xl transition-all duration-300 group relative ${
                isActive(item.path) 
                  ? 'text-brand-cyan bg-brand-cyan/5 shadow-inner shadow-brand-cyan/10' 
                  : 'text-gray-400 hover:text-gray-600 hover:bg-gray-50'
              }`}
            >
              <item.icon size={24} strokeWidth={isActive(item.path) ? 2.5 : 2} />
              
              {/* Active Indicator Line */}
              {isActive(item.path) && (
                <div className="absolute right-0 top-1/2 -translate-y-1/2 w-1 h-6 bg-brand-cyan rounded-l-full shadow-[0_0_10px_#01BEFF]" />
              )}
              
              {/* Tooltip */}
              <div className="absolute left-full ml-5 px-3 py-1.5 bg-dark-deep text-white text-xs font-medium rounded-md opacity-0 group-hover:opacity-100 pointer-events-none transition-all duration-200 whitespace-nowrap z-50 shadow-xl translate-x-[-10px] group-hover:translate-x-0">
                <div className="absolute left-0 top-1/2 -translate-x-1 -translate-y-1/2 border-4 border-transparent border-r-dark-deep"></div>
                {item.label}
              </div>
            </Link>
          ))}
        </nav>

        <div className="flex flex-col gap-4 mt-auto">
          <button className="p-3 text-gray-400 hover:text-gray-600 transition-colors hover:rotate-90 duration-500">
            <Settings size={22} />
          </button>
          <button 
            onClick={handleLogoutClick}
            className="p-3 text-gray-400 hover:text-red-500 transition-colors"
            title="Log Out"
          >
            <LogOut size={22} />
          </button>
        </div>
      </div>

      <LogoutFeedbackModal 
        isOpen={isFeedbackOpen}
        onClose={() => setIsFeedbackOpen(false)}
        onConfirmLogout={confirmLogout}
      />
    </>
  );
};