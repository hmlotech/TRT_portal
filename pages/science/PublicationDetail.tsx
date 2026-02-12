import React from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { LightBackground } from '../../components/visuals/Backgrounds';
import { DETAILED_PUBLICATIONS } from '../../constants';
import { ArrowLeft, ExternalLink, FileText, TrendingUp, AlertTriangle, Check, BookOpen } from 'lucide-react';
import { Badge } from '../../components/ui/Badge';

const PublicationDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const pub = DETAILED_PUBLICATIONS.find(p => p.id === id);

  if (!pub) {
    return <div className="pt-32 text-center">Publication not found.</div>;
  }

  return (
    <div className="min-h-screen pt-20 font-sans bg-gray-50/50">
      <LightBackground />
      
      {/* Header */}
      <div className="bg-white border-b border-gray-200 pb-12 pt-12 px-8">
          <div className="max-w-4xl mx-auto animate-[fadeInUp_0.3s_ease-out]">
             <button onClick={() => navigate('/trt-science')} className="flex items-center gap-2 text-sm text-gray-500 hover:text-gray-900 mb-8 transition-colors">
                 <ArrowLeft size={16} /> Back to Library
             </button>
             
             <Badge variant={pub.category === 'Clinical' ? 'default' : 'purple'} className="mb-4">
                 {pub.category} Analysis
             </Badge>
             
             <h1 className="text-3xl md:text-4xl font-serif font-bold text-gray-900 mb-6 leading-tight">
                 {pub.title}
             </h1>
             
             <div className="flex flex-wrap items-center gap-6 text-sm text-gray-500 font-medium">
                 <div className="flex items-center gap-2">
                     <BookOpen size={16} className="text-brand-cyan" />
                     {pub.journal}
                 </div>
                 <div className="w-1 h-1 bg-gray-300 rounded-full"></div>
                 <div>{pub.date}</div>
                 <div className="w-1 h-1 bg-gray-300 rounded-full"></div>
                 <div className="italic text-gray-400">Authored by {pub.authors}</div>
             </div>

             <div className="mt-8 flex gap-4">
                 <button className="px-6 py-2 bg-gray-900 text-white rounded-lg text-sm font-bold shadow-lg shadow-gray-900/20 hover:bg-black transition-colors flex items-center gap-2">
                     Download PDF Report
                 </button>
                 <a href={`https://doi.org/${pub.doi}`} target="_blank" rel="noreferrer" className="px-6 py-2 bg-white border border-gray-200 text-gray-700 rounded-lg text-sm font-medium hover:border-brand-cyan hover:text-brand-cyan transition-colors flex items-center gap-2">
                     Source DOI <ExternalLink size={14} />
                 </a>
             </div>
          </div>
      </div>

      <div className="max-w-4xl mx-auto px-8 py-12 space-y-8">
          
          {/* Market Implication (The "So What") */}
          <div className="bg-gradient-to-r from-brand-cyan/10 to-transparent border-l-4 border-brand-cyan p-6 rounded-r-xl">
              <h3 className="flex items-center gap-2 text-sm font-bold text-brand-cyan uppercase tracking-wider mb-2">
                  <TrendingUp size={16} /> Market Implication
              </h3>
              <p className="text-lg font-medium text-gray-900 leading-relaxed">
                  {pub.marketImplication}
              </p>
          </div>

          {/* Visual Abstract Container */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
              <div className="bg-gray-50 border-b border-gray-200 px-6 py-4">
                  <h3 className="font-serif font-bold text-xl text-gray-900">Visual Abstract</h3>
              </div>
              
              <div className="p-8 grid grid-cols-1 md:grid-cols-2 gap-12">
                  {/* Left Col: Objective & Design */}
                  <div className="space-y-8">
                      <div>
                          <h4 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3">Objective</h4>
                          <p className="text-gray-700 leading-relaxed">{pub.visualSummary.objective}</p>
                      </div>
                      <div>
                          <h4 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3">Study Design</h4>
                          <div className="bg-blue-50/50 p-4 rounded-xl border border-blue-100 text-blue-900 font-medium text-sm">
                              {pub.visualSummary.design}
                          </div>
                      </div>
                  </div>

                  {/* Right Col: Key Results */}
                  <div>
                      <h4 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-4">Key Findings</h4>
                      <div className="space-y-4">
                          {pub.visualSummary.results.map((res, i) => (
                              <div key={i} className="flex items-start gap-4 p-3 rounded-lg hover:bg-gray-50 transition-colors">
                                  <div className={`mt-1 p-1 rounded-full ${res.isPositive ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'}`}>
                                      {res.isPositive ? <Check size={14} /> : <AlertTriangle size={14} />}
                                  </div>
                                  <div>
                                      <div className="flex items-baseline gap-2 mb-1">
                                          <span className="text-lg font-bold text-gray-900">{res.value}</span>
                                          <span className="text-xs font-bold text-gray-500 uppercase">{res.label}</span>
                                      </div>
                                      <p className="text-sm text-gray-600 leading-snug">{res.description}</p>
                                  </div>
                              </div>
                          ))}
                      </div>
                  </div>
              </div>

              {/* Conclusion Footer */}
              <div className="bg-slate-900 text-white p-6 md:p-8">
                  <h4 className="text-brand-cyan text-xs font-bold uppercase tracking-widest mb-2">Conclusion</h4>
                  <p className="text-lg md:text-xl font-serif leading-relaxed opacity-90">
                      "{pub.visualSummary.conclusion}"
                  </p>
              </div>
          </div>

          {/* Abstract Text */}
          <div className="bg-white rounded-xl p-8 border border-gray-100 text-gray-500 text-sm leading-7">
              <h4 className="text-gray-900 font-bold mb-2">Original Abstract</h4>
              {pub.abstract}
          </div>

      </div>
    </div>
  );
};

export default PublicationDetail;