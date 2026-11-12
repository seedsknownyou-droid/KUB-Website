import React from 'react';
import logoImage from './images/known-you-seed-logo.jpg';

interface KnownYouSeedLogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

const HEIGHTS: Record<NonNullable<KnownYouSeedLogoProps['size']>, number> = {
  sm: 23,
  md: 30,
  lg: 42
};

/** Official Known-You Seed (India) Pvt. Ltd. logo. */
export const KnownYouSeedLogo: React.FC<KnownYouSeedLogoProps> = ({
  className = '',
  size = 'md'
}) => {
  return (
    <div className={`flex items-center ${className}`}>
      <img
        src={logoImage}
        alt="Known-You Seed (India) Pvt. Ltd."
        draggable={false}
        style={{ height: HEIGHTS[size], width: 'auto' }}
        className="select-none object-contain"
      />
    </div>
  );
};