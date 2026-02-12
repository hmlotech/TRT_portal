import React from 'react';
import { Link } from 'react-router-dom';
import { LightBackground } from '../components/visuals/Backgrounds';
import { SCIENCE_TOPICS, DETAILED_PUBLICATIONS } from '../constants';
import { ArrowRight, BookOpen, Microscope, Atom, FileText, Share2 } from 'lucide-react';

const TRTScience: React.FC = () => {
  return (
    <div className="min-h-screen pt-24 px-8 pb-8 font-sans">
      <LightBackground />
      
      <div className="max-w-7xl mx-auto animate-[fadeIn_0.5s_ease-out]">
        <div className="mb-12 text-center md:text-left">
           <div className="flex items-center gap-2 justify-center md:justify-start mb-2">
              <span className="px-3 py-1 bg-brand-cyan/10 text-brand-cyan rounded-full text-xs font-bold uppercase tracking-wider border border-brand-cyan/20">Knowledge Base</span>
           </div>
           <h1 className="text-4xl md:text-5xl font-serif font-bold text-gray-900 mb-4">TRT Science & Education</h1>
           <p className="text-lg text-gray-500 max-w-2xl mx-auto md:mx-0">
             Deep-dive educational resources, mechanism of action explainers, and analysis of key scientific literature.
           </p>
        </div>

        {/* --- Featured Learning Topics --- */}
        <div className="mb-16">
            <div className="flex items-center justify-between mb-6">
               <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                  <Atom className="text-brand-cyan" size={24} /> Learning Modules
               </h2>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
               {SCIENCE_TOPICS.map((topic) => (
                 <Link to={`/trt-science/topic/${topic.id}`} key={topic.id} className="group block h-full">
                   <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden hover:shadow-xl transition-all duration-300 h-full flex flex-col transform hover:-translate-y-1">
                      {/* Image Area */}
                      <div className="h-48 relative overflow-hidden">
                         <img 
                            src={topic.imageUrl} 
                            alt={topic.title} 
                            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                         />
                         <div className={`absolute inset-0 bg-gradient-to-t ${topic.color} opacity-20 mix-blend-multiply`}></div>
                         <div className="absolute bottom-0 left-0 w-full h-1/2 bg-gradient-to-t from-black/60 to-transparent"></div>
                         <div className="absolute bottom-4 left-4 text-white">
                            <p className="text-xs font-bold uppercase tracking-wider opacity-90 mb-1">Module</p>
                         </div>
                      </div>
                      
                      {/* Content Area */}
                      <div className="p-6 flex-1 flex flex-col">
                         <h3 className="font-serif font-bold text-xl text-gray-900 mb-2 group-hover:text-brand-cyan transition-colors">
                             {topic.title}
                         </h3>
                         <p className="text-sm text-gray-500 mb-4 flex-1">
                             {topic.shortDesc}
                         </p>
                         <div className="flex items-center text-sm font-bold text-brand-cyan group-hover:translate-x-1 transition-transform">
                             Start Module <ArrowRight size={16} className="ml-2" />
                         </div>
                      </div>
                   </div>
                 </Link>
               ))}
            </div>
        </div>

        {/* --- Key Publications Section --- */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
           
           {/* Left: Introduction Card */}
           <div className="lg:col-span-1 bg-gradient-to-br from-gray-900 to-slate-800 rounded-2xl p-8 text-white relative overflow-hidden shadow-xl">
               <div className="absolute top-0 right-0 w-64 h-64 bg-brand-cyan rounded-full mix-blend-overlay filter blur-3xl opacity-20 -mr-16 -mt-16"></div>
               <div className="absolute bottom-0 left-0 w-40 h-40 bg-brand-green rounded-full mix-blend-overlay filter blur-3xl opacity-20 -ml-10 -mb-10"></div>
               
               <div className="relative z-10 flex flex-col h-full justify-between">
                  <div>
                      <div className="w-12 h-12 bg-white/10 rounded-xl flex items-center justify-center mb-6 backdrop-blur-sm border border-white/10">
                          <BookOpen size={24} className="text-brand-cyan" />
                      </div>
                      <h2 className="text-3xl font-serif font-bold mb-4">Scientific Literature</h2>
                      <p className="text-gray-300 leading-relaxed mb-6">
                          Curated breakdowns of the clinical trials and review papers that are shaping the radiopharmaceutical market. We extract the "so what" for business strategy.
                      </p>
                  </div>
                  <button className="w-full py-3 bg-white text-gray-900 rounded-xl font-bold hover:bg-brand-cyan hover:text-white transition-colors flex items-center justify-center gap-2">
                      View All Library <ArrowRight size={18} />
                  </button>
               </div>
           </div>

           {/* Right: Publications List */}
           <div className="lg:col-span-2 space-y-4">
              <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <FileText className="text-gray-400" size={20} /> Featured Analysis
              </h2>
              
              {DETAILED_PUBLICATIONS.map((pub) => (
                 <Link to={`/trt-science/publication/${pub.id}`} key={pub.id} className="block group">
                    <div className="bg-white rounded-xl border border-gray-100 p-6 shadow-sm hover:shadow-md hover:border-brand-cyan/30 transition-all duration-300 flex flex-col md:flex-row gap-6">
                        {/* Visual Abstract Mini-Thumbnail */}
                        <div className="w-full md:w-32 h-24 bg-gray-50 rounded-lg flex-shrink-0 flex flex-col items-center justify-center border border-gray-100 group-hover:bg-brand-cyan/5 transition-colors">
                            <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded mb-2 ${
                                pub.category === 'Clinical' ? 'bg-blue-100 text-blue-700' :
                                pub.category === 'Market' ? 'bg-green-100 text-green-700' : 'bg-orange-100 text-orange-700'
                            }`}>
                                {pub.category}
                            </span>
                            <div className="flex gap-1">
                                <div className="w-1 h-8 bg-gray-300 rounded-full group-hover:bg-brand-cyan transition-colors"></div>
                                <div className="w-1 h-6 bg-gray-300 rounded-full mt-2 group-hover:bg-brand-cyan/70 transition-colors"></div>
                                <div className="w-1 h-4 bg-gray-300 rounded-full mt-4 group-hover:bg-brand-cyan/40 transition-colors"></div>
                            </div>
                        </div>

                        <div className="flex-1">
                            <h3 className="font-bold text-lg text-gray-900 group-hover:text-brand-cyan transition-colors mb-2 leading-tight">
                                {pub.title}
                            </h3>
                            <div className="text-xs text-gray-500 mb-3 flex flex-wrap gap-x-4 gap-y-1">
                                <span className="font-serif italic">{pub.journal}</span>
                                <span>•</span>
                                <span>{pub.date}</span>
                            </div>
                            <p className="text-sm text-gray-600 line-clamp-2 mb-3">
                                {pub.abstract}
                            </p>
                            <div className="flex items-center gap-2 text-xs font-bold text-brand-cyan opacity-0 group-hover:opacity-100 transition-opacity transform translate-y-2 group-hover:translate-y-0 duration-300">
                                Read Analysis <ArrowRight size={12} />
                            </div>
                        </div>
                    </div>
                 </Link>
              ))}
           </div>
        </div>

      </div>
    </div>
  );
};

export default TRTScience;