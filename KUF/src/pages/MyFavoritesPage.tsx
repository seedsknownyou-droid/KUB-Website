import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Heart, ChevronRight } from 'lucide-react';
import { MobileHeader } from '../components/MobileHeader';
import { BottomNavigation } from '../components/BottomNavigation';
import { EmptyFavoritesGraphic } from '../assets/EmptyFavoritesGraphic';
import { PapayaGraphic } from '../assets/PapayaGraphic';
import { ProductDetails } from '../constants/productData';
import { storageService } from '../services/storageService';

export const MyFavoritesPage: React.FC = () => {
  const navigate = useNavigate();
  const [favorites, setFavorites] = useState<ProductDetails[]>([]);

  useEffect(() => {
    setFavorites(storageService.getFavorites());
  }, []);

  const handleRemoveFavorite = (e: React.MouseEvent, product: ProductDetails) => {
    e.stopPropagation();
    storageService.toggleFavorite(product);
    setFavorites(storageService.getFavorites());
  };

  return (
    <div className="min-h-screen bg-white text-gray-900 pb-[56px] flex flex-col font-sans">
      <MobileHeader title="My Favorites" />

      <main className="max-w-[576px] w-full mx-auto px-[13px] flex-1 flex flex-col">
        {favorites.length === 0 ? (
          <div className="flex-1 flex flex-col items-center pt-[30px] px-[26px] text-center select-none text-[#66666A]">
            <p className="text-[16px] leading-[33px] font-normal">
              No product marked as favorite.
            </p>
            <p className="text-[16px] leading-[34px] font-normal max-w-[312px]">
              Please click{' '}
              <svg className="inline-block align-middle -mt-[3px] mx-[2px]" width="22" height="20" viewBox="0 0 24 22" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 20.500C12 20.500 2 14.400 2 7.800C2 4.700 4.300 2.500 7 2.500C9 2.500 10.800 3.600 12 5.300C13.200 3.600 15 2.500 17 2.500C19.700 2.500 22 4.700 22 7.800C22 14.400 12 20.500 12 20.500Z" stroke="#66666A" strokeWidth="1.600" strokeLinejoin="round" />
              </svg>{' '}
              to add the product to your favorite list.
            </p>

            <div className="mt-[29px]">
              <EmptyFavoritesGraphic size={114} />
            </div>
          </div>
        ) : (
          <div className="space-y-3 pt-2">
            {favorites.map((product) => (
              <div
                key={product.id}
                onClick={() => {
                  storageService.setCurrentProduct(product);
                  navigate('/scanned-product-details');
                }}
                className="bg-[#F8F9FA] rounded-xl p-3.5 flex items-center justify-between border border-gray-200/80 hover:bg-gray-100 cursor-pointer transition-all shadow-2xs"
              >
                <div className="flex items-center gap-3.5 min-w-0">
                  <div className="w-16 h-16 rounded-lg bg-white flex items-center justify-center shrink-0 border border-gray-100 overflow-hidden p-1">
                    <PapayaGraphic size="card" src={product.heroImage} alt={product.name} />
                  </div>
                  <div className="min-w-0">
                    <h2 className="text-[15.5px] font-bold text-gray-900 truncate">
                      {product.name}
                    </h2>
                    <p className="text-[12px] text-gray-500 mt-0.5">
                      Serial: {product.serialNumber}
                    </p>
                    <span className="inline-block mt-1 text-[11px] font-semibold text-[#0066FF]">
                      Authentic Seeds
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <button
                    type="button"
                    onClick={(e) => handleRemoveFavorite(e, product)}
                    className="p-2 text-[#0066FF] hover:bg-blue-50 rounded-full transition-colors"
                    title="Remove from favorites"
                  >
                    <Heart size={20} className="fill-[#0066FF]" />
                  </button>
                  <ChevronRight size={18} className="text-gray-400" />
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      <BottomNavigation />
    </div>
  );
};