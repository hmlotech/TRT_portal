import React from 'react';

interface TiaAvatarProps {
  className?: string;
}

export const TiaAvatar: React.FC<TiaAvatarProps> = ({ className }) => {
  return (
    <svg 
      viewBox="0 0 400 400" 
      fill="none" 
      xmlns="http://www.w3.org/2000/svg" 
      className={className}
      role="img"
      aria-label="TIA Avatar"
    >
      <defs>
        {/* Skin Gradient - 3D Effect */}
        <radialGradient id="skin-gradient" cx="0" cy="0" r="1" gradientUnits="userSpaceOnUse" gradientTransform="translate(200 180) rotate(90) scale(140)">
          <stop stopColor="#FFDFC4"/>
          <stop offset="0.6" stopColor="#F0C0A0"/>
          <stop offset="1" stopColor="#D89F80"/>
        </radialGradient>
        
        {/* Hair Gradient - Sheen */}
        <linearGradient id="hair-gradient" x1="100" y1="50" x2="300" y2="300" gradientUnits="userSpaceOnUse">
          <stop offset="0" stopColor="#3E2723"/> 
          <stop offset="0.4" stopColor="#4E342E"/>
          <stop offset="1" stopColor="#2D1B18"/>
        </linearGradient>

        {/* Hair Highlight */}
        <linearGradient id="hair-shine" x1="150" y1="50" x2="250" y2="100" gradientUnits="userSpaceOnUse">
          <stop stopColor="white" stopOpacity="0.15"/>
          <stop offset="1" stopColor="white" stopOpacity="0"/>
        </linearGradient>

        {/* Blazer Gradient */}
        <linearGradient id="blazer-gradient" x1="200" y1="280" x2="200" y2="400" gradientUnits="userSpaceOnUse">
          <stop stopColor="#1E293B"/> {/* Slate 800 */}
          <stop offset="1" stopColor="#0F172A"/> {/* Slate 900 */}
        </linearGradient>

        {/* Background Soft Glow */}
        <radialGradient id="bg-glow" cx="0" cy="0" r="1" gradientUnits="userSpaceOnUse" gradientTransform="translate(200 200) rotate(90) scale(200)">
          <stop stopColor="#E0F7FA"/>
          <stop offset="1" stopColor="#B2EBF2"/>
        </radialGradient>

        <clipPath id="circle-clip">
          <circle cx="200" cy="200" r="200"/>
        </clipPath>
        
        <filter id="soft-shadow" x="-20%" y="-20%" width="140%" height="140%">
           <feGaussianBlur in="SourceAlpha" stdDeviation="3"/>
           <feOffset dx="0" dy="2" result="offsetblur"/>
           <feComponentTransfer>
             <feFuncA type="linear" slope="0.2"/>
           </feComponentTransfer>
           <feMerge> 
             <feMergeNode in="offsetblur"/>
             <feMergeNode in="SourceGraphic"/>
           </feMerge>
        </filter>
      </defs>
      
      <g clipPath="url(#circle-clip)">
        {/* Background */}
        <rect width="400" height="400" fill="url(#bg-glow)"/>
        
        {/* Hair Back (Volume behind head) */}
        <path d="M110 120C90 180 80 280 100 340C120 380 280 380 300 340C320 280 310 180 290 120C270 60 130 60 110 120Z" fill="url(#hair-gradient)"/>

        {/* Body / Blazer */}
        <g transform="translate(0, 20)">
            <path d="M100 320 C100 290 140 280 160 280 L240 280 C260 280 300 290 300 320 V420 H100 V320 Z" fill="url(#blazer-gradient)"/>
            {/* White Shirt / Collar */}
            <path d="M160 280 L200 360 L240 280 L200 280 Z" fill="#F8FAFC"/>
            <path d="M200 280 L200 340" stroke="#CBD5E1" strokeWidth="1"/>
        </g>

        {/* Neck */}
        <path d="M165 240 V290 H235 V240" fill="#E8B9AB"/>
        <path d="M165 250 C165 250 165 290 200 300 C235 290 235 250 235 250" fill="black" fillOpacity="0.1"/> {/* Neck Shadow */}

        {/* Head Shape - 3D Spheroid */}
        <rect x="110" y="80" width="180" height="200" rx="90" ry="95" fill="url(#skin-gradient)" filter="url(#soft-shadow)"/>
        
        {/* Cheeks / Blush */}
        <circle cx="145" cy="200" r="25" fill="#FF5252" fillOpacity="0.1" filter="url(#soft-shadow)"/>
        <circle cx="255" cy="200" r="25" fill="#FF5252" fillOpacity="0.1" filter="url(#soft-shadow)"/>

        {/* Eyes - Expressive */}
        <g>
            {/* Left Eye */}
            <ellipse cx="155" cy="180" rx="14" ry="18" fill="#1E293B"/>
            <circle cx="160" cy="175" r="4" fill="white" fillOpacity="0.9"/> {/* Highlight */}
            
            {/* Right Eye */}
            <ellipse cx="245" cy="180" rx="14" ry="18" fill="#1E293B"/>
            <circle cx="250" cy="175" r="4" fill="white" fillOpacity="0.9"/> {/* Highlight */}
        </g>
        
        {/* Eyebrows */}
        <path d="M140 155 Q155 145 170 155" stroke="#3E2723" strokeWidth="5" strokeLinecap="round" fill="none"/>
        <path d="M230 155 Q245 145 260 155" stroke="#3E2723" strokeWidth="5" strokeLinecap="round" fill="none"/>

        {/* Nose - Subtle */}
        <path d="M195 210 Q200 215 205 210" stroke="#D89F80" strokeWidth="3" strokeLinecap="round" fill="none" opacity="0.6"/>

        {/* Mouth - Smile */}
        <path d="M175 235 Q200 250 225 235" stroke="#BF6050" strokeWidth="4" strokeLinecap="round" fill="none"/>

        {/* Glasses - 3D effect */}
        <g opacity="0.9">
            {/* Lenses */}
            <circle cx="155" cy="180" r="38" fill="white" fillOpacity="0.1" stroke="#334155" strokeWidth="3"/>
            <circle cx="245" cy="180" r="38" fill="white" fillOpacity="0.1" stroke="#334155" strokeWidth="3"/>
            {/* Bridge */}
            <path d="M193 180 Q200 170 207 180" stroke="#334155" strokeWidth="3" fill="none"/>
            {/* Lens Reflections */}
            <path d="M135 170 Q145 160 155 165" stroke="white" strokeWidth="3" strokeLinecap="round" opacity="0.4"/>
            <path d="M225 170 Q235 160 245 165" stroke="white" strokeWidth="3" strokeLinecap="round" opacity="0.4"/>
        </g>

        {/* Hair Front - Side Swept Bangs with Sheen */}
        <path d="M200 60 C140 60 110 100 110 160 C110 160 105 100 150 80 C180 65 250 65 290 160 C290 120 280 60 200 60 Z" fill="url(#hair-gradient)"/>
        <path d="M140 85 Q180 75 220 90" stroke="url(#hair-shine)" strokeWidth="6" strokeLinecap="round" opacity="0.6" fill="none"/>

    </g>
    </svg>
  );
};
