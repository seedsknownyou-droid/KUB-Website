import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { MobileHeader } from '../components/MobileHeader';
import { BottomNavigation } from '../components/BottomNavigation';
import { ProductDetails, buildProduct } from '../constants/productData';
import { storageService } from '../services/storageService';
import { apiService } from '../services/apiService';

export const MyPurchasesPage: React.FC = () => {
  const navigate = useNavigate();
  const [purchases, setPurchases] = useState<ProductDetails[]>(() => storageService.getPurchases());
  // while the phone-number lookup runs, do not flash the "No purchases found" message
  const [syncing, setSyncing] = useState<boolean>(() => !!storageService.getUser()?.phone);

  // Everything registered with the customer's phone number appears in My Purchases
  useEffect(() => {
    const phone = storageService.getUser()?.phone;
    if (!phone) {
      setSyncing(false);
      return;
    }

    let cancelled = false;
    apiService
      .getCustomerProducts(phone)
      .then((res) => {
        storageService.mergeServerPurchases(
          phone,
          res.products.map((p) => buildProduct(p.serialNumber, p.productName, p.registeredAt))
        );
      })
      .catch(() => {
        /* offline or server down: keep showing the purchases saved on this device */
      })
      .finally(() => {
        if (cancelled) return;
        setPurchases(storageService.getPurchases());
        setSyncing(false);
      });

    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <div className="min-h-screen bg-white text-gray-900 pb-[56px] flex flex-col font-sans">
      <MobileHeader title="My Purchases" />

      <main className="max-w-[576px] w-full mx-auto flex-1">
        {syncing && purchases.length === 0 ? (
          <div className="flex-1" aria-busy="true" />
        ) : purchases.length === 0 ? (
          <div className="flex flex-col items-center justify-center pt-24 text-center px-6">
            <div className="w-16 h-16 rounded-full bg-blue-50 flex items-center justify-center text-blue-600 mb-4">
              📦
            </div>
            <h2 className="text-lg font-semibold text-gray-800">No purchases found</h2>
            <p className="text-sm text-gray-500 mt-1 max-w-xs">
              Scan or register your seed packets to verify authenticity and track your products.
            </p>
            <button
              type="button"
              onClick={() => navigate('/')}
              className="mt-6 px-6 py-2.5 rounded-full bg-[#0070F3] text-white font-medium text-sm shadow-sm"
            >
              Register a Product
            </button>
          </div>
        ) : (
          <div className="pt-[28px]">
            {purchases.map((product) => (
              <div
                key={product.id}
                onClick={() => {
                  storageService.setCurrentProduct(product);
                  navigate('/scanned-product-details');
                }}
                className="px-[10px] pb-[14px] mb-[14px] border-b border-[#E3E3E3] flex items-start gap-[14px] cursor-pointer active:bg-gray-50 transition-colors select-none"
              >
                {/* Product image card */}
                <div className="w-[109px] h-[118px] rounded-[8px] bg-white border border-[#EDEDED] flex items-center justify-center shrink-0 overflow-hidden">
                  <img
                    src={product.heroImage}
                    alt={product.name}
                    draggable={false}
                    style={{ width: product.thumbSize.width, height: product.thumbSize.height }}
                    className="object-fill"
                  />
                </div>

                {/* Info */}
                <div className="relative flex-1 min-w-0 pr-[26px]">
                  <h2 className="text-[16px] leading-[20px] font-normal text-[#161616] truncate">
                    {product.name}
                  </h2>
                  <svg className="absolute right-[16px] top-[4px]" width="8" height="13" viewBox="0 0 8 13" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M1.500 1.500L6.500 6.500l-5 5" stroke="#C9C9C9" strokeWidth="1.600" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>

                  {product.description && (
                    <p className="text-[14px] leading-[20px] text-[#6B6B70] mt-[5px] line-clamp-2">
                      {product.description}
                    </p>
                  )}

                  <p className={`text-[13.5px] leading-[20px] text-[#6B6B70] truncate ${product.description ? 'mt-[8px]' : 'mt-[15px]'}`}>
                    <span className="font-bold text-black">Registered on</span>{' '}
                    {product.registeredDateFormatted}
                  </p>

                  <span className="inline-flex items-center h-[21px] mt-[4px] px-[11px] bg-[#27AE60] text-white text-[13px] font-normal rounded-full">
                    Product Registered
                  </span>
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