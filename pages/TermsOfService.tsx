import React from 'react';
import { Link } from 'react-router-dom';
import { DarkBackground } from '../components/visuals/Backgrounds';
import { ArrowLeft, FileText, AlertCircle, CheckCircle } from 'lucide-react';

const TermsOfService: React.FC = () => {
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
             <div className="flex items-center gap-3 text-brand-teal mb-4">
                 <FileText size={32} />
                 <span className="text-sm font-bold uppercase tracking-widest">Legal</span>
             </div>
             <h1 className="text-4xl md:text-5xl font-serif font-bold mb-4">Terms of Service</h1>
             <p className="text-gray-400 text-lg">Effective Date: May 15, 2024</p>
         </div>

         <div className="space-y-12 text-gray-300 leading-relaxed font-light">
             
             <section>
                 <h2 className="text-2xl font-bold text-white mb-4">1. Acceptance of Terms</h2>
                 <p className="mb-4">
                     By accessing and using the TRT Competitive Intelligence Tracker ("the Service"), you accept and agree to be bound by the terms and provision of this agreement. In addition, when using these particular services, you shall be subject to any posted guidelines or rules applicable to such services.
                 </p>
             </section>

             <section>
                 <h2 className="text-2xl font-bold text-white mb-4">2. Proprietary Rights</h2>
                 <p className="mb-4">
                     All content included on this site, such as text, graphics, logos, button icons, images, audio clips, digital downloads, data compilations, and software, is the property of Biopharma Inc. or its content suppliers and protected by international copyright laws.
                 </p>
                 <div className="bg-white/5 border border-brand-cyan/20 rounded-xl p-4 flex gap-3">
                     <AlertCircle className="text-brand-cyan shrink-0" size={20} />
                     <p className="text-sm text-gray-400">
                         <strong>Confidentiality Notice:</strong> The data presented herein is classified as "Internal Confidential." Unauthorized distribution, reproduction, or screenshotting of pipeline data is strictly prohibited and may result in disciplinary action.
                     </p>
                 </div>
             </section>

             <section>
                 <h2 className="text-2xl font-bold text-white mb-4">3. User Conduct</h2>
                 <p className="mb-4">
                     You agree not to use the Service to:
                 </p>
                 <ul className="space-y-3 text-gray-400">
                     <li className="flex items-start gap-2">
                         <CheckCircle size={16} className="text-red-400 mt-1 shrink-0" />
                         Upload, post, email, or otherwise transmit any content that is unlawful, harmful, threatening, or abusive.
                     </li>
                     <li className="flex items-start gap-2">
                         <CheckCircle size={16} className="text-red-400 mt-1 shrink-0" />
                         Impersonate any person or entity, or falsely state or otherwise misrepresent your affiliation with a person or entity.
                     </li>
                     <li className="flex items-start gap-2">
                         <CheckCircle size={16} className="text-red-400 mt-1 shrink-0" />
                         Interfere with or disrupt the Service or servers or networks connected to the Service.
                     </li>
                 </ul>
             </section>

             <section>
                 <h2 className="text-2xl font-bold text-white mb-4">4. Disclaimer of Warranties</h2>
                 <p className="mb-4">
                     The Service is provided on an "as is" and "as available" basis. Biopharma Inc. expressly disclaims all warranties of any kind, whether express or implied, including, but not limited to the implied warranties of merchantability, fitness for a particular purpose and non-infringement.
                 </p>
             </section>

         </div>

         <div className="mt-16 pt-8 border-t border-white/10 text-center">
             <p className="text-sm text-gray-500">
                 Questions regarding these terms? Contact <a href="mailto:legal@biopharma.inc" className="text-brand-teal hover:underline">legal@biopharma.inc</a>
             </p>
         </div>

      </div>
    </div>
  );
};

export default TermsOfService;