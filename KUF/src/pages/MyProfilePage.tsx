import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { MobileHeader } from '../components/MobileHeader';
import { BottomNavigation } from '../components/BottomNavigation';
import { SuccessToast } from '../components/SuccessToast';
import { storageService, UserRegistration } from '../services/storageService';

const ICON_COLOR = '#8C8C8C';

const OrdersIcon = () => (
  <svg width="15" height="16" viewBox="0 0 24 24" fill="none" stroke={ICON_COLOR} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M5 8h14l-1 12H6L5 8z" />
    <path d="M9 8V6.500a3 3 0 0 1 6 0V8" />
  </svg>
);

const EditProfileIcon = () => (
  <svg width="15" height="16" viewBox="0 0 24 24" fill="none" stroke={ICON_COLOR} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="9.500" />
    <circle cx="12" cy="10" r="3" />
    <path d="M6.500 18.500c1.200-2.400 3.100-3.500 5.500-3.500s4.300 1.100 5.500 3.500" />
  </svg>
);

const PrivacyIcon = () => (
  <svg width="15" height="16" viewBox="0 0 24 24" fill="none" stroke={ICON_COLOR} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 2.500l8 3v6c0 5-3.300 8.700-8 10-4.700-1.300-8-5-8-10v-6l8-3z" />
    <rect x="9" y="10.500" width="6" height="5" rx="1" />
    <path d="M10.200 10.500V9a1.800 1.800 0 0 1 3.600 0v1.500" />
  </svg>
);

const LogoutIcon = () => (
  <svg width="15" height="16" viewBox="0 0 24 24" fill="none" stroke="#E02B2B" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 2.500v9" />
    <path d="M17.500 5.800a8.500 8.500 0 1 1-11 0" />
  </svg>
);

const Chevron = () => (
  <svg width="8" height="14" viewBox="0 0 8 14" fill="none" stroke="#B8B8B8" strokeWidth="1.600" strokeLinecap="round" strokeLinejoin="round" className="mr-[10px] shrink-0">
    <path d="M1.500 1.500L6.500 7l-5 5.500" />
  </svg>
);

interface MenuRowProps {
  icon: React.ReactNode;
  label: string;
  onClick: () => void;
  danger?: boolean;
}

const MenuRow: React.FC<MenuRowProps> = ({ icon, label, onClick, danger = false }) => (
  <div className="ml-[14px] border-b border-[#E6E6E6]">
    <button
      type="button"
      onClick={onClick}
      className="w-full h-[41px] flex items-center text-left active:bg-gray-50 focus:outline-none"
    >
      <span className="w-[22px] flex items-center justify-start mr-[6px] shrink-0">{icon}</span>
      <span className={`flex-1 text-[16px] leading-none ${danger ? 'text-[#E02B2B]' : 'text-[#1F1F1F]'}`}>
        {label}
      </span>
      <Chevron />
    </button>
  </div>
);

export const MyProfilePage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [user, setUser] = useState<UserRegistration | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  useEffect(() => {
    setUser(storageService.getUser());
  }, []);

  // "Profile Updated" message coming back from the Edit Profile page
  useEffect(() => {
    const state = location.state as { toast?: string } | null;
    if (state?.toast) {
      setToastMessage(state.toast);
      navigate(location.pathname, { replace: true, state: null });
    }
  }, [location.state]);

  const handleLogout = () => {
    if (window.confirm('Do you want to log out?')) {
      storageService.logout();
      navigate('/welcome', { replace: true });
    }
  };

  const name = user?.name?.trim() || 'Guest';

  return (
    <div className="min-h-screen bg-white text-[#1F1F1F] pb-[50px] flex flex-col font-sans">
      <MobileHeader title="My Profile" />

      <main className="w-full mx-auto flex-1">
        {/* Name, e-mail and avatar */}
        <section
          aria-label="User Profile"
          className="h-[120px] pl-[18px] pr-[18px] flex items-center justify-between border-b border-[#E6E6E6]"
        >
          <div className="min-w-0 pr-3">
            <h2 className="text-[24px] leading-[28px] font-bold text-[#141414] truncate">{name}</h2>
            <p className="text-[12px] leading-[16px] text-[#ABABAB] truncate mt-[2px]">{user?.email || ''}</p>
          </div>

          {user?.photo ? (
            <img src={user.photo} alt={name} className="w-[73px] h-[73px] rounded-full object-cover shrink-0" />
          ) : (
            <div className="w-[73px] h-[73px] rounded-full bg-[#F7842F] flex items-center justify-center text-white text-[38px] leading-none shrink-0 select-none">
              {name[0].toUpperCase()}
            </div>
          )}
        </section>

        {/* Menu */}
        <nav aria-label="Profile menu">
          <MenuRow icon={<OrdersIcon />} label="My Orders" onClick={() => navigate('/purchases')} />
          <MenuRow icon={<EditProfileIcon />} label="Edit Profile" onClick={() => navigate('/profile/edit')} />
          <MenuRow icon={<PrivacyIcon />} label="Privacy Policy" onClick={() => navigate('/profile/privacy')} />
          <MenuRow icon={<LogoutIcon />} label="Logout" onClick={handleLogout} danger />
        </nav>
      </main>

      <SuccessToast
        message={toastMessage || ''}
        isOpen={!!toastMessage}
        onClose={() => setToastMessage(null)}
        bottomOffset="bottom-[50px]"
      />

      <BottomNavigation />
    </div>
  );
};
