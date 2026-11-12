import React from 'react';
import { MapPin } from 'lucide-react';
import { storageService } from '../services/storageService';

interface LocationPromptModalProps {
  isOpen: boolean;
  onDecision: (allowed: boolean) => void;
}

export const LocationPromptModal: React.FC<LocationPromptModalProps> = ({
  isOpen,
  onDecision
}) => {
  if (!isOpen) return null;

  const handleAllow = () => {
    storageService.setLocationPermission('allowed');
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        () => {
          onDecision(true);
        },
        () => {
          // Gracefully continue even if denied in sandbox
          onDecision(true);
        },
        { timeout: 5000 }
      );
    } else {
      onDecision(true);
    }
  };

  const handleDeny = () => {
    storageService.setLocationPermission('denied');
    onDecision(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/65 backdrop-blur-[1px] animate-in fade-in duration-200">
      <div className="bg-[#242A38] text-white w-full max-w-[360px] rounded-3xl p-6 shadow-2xl border border-white/10 flex flex-col items-center">
        {/* Location Icon and Header */}
        <div className="flex items-center gap-3.5 mb-6 w-full">
          <div className="w-12 h-12 rounded-full bg-[#1E56C8] flex items-center justify-center shrink-0 shadow-inner">
            <MapPin className="text-white w-6 h-6 fill-white" />
          </div>
          <p className="text-[15px] font-medium text-gray-100 leading-tight">
            <span className="font-semibold text-white">knownyou.dyrect.co</span> wants to use your device&apos;s location
          </p>
        </div>

        {/* 3 Action Buttons matching Android Chrome UI */}
        <div className="w-full flex flex-col gap-2.5">
          <button
            type="button"
            onClick={handleAllow}
            className="w-full py-3 px-4 rounded-xl bg-[#2A4374] hover:bg-[#34538E] active:scale-[0.99] text-[#A5C7FF] font-medium text-[14.5px] transition-colors"
          >
            Allow while visiting the site
          </button>

          <button
            type="button"
            onClick={handleAllow}
            className="w-full py-3 px-4 rounded-xl bg-[#2A4374] hover:bg-[#34538E] active:scale-[0.99] text-[#A5C7FF] font-medium text-[14.5px] transition-colors"
          >
            Allow this time
          </button>

          <button
            type="button"
            onClick={handleDeny}
            className="w-full py-3 px-4 rounded-xl bg-[#2A4374] hover:bg-[#34538E] active:scale-[0.99] text-[#A5C7FF] font-medium text-[14.5px] transition-colors"
          >
            Never allow
          </button>
        </div>
      </div>
    </div>
  );
};
