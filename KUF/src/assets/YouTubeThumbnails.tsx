import React from 'react';

interface ThumbnailProps {
  type: 'alert' | 'success' | 'harvesting' | 'yield';
  className?: string;
}

export const VideoThumbnailGraphic: React.FC<ThumbnailProps> = ({ type, className = '' }) => {
  if (type === 'alert') {
    return (
      <svg viewBox="0 0 480 270" preserveAspectRatio="xMidYMid slice" className={`w-full h-full object-cover ${className}`} xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="bgAlert" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#2A1B4E" />
            <stop offset="40%" stopColor="#432874" />
            <stop offset="100%" stopColor="#1B3B2B" />
          </linearGradient>
        </defs>
        <rect width="480" height="270" fill="url(#bgAlert)" />
        {/* Background farm pattern */}
        <ellipse cx="400" cy="180" rx="90" ry="120" fill="#2E7D32" fillOpacity="0.4" />
        <ellipse cx="360" cy="120" rx="40" ry="60" fill="#4CAF50" fillOpacity="0.4" />
        
        {/* Warning banner right */}
        <rect x="290" y="80" width="180" height="70" rx="4" fill="#D32F2F" fillOpacity="0.9" />
        <text x="380" y="105" fill="#FFF" fontSize="13" fontWeight="bold" textAnchor="middle">🚨 Buy ONLY from</text>
        <text x="380" y="125" fill="#FFEB3B" fontSize="14" fontWeight="extrabold" textAnchor="middle">Authorized Nurseries</text>
        <text x="380" y="142" fill="#FFF" fontSize="11" fontWeight="bold" textAnchor="middle">⚠️ Avoid Losses!</text>

        {/* Megaphone Graphic */}
        <g transform="translate(60, 60)">
          <path d="M40 30 L80 10 L80 70 L40 50 Z" fill="#E0E0E0" stroke="#9E9E9E" strokeWidth="2" />
          <rect x="20" y="32" width="20" height="16" rx="3" fill="#9C27B0" />
          <path d="M80 10 C90 10 95 70 80 70" fill="#AB47BC" />
        </g>

        {/* Papaya Cluster on left */}
        <ellipse cx="140" cy="190" rx="55" ry="35" fill="#388E3C" />
        <ellipse cx="180" cy="195" rx="45" ry="30" fill="#F57C00" />
        <ellipse cx="185" cy="195" rx="35" ry="20" fill="#D84315" />
      </svg>
    );
  }

  if (type === 'success') {
    return (
      <svg viewBox="0 0 480 270" preserveAspectRatio="xMidYMid slice" className={`w-full h-full object-cover ${className}`} xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="bgSuccess" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#1B4D24" />
            <stop offset="60%" stopColor="#2E7D32" />
            <stop offset="100%" stopColor="#F9A825" />
          </linearGradient>
        </defs>
        <rect width="480" height="270" fill="url(#bgSuccess)" />

        {/* Papaya tree leaves and cluster */}
        <circle cx="120" cy="130" r="85" fill="#33691E" />
        <ellipse cx="110" cy="150" rx="45" ry="65" fill="#43A047" />
        <ellipse cx="160" cy="160" rx="38" ry="55" fill="#7CB342" />

        {/* Farmer silhouette / badge on right */}
        <g transform="translate(340, 110)">
          <circle cx="40" cy="30" r="22" fill="#FFE082" />
          <path d="M10 80 C10 55 70 55 70 80 Z" fill="#F57F17" />
        </g>

        {/* Bold Hindi text banner */}
        <rect x="230" y="85" width="240" height="60" rx="6" fill="#1B5E20" fillOpacity="0.85" />
        <text x="350" y="110" fill="#FFEB3B" fontSize="18" fontWeight="bold" textAnchor="middle">सफल किसान</text>
        <text x="350" y="132" fill="#FFFFFF" fontSize="16" fontWeight="bold" textAnchor="middle">की कहानी</text>
      </svg>
    );
  }

  if (type === 'harvesting') {
    return (
      <svg viewBox="0 0 480 270" preserveAspectRatio="xMidYMid slice" className={`w-full h-full object-cover ${className}`} xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="bgHarvest" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#0D47A1" />
            <stop offset="50%" stopColor="#00838F" />
            <stop offset="100%" stopColor="#E65100" />
          </linearGradient>
        </defs>
        <rect width="480" height="270" fill="url(#bgHarvest)" />

        {/* Papaya branch with heavy fruit set */}
        <ellipse cx="100" cy="120" rx="55" ry="80" fill="#2E7D32" />
        <ellipse cx="150" cy="150" rx="45" ry="70" fill="#689F38" />
        <ellipse cx="200" cy="160" rx="40" ry="65" fill="#FBC02D" />

        {/* Right harvesting text box */}
        <rect x="260" y="70" width="210" height="75" rx="8" fill="#B71C1C" fillOpacity="0.9" />
        <text x="365" y="98" fill="#FFF" fontSize="15" fontWeight="bold" textAnchor="middle">पपीता खेती और</text>
        <text x="365" y="128" fill="#FFEB3B" fontSize="22" fontWeight="extrabold" textAnchor="middle">हार्वेस्टिंग</text>
      </svg>
    );
  }

  // High Yield
  return (
    <svg viewBox="0 0 480 270" preserveAspectRatio="xMidYMid slice" className={`w-full h-full object-cover ${className}`} xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="bgYield" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#1A237E" />
          <stop offset="50%" stopColor="#004D40" />
          <stop offset="100%" stopColor="#33691E" />
        </linearGradient>
      </defs>
      <rect width="480" height="270" fill="url(#bgYield)" />

      {/* Papayas */}
      <ellipse cx="120" cy="140" rx="60" ry="85" fill="#388E3C" />
      <ellipse cx="170" cy="160" rx="48" ry="75" fill="#66BB6A" />

      {/* Quality Badge */}
      <g transform="translate(60, 45)">
        <circle cx="25" cy="25" r="22" fill="#FFF" stroke="#FFC107" strokeWidth="3" />
        <text x="25" y="22" fill="#E65100" fontSize="7" fontWeight="bold" textAnchor="middle">RECOMMEND</text>
        <text x="25" y="32" fill="#2E7D32" fontSize="12" textAnchor="middle">👍</text>
      </g>

      {/* Yield & sweetness features */}
      <g transform="translate(320, 80)">
        <rect x="0" y="0" width="150" height="28" rx="4" fill="#1B5E20" fillOpacity="0.8" />
        <text x="75" y="19" fill="#FFEB3B" fontSize="13" fontWeight="bold" textAnchor="middle">✔ ज्यादा उत्पाद</text>

        <rect x="0" y="34" width="150" height="28" rx="4" fill="#E65100" fillOpacity="0.8" />
        <text x="75" y="53" fill="#FFF" fontSize="13" fontWeight="bold" textAnchor="middle">✔ मीठा स्वाद</text>
      </g>
    </svg>
  );
};
