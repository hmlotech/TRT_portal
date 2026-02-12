import React from 'react';
import { LightBackground } from '../components/visuals/Backgrounds';
import { KPIS, MARKET_DATA, SIGNAL_DATA } from '../constants';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip as RechartsTooltip, AreaChart, Area, XAxis, YAxis, CartesianGrid } from 'recharts';
import { TrendingUp, MoreHorizontal, ArrowUpRight } from 'lucide-react';

const Analytics: React.FC = () => {
  return (
    <div className="min-h-screen pt-24 px-8 pb-8 font-sans">
      <LightBackground />
      
      <div className="max-w-7xl mx-auto animate-[fadeIn_0.5s_ease-out]">
        <div className="mb-10 flex justify-between items-end">
           <div>
              <h1 className="text-4xl font-serif font-bold text-gray-900 mb-2">Analytics</h1>
              <p className="text-gray-500">A comprehensive review of major advancements, market data, and trends.</p>
           </div>
           <div className="flex gap-2">
              <button className="px-4 py-2 bg-white border border-gray-200 rounded-lg text-sm font-medium text-gray-600 shadow-sm hover:border-brand-cyan hover:text-brand-cyan transition-all">Download PDF</button>
              <button className="px-4 py-2 bg-dark-deep text-white rounded-lg text-sm font-medium shadow-lg shadow-dark-deep/20 hover:bg-brand-cyan transition-all">Share Report</button>
           </div>
        </div>

        {/* Top Section: Isotope Signals & KPIs */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
           
           {/* Main Chart Card */}
           <div className="lg:col-span-2 bg-white rounded-2xl border border-gray-100 shadow-sm p-6 relative overflow-hidden group hover:shadow-md transition-all duration-300">
               <div className="flex justify-between items-center mb-6">
                  <div className="flex gap-6 items-center">
                     <span className="text-gray-900 font-bold text-lg">Isotopic Trend Signals</span>
                     <div className="flex bg-gray-100 rounded-lg p-0.5">
                        <button className="px-3 py-1 text-xs font-medium text-gray-800 bg-white shadow-sm rounded-md transition-all">1M</button>
                        <button className="px-3 py-1 text-xs font-medium text-gray-500 hover:text-gray-900 transition-all">3M</button>
                        <button className="px-3 py-1 text-xs font-medium text-gray-500 hover:text-gray-900 transition-all">YTD</button>
                     </div>
                  </div>
                  <button className="text-gray-400 hover:text-gray-600 transition-colors">
                    <MoreHorizontal size={20} />
                  </button>
               </div>
               
               {/* Recharts Area Chart */}
               <div className="h-72 w-full relative -ml-4">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={SIGNAL_DATA} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                      <defs>
                        <linearGradient id="colorLu" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#01BEFF" stopOpacity={0.3}/>
                          <stop offset="95%" stopColor="#01BEFF" stopOpacity={0}/>
                        </linearGradient>
                        <linearGradient id="colorAc" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#5ED500" stopOpacity={0.3}/>
                          <stop offset="95%" stopColor="#5ED500" stopOpacity={0}/>
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                      <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} />
                      <YAxis axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} />
                      <RechartsTooltip 
                        contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)' }}
                        itemStyle={{ fontSize: '12px', fontWeight: 600 }}
                      />
                      <Area type="monotone" dataKey="lutetium" stroke="#01BEFF" strokeWidth={3} fillOpacity={1} fill="url(#colorLu)" animationDuration={1500} />
                      <Area type="monotone" dataKey="actinium" stroke="#5ED500" strokeWidth={3} fillOpacity={1} fill="url(#colorAc)" animationDuration={1500} animationBegin={300} />
                    </AreaChart>
                  </ResponsiveContainer>
               </div>

               <div className="flex gap-8 mt-2 justify-center text-xs font-medium text-gray-600">
                  <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 border border-blue-100">
                     <div className="w-2 h-2 rounded-full bg-brand-cyan"></div> Lu-177 Interest
                  </div>
                  <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-green-50 border border-green-100">
                     <div className="w-2 h-2 rounded-full bg-brand-green"></div> Ac-225 Interest
                  </div>
               </div>
           </div>

           {/* KPIs */}
           <div className="space-y-6">
              {KPIS.map((kpi, idx) => (
                 <div key={idx} className="bg-white rounded-xl border border-gray-100 shadow-sm p-6 hover:shadow-lg hover:-translate-y-1 transition-all duration-300 relative overflow-hidden group">
                    <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-transparent to-gray-50 rounded-bl-full -mr-4 -mt-4 transition-transform group-hover:scale-110"></div>
                    
                    <div className="relative z-10">
                       <div className="flex items-center justify-between mb-3">
                          <div className="flex items-center gap-2 text-sm text-gray-500 font-medium">
                             {idx === 0 ? <div className="p-1.5 rounded-lg bg-green-100 text-green-700"><TrendingUp size={14} /></div> : 
                              idx === 1 ? <div className="p-1.5 rounded-lg bg-blue-100 text-blue-700"><TrendingUp size={14} /></div> :
                              <div className="p-1.5 rounded-lg bg-teal-100 text-teal-700"><TrendingUp size={14} /></div>}
                             {kpi.label}
                          </div>
                          {kpi.trend === 'up' && <ArrowUpRight size={16} className="text-green-500" />}
                       </div>
                       
                       <div className="flex items-baseline gap-2 mb-1">
                          <div className="text-3xl font-serif font-bold text-gray-900 tracking-tight">{kpi.value}</div>
                       </div>
                       
                       <div className="text-xs text-gray-400 font-medium flex items-center gap-1">
                          <span className="text-green-600 font-bold bg-green-50 px-1.5 py-0.5 rounded">+4.2%</span>
                          {kpi.change}
                       </div>
                    </div>
                 </div>
              ))}
           </div>
        </div>

        {/* Bottom Section: Highlights & Market Snapshot */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
           
           {/* Top Highlights List */}
           <div className="lg:col-span-2 bg-white rounded-2xl border border-gray-100 shadow-sm p-8">
              <h3 className="font-serif font-bold text-xl text-gray-900 mb-6 flex items-center gap-2">
                 <span>Strategic Highlights</span>
                 <div className="h-px flex-1 bg-gray-100 ml-4"></div>
              </h3>
              
              <div className="space-y-8 relative">
                 {/* Connecting line */}
                 <div className="absolute left-[19px] top-2 bottom-4 w-0.5 bg-gray-100 z-0"></div>

                 {[
                    { type: 'Regulatory', text: 'FDA prioritizes Lu-177 radioligand for expedited review', time: '2 days ago', desc: 'The FDA has granted priority review to a Lu-177 based radioligand, signaling confidence in radiopharmaceuticals.' },
                    { type: 'Pipeline', text: 'Curium initiates Pb-212 radiopharmaceutical trial in glioblastoma', time: '4 days ago', desc: 'Curium has commenced a Phase 1 trial using Pb-212 radiopharmaceuticals aimed at treating glioblastoma.' },
                    { type: 'Funding', text: 'Fusion Pharmaceuticals achieves $150M Series C funding', time: '5 days ago', desc: 'Funding to advance multiple radiotherapeutic candidates within their pipeline.' },
                 ].map((item, i) => (
                    <div key={i} className="group cursor-pointer relative z-10 pl-12">
                       {/* Timeline Dot */}
                       <div className={`absolute left-0 top-1 w-10 h-10 rounded-full border-4 border-white shadow-sm flex items-center justify-center transition-colors ${
                          item.type === 'Regulatory' ? 'bg-green-100 text-green-700 group-hover:bg-green-200' :
                          item.type === 'Pipeline' ? 'bg-blue-100 text-blue-700 group-hover:bg-blue-200' : 'bg-teal-100 text-teal-700 group-hover:bg-teal-200'
                       }`}>
                          <span className="text-xs font-bold">{i + 1}</span>
                       </div>

                       <div className="flex justify-between items-start mb-1">
                          <h4 className="font-bold text-gray-900 group-hover:text-brand-cyan transition-colors text-lg">{item.text}</h4>
                          <span className="text-xs text-gray-400 whitespace-nowrap bg-gray-50 px-2 py-1 rounded font-medium">{item.time}</span>
                       </div>
                       
                       <div className="flex gap-2 mb-2">
                          <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
                             item.type === 'Regulatory' ? 'bg-green-50 text-green-700' :
                             item.type === 'Pipeline' ? 'bg-blue-50 text-blue-700' : 'bg-teal-50 text-teal-700'
                          }`}>
                             {item.type}
                          </span>
                       </div>

                       {item.desc && <p className="text-sm text-gray-500 leading-relaxed max-w-2xl">{item.desc}</p>}
                    </div>
                 ))}
              </div>
           </div>

           {/* Market Snapshot Donut */}
           <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 flex flex-col">
              <h3 className="font-serif font-bold text-xl text-gray-900 mb-2">Market Composition</h3>
              <p className="text-xs text-gray-400 mb-6">Distribution by activity type</p>
              
              <div className="flex-1 min-h-[220px] relative">
                 <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={MARKET_DATA}
                        cx="50%"
                        cy="50%"
                        innerRadius={70}
                        outerRadius={90}
                        paddingAngle={4}
                        dataKey="value"
                        stroke="none"
                      >
                        {MARKET_DATA.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <RechartsTooltip 
                        contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                        itemStyle={{ fontSize: '12px', fontWeight: 'bold' }}
                      />
                    </PieChart>
                 </ResponsiveContainer>
                 {/* Center Text */}
                 <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center pointer-events-none">
                    <div className="text-3xl font-serif font-bold text-gray-900">45%</div>
                    <div className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Comm.</div>
                 </div>
              </div>

              <div className="space-y-4 mt-6 bg-gray-50 rounded-xl p-4">
                 <div className="flex justify-between items-center text-sm">
                    <div className="flex items-center gap-3">
                       <div className="w-2 h-2 rounded-full bg-brand-green ring-4 ring-green-100"></div>
                       <span className="text-gray-600 font-medium">Therapeutics</span>
                    </div>
                    <div className="text-right">
                       <div className="text-gray-900 font-bold">$24.6B</div>
                       <div className="text-green-600 text-[10px] font-bold">▲ 5.3%</div>
                    </div>
                 </div>
                 <div className="h-px bg-gray-200"></div>
                 <div className="flex justify-between items-center text-sm">
                    <div className="flex items-center gap-3">
                       <div className="w-2 h-2 rounded-full bg-brand-cyan ring-4 ring-blue-100"></div>
                       <span className="text-gray-600 font-medium">Diagnostics</span>
                    </div>
                    <div className="text-right">
                       <div className="text-gray-900 font-bold">$84.2B</div>
                       <div className="text-green-600 text-[10px] font-bold">▲ 4.3%</div>
                    </div>
                 </div>
              </div>

              <button className="w-full mt-4 py-3 border border-transparent hover:border-brand-cyan/20 hover:bg-brand-cyan/5 rounded-xl text-sm font-medium text-brand-cyan transition-all flex items-center justify-center gap-2">
                 Full Breakdown <TrendingUp size={16} />
              </button>
           </div>
        </div>

      </div>
    </div>
  );
};

export default Analytics;