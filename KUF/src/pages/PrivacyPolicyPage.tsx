import React from 'react';
import { useNavigate } from 'react-router-dom';
import { MobileHeader } from '../components/MobileHeader';

export const PrivacyPolicyPage: React.FC = () => {
  const navigate = useNavigate();
  const goBack = () => navigate('/profile');

  return (
    <div className="min-h-screen bg-white text-[#1F1F1F] flex flex-col font-sans">
      <MobileHeader title="Privacy Policy" showBack onBack={goBack} />

      <main className="w-full mx-auto flex-1 pl-[14px] pt-[32px]">
        <p className="text-[13px] leading-[18px] text-[#8A8A8A]">Coming Soon...</p>

        <button
          type="button"
          onClick={goBack}
          className="mt-[24px] flex items-center gap-[7px] text-[#1A7BE8] text-[14px] leading-none active:opacity-70 focus:outline-none"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#1A7BE8" strokeWidth="1.800" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="10" />
            <path d="M16 12H8" />
            <path d="M12 8l-4 4 4 4" />
          </svg>
          Back
        </button>
      </main>
    </div>
  );
};
