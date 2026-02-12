import React from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { LightBackground } from '../../components/visuals/Backgrounds';
import { SCIENCE_TOPICS } from '../../constants';
import { ArrowLeft, CheckCircle2, Bookmark, Share2 } from 'lucide-react';

const TopicDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const topic = SCIENCE_TOPICS.find(t => t.id === id);

  if (!topic) {
    return <div className="pt-32 text-center">Topic not found.</div>;
  }

  return (
    <div className="min-h-screen pt-20 font-sans bg-gray-50">
      <LightBackground />
      
      {/* Hero Header */}
      <div className="bg-white border-b border-gray-200">
          <div className="max-w-5xl mx-auto px-8 py-12">
             <button onClick={() => navigate('/trt-science')} className="flex items-center gap-2 text-sm text-gray-500 hover:text-gray-900 mb-6 transition-colors">
                 <ArrowLeft size={16} /> Back to Library
             </button>
             
             <div className="flex flex-col md:flex-row gap-8 items-start">
                 <div className="flex-1">
                     <span className={`inline-block px-3 py-1 rounded-full text-xs font-bold text-white bg-gradient-to-r ${topic.color} mb-4 uppercase tracking-wider shadow-sm`}>
                        Module
                     </span>
                     <h1 className="text-4xl md:text-5xl font-serif font-bold text-gray-900 mb-4 leading-tight">
                         {topic.title}
                     </h1>
                     <p className="text-xl text-gray-500 leading-relaxed">
                         {topic.shortDesc}
                     </p>
                 </div>
                 <div className="w-full md:w-64 h-40 rounded-xl overflow-hidden shadow-lg flex-shrink-0 relative group">
                     <img src={topic.imageUrl} alt={topic.title} className="w-full h-full object-cover" />
                     <div className="absolute inset-0 bg-black/10 group-hover:bg-transparent transition-colors"></div>
                 </div>
             </div>
          </div>
      </div>

      <div className="max-w-5xl mx-auto px-8 py-12 grid grid-cols-1 lg:grid-cols-12 gap-12">
          
          {/* Main Content */}
          <div className="lg:col-span-8 space-y-12 animate-[fadeIn_0.5s_ease-out]">
              {topic.sections.map((section, idx) => (
                  <div key={idx} className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100">
                      <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-3">
                          <span className="flex items-center justify-center w-8 h-8 rounded-full bg-gray-100 text-sm text-gray-500 font-mono border border-gray-200">
                              {idx + 1}
                          </span>
                          {section.heading}
                      </h2>
                      <p className="text-gray-700 leading-7 text-lg mb-6">
                          {section.content}
                      </p>
                      
                      {section.keyPoints && (
                          <div className="bg-blue-50/50 rounded-xl p-6 border border-blue-100">
                              <h3 className="text-sm font-bold text-blue-800 uppercase tracking-wide mb-3">Key Characteristics</h3>
                              <ul className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                  {section.keyPoints.map((point, i) => (
                                      <li key={i} className="flex items-center gap-2 text-sm text-gray-700">
                                          <CheckCircle2 size={16} className="text-brand-cyan flex-shrink-0" />
                                          {point}
                                      </li>
                                  ))}
                              </ul>
                          </div>
                      )}
                  </div>
              ))}
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-4 space-y-6">
              <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 sticky top-24">
                  <h3 className="font-bold text-gray-900 mb-4">Actions</h3>
                  <div className="flex flex-col gap-3">
                      <button className="flex items-center justify-center gap-2 w-full py-2.5 border border-gray-200 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors">
                          <Bookmark size={16} /> Save for Later
                      </button>
                      <button className="flex items-center justify-center gap-2 w-full py-2.5 border border-gray-200 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors">
                          <Share2 size={16} /> Share Module
                      </button>
                  </div>

                  <div className="mt-8 pt-6 border-t border-gray-100">
                      <h4 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-4">Related Intelligence</h4>
                      <div className="space-y-4">
                          <div className="text-sm">
                              <span className="block text-brand-cyan font-bold mb-1">Market Data</span>
                              <Link to="/news-feed" className="text-gray-600 hover:underline">View recent {topic.title.split(' ')[0]} deals</Link>
                          </div>
                          <div className="text-sm">
                              <span className="block text-brand-green font-bold mb-1">Clinical Trials</span>
                              <Link to="/news-feed" className="text-gray-600 hover:underline">See active Phase 3 trials</Link>
                          </div>
                      </div>
                  </div>
              </div>
          </div>

      </div>
    </div>
  );
};

export default TopicDetail;