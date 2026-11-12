import React from 'react';
import dyrectIcon from './images/dyrect-d-blue.png';
import dyrectWordmark from './images/dyrect-white.png';

interface DyrectLogoProps {
  className?: string;
  size?: number;
}

/** The blue "D" mark shown in the loading dialog. */
export const DyrectLogo: React.FC<DyrectLogoProps> = ({
  className = '',
  size = 64
}) => {
  return (
    <img
      src={dyrectIcon}
      alt="DYRECT"
      draggable={false}
      style={{ height: size * 0.75, width: 'auto' }}
      className={`select-none object-contain ${className}`}
    />
  );
};

/** White DYRECT wordmark (transparent background) for use on coloured backgrounds. */
export const DyrectWordmark: React.FC<{ height?: number; className?: string }> = ({
  height = 14,
  className = ''
}) => {
  return (
    <img
      src={dyrectWordmark}
      alt="DYRECT"
      draggable={false}
      style={{ height, width: 'auto' }}
      className={`select-none object-contain ${className}`}
    />
  );
};

/** "POWERED BY DYRECT" badge shown at the bottom of the product pages (77 x 31 px in the real app). */
export const PoweredByDyrect: React.FC<{ className?: string }> = ({ className = '' }) => {
  return (
    <div className={`flex flex-col items-center justify-center select-none ${className}`}>
      <div className="bg-[#2548FF] w-[77px] h-[31px] pl-[7px] flex flex-col items-start justify-center">
        <span className="text-[6px] tracking-[0.01em] text-[#D3DAFF] font-normal uppercase leading-none">
          Powered by
        </span>
        <DyrectWordmark height={11} className="mt-[3px]" />
      </div>
    </div>
  );
};