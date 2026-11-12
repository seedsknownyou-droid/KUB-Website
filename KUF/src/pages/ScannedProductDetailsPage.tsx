import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { MobileHeader } from '../components/MobileHeader';
import { BottomNavigation } from '../components/BottomNavigation';
import { SuccessToast } from '../components/SuccessToast';
import { ProductVideoCard } from '../components/ProductVideoCard';
import { KnownYouSeedLogo } from '../assets/KnownYouSeedLogo';
import { PapayaGraphic } from '../assets/PapayaGraphic';
import { PoweredByDyrect, DyrectWordmark } from '../assets/DyrectLogo';
import { ProductDetails } from '../constants/productData';
import { storageService } from '../services/storageService';

export const ScannedProductDetailsPage: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();

  // The product the customer registered / selected (comes from the backend registration)
  const [product] = useState<ProductDetails | null>(() => storageService.getCurrentProduct());

  // Nothing registered on this device yet -> back to the start
  useEffect(() => {
    if (!product) navigate('/', { replace: true });
  }, [product, navigate]);

  // Favorite state
  const [isFavorite, setIsFavorite] = useState(false);

  // Toast states
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [carouselIndex, setCarouselIndex] = useState(0);

  useEffect(() => {
    if (product) setIsFavorite(storageService.isFavorite(product.id));

    // Handle toast messages passed via router state
    const state = location.state as { justRegistered?: boolean; toast?: string } | null;
    if (state?.justRegistered) {
      setToastMessage('Product successfully registered');
    } else if (state?.toast) {
      setToastMessage(state.toast);
    }
    if (state?.justRegistered || state?.toast) {
      navigate(location.pathname, { replace: true, state: null });
    }
  }, [location.state]);

  // "Read online reviews" -> Google search (same tab), no popup
  const openReviews = () => {
    const query = product?.reviewsSearchQuery || `${product?.name || ''} reviews`;
    window.location.href = `https://www.google.com/search?q=${encodeURIComponent(query)}`;
  };

  const handleToggleFavorite = () => {
    if (!product) return;
    const nextState = storageService.toggleFavorite(product);
    setIsFavorite(nextState);
  };

  const handleShare = () => {
    if (!product) return;
    if (navigator.share) {
      navigator.share({
        title: product.name,
        text: `Verify authentic ${product.name} seeds on DYRECT`,
        url: window.location.href
      }).catch(() => {});
    } else {
      navigator.clipboard.writeText(window.location.href);
      alert('Product link copied to clipboard!');
    }
  };

  const openInstagram = () => {
    window.open('https://www.instagram.com/knownyouseed_india/', '_blank');
  };

  if (!product) return null;

  return (
    <div className="min-h-screen bg-white text-gray-900 pb-[50px] flex flex-col font-sans">
      <MobileHeader
        title="Scanned Product Details"
        showBack={true}
        onBack={() => navigate('/purchases')}
      />

      <main className="w-full mx-auto px-[13px] pt-[14px] pb-[33px] flex-1">
        {/* Brand logo */}
        <KnownYouSeedLogo size="md" />

        {/* Favourite + Share (sit under the logo, as in the real app) */}
        <section aria-label="Actions" className="flex items-center gap-[14px] mt-[4px]" style={{ marginLeft: '54.500%' }}>
          <button
            type="button"
            onClick={handleToggleFavorite}
            className="p-0 active:scale-95 transition-transform"
            aria-label={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
          >
            <svg width="22" height="20" viewBox="0 0 24 22" fill={isFavorite ? '#1F7FE5' : 'none'} xmlns="http://www.w3.org/2000/svg">
              <path
                d="M12 20.500C12 20.500 2 14.400 2 7.800C2 4.700 4.300 2.500 7 2.500C9 2.500 10.800 3.600 12 5.300C13.200 3.600 15 2.500 17 2.500C19.700 2.500 22 4.700 22 7.800C22 14.400 12 20.500 12 20.500Z"
                stroke="#1F7FE5" strokeWidth="1.900" strokeLinejoin="round"
              />
            </svg>
          </button>
          <button
            type="button"
            onClick={handleShare}
            className="p-0 active:scale-95 transition-transform"
            aria-label="Share product"
          >
            <svg width="20" height="22" viewBox="0 0 20 22" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M6.500 8H4a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-9a2 2 0 0 0-2-2h-2.500" stroke="#1F7FE5" strokeWidth="1.900" strokeLinecap="round" strokeLinejoin="round" />
              <path d="M10 14V1.500M10 1.500L6 5.500M10 1.500L14 5.500" stroke="#1F7FE5" strokeWidth="1.900" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
        </section>

        {/* Product Title */}
        <h2 className="text-[20px] font-normal text-[#060606] leading-tight mt-[16px] mb-[12px]">
          {product.name}
        </h2>

        {/* Authenticated Green Banner */}
        <section aria-label="Authentication Status" className="bg-[#30B870] text-white rounded-[8px] h-[77px] flex items-stretch overflow-hidden">
          <div className="w-[44px] shrink-0 border-r border-[#2BA862] flex items-center pl-[17px]">
            <svg width="21" height="16" viewBox="0 0 21 16" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M2 8.500L7.500 14L19 2" stroke="white" strokeWidth="2.800" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
          <div className="flex flex-col justify-center pl-[10px]">
            <span className="text-[15px] font-medium leading-[18px]">
              This product is registered to you
            </span>
            <div className="flex items-center gap-[5px] mt-[11px]">
              <span className="text-[9.5px] font-normal leading-none text-white/95">Authenticated by</span>
              <DyrectWordmark height={15} />
            </div>
          </div>
        </section>

        {/* Product Serial and Date Card */}
        <section aria-label="Product Identification" className="bg-[#F8F9FD] rounded-[8px] px-[12px] py-[17.75px] mt-[9px] grid grid-cols-2 text-[13px] leading-[21px]">
          <span className="text-[#2A2B2F] font-medium">Product Serial No.:</span>
          <span className="text-[#47464B]">{product.serialNumber}</span>
          <span className="text-[#2A2B2F] font-medium">Registered On:</span>
          <span className="text-[#47464B]">{product.registeredOn}</span>
        </section>

        {/* Product Image Carousel */}
        <section aria-label="Product Gallery" className="flex flex-col items-center mt-[22px]">
          <div
            className="w-full flex items-center justify-center cursor-pointer"
            onClick={() => setCarouselIndex(carouselIndex === 0 ? 1 : 0)}
          >
            <PapayaGraphic size="hero" src={product.heroImage} alt={product.name} />
          </div>

          {/* Pagination dots */}
          <div className="flex items-center gap-[8px] mt-[20px] mb-[14px]">
            <button
              type="button"
              onClick={() => setCarouselIndex(0)}
              className={`rounded-full transition-colors ${carouselIndex === 0 ? 'w-[7px] h-[7px] bg-[#0087FF]' : 'w-[6px] h-[6px] bg-[#D3D3D3]'}`}
              aria-label="View first image"
            />
            <button
              type="button"
              onClick={() => setCarouselIndex(1)}
              className={`rounded-full transition-colors ${carouselIndex === 1 ? 'w-[7px] h-[7px] bg-[#0087FF]' : 'w-[6px] h-[6px] bg-[#D3D3D3]'}`}
              aria-label="View second image"
            />
          </div>
        </section>

        {/* Product Description */}
        {product.description && (
        <section aria-label="Product Description" className="text-[13.5px] text-[#707070] leading-[21px] mb-[18px] font-normal">
          <p>{product.description}</p>
        </section>
        )}

        {/* Specifications table (products without a description) */}
        {product.specifications && product.specifications.length > 0 && (
          <section aria-label="Specifications" className="mt-[20px]">
            <h3 className="text-[19px] leading-[24px] font-medium text-[#68676B]">Specifications</h3>
            <div className="w-[36px] h-[1.5px] bg-[#333] mt-[10px]" />
            <div className="mt-[25px] border border-[#DDDDDD] rounded-[4px] overflow-hidden">
              {product.specifications.map((row, i) => (
                <div
                  key={row.label}
                  className={`grid grid-cols-[44.5%_55.5%] items-center h-[33.25px] pl-[8px] pr-[8px] text-[13px] ${
                    i % 2 === 0 ? 'bg-[#F4F4F4]' : 'bg-white'
                  } ${i < product.specifications!.length - 1 ? 'border-b border-[#DDDDDD]' : ''}`}
                >
                  <span className="font-semibold text-[#848484]">{row.label}</span>
                  <span className="font-normal text-[#69686B]">{row.value}</span>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* YouTube videos (embedded players, 137px tall, 2px apart as in the real app) */}
        {product.videos.length > 0 && (
        <section aria-label="Farming Guidance Videos" className="flex flex-col gap-[2px] mb-[4px]">
          {product.videos.map((vid) => (
            <ProductVideoCard key={vid.id} video={vid} />
          ))}
        </section>
        )}

        {/* Read Online Reviews Section */}
        {product.showReviews && (
        <section aria-label="Customer Reviews" className="flex flex-col items-center justify-center">
          {/* Thumbs up + 3 outlined stars */}
          <svg width="46" height="47" viewBox="0 0 46 47" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect x="9.500" y="14" width="9" height="19.500" rx="1.800" stroke="#111" strokeWidth="1.600" />
            <circle cx="12.500" cy="29.500" r="1.200" stroke="#111" strokeWidth="1.100" />
            <path d="M18.500 17.500L25 12C26.800 10.400 27.200 8 26.400 5.500C26 4 26.500 2.200 28 2C29.800 1.800 31 3 31 5.200C31 8 30 11 29.300 13.500H38C39.900 13.500 41 15 40.600 16.800C40.300 17.600 39.700 18.300 39 18.700C40.200 19.200 40.900 20.400 40.500 21.600C40.200 22.500 39.600 23.100 38.800 23.400C39.800 23.900 40.200 25 39.800 26C39.400 26.900 38.800 27.400 38 27.600C38.700 28.300 38.700 29.600 38 30.400C37.300 31.200 36.400 31.500 35.500 31.500H18.500" stroke="#111" strokeWidth="1.600" strokeLinejoin="round" strokeLinecap="round" />
              <polygon points="7.00,35.40 8.38,39.10 12.33,39.27 9.24,41.73 10.29,45.53 7.00,43.35 3.71,45.53 4.76,41.73 1.67,39.27 5.62,39.10" stroke="#111" strokeWidth="1.5" strokeLinejoin="round" fill="none" />
              <polygon points="22.50,35.40 23.88,39.10 27.83,39.27 24.74,41.73 25.79,45.53 22.50,43.35 19.21,45.53 20.26,41.73 17.17,39.27 21.12,39.10" stroke="#111" strokeWidth="1.5" strokeLinejoin="round" fill="none" />
              <polygon points="38.00,35.40 39.38,39.10 43.33,39.27 40.24,41.73 41.29,45.53 38.00,43.35 34.71,45.53 35.76,41.73 32.67,39.27 36.62,39.10" stroke="#111" strokeWidth="1.5" strokeLinejoin="round" fill="none" />
          </svg>
          <button
            type="button"
            onClick={openReviews}
            className="text-[#0087FF] font-medium text-[13px] flex items-center mt-[6px] active:opacity-70"
          >
            <span>Read online reviews</span>
            <svg width="16" height="14" viewBox="0 0 16 14" fill="none" xmlns="http://www.w3.org/2000/svg" className="ml-[1px]">
              <path d="M9.500 1.200L14.800 6 9.500 10.800V8C5.400 8 3 9.200 1.500 12.200C1.800 7.800 4.400 4.700 9.500 4.200z" stroke="#0087FF" strokeWidth="1.300" strokeLinejoin="round" />
            </svg>
          </button>
        </section>
        )}

        {/* Support menu */}
        <section aria-label="Customer Support Links" className={`flex flex-col gap-[14px] ${product.specifications ? 'mt-[27px]' : 'mt-[30px]'}`}>
          <button
            type="button"
            onClick={() => navigate('/contact-support')}
            className="w-full h-[56.5px] bg-white border border-[#378BFF] rounded-[4px] flex items-stretch overflow-hidden active:bg-gray-50 transition-colors text-left"
          >
            <div className="w-[72px] shrink-0 bg-[#378BFF] flex items-center justify-center">
              <svg width="44" height="27" viewBox="0 0 44 27" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M2.200 0.300h16c1.200 0 2.200 1 2.200 2.200v9.200c0 1.200-1 2.200-2.200 2.200H8.800L5 17.600v-3.700H2.200C1 13.900 0 12.900 0 11.700V2.500C0 1.300 1 0.300 2.200 0.300z" fill="white" />
                <circle cx="5.200" cy="7" r="1.500" fill="#378BFF" />
                <circle cx="10.200" cy="7" r="1.500" fill="#378BFF" />
                <circle cx="15.200" cy="7" r="1.500" fill="#378BFF" />
                <circle cx="30" cy="6.200" r="6.100" fill="white" />
                <path d="M16.800 26.400C16.800 20.400 22.200 15.800 30.100 15.800S43.500 20.400 43.500 26.400z" fill="white" />
              </svg>
            </div>
            <div className="flex-1 flex items-center justify-between pl-[22px] pr-[20px]">
              <span className="text-[13.5px] font-normal text-[#141414]">Contact Support</span>
              <svg width="19" height="14" viewBox="0 0 19 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M1 7h16.500M11.500 1.200L17.500 7l-6 5.800" stroke="#4A86E8" strokeWidth="1.500" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
          </button>

          <button
            type="button"
            onClick={() => navigate('/feedback')}
            className="w-full h-[56.5px] bg-white border border-[#378BFF] rounded-[4px] flex items-stretch overflow-hidden active:bg-gray-50 transition-colors text-left"
          >
            <div className="w-[72px] shrink-0 bg-[#378BFF] flex items-center justify-center">
              <svg width="28" height="31" viewBox="0 0 28 31" fill="none" xmlns="http://www.w3.org/2000/svg">
                <circle cx="14" cy="6" r="4.900" stroke="white" strokeWidth="2" />
                <path d="M5.200 18.200C6.200 14 9.600 12.600 14 12.600S21.800 14 22.800 18.200" stroke="white" strokeWidth="2" strokeLinecap="round" />
                <polygon points="5.40,21.00 6.54,24.04 9.77,24.18 7.24,26.20 8.10,29.32 5.40,27.53 2.70,29.32 3.56,26.20 1.03,24.18 4.26,24.04" fill="white" />
                <polygon points="14.00,18.40 15.14,21.44 18.37,21.58 15.84,23.60 16.70,26.72 14.00,24.93 11.30,26.72 12.16,23.60 9.63,21.58 12.86,21.44" fill="white" />
                <polygon points="22.60,21.00 23.74,24.04 26.97,24.18 24.44,26.20 25.30,29.32 22.60,27.53 19.90,29.32 20.76,26.20 18.23,24.18 21.46,24.04" fill="white" />
              </svg>
            </div>
            <div className="flex-1 flex items-center justify-between pl-[22px] pr-[20px]">
              <span className="text-[13.5px] font-normal text-[#141414]">Feedback / Suggestions</span>
              <svg width="19" height="14" viewBox="0 0 19 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M1 7h16.500M11.500 1.200L17.500 7l-6 5.800" stroke="#4A86E8" strokeWidth="1.500" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
          </button>
        </section>

        {/* Instagram (some products) + Powered By Dyrect footer */}
        <footer className={`flex flex-col items-center justify-center ${product.showInstagram ? 'mt-[41px]' : 'mt-[28px]'}`}>
          {product.showInstagram && (
            <button
              type="button"
              onClick={openInstagram}
              className="active:opacity-70 transition-opacity"
              aria-label="Known-You Seed India Instagram"
            >
              <svg width="37" height="37" viewBox="0 0 37 37" fill="none" xmlns="http://www.w3.org/2000/svg">
                <rect x="1.600" y="1.600" width="33.800" height="33.800" rx="8.500" stroke="#7B8798" strokeWidth="2.800" />
                <circle cx="18.500" cy="19.500" r="8.200" stroke="#7B8798" strokeWidth="2.800" />
                <circle cx="28.300" cy="9" r="1.900" stroke="#7B8798" strokeWidth="2.200" />
              </svg>
            </button>
          )}

          <PoweredByDyrect className={product.showInstagram ? 'mt-[46px]' : ''} />
        </footer>
      </main>

      {/* Bottom Success Toast (e.g. "Product successfully registered" [Ok]) */}
      <SuccessToast 
        isOpen={Boolean(toastMessage)} 
        message={toastMessage || ''} 
        onClose={() => setToastMessage(null)} 
      />

      {/* Fixed Bottom Navigation */}
      <BottomNavigation />
    </div>
  );
};