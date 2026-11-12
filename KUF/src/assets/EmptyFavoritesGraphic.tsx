import React from 'react';
import emptyFavorites from './images/empty-favorites.png';

interface EmptyFavoritesGraphicProps {
  className?: string;
  /** Width in px (the real app shows it about 114px wide) */
  size?: number;
}

/** "No favorites yet" illustration: QR code inside scan corners with a sad-face magnifier. */
export const EmptyFavoritesGraphic: React.FC<EmptyFavoritesGraphicProps> = ({
  className = '',
  size = 114
}) => {
  return (
    <img
      src={emptyFavorites}
      alt="No favorite products"
      draggable={false}
      style={{ width: size, height: 'auto' }}
      className={`select-none ${className}`}
    />
  );
};
