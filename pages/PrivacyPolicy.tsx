import React from 'react';
import { Link } from 'react-router-dom';
import { DarkBackground } from '../components/visuals/Backgrounds';
import { ArrowLeft, Shield, Lock, Eye } from 'lucide-react';

const PrivacyPolicy: React.FC = () => {
  return (
    <div className="relative min-h-screen text-white bg-dark-bg selection:bg-brand-cyan/30">
      <DarkBackground />
      
      {/* Header */}
      <header className="fixed top-0 w-full h-20 z-20 px-8 flex items-center border-b border-white/5 bg-dark-bg/80 backdrop-blur-md">
        <Link to="/login" className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors group">
            <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" />
            <span className="text-sm font-medium">Back</span>
        </Link>
      </header>

      <div className="container mx-auto px-8 pt-32 pb-20 max-w-4xl animate-[fadeIn_0.5s_ease-out]">
         
         <div className="mb-12 border-b border-white/10 pb-8">
             <div className="flex items-center gap-3 text-brand-cyan mb-4">
                 <Shield size={32} />
                 <span className="text-sm font-bold uppercase tracking-widest">Legal</span>
             </div>
             <h1 className="text-4xl md:text-5xl font-serif font-bold mb-4">Privacy Policy</h1>
             <p className="text-gray-400 text-lg">Last Updated: May 15, 2024</p>
         </div>

         <div className="space-y-12 text-gray-300 leading-relaxed font-light">
             
             <section>
                 <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-2">
                    <Lock size={20} className="text-brand-green" /> Data Collection
                 </h2>
                 <p className="mb-4">
                     The TRT Competitive Intelligence Tracker collects internal usage data to improve the platform's efficacy. This includes:
                 </p>
                 <ul className="list-disc pl-6 space-y-2 text-gray-400">
                     <li>Login timestamps and session duration.</li>
                     <li>Search queries entered into the Intelligence Database.</li>
                     <li>Articles viewed and reports downloaded.</li>
                 </ul>
             </section>

             <section>
                 <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-2">
                    <Eye size={20} className="text-brand-cyan" /> Information Usage
                 </h2>
                 <p className="mb-4">
                     We use the collected information solely for internal business intelligence purposes, including:
                 </p>
                 <ul className="list-disc pl-6 space-y-2 text-gray-400">
                     <li>Optimizing the relevance of the News Feed algorithms.</li>
                     <li>Auditing access to sensitive competitive data.</li>
                     <li>Ensuring compliance with corporate data governance policies.</li>
                 </ul>
             </section>

             <section>
                 <h2 className="text-2xl font-bold text-white mb-4">Data Security</h2>
                 <p className="mb-4">
                     All data transmitted to and from this portal is encrypted using TLS 1.3 standards. Data at rest is encrypted using AES-256. Access is restricted to authorized employees via SSO authentication.
                 </p>
             </section>

             <section>
                 <h2 className="text-2xl font-bold text-white mb-4">Third-Party Disclosure</h2>
                 <p className="mb-4">
                     We do not sell, trade, or otherwise transfer your personally identifiable information to outside parties. This does not include trusted third parties who assist us in operating our website, conducting our business, or servicing you, so long as those parties agree to keep this information confidential.
                 </p>
             </section>

         </div>

         <div className="mt-16 pt-8 border-t border-white/10 text-center">
             <p className="text-sm text-gray-500">
                 For privacy-related inquiries, please contact <a href="mailto:privacy@biopharma.inc" className="text-brand-cyan hover:underline">privacy@biopharma.inc</a>
             </p>
         </div>

      </div>
    </div>
  );
};

export default PrivacyPolicy;