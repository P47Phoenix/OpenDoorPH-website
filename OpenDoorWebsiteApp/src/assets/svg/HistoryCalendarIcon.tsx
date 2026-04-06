import React from 'react';

interface HistoryScrollIconProps {
  className?: string;
  width?: number;
  height?: number;
}

export const HistoryScrollIcon: React.FC<HistoryScrollIconProps> = ({ 
  className = '', 
  width = 24, 
  height = 24 
}) => (
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    width={width} 
    height={height} 
    viewBox="0 0 24 24" 
    fill="none"
    className={className}
  >
    <title>Church History Scroll</title>
    <desc>Ancient scroll icon representing church history and heritage</desc>
    
    {/* Scroll parchment */}
    <path d="M4 4h16c1 0 2 1 2 2v12c0 1-1 2-2 2H4c-1 0-2-1-2-2V6c0-1 1-2 2-2z" 
          fill="#fefce8" stroke="currentColor" strokeWidth="1.5"/>
    
    {/* Scroll rolls on left and right */}
    <circle cx="4" cy="12" r="2" fill="none" stroke="currentColor" strokeWidth="1.5"/>
    <circle cx="20" cy="12" r="2" fill="none" stroke="currentColor" strokeWidth="1.5"/>
    
    {/* Historical text lines */}
    <line x1="7" y1="8" x2="17" y2="8" stroke="currentColor" strokeWidth="1" opacity="0.7"/>
    <line x1="7" y1="11" x2="15" y2="11" stroke="currentColor" strokeWidth="1" opacity="0.7"/>
    <line x1="7" y1="14" x2="16" y2="14" stroke="currentColor" strokeWidth="1" opacity="0.7"/>
    <line x1="7" y1="17" x2="13" y2="17" stroke="currentColor" strokeWidth="1" opacity="0.7"/>
    
    {/* Small cross symbol representing church */}
    <g transform="translate(18,6)" opacity="0.8">
      <line x1="0" y1="-1" x2="0" y2="3" stroke="currentColor" strokeWidth="1"/>
      <line x1="-1.5" y1="0.5" x2="1.5" y2="0.5" stroke="currentColor" strokeWidth="1"/>
    </g>
  </svg>
);

export default HistoryScrollIcon;
