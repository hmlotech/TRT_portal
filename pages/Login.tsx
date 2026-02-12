import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { DarkBackground } from '../components/visuals/Backgrounds';
import { UserPlus, ArrowRight } from 'lucide-react';

const Login: React.FC = () => {
  const navigate = useNavigate();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    navigate('/home');
  };

  return (
    <div className="relative min-h-screen flex flex-col items-center justify-center text-white p-4">
      <DarkBackground />
      
      <div className="w-full max-w-md animate-[fadeInUp_0.8s_ease-out]">
        
        {/* Logo Branding */}
        <div className="flex flex-col items-center mb-10 mx-auto w-fit">
             <div className="text-3xl font-serif font-bold tracking-tight text-white/90 leading-none">
                Targeted <span className="text-brand-cyan drop-shadow-[0_0_8px_rgba(1,190,255,0.6)]">Radionuclide Therapy</span>
             </div>
             <div className="flex gap-1.5 text-[0.7rem] leading-none font-sans font-semibold tracking-wider uppercase text-brand-cyan/60 mt-2 select-none">
                <span>Competitive</span> <span>Intelligence</span> <span>Tracker</span>
             </div>
        </div>

        <h1 className="text-4xl md:text-5xl font-serif text-center mb-10">Sign In</h1>
        
        <div className="bg-dark-card backdrop-blur-md border border-brand-cyan/20 rounded-2xl p-8 shadow-2xl shadow-brand-cyan/5 relative overflow-hidden">
          {/* Decorative glow */}
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-brand-cyan to-transparent opacity-50"></div>

          <form onSubmit={handleLogin} className="space-y-6">
            <div>
              <label className="block text-sm text-gray-400 mb-2">Email</label>
              <input 
                type="email" 
                className="w-full bg-[#001a2e]/60 border border-gray-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-brand-cyan focus:ring-1 focus:ring-brand-cyan transition-all"
                placeholder="Enter your email" 
              />
            </div>
            
            <div>
              <div className="flex justify-between items-center mb-2">
                <label className="block text-sm text-gray-400">Password</label>
                <a href="#" className="text-xs text-brand-cyan/80 hover:text-brand-cyan transition-colors">Forgot password?</a>
              </div>
              <input 
                type="password" 
                className="w-full bg-[#001a2e]/60 border border-gray-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-brand-cyan focus:ring-1 focus:ring-brand-cyan transition-all"
                placeholder="Enter your password"
              />
            </div>

            <button 
              type="submit"
              className="w-full bg-gradient-to-r from-brand-teal/80 to-brand-cyan/80 hover:from-brand-teal hover:to-brand-cyan text-white font-medium py-3 rounded-lg shadow-lg shadow-brand-cyan/20 transition-all transform hover:scale-[1.02] active:scale-[0.98]"
            >
              Sign In
            </button>

            {/* Quick Dev Link */}
             <div className="text-center pt-2">
               <button 
                 type="button"
                 onClick={() => navigate('/home')}
                 className="text-xs text-gray-500 hover:text-brand-cyan transition-colors flex items-center justify-center gap-1 mx-auto"
               >
                 (Dev) Quick Access <ArrowRight size={10} />
               </button>
             </div>
          </form>

          <div className="mt-6">
            <div className="relative flex py-2 items-center">
              <div className="flex-grow border-t border-gray-700"></div>
              <span className="flex-shrink-0 mx-4 text-gray-500 text-xs uppercase tracking-widest">New User?</span>
              <div className="flex-grow border-t border-gray-700"></div>
            </div>

            <div className="mt-4">
              <Link 
                to="/signup"
                className="w-full bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg py-3 flex items-center justify-center gap-2 transition-all group"
              >
                <UserPlus size={18} className="text-gray-400 group-hover:text-brand-cyan transition-colors" />
                <span className="text-white font-medium group-hover:text-brand-cyan transition-colors">Create Account</span>
              </Link>
            </div>
          </div>
        </div>
        
        <div className="mt-8 text-center space-x-4 text-xs text-gray-500">
           <Link to="/help" className="hover:text-gray-300">Need help?</Link>
           <span>|</span>
           <Link to="/privacy" className="hover:text-gray-300">Privacy Policy</Link>
           <span>|</span>
           <Link to="/terms" className="hover:text-gray-300">Terms of Service</Link>
        </div>
      </div>
    </div>
  );
};

export default Login;