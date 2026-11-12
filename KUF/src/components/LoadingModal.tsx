import React from 'react';
import { DyrectLogo } from '../assets/DyrectLogo';

interface LoadingModalProps {
  isOpen: boolean;
  text?: string;
}

export const LoadingModal: React.FC<LoadingModalProps> = ({ 
  isOpen, 
  text = 'Loading...' 
}) => {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40"
      aria-modal="true"
      role="dialog"
      aria-live="polite"
    >
      <div className="bg-[#FAFAFA] rounded-[11px] w-[248px] h-[119px] pt-[16px] flex flex-col items-center animate-in fade-in zoom-in-95 duration-150">
        <p className="text-[#111] text-[16.5px] leading-[20px] font-normal text-center select-none">
          {text}
        </p>
        <div className="mt-[17px] flex items-center justify-center">
          <DyrectLogo size={70} />
        </div>
      </div>
    </div>
  );
};
