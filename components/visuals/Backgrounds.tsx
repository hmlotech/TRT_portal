import React from 'react';

export const DarkBackground: React.FC = () => (
  <div className="fixed inset-0 z-[-1] overflow-hidden bg-dark-bg">
    {/* Radial Gradient */}
    <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_70%_30%,#004466_0%,#00314E_50%,#001a2e_100%)]" />
    
    {/* Animated Particles / Stars */}
    <div className="absolute inset-0 opacity-40">
       <div className="absolute top-1/4 left-1/4 w-1 h-1 bg-white rounded-full animate-pulse"></div>
       <div className="absolute top-1/3 left-2/3 w-1.5 h-1.5 bg-brand-cyan rounded-full animate-pulse" style={{ animationDelay: '1s' }}></div>
       <div className="absolute bottom-1/4 right-1/4 w-1 h-1 bg-brand-green rounded-full animate-pulse" style={{ animationDelay: '2s' }}></div>
       {/* Orbits */}
       <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] border border-white/5 rounded-full rotate-45"></div>
       <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] border border-brand-cyan/10 rounded-full -rotate-12"></div>
    </div>
    
    {/* Noise Texture Overlay */}
    <div className="absolute inset-0 opacity-[0.03] mix-blend-overlay bg-[url('https://grainy-gradients.vercel.app/noise.svg')]"></div>
  </div>
);

export const LightBackground: React.FC = () => (
  <div className="fixed inset-0 z-[-1] bg-light-bg overflow-hidden pointer-events-none">
     {/* Soft Top Right Gradient Glow */}
     <div className="absolute -top-[20%] -right-[10%] w-[60%] h-[80%] bg-[radial-gradient(circle_at_center,rgba(1,190,255,0.03)_0%,rgba(94,213,0,0.02)_40%,transparent_70%)] blur-[100px] rounded-full"></div>
     
     {/* Atomic Visualization SVG - Positioned Absolutely to top right - SLOWED & LIGHTER */}
     <div className="absolute -top-[50px] -right-[50px] w-[500px] h-[500px] opacity-60">
       <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 400">
          <defs>
             <filter id="glow">
                <feGaussianBlur stdDeviation="2.5" result="coloredBlur"/>
                <feMerge>
                   <feMergeNode in="coloredBlur"/>
                   <feMergeNode in="SourceGraphic"/>
                </feMerge>
             </filter>
          </defs>

          {/* Main Atomic Structure - Centered in this 400x400 viewbox */}
          <g transform="translate(200, 200)">
              {/* Nucleus - Slowed */}
              <circle r="14" fill="#5ED500" fillOpacity="0.5" filter="url(#glow)">
                 <animate attributeName="r" values="14;16;14" dur="12s" repeatCount="indefinite" />
                 <animate attributeName="opacity" values="0.5;0.7;0.5" dur="12s" repeatCount="indefinite" />
              </circle>
              {/* Electron Cloud Haze */}
              <circle r="50" fill="#01BEFF" fillOpacity="0.04" />

              {/* Orbit 1 (Cyan) - Slowed */}
              <g transform="rotate(-30)">
                 <ellipse rx="110" ry="35" fill="none" stroke="#01BEFF" strokeWidth="1.5" strokeOpacity="0.15" />
                 {/* Electron 1 */}
                 <circle r="3.5" fill="#01BEFF" filter="url(#glow)" opacity="0.7">
                    <animateMotion dur="25s" repeatCount="indefinite" path="M-110,0 A110,35 0 1 1 110,0 A110,35 0 1 1 -110,0" />
                 </circle>
              </g>

              {/* Orbit 2 (Teal) - Slowed */}
              <g transform="rotate(30)">
                 <ellipse rx="110" ry="35" fill="none" stroke="#4DB6AC" strokeWidth="1.5" strokeOpacity="0.15" />
                 {/* Electron 2 */}
                 <circle r="3.5" fill="#4DB6AC" filter="url(#glow)" opacity="0.7">
                    <animateMotion dur="30s" repeatCount="indefinite" path="M110,0 A110,35 0 1 1 -110,0 A110,35 0 1 1 110,0" />
                 </circle>
              </g>

              {/* Orbit 3 (Green) - Slowed */}
              <g transform="rotate(90)">
                 <ellipse rx="130" ry="40" fill="none" stroke="#5ED500" strokeWidth="1" strokeOpacity="0.15" />
                 {/* Electron 3 */}
                 <circle r="3" fill="#5ED500" filter="url(#glow)" opacity="0.7">
                     <animateMotion dur="35s" repeatCount="indefinite" path="M-130,0 A130,40 0 1 1 130,0 A130,40 0 1 1 -130,0" />
                 </circle>
              </g>
          </g>

          {/* Decorative small particles floating around - Slowed */}
          <circle cx="50" cy="150" r="2" fill="#01BEFF" opacity="0.2">
             <animate attributeName="cy" values="150;140;150" dur="15s" repeatCount="indefinite" />
          </circle>
          <circle cx="350" cy="100" r="1.5" fill="#5ED500" opacity="0.2">
             <animate attributeName="cy" values="100;110;100" dur="20s" repeatCount="indefinite" />
          </circle>
       </svg>
     </div>
     
     {/* Connection Lines trailing off to the left/bottom - SVG Layer 2 */}
     <div className="absolute top-0 right-0 w-full h-full pointer-events-none">
        <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMaxYMin slice">
            <defs>
               <linearGradient id="orbitTrace" x1="100%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stopColor="#01BEFF" stopOpacity="0.08" />
                  <stop offset="100%" stopColor="#01BEFF" stopOpacity="0" />
               </linearGradient>
            </defs>
            <path d="M1400,100 C1000,100 800,400 400,600" fill="none" stroke="url(#orbitTrace)" strokeWidth="1.5" />
            <path d="M1450,150 C1100,150 900,450 500,650" fill="none" stroke="url(#orbitTrace)" strokeWidth="1" opacity="0.4" />
        </svg>
     </div>
  </div>
);