import React from 'react';
import { BrowserRouter, Routes, Route, Navigate, useSearchParams } from 'react-router-dom';
import { RegisterProductPage } from './pages/RegisterProductPage';
import { ScannedProductDetailsPage } from './pages/ScannedProductDetailsPage';
import { ContactSupportPage } from './pages/ContactSupportPage';
import { FeedbackPage } from './pages/FeedbackPage';
import { MyPurchasesPage } from './pages/MyPurchasesPage';
import { MyFavoritesPage } from './pages/MyFavoritesPage';
import { MyProfilePage } from './pages/MyProfilePage';
import { EditProfilePage } from './pages/EditProfilePage';
import { WelcomePage } from './pages/WelcomePage';
import { SignInPage } from './pages/SignInPage';
import { SignUpPage } from './pages/SignUpPage';
import { PrivacyPolicyPage } from './pages/PrivacyPolicyPage';

/**
 * The site's home address.
 *  - A product QR code (link with the serial number) opens the Register Product page.
 *  - Anything else, such as "Access Your Account" in the email, opens the Welcome page (Sign In / Sign Up).
 */
function HomeRoute() {
  const [searchParams] = useSearchParams();
  const hasSerial = ['h', 'sn', 'serial', 'serialNumber', 's'].some((key) => searchParams.get(key));
  return hasSerial ? <RegisterProductPage /> : <WelcomePage />;
}

export default function App() {
  return (
    <BrowserRouter>
      {/* Mobile-first centered frame on large screens */}
      <div className="min-h-screen bg-[#E5E7EB] flex justify-center items-start">
        <div className="w-full max-w-[576px] min-h-screen bg-white shadow-xl relative flex flex-col">
          <Routes>
            <Route path="/" element={<HomeRoute />} />
            <Route path="/register" element={<RegisterProductPage />} />
            <Route path="/register/:serial" element={<RegisterProductPage />} />
            <Route path="/r/:hash" element={<RegisterProductPage />} />
            <Route path="/scanned-product-details" element={<ScannedProductDetailsPage />} />
            <Route path="/contact-support" element={<ContactSupportPage />} />
            <Route path="/feedback" element={<FeedbackPage />} />
            <Route path="/purchases" element={<MyPurchasesPage />} />
            <Route path="/favorites" element={<MyFavoritesPage />} />
            <Route path="/welcome" element={<WelcomePage />} />
            <Route path="/signin" element={<SignInPage />} />
            <Route path="/signup" element={<SignUpPage />} />
            <Route path="/profile" element={<MyProfilePage />} />
            <Route path="/profile/edit" element={<EditProfilePage />} />
            <Route path="/profile/privacy" element={<PrivacyPolicyPage />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </div>
      </div>
    </BrowserRouter>
  );
}