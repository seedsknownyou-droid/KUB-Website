import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation, useParams, useSearchParams } from 'react-router-dom';
import { Check } from 'lucide-react';
import { MobileHeader } from '../components/MobileHeader';
import { LoadingModal } from '../components/LoadingModal';
import { LocationPromptModal } from '../components/LocationPromptModal';
import { PrivacyPolicyModal } from '../components/PrivacyPolicyModal';
import { PapayaGraphic } from '../assets/PapayaGraphic';
import { KnownYouSeedLogo } from '../assets/KnownYouSeedLogo';
import { PoweredByDyrect } from '../assets/DyrectLogo';
import { SuccessToast } from '../components/SuccessToast';
import { buildProduct, findCatalogProduct, ProductDetails } from '../constants/productData';
import { storageService } from '../services/storageService';
import { apiService, ApiError, ApiProduct } from '../services/apiService';
import { OWNER_OPENS_DETAILS_ON_RESCAN } from '../constants/appConfig.ts';

export const RegisterProductPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams] = useSearchParams();
  const params = useParams();

  // The QR code opens this page with a secret hash in the link (hash mapping), e.g. /r/Qm3vX9t2LkP0aZr7bNf4YcHd
  // The backend maps the hash to the serial number, so the serial number is never visible in the link.
  const qrHash = (searchParams.get('h') || params.hash || '').trim();

  // Older QR codes carry the serial number itself, e.g. /register?sn=PRI01321111 (only works while the
  // backend still has ALLOW_PLAIN_SERIAL=true)
  const urlSerial = (
    searchParams.get('sn') ||
    searchParams.get('serial') ||
    searchParams.get('serialNumber') ||
    searchParams.get('s') ||
    params.serial ||
    ''
  ).trim().toUpperCase();

  // With a hash link the serial number comes back from the backend
  const [hashSerial, setHashSerial] = useState('');
  const serialNumber = qrHash ? hashSerial : urlSerial;

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [agreePolicy, setAgreePolicy] = useState(true);

  // Product verification (serial number checked against Firebase)
  const [verifyState, setVerifyState] = useState<'checking' | 'ready' | 'blocked'>('checking');
  const [blockedMessage, setBlockedMessage] = useState('');
  const [alreadyRegistered, setAlreadyRegistered] = useState(false);
  const [product, setProduct] = useState<ApiProduct | null>(null);

  // Validation
  const [errors, setErrors] = useState<{ name?: string; email?: string; phone?: string; agree?: string }>({});
  const [submitError, setSubmitError] = useState('');

  // Modals & Flow States
  const [isLoading, setIsLoading] = useState(false);
  const [loadingText, setLoadingText] = useState('Loading...');
  const [showLocationPrompt, setShowLocationPrompt] = useState(false);
  const [showPrivacyPolicy, setShowPrivacyPolicy] = useState(false);

  // Message coming back from the "Report this incident" form
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  useEffect(() => {
    const state = location.state as { toast?: string } | null;
    if (state?.toast) {
      setToastMessage(state.toast);
      navigate(location.pathname + location.search, { replace: true, state: null });
    }
  }, [location.state]);

  // Step 0: verify the scanned serial number with the backend
  useEffect(() => {
    let cancelled = false;

    if (!qrHash && !urlSerial) {
      setBlockedMessage('Please scan the QR code on your product to register it.');
      setVerifyState('blocked');
      return;
    }

    setVerifyState('checking');
    const lookup = qrHash ? apiService.verifyByHash(qrHash) : apiService.verifyProduct(urlSerial);
    lookup
      .then((res) => {
        if (cancelled) return;
        const serial = res.product.serialNumber;
        if (qrHash) setHashSerial(serial);
        setProduct(res.product);
        if (res.canRegister) {
          setVerifyState('ready');
          return;
        }

        // Already registered. By default everyone sees the red page (see constants/appConfig.ts).
        const showSoldToAnother = () => {
          setAlreadyRegistered(true);
          setBlockedMessage('This product is already registered.');
          setVerifyState('blocked');
        };
        const openOwned = (owned: ProductDetails) => {
          storageService.setCurrentProduct(owned);
          navigate('/scanned-product-details', { replace: true });
        };

        if (!OWNER_OPENS_DETAILS_ON_RESCAN) {
          showSoldToAnother();
          return;
        }

        const mine = storageService.getPurchases().find((p) => p.serialNumber === serial);
        if (mine) {
          openOwned(mine);
          return;
        }

        const phone = storageService.getUser()?.phone;
        if (!phone) {
          showSoldToAnother();
          return;
        }
        apiService
          .getCustomerProducts(phone)
          .then((list) => {
            if (cancelled) return;
            const hit = list.products.find((p) => p.serialNumber === serial);
            if (hit) {
              const owned = buildProduct(hit.serialNumber, hit.productName, hit.registeredAt);
              storageService.mergeServerPurchases(phone, [owned]);
              openOwned(owned);
            } else {
              showSoldToAnother();
            }
          })
          .catch(() => {
            if (!cancelled) showSoldToAnother();
          });
      })
      .catch((err: ApiError) => {
        if (cancelled) return;
        setBlockedMessage(err.message);
        setVerifyState('blocked');
      });

    return () => {
      cancelled = true;
    };
  }, [qrHash, urlSerial]);

  // If this device already registered someone before, pre-fill their details
  useEffect(() => {
    const existing = storageService.getUser();
    if (existing) {
      if (existing.name) setName(existing.name);
      if (existing.email) setEmail(existing.email);
      if (existing.phone) setPhone(existing.phone);
    }
  }, []);

  const validate = () => {
    const newErrors: { name?: string; email?: string; phone?: string; agree?: string } = {};
    if (!name.trim()) newErrors.name = 'Please enter your name';
    if (email.trim() && !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email.trim())) {
      newErrors.email = 'Please enter a valid email address';
    }
    if (!phone.trim()) newErrors.phone = 'Please enter your phone number';
    else if (!/^[6-9]\d{9}$/.test(phone.replace(/\D/g, '').replace(/^(91|0)(?=\d{10}$)/, ''))) {
      newErrors.phone = 'Please enter a valid 10-digit mobile number';
    }
    if (!agreePolicy) newErrors.agree = 'You must agree to the Privacy Policy';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitError('');
    if (!validate()) return;

    // Step 1: Initial Loading modal with Dyrect logo
    setLoadingText('Loading...');
    setIsLoading(true);

    setTimeout(() => {
      setIsLoading(false);
      // Step 2: Show location permission dialog
      setShowLocationPrompt(true);
    }, 1500);
  };

  const handleLocationDecision = async (_allowed: boolean) => {
    setShowLocationPrompt(false);

    // Step 3: Show "Authenticating with Dyrect..." loader while the backend registers the product
    setLoadingText('Authenticating with Dyrect...');
    setIsLoading(true);

    try {
      const result = await apiService.registerProduct({
        ...(qrHash ? { hash: qrHash } : { serialNumber }),
        name: name.trim(),
        email: email.trim(),
        phone: phone.trim(),
        agreedToPolicy: agreePolicy
      });

      storageService.registerProduct(
        buildProduct(serialNumber, result.product.productName, result.product.registeredAt),
        {
          name: name.trim(),
          email: email.trim(),
          phone: phone.replace(/\D/g, '').slice(-10),
          agreedToPolicy: agreePolicy,
          registeredAt: result.product.registeredAt || new Date().toISOString(),
          serialNumber
        }
      );

      setIsLoading(false);
      // Navigate to product details with fresh registration state
      navigate('/scanned-product-details', { replace: true, state: { justRegistered: true } });
    } catch (err) {
      setIsLoading(false);
      const apiErr = err as ApiError;
      if (apiErr.code === 'ALREADY_REGISTERED') {
        setAlreadyRegistered(true);
        setBlockedMessage('This product is already registered.');
        setVerifyState('blocked');
      } else {
        setSubmitError(apiErr.message || 'Registration failed. Please try again.');
      }
    }
  };

  const catalogProduct = findCatalogProduct(product?.productName, serialNumber);
  const displayName = product?.productName || catalogProduct.name;

  // Serial not valid / already registered / no QR scanned: registration is not allowed
  if (verifyState !== 'ready') {
    const toast = (
      <SuccessToast
        isOpen={Boolean(toastMessage)}
        message={toastMessage || ''}
        onClose={() => setToastMessage(null)}
      />
    );

    // ---- Product already sold: red warning page (same as the real app) ----
    if (verifyState === 'blocked' && alreadyRegistered) {
      return (
        <div className="min-h-screen bg-white text-gray-900 pb-[24px] flex flex-col font-sans">
          <MobileHeader title="Scanned Product Details" emphasis />

          <main className="max-w-[576px] w-full mx-auto px-[13.5px] pt-[14px] flex-1">
            <KnownYouSeedLogo size="md" />

            <h2 className="text-[19.5px] font-medium text-black leading-[24px] mt-[12px] mb-[14px]">
              {displayName}
            </h2>

            <section role="alert" className="bg-[#D32F2F] text-white rounded-[4px] flex items-stretch overflow-hidden">
              <div className="w-[44px] shrink-0 border-r border-[#C82422] flex items-center pl-[18.5px]">
                <svg width="15" height="15" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M1.600 1.600L13.400 13.400M13.400 1.600L1.600 13.400" stroke="white" strokeWidth="2.700" strokeLinecap="round" />
                </svg>
              </div>
              <p className="pl-[10px] pr-[12px] py-[21.800px] text-[14.5px] font-bold leading-[20px] max-w-[286px]">
                This product item has already been sold and registered to another user. If you see this item on sale, most likely it is a counterfeit.
                <br />
                Please help us protect buyers like yourself by reporting this incident.
              </p>
            </section>

            <section className="bg-[#F7F8FC] rounded-[4px] px-[13.5px] pt-[14px] pb-[13px] mt-[10px] text-[11.3px] leading-[17px] text-[#535459]">
              If you have registered this product before, please{' '}
              <button
                type="button"
                onClick={() => navigate('/purchases')}
                className="text-[#1F7AB8] font-normal focus:outline-none"
              >
                sign in
              </button>{' '}
              with the corresponding account.
            </section>

            <button
              type="button"
              onClick={() =>
                navigate('/contact-support', {
                  state: {
                    serialNumber,
                    productName: displayName,
                    returnTo: qrHash ? `/r/${encodeURIComponent(qrHash)}` : `/register?sn=${encodeURIComponent(serialNumber)}`,
                    counterfeit: true
                  }
                })
              }
              className="mt-[14px] w-full h-[38px] rounded-[4px] bg-[#007AFF] active:bg-[#0069DB] text-white text-[15.5px] font-medium transition-colors select-none"
            >
              Report this incident
            </button>

            <div className="flex justify-center mt-[37px]">
              <PoweredByDyrect />
            </div>
          </main>
          {toast}
        </div>
      );
    }

    // ---- Checking, invalid QR code, no QR scanned ----
    return (
      <div className="min-h-screen bg-white text-gray-900 pb-16 flex flex-col font-sans">
        <MobileHeader title="Register Product" />
        <main className="max-w-[576px] w-full mx-auto px-6 flex-1 flex flex-col items-center justify-center text-center">
          {verifyState === 'checking' ? (
            <p className="text-[15px] text-gray-500">Verifying your product...</p>
          ) : (
            <>
              <div className="w-16 h-16 rounded-full bg-red-50 flex items-center justify-center text-3xl mb-4">
                ⚠️
              </div>
              <h2 className="text-lg font-semibold text-gray-800">{blockedMessage}</h2>
              {serialNumber && (
                <p className="text-[13px] text-gray-500 mt-1">Serial No: {serialNumber}</p>
              )}
            </>
          )}
        </main>
        {toast}
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white text-gray-900 pb-16 flex flex-col font-sans">
      <MobileHeader title="Register Product" />

      {/* Product summary card: photo on the left, product name and serial number on the right */}
      <section aria-label="Product Summary" className="bg-white">
        <div className="max-w-[576px] mx-auto px-[14px] pt-[22px] pb-[20px] flex items-center">
          <div className="w-[48px] h-[36px] shrink-0 flex items-center justify-center ml-[14px]">
            <PapayaGraphic size="thumb" src={catalogProduct.cutoutImage || catalogProduct.heroImage} alt={displayName} />
          </div>
          <div className="flex flex-col ml-[26px] min-w-0">
            <h2 className="text-[16px] font-normal text-[#787878] leading-[20px] truncate">
              {displayName}
            </h2>
            <p className="text-[13px] font-normal text-[#787878] leading-[16px] mt-[6px]">
              Serial No: {serialNumber}
            </p>
          </div>
        </div>
      </section>

      <main className="max-w-[576px] w-full mx-auto px-[14px] pt-[27px] pb-8 flex-1">
        {/* Registration Form */}
        <form onSubmit={handleRegister} className="flex flex-col gap-[35px]">
          {/* Name Field */}
          <div className="flex flex-col">
            <label htmlFor="reg-name" className="text-[11px] leading-[14px] font-normal text-[#9B9B9B] mb-[3px] select-none">
              Name *
            </label>
            <input
              id="reg-name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter your name"
              className="w-full h-[34px] p-0 text-[16px] text-[#111] bg-transparent border-0 border-b border-[#D6D6D6] rounded-none focus:border-[#0A7CFF] focus:outline-none placeholder:text-[#B8B8B8] transition-colors"
            />
            {errors.name && (
              <span className="text-red-500 text-xs mt-1">{errors.name}</span>
            )}
          </div>

          {/* Email Field */}
          <div className="flex flex-col">
            <label htmlFor="reg-email" className="text-[11px] leading-[14px] font-normal text-[#9B9B9B] mb-[3px] select-none">
              Email
            </label>
            <input
              id="reg-email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              className="w-full h-[34px] p-0 text-[16px] text-[#111] bg-transparent border-0 border-b border-[#D6D6D6] rounded-none focus:border-[#0A7CFF] focus:outline-none placeholder:text-[#B8B8B8] transition-colors"
            />
            {errors.email && (
              <span className="text-red-500 text-xs mt-1">{errors.email}</span>
            )}
          </div>

          {/* Phone Field */}
          <div className="flex flex-col">
            <label htmlFor="reg-phone" className="text-[11px] leading-[14px] font-normal text-[#9B9B9B] mb-[3px] select-none">
              Phone *
            </label>
            <input
              id="reg-phone"
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="Enter your phone number"
              className="w-full h-[34px] p-0 text-[16px] text-[#111] bg-transparent border-0 border-b border-[#D6D6D6] rounded-none focus:border-[#0A7CFF] focus:outline-none placeholder:text-[#B8B8B8] transition-colors"
            />
            {errors.phone && (
              <span className="text-red-500 text-xs mt-1">{errors.phone}</span>
            )}
          </div>

          {/* Privacy Policy Checkbox */}
          <div className="-mt-[5px]">
            <div className="flex items-center gap-[5px]">
              <button
                type="button"
                role="checkbox"
                aria-checked={agreePolicy}
                onClick={() => setAgreePolicy(!agreePolicy)}
                className={`w-5 h-5 rounded-full flex items-center justify-center transition-all shrink-0 ${
                  agreePolicy 
                    ? 'bg-[#0A7CFF] text-white' 
                    : 'border-2 border-gray-400 bg-white'
                }`}
              >
                {agreePolicy && <Check size={13} strokeWidth={3} />}
              </button>
              <div className="text-[11.5px] text-[#666] select-none">
                <span>I agree to </span>
                <button
                  type="button"
                  onClick={() => setShowPrivacyPolicy(true)}
                  className="text-[#0A66C2] hover:underline font-normal focus:outline-none"
                >
                  Privacy Policy
                </button>
              </div>
            </div>
            {errors.agree && (
              <span className="text-red-500 text-xs mt-1 block">{errors.agree}</span>
            )}
          </div>

          {submitError && (
            <span className="text-red-500 text-sm block" role="alert">{submitError}</span>
          )}

          {/* Register Button */}
          <div className="pt-[11px] mx-[13px]">
            <button
              type="submit"
              className="w-full h-[38px] rounded-full bg-[#0A7CFF] active:bg-[#0069DB] text-white font-normal text-[16px] transition-colors text-center select-none"
            >
              Register Product
            </button>
          </div>
        </form>
      </main>

      {/* Loading Modal with Dyrect Logo */}
      <LoadingModal isOpen={isLoading} text={loadingText} />

      {/* Location Permission Modal */}
      <LocationPromptModal 
        isOpen={showLocationPrompt} 
        onDecision={handleLocationDecision} 
      />

      {/* Privacy Policy Modal */}
      <PrivacyPolicyModal 
        isOpen={showPrivacyPolicy} 
        onClose={() => setShowPrivacyPolicy(false)} 
      />
    </div>
  );
};