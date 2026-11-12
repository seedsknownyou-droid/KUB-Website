import React from 'react';
import { useNavigate } from 'react-router-dom';

interface MobileHeaderProps {
  title: string;
  showBack?: boolean;
  onBack?: () => void;
  rightAction?: React.ReactNode;
  /** Medium-weight black title (the "already sold" page uses it) */
  emphasis?: boolean;
}

export const MobileHeader: React.FC<MobileHeaderProps> = ({
  title,
  showBack = false,
  onBack,
  rightAction,
  emphasis = false
}) => {
  const navigate = useNavigate();

  const handleBack = () => {
    if (onBack) {
      onBack();
    } else {
      navigate(-1);
    }
  };

  return (
    <header className="sticky top-0 z-30 bg-[#FBFBFB] shadow-[0_1px_0_rgba(0,0,0,0.05)] h-[40px] flex items-center justify-between px-[10px] select-none">
      {/* Left Back Arrow slot */}
      <div className="w-10 flex items-center justify-start">
        {showBack ? (
          <button
            type="button"
            onClick={handleBack}
            className="p-1 -ml-0.5 hover:opacity-80 active:opacity-60 transition-opacity focus:outline-none"
            aria-label="Go Back"
          >
            <svg width="14" height="22" viewBox="0 0 14 22" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M11.500 2.500L3 11l8.500 8.500" stroke="#1A7BE8" strokeWidth="2.400" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
        ) : null}
      </div>

      {/* Centered Title */}
      <h1 className={`${emphasis ? 'text-black font-medium' : 'text-[#1F1F1F] font-normal'} text-[16px] text-center truncate flex-1 font-sans`}>
        {title}
      </h1>

      {/* Right slot */}
      <div className="w-10 flex items-center justify-end">
        {rightAction || null}
      </div>
    </header>
  );
};