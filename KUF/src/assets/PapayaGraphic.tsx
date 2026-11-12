import React from 'react';
import papayaImage from './images/papaya.jpg';

interface PapayaGraphicProps {
  className?: string;
  size?: 'thumb' | 'card' | 'hero';
  /** Product photo; defaults to the papaya photo */
  src?: string;
  alt?: string;
}

/** Real product photo (replaces the old drawn placeholder). Sizing is controlled by the parent box. */
export const PapayaGraphic: React.FC<PapayaGraphicProps> = ({
  className = '',
  size = 'hero',
  src,
  alt = 'Papaya Red Lady'
}) => {
  return (
    <div className={`relative flex items-center justify-center select-none w-full h-full ${className}`}>
      <img
        src={src || papayaImage}
        alt={alt}
        draggable={false}
        className={`w-full h-auto max-h-full object-contain`}
      />
    </div>
  );
};