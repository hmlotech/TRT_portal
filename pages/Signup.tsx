import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { DarkBackground } from '../components/visuals/Backgrounds';
import { ArrowLeft, CheckCircle } from 'lucide-react';

const Signup: React.FC = () => {
  const navigate = useNavigate();

  const handleSignup = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real app, handle registration logic here
    navigate('/home');
  };

  return (
    <div className="relative min-h-screen flex flex-col items-center justify-center text-white p-4">
      <DarkBackground />
      
      <div className="w-full max-w-md animate-[fadeInUp_0.8s_ease-out]">
        
        {/* Back Navigation */}
        <Link to="/login" className="inline-flex items-center gap-2 text-gray-400 hover:text-white mb-8 transition-colors group">
            <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
            <span className="text-sm font-medium">Back to Login</span>
        </Link>

        {/* Branding */}
        <div className="flex flex-col items-center mb-8 mx-auto w-fit">
             <div className="text-2xl font-serif font-bold tracking-tight text-white/90 leading-none">
                Targeted <span className="text-brand-cyan">Radionuclide Therapy</span>
             </div>
        </div>

        <h1 className="text-4xl font-serif text-center mb-2">Create Account</h1>
        <p className="text-gray-400 text-center mb-8 font-light">Join the leading competitive intelligence platform.</p>
        
        <div className="bg-dark-card backdrop-blur-md border border-brand-cyan/20 rounded-2xl p-8 shadow-2xl shadow-brand-cyan/5 relative overflow-hidden">
          {/* Decorative glow */}
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-brand-green to-transparent opacity-50"></div>

          <form onSubmit={handleSignup} className="space-y-5">
            <div>
              <label className="block text-sm text-gray-400 mb-2">Full Name</label>
              <input 
                type="text" 
                className="w-full bg-[#001a2e]/60 border border-gray-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-brand-cyan focus:ring-1 focus:ring-brand-cyan transition-all"
                placeholder="e.g. Dr. Sarah Chen"
                required
              />
            </div>

            <div>
              <label className="block text-sm text-gray-400 mb-2">Designation / Role</label>
              <input 
                type="text" 
                className="w-full bg-[#001a2e]/60 border border-gray-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-brand-cyan focus:ring-1 focus:ring-brand-cyan transition-all"
                placeholder="e.g. Senior Research Analyst"
                required
              />
            </div>

            <div>
              <label className="block text-sm text-gray-400 mb-2">Work Email</label>
              <input 
                type="email" 
                className="w-full bg-[#001a2e]/60 border border-gray-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-brand-cyan focus:ring-1 focus:ring-brand-cyan transition-all"
                placeholder="name@company.com" 
                required
              />
            </div>
            
            <div>
              <label className="block text-sm text-gray-400 mb-2">Set Password</label>
              <input 
                type="password" 
                className="w-full bg-[#001a2e]/60 border border-gray-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-brand-cyan focus:ring-1 focus:ring-brand-cyan transition-all"
                placeholder="Create a strong password"
                required
              />
              <div className="mt-2 text-[10px] text-gray-500 flex gap-3">
                 <span className="flex items-center gap-1"><CheckCircle size={10} /> 8+ chars</span>
                 <span className="flex items-center gap-1"><CheckCircle size={10} /> 1 symbol</span>
                 <span className="flex items-center gap-1"><CheckCircle size={10} /> 1 number</span>
              </div>
            </div>

            <div className="pt-2">
                <button 
                  type="submit"
                  className="w-full bg-gradient-to-r from-brand-green/80 to-brand-teal/80 hover:from-brand-green hover:to-brand-teal text-white font-medium py-3 rounded-lg shadow-lg shadow-brand-green/20 transition-all transform hover:scale-[1.02] active:scale-[0.98]"
                >
                  Create Account
                </button>
            </div>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-gray-400">
                Already have an account?{' '}
                <Link to="/login" className="text-brand-cyan hover:text-white transition-colors font-medium">
                    Sign In
                </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Signup;